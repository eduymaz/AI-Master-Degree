"""Uygulama yapılandırması — environment-based settings."""
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Varsayılan LLM sağlayıcısı — groq ücretsiz, çok hızlı, sadece API key gerekir
    llm_provider: str = "groq"

    # Groq Cloud (Llama 3.3 70B / 3.1 8B — ücretsiz, https://console.groq.com)
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"

    # Anthropic Claude (opsiyonel)
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-sonnet-4-6"

    # Ollama (yerel — sadece host'ta Ollama varsa)
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:3b"

    embedding_model: str = "intfloat/multilingual-e5-base"

    chroma_persist_dir: str = "./app/knowledge/chroma_db"
    chroma_collection: str = "yz-etik-saglik"

    retrieval_top_k: int = 5
    retrieval_hybrid_alpha: float = 0.6

    allowed_origins: str = "http://localhost:3000,http://localhost:3001,http://localhost:3002"

    host: str = "0.0.0.0"
    port: int = 8000
    log_level: str = "INFO"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def chroma_persist_path(self) -> Path:
        return Path(self.chroma_persist_dir).resolve()


@lru_cache
def get_settings() -> Settings:
    return Settings()
