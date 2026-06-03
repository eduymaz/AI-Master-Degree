---
title: Sağlık YZ Etik Backend
emoji: 🏥
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 8000
pinned: false
short_description: Sağlık YZ uygulamaları için kural bazlı RAG-LLM değerlendirme API'si
---

# Sağlık YZ Etik — Backend (HuggingFace Spaces)

Bu Space, **YZM 714 Final Projesi Seçenek B**'nin backend API'sini barındırır.

## Servis

- **POST /api/evaluate** — Sağlık YZ use case değerlendirmesi
- **GET /api/use-cases** — Hazır şablon listesi
- **GET /api/rules** — 24 kural
- **GET /api/sources** — 8 küratörlü belge
- **GET /docs** — OpenAPI / Swagger UI

## LLM Sağlayıcı

Varsayılan: **Groq Cloud** (Llama 3.3 70B, ücretsiz). `GROQ_API_KEY` Space secrets'da ayarlanmalıdır.

## Frontend

Bu API'yi tüketen Next.js frontend: [Vercel'de canlı](#) (URL deploy sonrası eklenir).

---

*Detaylı kaynak kod ve dokümantasyon: ana repo*
