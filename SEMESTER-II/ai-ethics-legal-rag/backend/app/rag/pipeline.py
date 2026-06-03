"""Uçtan uca RAG değerlendirme pipeline'ı.

Akış:
    Kullanıcı sorgusu
      → Retrieval (semantik + BM25 → RRF)
      → Kural Filtreleme (pre-LLM)
      → LLM Üretimi (Claude / Ollama)
      → Kural Doğrulama (post-LLM)
      → Çıktı (skor + anlatı + kaynaklar)
"""
from __future__ import annotations

import json
import logging
import re
import time
import uuid
from typing import Any

from app.llm import get_llm_provider
from app.models.schemas import (
    EthicsScoreDetail,
    EthicsScores,
    EvaluationMetadata,
    EvaluationRequest,
    EvaluationResponse,
    LegalCompliance,
    RetrievedChunk,
    RiskClass,
    RuleViolation,
    Severity,
    UseCase,
)
from app.rag.prompts import SYSTEM_PROMPT, build_user_prompt
from app.rag.retriever import HybridRetriever
from app.rules.engine import RuleEngine

logger = logging.getLogger(__name__)


class EvaluationPipeline:
    """Tek-vurgu değerlendirme pipeline'ı; tüm bileşenleri orchestrate eder."""

    def __init__(
        self,
        retriever: HybridRetriever | None = None,
        rule_engine: RuleEngine | None = None,
    ):
        self.retriever = retriever or HybridRetriever()
        self.rule_engine = rule_engine or RuleEngine()

    # ─── Sorgu inşası ──────────────────────────────────────

    def _build_retrieval_query(self, use_case: UseCase) -> str:
        parts = [
            use_case.title,
            use_case.area.value,
            use_case.description,
            " ".join(use_case.jurisdiction),
        ]
        return " ".join(p for p in parts if p)

    # ─── LLM çıktısını parse etme ─────────────────────────

    @staticmethod
    def _extract_json(text: str) -> dict[str, Any]:
        """LLM çıktısından JSON objesi çıkar; ```json bloklarını ve düz JSON'u destekler."""
        # Önce ```json ... ``` bloğu
        match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
        if match:
            return json.loads(match.group(1))
        # Düz JSON
        start = text.find("{")
        end = text.rfind("}")
        if start == -1 or end == -1 or end <= start:
            raise ValueError(f"LLM çıktısında JSON bulunamadı: {text[:200]}")
        return json.loads(text[start : end + 1])

    @staticmethod
    def _coerce_ethics_scores(scores_dict: dict, fallback_sources: list[str]) -> EthicsScores:
        def detail(key: str) -> EthicsScoreDetail:
            raw = scores_dict.get(key, {})
            score = float(raw.get("score", 5.0))
            score = max(0.0, min(10.0, score))
            return EthicsScoreDetail(
                score=score,
                rationale=str(raw.get("rationale", "Yetersiz bilgi")),
                sources=list(raw.get("sources", [])) or fallback_sources[:3],
            )

        return EthicsScores(
            fairness=detail("fairness"),
            transparency=detail("transparency"),
            accountability=detail("accountability"),
            privacy=detail("privacy"),
            human_oversight=detail("human_oversight"),
        )

    @staticmethod
    def _coerce_legal(legal_dict: dict, fallback_sources: list[str]) -> LegalCompliance:
        risk_str = str(legal_dict.get("eu_ai_act_risk_class", "limited")).lower()
        try:
            risk = RiskClass(risk_str)
        except ValueError:
            risk = RiskClass.LIMITED
        return LegalCompliance(
            eu_ai_act_risk_class=risk,
            applicable_regulations=list(legal_dict.get("applicable_regulations", [])),
            compliance_gaps=list(legal_dict.get("compliance_gaps", [])),
            sources=list(legal_dict.get("sources", [])) or fallback_sources[:3],
        )

    # ─── Skor ayarlama ─────────────────────────────────────

    def _apply_rule_penalties(
        self, scores: EthicsScores, use_case: UseCase
    ) -> EthicsScores:
        adjustments = self.rule_engine.compute_score_adjustments(use_case)
        dims = ("fairness", "transparency", "accountability", "privacy", "human_oversight")
        for dim in dims:
            detail: EthicsScoreDetail = getattr(scores, dim)
            new_score = max(0.0, detail.score - adjustments.get(dim, 0.0))
            detail.score = round(new_score, 2)
        return scores

    # ─── Public API ────────────────────────────────────────

    async def evaluate(self, request: EvaluationRequest) -> EvaluationResponse:
        start = time.time()
        evaluation_id = str(uuid.uuid4())
        use_case = request.use_case

        # 1) Retrieval
        query = self._build_retrieval_query(use_case)
        top_k = request.retrieval_top_k or self.retriever.settings.retrieval_top_k
        retrieved = self.retriever.retrieve(query, top_k=top_k)
        logger.info(f"Retrieval: {len(retrieved)} chunk getirildi")

        # 2) Pre-LLM kural filtre
        rules_context: list[str] = []
        pre_violations: list[RuleViolation] = []
        if request.rules_enabled:
            _, pre_violations = self.rule_engine.pre_llm_filter(use_case)
            for v in self.rule_engine.violations(use_case):
                rules_context.append(f"[{v.severity.value.upper()}] {v.rule_id}: {v.message}")

        # 3) LLM üretimi
        llm = get_llm_provider(request.llm_provider)
        user_prompt = build_user_prompt(use_case, retrieved, rules_context)
        llm_response = await llm.generate(SYSTEM_PROMPT, user_prompt)

        # 4) JSON parse
        try:
            parsed = self._extract_json(llm_response.content)
        except (ValueError, json.JSONDecodeError) as e:
            logger.error(f"LLM JSON parse hatası: {e}")
            # Düşük güven skorlu fallback
            parsed = {
                "use_case_summary": "LLM çıktısı işlenemedi; fallback değerlendirme.",
                "ethics_scores": {},
                "legal_compliance": {},
                "narrative_assessment": llm_response.content[:2000],
            }

        all_source_ids = [c.chunk_id for c in retrieved]
        ethics_scores = self._coerce_ethics_scores(
            parsed.get("ethics_scores", {}), all_source_ids
        )
        legal = self._coerce_legal(parsed.get("legal_compliance", {}), all_source_ids)

        # 5) Risk sınıfı kural tarafından override edilirse
        if request.rules_enabled:
            rule_risk = self.rule_engine.determine_risk_class(use_case)
            if rule_risk == RiskClass.HIGH and legal.eu_ai_act_risk_class != RiskClass.HIGH:
                legal.eu_ai_act_risk_class = rule_risk
            # Skor penalty uygula
            ethics_scores = self._apply_rule_penalties(ethics_scores, use_case)

        # 6) Post-LLM doğrulama
        post_violations: list[RuleViolation] = []
        if request.rules_enabled:
            post_violations = self.rule_engine.post_llm_validation(use_case, parsed)

        all_violations = pre_violations + post_violations
        # pre_violations zaten kapatıldıysa rules_enabled True iken sadece error'ları
        # taşıdık; ayrıca tetiklenen tüm uyarıları (info/warning) ekleyelim
        if request.rules_enabled:
            all_violations = self.rule_engine.violations(use_case) + post_violations

        # 7) Yanıt inşası
        duration_ms = int((time.time() - start) * 1000)
        response = EvaluationResponse(
            evaluation_id=evaluation_id,
            use_case_summary=str(parsed.get("use_case_summary", "")),
            ethics_scores=ethics_scores,
            legal_compliance=legal,
            rule_violations=all_violations,
            narrative_assessment=str(parsed.get("narrative_assessment", ""))
            if request.include_narrative
            else "",
            retrieved_sources=retrieved,
            metadata=EvaluationMetadata(
                llm_provider=llm.name,
                model_version=llm.model_id(),
                retrieval_top_k=top_k,
                rules_enabled=request.rules_enabled,
                duration_ms=duration_ms,
                tokens_used={
                    "input": llm_response.input_tokens,
                    "output": llm_response.output_tokens,
                },
            ),
        )

        logger.info(
            f"Değerlendirme tamamlandı: {evaluation_id} ({duration_ms}ms, "
            f"{len(all_violations)} ihlal/uyarı)"
        )
        return response
