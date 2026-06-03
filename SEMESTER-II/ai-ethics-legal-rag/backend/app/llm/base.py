"""LLM sağlayıcı tabanı — tüm sağlayıcılar bu protokolü uygular."""
from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class LLMResponse:
    """LLM çağrısının normalize edilmiş yanıtı."""

    content: str
    model: str
    provider: str
    input_tokens: int = 0
    output_tokens: int = 0


class LLMProviderBase(ABC):
    """Soyut LLM sağlayıcı."""

    name: str = "base"

    @abstractmethod
    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 4096,
    ) -> LLMResponse:
        """Senkron olmayan tek-shot üretim."""

    @abstractmethod
    def model_id(self) -> str:
        """Aktif modelin tanımlayıcısı."""
