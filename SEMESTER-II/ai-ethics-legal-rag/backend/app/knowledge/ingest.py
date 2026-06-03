"""Doküman koleksiyonunu chunk'la ve ChromaDB'ye yükle.

Kullanım:
    python -m app.knowledge.ingest
veya
    python scripts/ingest_all.py
"""
from __future__ import annotations

import logging
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator

import chromadb
import yaml
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer

from app.config import get_settings
from app.models.schemas import DocumentMetadata

logger = logging.getLogger(__name__)

# Yapılandırma sabitleri
CHUNK_TARGET_TOKENS = 350
CHUNK_OVERLAP_TOKENS = 50
APPROX_CHARS_PER_TOKEN = 4  # Türkçe için yaklaşık değer


@dataclass
class Chunk:
    """Tek bir doküman parçası."""

    chunk_id: str
    doc_id: str
    text: str
    section_title: str
    char_start: int
    char_end: int


def _normalize_value(v):
    """YAML'den gelen date/datetime objelerini ISO formatlı string'e çevir."""
    if hasattr(v, "isoformat"):
        return v.isoformat()
    if isinstance(v, list):
        return [_normalize_value(x) for x in v]
    if isinstance(v, dict):
        return {k: _normalize_value(x) for k, x in v.items()}
    return v


def parse_frontmatter(content: str) -> tuple[dict, str]:
    """Markdown'dan YAML frontmatter ayır."""
    if not content.startswith("---"):
        return {}, content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    metadata = yaml.safe_load(parts[1]) or {}
    # Date/datetime objelerini string'e çevir (Pydantic için)
    metadata = _normalize_value(metadata)
    body = parts[2].lstrip("\n")
    return metadata, body


def split_into_sections(text: str) -> list[tuple[str, str]]:
    """Markdown'ı ## başlıklarına göre bölümlere ayır."""
    sections = []
    current_title = "Giriş"
    current_buffer: list[str] = []

    for line in text.split("\n"):
        heading_match = re.match(r"^##\s+(.+)$", line)
        if heading_match:
            if current_buffer:
                sections.append((current_title, "\n".join(current_buffer).strip()))
                current_buffer = []
            current_title = heading_match.group(1).strip()
        else:
            current_buffer.append(line)

    if current_buffer:
        sections.append((current_title, "\n".join(current_buffer).strip()))

    return [(t, b) for t, b in sections if b]


def chunk_text(
    text: str,
    target_tokens: int = CHUNK_TARGET_TOKENS,
    overlap_tokens: int = CHUNK_OVERLAP_TOKENS,
) -> list[tuple[str, int, int]]:
    """Metni sliding window ile parçala. Cümle sınırlarını mümkün olduğunca koru."""
    target_chars = target_tokens * APPROX_CHARS_PER_TOKEN
    overlap_chars = overlap_tokens * APPROX_CHARS_PER_TOKEN

    if len(text) <= target_chars:
        return [(text, 0, len(text))]

    chunks: list[tuple[str, int, int]] = []
    start = 0
    while start < len(text):
        end = min(start + target_chars, len(text))
        # Cümle sınırı arayalım (geriye doğru)
        if end < len(text):
            sentence_end = text.rfind(". ", start, end)
            if sentence_end > start + target_chars // 2:
                end = sentence_end + 1
        chunks.append((text[start:end].strip(), start, end))
        if end >= len(text):
            break
        start = end - overlap_chars

    return chunks


def iter_chunks(documents_dir: Path) -> Iterator[tuple[Chunk, DocumentMetadata]]:
    """Documents klasöründeki tüm .md dosyalarını işle."""
    md_files = sorted(documents_dir.glob("*.md"))
    logger.info(f"{len(md_files)} markdown dosyası bulundu")

    for md_path in md_files:
        content = md_path.read_text(encoding="utf-8")
        metadata_dict, body = parse_frontmatter(content)

        if not metadata_dict.get("doc_id"):
            logger.warning(f"Frontmatter eksik: {md_path.name}, atlandı")
            continue

        metadata = DocumentMetadata.model_validate(metadata_dict)
        sections = split_into_sections(body)

        chunk_counter = 0
        for section_title, section_body in sections:
            for chunk_text_str, c_start, c_end in chunk_text(section_body):
                chunk = Chunk(
                    chunk_id=f"{metadata.doc_id}#{chunk_counter:03d}",
                    doc_id=metadata.doc_id,
                    text=chunk_text_str,
                    section_title=section_title,
                    char_start=c_start,
                    char_end=c_end,
                )
                yield chunk, metadata
                chunk_counter += 1


def build_chroma_collection(force_rebuild: bool = False) -> dict[str, int]:
    """ChromaDB collection'ı oluştur veya güncelle.

    Returns:
        İstatistikler: {"documents": N, "chunks": M}
    """
    settings = get_settings()
    docs_dir = Path(__file__).parent / "documents"
    persist_dir = settings.chroma_persist_path
    persist_dir.mkdir(parents=True, exist_ok=True)

    logger.info(f"Embedding modeli yükleniyor: {settings.embedding_model}")
    embedder = SentenceTransformer(settings.embedding_model)

    client = chromadb.PersistentClient(
        path=str(persist_dir),
        settings=ChromaSettings(anonymized_telemetry=False),
    )

    if force_rebuild:
        try:
            client.delete_collection(settings.chroma_collection)
            logger.info(f"Mevcut collection silindi: {settings.chroma_collection}")
        except Exception:  # noqa: BLE001
            pass

    collection = client.get_or_create_collection(
        name=settings.chroma_collection,
        metadata={"hnsw:space": "cosine"},
    )

    chunk_texts: list[str] = []
    chunk_ids: list[str] = []
    chunk_metadatas: list[dict] = []
    doc_ids_seen: set[str] = set()

    for chunk, doc_meta in iter_chunks(docs_dir):
        chunk_texts.append(chunk.text)
        chunk_ids.append(chunk.chunk_id)
        chunk_metadatas.append(
            {
                "doc_id": chunk.doc_id,
                "title": doc_meta.title,
                "authority": doc_meta.authority,
                "jurisdiction": doc_meta.jurisdiction,
                "category": doc_meta.category,
                "applicable_areas": ",".join(doc_meta.applicable_areas),
                "section_title": chunk.section_title,
                "source_url": doc_meta.source_url,
            }
        )
        doc_ids_seen.add(chunk.doc_id)

    if not chunk_texts:
        logger.error("Hiç chunk üretilmedi — documents/ klasörünü kontrol edin")
        return {"documents": 0, "chunks": 0}

    logger.info(f"{len(chunk_texts)} chunk için embedding hesaplanıyor...")
    # e5 modeli "passage: " prefix'i bekler
    prefixed_texts = [f"passage: {t}" for t in chunk_texts]
    embeddings = embedder.encode(
        prefixed_texts,
        show_progress_bar=True,
        normalize_embeddings=True,
        batch_size=16,
    )

    collection.upsert(
        ids=chunk_ids,
        embeddings=embeddings.tolist(),
        documents=chunk_texts,
        metadatas=chunk_metadatas,
    )

    stats = {"documents": len(doc_ids_seen), "chunks": len(chunk_texts)}
    logger.info(f"ChromaDB güncellendi: {stats}")
    return stats


def main():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )
    stats = build_chroma_collection(force_rebuild=True)
    print(f"\n✓ Bilgi tabanı kuruldu: {stats['documents']} belge, {stats['chunks']} chunk")


if __name__ == "__main__":
    main()
