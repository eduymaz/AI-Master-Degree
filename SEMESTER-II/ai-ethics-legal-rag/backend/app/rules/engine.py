"""Kural motoru — YAML tabanlı kural yükleyici + değerlendirici.

Üç boyutu kapsar:
    1) Etik ilke kontrolleri (5 etik kavram)
    2) Hukuki uyumluluk kontrolleri (AB YZ Yasası, GDPR/KVKK, İtalya)
    3) Use case skorlama (penalty/bonus tabanlı)

Pre-LLM (filtreleme) ve Post-LLM (doğrulama) hook'larını destekler.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml

from app.models.schemas import RiskClass, RuleViolation, Severity, UseCase


@dataclass
class RuleResult:
    """Bir kuralın değerlendirme sonucu."""

    rule_id: str
    rule_name: str
    severity: Severity
    triggered: bool
    message: str = ""
    affected_dimension: str | None = None
    score_penalty: float = 0.0
    risk_class_set: str | None = None


class RuleEngine:
    """YAML kural dosyasından kural seti yükler ve use case'leri değerlendirir."""

    def __init__(self, rules_path: Path | None = None):
        if rules_path is None:
            rules_path = Path(__file__).parent / "rules.yaml"
        self.rules_path = rules_path
        self.rules_data = self._load_rules()

    def _load_rules(self) -> dict[str, Any]:
        with open(self.rules_path, encoding="utf-8") as f:
            return yaml.safe_load(f)

    @property
    def metadata(self) -> dict:
        return self.rules_data.get("metadata", {})

    def all_rule_definitions(self) -> list[dict]:
        """Tüm kural tanımlarını düz liste olarak döndür."""
        rules: list[dict] = []
        for section_key in ("ethical_principles", "legal_compliance"):
            section = self.rules_data.get(section_key, {})
            for category in section.values():
                rules.extend(category.get("rules", []))
        rules.extend(self.rules_data.get("use_case_scoring", {}).get("rules", []))
        return rules

    # ─── Tetikleyici (trigger) değerlendirme ──────────────────

    def _get_field_value(self, use_case: UseCase, field: str) -> Any:
        """Dot-notation field yolu (örn. 'use_case.description') değer döndürür."""
        if field.startswith("use_case."):
            field = field[len("use_case.") :]
        return getattr(use_case, field, None)

    def _trigger_matches(self, trigger: dict, use_case: UseCase) -> bool:
        """Tek bir trigger'ın use case ile eşleşip eşleşmediğini hesapla.

        Trigger dict'inde aşağıdaki anahtarlar (AND ile birleştirilir):
            field, pattern, not_pattern, equals, contains, in, min_length
            and_field — sonraki kontrolü farklı alana uygula
            invert — sonucu tersine çevir
        """
        # Tek trigger içinde birden fazla 'and_field' zinciri olabilir
        # Bunu parse etmek için trigger'ı (field, conditions) listelerine ayır
        chains = self._split_chains(trigger)
        invert = trigger.get("invert", False)
        results: list[bool] = []

        for field_name, conditions in chains:
            value = self._get_field_value(use_case, field_name)
            chain_pass = True
            for cond_key, cond_val in conditions.items():
                if not self._evaluate_condition(value, cond_key, cond_val):
                    chain_pass = False
                    break
            results.append(chain_pass)

        outcome = all(results)
        return (not outcome) if invert else outcome

    def _split_chains(self, trigger: dict) -> list[tuple[str, dict]]:
        """and_field zincirini ayır."""
        chains: list[tuple[str, dict]] = []
        current_field = trigger.get("field", "")
        current_conditions: dict = {}

        skip_keys = {"field", "and_field", "invert", "description"}

        for key, val in trigger.items():
            if key == "field":
                current_field = val
            elif key == "and_field":
                if current_field and current_conditions:
                    chains.append((current_field, current_conditions))
                current_field = val
                current_conditions = {}
            elif key not in skip_keys:
                current_conditions[key] = val

        if current_field and current_conditions:
            chains.append((current_field, current_conditions))
        return chains

    def _evaluate_condition(self, value: Any, key: str, expected: Any) -> bool:
        """Tek bir koşul değerlendirme."""
        if value is None:
            return key in {"not_pattern"}  # absent içerik not_pattern'i otomatik geçer

        # String/Liste haline çevir
        text = self._coerce_text(value)

        if key == "pattern":
            return bool(re.search(expected, text))
        if key == "not_pattern":
            return not re.search(expected, text)
        if key == "equals":
            return self._coerce_text(value).lower() == str(expected).lower()
        if key == "contains":
            if isinstance(value, list):
                return any(self._coerce_text(v).lower() == str(expected).lower() for v in value)
            return str(expected).lower() in text.lower()
        if key == "in":
            return self._coerce_text(value).lower() in [str(v).lower() for v in expected]
        if key == "min_length":
            if isinstance(value, str):
                return len(value) >= int(expected)
            if isinstance(value, list):
                return len(value) >= int(expected)
            return False
        return False

    @staticmethod
    def _coerce_text(value: Any) -> str:
        if isinstance(value, list):
            return " ".join(str(v) for v in value)
        if hasattr(value, "value"):  # Enum
            return str(value.value)
        return str(value)

    # ─── Public API ────────────────────────────────────────

    def evaluate(self, use_case: UseCase) -> list[RuleResult]:
        """Tüm kuralları use case'e karşı çalıştır."""
        results: list[RuleResult] = []
        for rule_def in self.all_rule_definitions():
            triggers = rule_def.get("triggers", [])
            triggered = any(self._trigger_matches(t, use_case) for t in triggers)

            severity_str = rule_def.get("severity", "info")
            results.append(
                RuleResult(
                    rule_id=rule_def["id"],
                    rule_name=rule_def["name"],
                    severity=Severity(severity_str),
                    triggered=triggered,
                    message=rule_def.get("message", ""),
                    affected_dimension=rule_def.get("affected_dimension"),
                    score_penalty=float(rule_def.get("score_penalty", 0.0)),
                    risk_class_set=rule_def.get("risk_class_set"),
                )
            )
        return results

    def violations(self, use_case: UseCase) -> list[RuleViolation]:
        """Sadece tetiklenen kuralları RuleViolation listesi olarak döndür."""
        return [
            RuleViolation(
                rule_id=r.rule_id,
                rule_name=r.rule_name,
                severity=r.severity,
                message=r.message,
                affected_dimension=r.affected_dimension,
            )
            for r in self.evaluate(use_case)
            if r.triggered
        ]

    def compute_score_adjustments(self, use_case: UseCase) -> dict[str, float]:
        """Boyut-bazlı toplam penalty hesapla."""
        adjustments: dict[str, float] = {
            "fairness": 0.0,
            "transparency": 0.0,
            "accountability": 0.0,
            "privacy": 0.0,
            "human_oversight": 0.0,
        }
        for r in self.evaluate(use_case):
            if r.triggered and r.affected_dimension and r.affected_dimension in adjustments:
                adjustments[r.affected_dimension] += r.score_penalty
        return adjustments

    def determine_risk_class(self, use_case: UseCase) -> RiskClass:
        """AB YZ Yasası risk sınıfını kurallarla belirle."""
        for r in self.evaluate(use_case):
            if r.triggered and r.risk_class_set:
                return RiskClass(r.risk_class_set)
        # Varsayılan: alan-bazlı
        from app.models.schemas import HealthcareArea

        if use_case.area in {HealthcareArea.RADIOLOGY, HealthcareArea.CDSS}:
            return RiskClass.HIGH
        if use_case.area == HealthcareArea.PATIENT_FACING:
            return RiskClass.LIMITED
        return RiskClass.LIMITED

    # ─── Hook'lar (pipeline entegrasyonu) ───────────────────

    def pre_llm_filter(self, use_case: UseCase) -> tuple[bool, list[RuleViolation]]:
        """LLM çağrısı öncesi sert engelleme.

        Returns:
            (allow, blocking_violations)
        """
        violations = self.violations(use_case)
        blocking = [v for v in violations if v.severity == Severity.ERROR]
        # Şu an için error'lar engellemez ama uyarı listesine eklenir
        # İleride policy değişebilir: HOOTL + Italy gibi vakalar block edilebilir
        return True, blocking

    def post_llm_validation(
        self, use_case: UseCase, llm_output: dict
    ) -> list[RuleViolation]:
        """LLM çıktısının kural-uyumluluğunu doğrula."""
        extra_violations: list[RuleViolation] = []

        # 1) Skorlar 0-10 aralığında mı?
        scores = llm_output.get("ethics_scores", {})
        for dim, detail in scores.items():
            if isinstance(detail, dict):
                score = detail.get("score")
                if score is None or not (0.0 <= float(score) <= 10.0):
                    extra_violations.append(
                        RuleViolation(
                            rule_id="POST-VAL-001",
                            rule_name="Skor aralığı ihlali",
                            severity=Severity.ERROR,
                            message=f"{dim} skoru 0-10 aralığında değil: {score}",
                            affected_dimension=dim,
                        )
                    )

        # 2) Tıbbi tavsiye iddiası var mı? (sistem klinik tavsiye vermemeli)
        narrative = llm_output.get("narrative_assessment", "")
        forbidden_phrases = [
            r"(?i)tedavi\s+olarak\s+öneri",
            r"(?i)kesin\s+tanı",
            r"(?i)bu\s+ilacı\s+alın",
            r"(?i)diagnose\s+yourself",
        ]
        for pattern in forbidden_phrases:
            if re.search(pattern, narrative):
                extra_violations.append(
                    RuleViolation(
                        rule_id="POST-VAL-002",
                        rule_name="Tıbbi tavsiye yasağı ihlali",
                        severity=Severity.ERROR,
                        message=(
                            "Sistem klinik tıbbi tavsiye üretmemeli; çıktı yalnızca etik/hukuki "
                            "değerlendirmedir."
                        ),
                    )
                )
                break

        return extra_violations
