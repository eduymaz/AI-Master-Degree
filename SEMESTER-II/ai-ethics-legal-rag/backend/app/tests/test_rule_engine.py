"""Kural motoru için temel testler."""
from __future__ import annotations

from app.models.schemas import HealthcareArea, Severity, UseCase
from app.rules.engine import RuleEngine


def _make_use_case(**overrides) -> UseCase:
    defaults = {
        "title": "Test radyoloji CADx",
        "area": HealthcareArea.RADIOLOGY,
        "description": (
            "Bu sistem akciğer X-ray görüntülerinde 14 patoloji sınıflandırması yapar. "
            "Eğitim için MIMIC-CXR kullanılmıştır. "
            "HITL paradigmasında radyolog onayı zorunludur. "
            "GDPR ve KVKK uyumlu federated learning kullanılır. "
            "Grad-CAM ile açıklanabilirlik sağlanır."
        ),
        "affected_stakeholders": ["radyolog", "hasta", "hastane"],
        "jurisdiction": ["EU", "TR"],
    }
    defaults.update(overrides)
    return UseCase(**defaults)


def test_engine_loads():
    engine = RuleEngine()
    assert engine.metadata["version"]
    assert len(engine.all_rule_definitions()) >= 20


def test_mimic_dataset_triggers_fairness_warning():
    engine = RuleEngine()
    uc = _make_use_case()
    violations = engine.violations(uc)
    ids = {v.rule_id for v in violations}
    assert "ETH-FAIR-001" in ids


def test_clean_use_case_minimal_violations():
    engine = RuleEngine()
    uc = _make_use_case(
        description=(
            "Sistem akciğer X-ray sınıflandırması yapar. "
            "Eğitim verisi PadChest (İspanya) + VinDr (Vietnam) ile çeşitlendirilmiştir. "
            "HITL: Radyolog her tanıyı onaylar. "
            "GDPR ve KVKK uyumlu federated learning; differential privacy (epsilon=4). "
            "Grad-CAM ile açıklanabilirlik; SHAP ek skorlama. "
            "Independence, Separation ve Sufficiency adalet metrikleri uygulanır. "
            "Audit log her tahmin için tutulur. "
            "Veri kalitesi ve temsiliyet raporu kurum içi denetim ile doğrulanır. "
            "DPIA tamamlanmıştır."
        ),
        affected_stakeholders=["üretici", "hastane", "radyolog", "hasta"],
    )
    violations = engine.violations(uc)
    errors = [v for v in violations if v.severity == Severity.ERROR]
    assert len(errors) == 0


def test_italy_jurisdiction_requires_patient_info():
    engine = RuleEngine()
    uc = _make_use_case(jurisdiction=["IT", "EU"])
    ids = {v.rule_id for v in engine.violations(uc)}
    assert "ETH-TRANS-002" in ids


def test_post_validation_catches_bad_score():
    engine = RuleEngine()
    uc = _make_use_case()
    bad_output = {
        "ethics_scores": {
            "fairness": {"score": 15.0},  # geçersiz
        },
        "narrative_assessment": "ok",
    }
    extras = engine.post_llm_validation(uc, bad_output)
    assert any(v.rule_id == "POST-VAL-001" for v in extras)
