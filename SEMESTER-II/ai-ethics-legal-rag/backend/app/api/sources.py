"""Bilgi tabanındaki belge listesini paylaşan endpoint."""
from __future__ import annotations

import re
from pathlib import Path

import yaml
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api", tags=["sources"])

DOCS_DIR = Path(__file__).parent.parent / "knowledge" / "documents"


def _read_frontmatter(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    return yaml.safe_load(parts[1]) or {}


@router.get("/sources")
async def list_sources() -> dict:
    """Bilgi tabanındaki tüm kaynakların listesini döndür."""
    sources = []
    for md in sorted(DOCS_DIR.glob("*.md")):
        meta = _read_frontmatter(md)
        if not meta:
            continue
        sources.append(
            {
                "doc_id": meta.get("doc_id"),
                "title": meta.get("title"),
                "authority": meta.get("authority"),
                "jurisdiction": meta.get("jurisdiction"),
                "category": meta.get("category"),
                "publication_date": meta.get("publication_date"),
                "source_url": meta.get("source_url"),
            }
        )
    return {"total": len(sources), "sources": sources}


@router.get("/sources/{doc_id}")
async def get_source(doc_id: str) -> dict:
    """Belirli bir kaynak belgenin metnini ve metaverisini döndür."""
    for md in DOCS_DIR.glob("*.md"):
        meta = _read_frontmatter(md)
        if meta.get("doc_id") == doc_id:
            text = md.read_text(encoding="utf-8")
            body = re.split(r"^---\s*$", text, maxsplit=2, flags=re.MULTILINE)[-1].strip()
            return {"metadata": meta, "body": body}
    raise HTTPException(status_code=404, detail=f"Belge bulunamadı: {doc_id}")
