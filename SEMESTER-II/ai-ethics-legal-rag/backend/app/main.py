"""FastAPI uygulamasının giriş noktası."""
from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import evaluate, rules, sources, use_cases
from app.config import get_settings

settings = get_settings()
logging.basicConfig(
    level=settings.log_level,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    logger.info("Uygulama başlatılıyor — RAG pipeline ön-hazırlık yapılacak")
    # Retriever singleton'ı isteklerde lazy yüklenir
    yield
    logger.info("Uygulama kapatılıyor")


app = FastAPI(
    title="YZM 714 — Sağlık YZ Etik & Hukuk Değerlendirme API",
    description=(
        "Kural bazlı RAG-LLM sistemi: kullanıcı tarafından tanımlanan sağlık YZ "
        "use case'lerini AB YZ Yasası, KVKK, ISO/IEC 42001, UNESCO ve İtalya YZ "
        "Yasası bilgi tabanına karşı değerlendirir."
    ),
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(evaluate.router)
app.include_router(use_cases.router)
app.include_router(rules.router)
app.include_router(sources.router)


@app.get("/")
async def root():
    return {
        "name": "YZM 714 RAG-LLM Backend",
        "version": "0.1.0",
        "docs": "/docs",
        "endpoints": [
            "POST /api/evaluate",
            "GET /api/use-cases",
            "GET /api/use-cases/{id}",
            "GET /api/rules",
            "GET /api/rules/{rule_id}",
            "GET /api/sources",
            "GET /api/sources/{doc_id}",
        ],
    }


@app.get("/api/health")
async def health():
    return {"status": "ok"}
