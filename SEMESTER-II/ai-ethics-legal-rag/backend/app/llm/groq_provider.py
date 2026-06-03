"""Groq Cloud LLM sağlayıcısı — Llama 3 (ücretsiz, OpenAI-uyumlu API).

Groq, OpenAI Chat Completions API'siyle birebir uyumludur; ücretsiz tier'da
Llama 3.3 70B ve Llama 3.1 8B sunar. API key: https://console.groq.com (ücretsiz).
"""
from __future__ import annotations

import logging

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import get_settings
from app.llm.base import LLMProviderBase, LLMResponse

logger = logging.getLogger(__name__)


class GroqProvider(LLMProviderBase):
    name = "groq"

    def __init__(self):
        settings = get_settings()
        if not settings.groq_api_key:
            raise RuntimeError(
                "GROQ_API_KEY ortam değişkeni boş. Lütfen .env dosyasına ekleyin "
                "(ücretsiz key: https://console.groq.com)."
            )
        self.api_key = settings.groq_api_key
        self.model = settings.groq_model
        self.base_url = "https://api.groq.com/openai/v1"
        self.client = httpx.AsyncClient(timeout=httpx.Timeout(60.0))

    def model_id(self) -> str:
        return self.model

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
    )
    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> LLMResponse:
        logger.info(f"Groq API çağrısı: model={self.model}")
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": temperature,
            "max_tokens": max_tokens,
            "response_format": {"type": "json_object"},
        }
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        response = await self.client.post(
            f"{self.base_url}/chat/completions",
            json=payload,
            headers=headers,
        )
        response.raise_for_status()
        data = response.json()

        content = data["choices"][0]["message"]["content"]
        usage = data.get("usage", {})

        return LLMResponse(
            content=content,
            model=self.model,
            provider=self.name,
            input_tokens=usage.get("prompt_tokens", 0),
            output_tokens=usage.get("completion_tokens", 0),
        )
