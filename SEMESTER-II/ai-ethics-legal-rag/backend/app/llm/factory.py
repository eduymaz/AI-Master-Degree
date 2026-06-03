"""LLM sağlayıcı seçici."""
from __future__ import annotations

from app.llm.base import LLMProviderBase
from app.models.schemas import LLMProvider


def get_llm_provider(provider: LLMProvider | str) -> LLMProviderBase:
    """İstenen sağlayıcının instance'ını üret. Lazy import ile importlanır."""
    name = provider.value if hasattr(provider, "value") else str(provider)
    name = name.lower()
    if name == "groq":
        from app.llm.groq_provider import GroqProvider

        return GroqProvider()
    if name == "claude":
        from app.llm.claude_provider import ClaudeProvider

        return ClaudeProvider()
    if name == "ollama":
        from app.llm.ollama_provider import OllamaProvider

        return OllamaProvider()
    raise ValueError(f"Bilinmeyen LLM sağlayıcı: {name}")
