"""Anthropic Claude LLM sağlayıcısı."""
from __future__ import annotations

import logging

from anthropic import AsyncAnthropic
from tenacity import retry, stop_after_attempt, wait_exponential

from app.config import get_settings
from app.llm.base import LLMProviderBase, LLMResponse

logger = logging.getLogger(__name__)


class ClaudeProvider(LLMProviderBase):
    name = "claude"

    def __init__(self):
        settings = get_settings()
        if not settings.anthropic_api_key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY environment variable boş; .env dosyasına ekleyin "
                "veya LLM_PROVIDER=ollama'ya geçin."
            )
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)
        self.model = settings.anthropic_model

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
        max_tokens: int = 4096,
    ) -> LLMResponse:
        logger.info(f"Claude API çağrısı: model={self.model}")
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            temperature=temperature,
            system=system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        text = "".join(block.text for block in response.content if hasattr(block, "text"))
        return LLMResponse(
            content=text,
            model=self.model,
            provider=self.name,
            input_tokens=response.usage.input_tokens,
            output_tokens=response.usage.output_tokens,
        )
