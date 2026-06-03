"""Ollama (yerel) LLM sağlayıcısı — ücretsiz alternatif."""
from __future__ import annotations

import logging

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import get_settings
from app.llm.base import LLMProviderBase, LLMResponse

logger = logging.getLogger(__name__)


class OllamaProvider(LLMProviderBase):
    name = "ollama"

    def __init__(self):
        settings = get_settings()
        self.base_url = settings.ollama_base_url.rstrip("/")
        self.model = settings.ollama_model
        self.client = httpx.AsyncClient(timeout=httpx.Timeout(120.0))

    def model_id(self) -> str:
        return self.model

    @retry(
        stop=stop_after_attempt(2),
        wait=wait_exponential(multiplier=1, min=1, max=5),
    )
    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 4096,
    ) -> LLMResponse:
        logger.info(f"Ollama çağrısı: model={self.model}")
        payload = {
            "model": self.model,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens,
            },
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        }
        response = await self.client.post(f"{self.base_url}/api/chat", json=payload)
        response.raise_for_status()
        data = response.json()
        content = data.get("message", {}).get("content", "")
        return LLMResponse(
            content=content,
            model=self.model,
            provider=self.name,
            input_tokens=data.get("prompt_eval_count", 0),
            output_tokens=data.get("eval_count", 0),
        )
