"""Kural tabanı endpoint'leri — şeffaflık için kuralları açık paylaşır."""
from __future__ import annotations

from fastapi import APIRouter

from app.rules import RuleEngine

router = APIRouter(prefix="/api", tags=["rules"])

_engine: RuleEngine | None = None


def _get_engine() -> RuleEngine:
    global _engine
    if _engine is None:
        _engine = RuleEngine()
    return _engine


@router.get("/rules")
async def list_rules() -> dict:
    """Kural tabanını döndür."""
    engine = _get_engine()
    return {
        "metadata": engine.metadata,
        "rules": [
            {
                "id": r["id"],
                "name": r["name"],
                "description": r.get("description", ""),
                "severity": r.get("severity", "info"),
                "affected_dimension": r.get("affected_dimension"),
                "score_penalty": r.get("score_penalty", 0.0),
            }
            for r in engine.all_rule_definitions()
        ],
    }


@router.get("/rules/{rule_id}")
async def get_rule(rule_id: str) -> dict:
    """Belirli bir kuralı döndür."""
    from fastapi import HTTPException

    engine = _get_engine()
    for r in engine.all_rule_definitions():
        if r["id"] == rule_id:
            return r
    raise HTTPException(status_code=404, detail=f"Kural bulunamadı: {rule_id}")
