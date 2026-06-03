"""Hibrit retriever — semantik (ChromaDB) + lexical (BM25).

Reciprocal Rank Fusion (RRF) ile iki sonuç birleştirilir.
"""
from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Any

import chromadb
from chromadb.config import Settings as ChromaSettings
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer

from app.config import get_settings
from app.models.schemas import RetrievedChunk

logger = logging.getLogger(__name__)


def _tokenize(text: str) -> list[str]:
    """Türkçe/İngilizce için basit kelime ayırıcı."""
    return re.findall(r"\w+", text.lower(), flags=re.UNICODE)


class HybridRetriever:
    """Semantik + BM25 hibrit getirici (RRF füzyonu)."""

    _instance: "HybridRetriever | None" = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self.settings = get_settings()
        logger.info(f"Embedder yükleniyor: {self.settings.embedding_model}")
        self.embedder = SentenceTransformer(self.settings.embedding_model)

        persist_dir = self.settings.chroma_persist_path
        self.client = chromadb.PersistentClient(
            path=str(persist_dir),
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        try:
            self.collection = self.client.get_collection(self.settings.chroma_collection)
        except Exception:  # noqa: BLE001
            logger.warning(
                f"Collection bulunamadı: {self.settings.chroma_collection}. "
                "Önce 'python -m app.knowledge.ingest' çalıştırın."
            )
            self.collection = self.client.create_collection(
                name=self.settings.chroma_collection,
                metadata={"hnsw:space": "cosine"},
            )

        self._bm25_index: BM25Okapi | None = None
        self._bm25_docs: list[str] = []
        self._bm25_ids: list[str] = []
        self._bm25_metas: list[dict] = []
        self._build_bm25_index()
        self._initialized = True

    def _build_bm25_index(self) -> None:
        """ChromaDB'deki tüm chunk'ları BM25 indeksine yükle."""
        result = self.collection.get(include=["documents", "metadatas"])
        docs = result.get("documents", []) or []
        ids = result.get("ids", []) or []
        metas = result.get("metadatas", []) or []
        if not docs:
            logger.warning("BM25 indeks boş — bilgi tabanı henüz dolu değil")
            return
        tokenized = [_tokenize(d) for d in docs]
        self._bm25_index = BM25Okapi(tokenized)
        self._bm25_docs = list(docs)
        self._bm25_ids = list(ids)
        self._bm25_metas = list(metas)
        logger.info(f"BM25 indeksi {len(docs)} chunk ile hazır")

    def _semantic_search(self, query: str, top_k: int) -> list[tuple[str, str, dict, float]]:
        prefixed = f"query: {query}"
        emb = self.embedder.encode([prefixed], normalize_embeddings=True)[0].tolist()
        result = self.collection.query(
            query_embeddings=[emb],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )
        hits: list[tuple[str, str, dict, float]] = []
        ids = result.get("ids", [[]])[0]
        docs = result.get("documents", [[]])[0]
        metas = result.get("metadatas", [[]])[0]
        distances = result.get("distances", [[]])[0]
        for cid, doc, meta, dist in zip(ids, docs, metas, distances, strict=False):
            similarity = max(0.0, 1.0 - float(dist))  # cosine distance → similarity
            hits.append((cid, doc, meta or {}, similarity))
        return hits

    def _bm25_search(self, query: str, top_k: int) -> list[tuple[str, str, dict, float]]:
        if self._bm25_index is None:
            return []
        scores = self._bm25_index.get_scores(_tokenize(query))
        if not scores.size:
            return []
        top_indices = scores.argsort()[::-1][:top_k]
        max_score = max(scores) if max(scores) > 0 else 1.0
        return [
            (
                self._bm25_ids[i],
                self._bm25_docs[i],
                self._bm25_metas[i],
                float(scores[i] / max_score),
            )
            for i in top_indices
            if scores[i] > 0
        ]

    @staticmethod
    def _reciprocal_rank_fusion(
        semantic_hits: list[tuple[str, str, dict, float]],
        bm25_hits: list[tuple[str, str, dict, float]],
        k: int = 60,
    ) -> dict[str, dict[str, Any]]:
        """RRF — sıra-temelli füzyon. Skor yerine sıra puanlar."""
        fused: dict[str, dict[str, Any]] = {}

        for rank, (cid, doc, meta, sim) in enumerate(semantic_hits, start=1):
            fused[cid] = {
                "doc": doc,
                "meta": meta,
                "sim": sim,
                "bm25": 0.0,
                "score": 1.0 / (k + rank),
            }

        for rank, (cid, doc, meta, bm25) in enumerate(bm25_hits, start=1):
            entry = fused.setdefault(
                cid,
                {"doc": doc, "meta": meta, "sim": 0.0, "bm25": 0.0, "score": 0.0},
            )
            entry["bm25"] = bm25
            entry["score"] += 1.0 / (k + rank)

        return fused

    def retrieve(self, query: str, top_k: int | None = None) -> list[RetrievedChunk]:
        """Sorgu için hibrit retrieval; RetrievedChunk listesi döndürür."""
        top_k = top_k or self.settings.retrieval_top_k
        retrieve_n = max(top_k * 2, 8)

        semantic = self._semantic_search(query, retrieve_n)
        bm25 = self._bm25_search(query, retrieve_n)
        fused = self._reciprocal_rank_fusion(semantic, bm25)

        sorted_items = sorted(fused.items(), key=lambda kv: kv[1]["score"], reverse=True)[:top_k]
        return [
            RetrievedChunk(
                doc_id=entry["meta"].get("doc_id", cid.split("#")[0]),
                chunk_id=cid,
                title=entry["meta"].get("title", "Bilinmeyen"),
                authority=entry["meta"].get("authority", ""),
                jurisdiction=entry["meta"].get("jurisdiction", ""),
                text=entry["doc"],
                similarity_score=entry["sim"],
                bm25_score=entry["bm25"],
                fused_score=entry["score"],
            )
            for cid, entry in sorted_items
        ]
