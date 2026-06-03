"""Pydantic v2 şemaları — istek, yanıt ve iç veri modelleri."""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class HealthcareArea(str, Enum):
    RADIOLOGY = "radiology"
    CDSS = "clinical_decision_support"
    DATA_GOVERNANCE = "data_governance"
    DRUG_DISCOVERY = "drug_discovery"
    PATIENT_FACING = "patient_facing"
    OTHER = "other"


class RiskClass(str, Enum):
    PROHIBITED = "prohibited"
    HIGH = "high"
    LIMITED = "limited"
    MINIMAL = "minimal"


class Severity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"


class LLMProvider(str, Enum):
    GROQ = "groq"
    CLAUDE = "claude"
    OLLAMA = "ollama"


class DocumentMetadata(BaseModel):
    model_config = ConfigDict(extra="allow")

    doc_id: str
    title: str
    authority: str
    jurisdiction: str
    publication_date: str
    language: str = "tr"
    source_url: str = ""
    category: str
    applicable_areas: list[str] = Field(default_factory=list)


class RetrievedChunk(BaseModel):
    """Bilgi tabanından getirilen tek bir parça."""

    doc_id: str
    chunk_id: str
    title: str
    authority: str
    jurisdiction: str
    text: str
    similarity_score: float = Field(ge=0.0, le=1.0)
    bm25_score: float = 0.0
    fused_score: float = 0.0


class UseCase(BaseModel):
    """Kullanıcı tarafından tanımlanan sağlık YZ use case'i."""

    title: str = Field(min_length=10, max_length=200)
    area: HealthcareArea
    description: str = Field(min_length=50, max_length=5000)
    data_sources: list[str] = Field(default_factory=list)
    affected_stakeholders: list[str] = Field(default_factory=list)
    technical_architecture: str | None = None
    jurisdiction: list[str] = Field(default_factory=lambda: ["EU", "TR"])


class EvaluationRequest(BaseModel):
    """API'ye gelen değerlendirme isteği."""

    use_case: UseCase
    llm_provider: LLMProvider = LLMProvider.CLAUDE
    rules_enabled: bool = True
    retrieval_top_k: int | None = None
    include_narrative: bool = True


class EthicsScoreDetail(BaseModel):
    """Bir etik boyutun skoru + gerekçe + kaynaklar."""

    score: float = Field(ge=0.0, le=10.0)
    rationale: str
    sources: list[str] = Field(default_factory=list, description="doc_id:chunk_id listesi")


class EthicsScores(BaseModel):
    """5 boyutta etik değerlendirme."""

    fairness: EthicsScoreDetail
    transparency: EthicsScoreDetail
    accountability: EthicsScoreDetail
    privacy: EthicsScoreDetail
    human_oversight: EthicsScoreDetail

    @property
    def average(self) -> float:
        scores = [
            self.fairness.score,
            self.transparency.score,
            self.accountability.score,
            self.privacy.score,
            self.human_oversight.score,
        ]
        return round(sum(scores) / len(scores), 2)


class LegalCompliance(BaseModel):
    """Hukuki uyumluluk değerlendirmesi."""

    eu_ai_act_risk_class: RiskClass
    applicable_regulations: list[str] = Field(default_factory=list)
    compliance_gaps: list[str] = Field(default_factory=list)
    sources: list[str] = Field(default_factory=list)


class RuleViolation(BaseModel):
    """Kural motoru tarafından tespit edilen ihlal/uyarı."""

    rule_id: str
    rule_name: str
    severity: Severity
    message: str
    affected_dimension: str | None = None


class EvaluationMetadata(BaseModel):
    """Değerlendirme süreci meta-bilgisi."""

    llm_provider: str
    model_version: str
    retrieval_top_k: int
    rules_enabled: bool
    duration_ms: int
    tokens_used: dict[str, int] | None = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class EvaluationResponse(BaseModel):
    """Tam değerlendirme çıktısı."""

    evaluation_id: str
    use_case_summary: str
    ethics_scores: EthicsScores
    legal_compliance: LegalCompliance
    rule_violations: list[RuleViolation] = Field(default_factory=list)
    narrative_assessment: str = ""
    retrieved_sources: list[RetrievedChunk] = Field(default_factory=list)
    metadata: EvaluationMetadata
