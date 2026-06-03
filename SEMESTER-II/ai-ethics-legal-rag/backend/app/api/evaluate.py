"""Değerlendirme endpoint'i."""
from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException

from app.models.schemas import EvaluationRequest, EvaluationResponse
from app.rag import EvaluationPipeline

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["evaluate"])

_pipeline: EvaluationPipeline | None = None


def get_pipeline() -> EvaluationPipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = EvaluationPipeline()
    return _pipeline


@router.post("/evaluate", response_model=EvaluationResponse)
async def evaluate(request: EvaluationRequest) -> EvaluationResponse:
    """Bir sağlık YZ use case'ini etik ve hukuki açıdan değerlendir."""
    try:
        pipeline = get_pipeline()
        return await pipeline.evaluate(request)
    except RuntimeError as e:
        # API key / yapılandırma hataları
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:  # noqa: BLE001
        logger.exception("Değerlendirme hatası")
        raise HTTPException(status_code=500, detail=f"İç hata: {e}") from e
