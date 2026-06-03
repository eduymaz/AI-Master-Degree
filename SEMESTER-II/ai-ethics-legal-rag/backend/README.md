# Backend — FastAPI RAG-LLM

Sağlık YZ etik & hukuki değerlendirme sisteminin Python backend'i.

## Hızlı Çalıştırma

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/ingest_all.py
uvicorn app.main:app --reload
```

OpenAPI dokümantasyonu: http://localhost:8000/docs

## Anahtar Modüller

- `app/main.py` — FastAPI uygulaması + CORS + router'lar
- `app/config.py` — Pydantic Settings (env-based)
- `app/api/` — REST endpoint'leri
- `app/knowledge/ingest.py` — Doküman → chunk → ChromaDB
- `app/rules/engine.py` — YAML kural motoru
- `app/rag/pipeline.py` — Uçtan uca RAG akışı
- `app/llm/` — Claude + Ollama sağlayıcıları

## Test

```bash
pytest app/tests/ -v
```
