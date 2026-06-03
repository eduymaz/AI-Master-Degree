FROM python:3.11-slim

WORKDIR /app

# Sistem bağımlılıkları
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl \
    && rm -rf /var/lib/apt/lists/*

# CPU-only torch (HuggingFace Spaces ARM/x86 ve Apple Silicon için 5× daha hızlı)
RUN pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch==2.5.1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY scripts ./scripts

# HuggingFace Spaces /data dizinini persistent storage olarak sunar
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV HF_HOME=/data/huggingface
ENV CHROMA_PERSIST_DIR=/data/chroma_db
ENV HOST=0.0.0.0
ENV PORT=8000

# Persistent storage dizini (varsa kullan, yoksa local fallback)
RUN mkdir -p /data/huggingface /data/chroma_db 2>/dev/null || true

EXPOSE 8000

# Sunucu öncesi bilgi tabanını kur (idempotent; persistent volume sayesinde 2. açılışta hızlı)
CMD ["sh", "-c", "python scripts/ingest_all.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
