# 03 — RAG Pipeline

> **Rubric Maddesi:** Retrieval + LLM generation + (kurallarla) doğrulama uçtan uca pipeline (15 puan)

---

## 1. Genel Bakış

RAG (Retrieval-Augmented Generation) Pipeline, kullanıcının tanımladığı sağlık YZ use case'ini **6 aşamalı** bir süreçle değerlendirir:

1. **Query Construction** — Use case'den arama sorgusu oluşturma
2. **Hybrid Retrieval** — Semantik + BM25 + RRF ile bilgi getirme
3. **Pre-LLM Rule Check** — Kural motoru ön kontrolü
4. **LLM Generation** — Groq/Claude/Ollama ile değerlendirme üretimi
5. **Post-LLM Adjustment** — Kural cezaları uygulama
6. **Response Formatting** — Final yanıt oluşturma

---

## 2. Dosya Yapısı

```
backend/app/rag/
├── pipeline.py     ← Ana orkestrasyon (6 aşama)
├── retriever.py    ← Hibrit retrieval (semantic + BM25 + RRF)
└── prompts.py      ← LLM sistem ve kullanıcı promptları

backend/app/llm/
├── base.py             ← LLMProviderBase soyut sınıfı
├── factory.py          ← Provider seçim factory
├── groq_provider.py    ← Groq Cloud (Llama 3.1 8B) — varsayılan
├── claude_provider.py  ← Anthropic Claude
└── ollama_provider.py  ← Ollama (yerel)
```

---

## 3. Pipeline Akış Diyagramı

```
┌─────────────────────────────────────────────────────────────────┐
│                      USE CASE GİRDİSİ                            │
│  { title, area, description, jurisdiction, stakeholders, ... }  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. QUERY CONSTRUCTION                                           │
│     • title + area + description + jurisdiction birleştir        │
│     • Retrieval için optimize edilmiş sorgu metni                │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. HYBRID RETRIEVAL                                             │
│     ┌────────────────┐    ┌────────────────┐                    │
│     │ Semantic Search│    │  BM25 Search   │                    │
│     │ (e5-base embed)│    │  (keyword)     │                    │
│     └───────┬────────┘    └───────┬────────┘                    │
│             │                     │                              │
│             └──────────┬──────────┘                              │
│                        ▼                                         │
│              Reciprocal Rank Fusion (RRF)                        │
│                        │                                         │
│                        ▼                                         │
│                   Top-5 Chunks                                   │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. PRE-LLM RULE CHECK                                           │
│     • 24 kural trigger kontrolü                                  │
│     • Tetiklenen kuralları listele                               │
│     • Rules context oluştur (LLM'e bilgi olarak)                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. LLM GENERATION                                               │
│     • SYSTEM_PROMPT: 5 etik boyut, JSON şema                    │
│     • USER_PROMPT: use case + chunks + rules context            │
│     • Provider: Groq (varsayılan) / Claude / Ollama             │
│     • temperature=0.3, max_tokens=4096                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. POST-LLM ADJUSTMENT                                          │
│     • JSON parse + şema doğrulama                               │
│     • Her boyut için kural cezası uygula                        │
│     • Risk sınıfı override (gerekirse)                          │
│     • Skor aralığı kontrolü (0-10)                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. RESPONSE FORMATTING                                          │
│     • EvaluationResponse modeli                                  │
│     • Metadata ekleme (provider, duration, tokens)              │
│     • evaluation_id üretme                                       │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
                   [FINAL RESPONSE]
```

---

## 4. Hibrit Retrieval Detayı

### 4.1 İki Aşamalı Arama

| Yöntem | Kütüphane | Ağırlık (α) | Güçlü Yanı |
|--------|-----------|-------------|------------|
| **Semantic** | ChromaDB + e5-base | 0.6 | Kavramsal ilişkiler |
| **BM25** | rank-bm25 | 0.4 | Spesifik terimler |

### 4.2 Reciprocal Rank Fusion (RRF)

```python
def rrf_score(doc, k=60):
    """İki sıralamayı birleştir"""
    semantic_rank = get_rank(doc, semantic_results)
    bm25_rank = get_rank(doc, bm25_results)
    return 1/(k + semantic_rank) + 1/(k + bm25_rank)
```

**Avantajları:**
- Skor normalizasyonu gerektirmez
- Her iki yöntemin güçlü yanlarını birleştirir
- Stabil ve öngörülebilir sonuçlar

### 4.3 Neden Hibrit?

| Sorgu Tipi | Sadece Semantic | Sadece BM25 | Hibrit |
|------------|-----------------|-------------|--------|
| "adalet ve kapsayıcılık" | ✓ İyi | ✗ Zayıf | ✓ En iyi |
| "GDPR Madde 22" | ✗ Zayıf | ✓ İyi | ✓ En iyi |
| "AB YZ Yasası yüksek risk" | ~ Orta | ~ Orta | ✓ En iyi |

---

## 5. LLM Sağlayıcıları

### 5.1 Groq (Varsayılan)

| Özellik | Değer |
|---------|-------|
| **Model** | `llama-3.1-8b-instant` |
| **Latency** | ~2-5 saniye |
| **Maliyet** | Ücretsiz (rate limit var) |
| **API Key** | https://console.groq.com |

```python
# Groq kullanımı
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.1-8b-instant
```

### 5.2 Claude (Anthropic)

| Özellik | Değer |
|---------|-------|
| **Model** | `claude-sonnet-4-20250514` |
| **Latency** | ~5-10 saniye |
| **Maliyet** | Ücretli |
| **Kalite** | En yüksek |

```python
# Claude kullanımı
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```

### 5.3 Ollama (Yerel)

| Özellik | Değer |
|---------|-------|
| **Model** | `llama3.2:3b` |
| **Latency** | ~10-30 saniye (CPU) |
| **Maliyet** | Ücretsiz (yerel) |
| **Gereksinim** | Ollama kurulu olmalı |

```python
# Ollama kullanımı
LLM_PROVIDER=ollama
# docker compose --profile offline up
```

### 5.4 Provider Karşılaştırma

| Kriter | Groq | Claude | Ollama |
|--------|------|--------|--------|
| Hız | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Kalite | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Maliyet | Ücretsiz | Ücretli | Ücretsiz |
| Türkçe | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Önerilen | ✓ Varsayılan | Premium | Offline |

---

## 6. Prompt Mühendisliği

### 6.1 System Prompt Yapısı

```python
SYSTEM_PROMPT = """
Sen sağlık hizmetlerinde yapay zekânın etik ve hukuki boyutlarını
değerlendiren uzman bir akademik analist asistanısın.

**Beş etik boyut** üzerinde 0-10 ölçeğinde skor üret:
1. Adalet (fairness)
2. Şeffaflık (transparency)
3. Hesap verebilirlik (accountability)
4. Mahremiyet (privacy)
5. İnsan denetimi (human_oversight)

**Hukuki çerçeve:**
- AB YZ Yasası risk sınıfı: prohibited|high|limited|minimal
- Uygulanabilir düzenlemeler listesi
- Uyumluluk boşlukları

**Kurallar:**
- Her iddia için kaynak atfı ver [doc_id:chunk_id]
- Türkçe yanıtla
- Klinik tıbbi tavsiye verme
- Çıktıyı KESİNLİKLE JSON şemasında ver

**JSON Çıktı Şeması:** { ... }
"""
```

### 6.2 User Prompt Yapısı

```python
USER_PROMPT = f"""
## Değerlendirilecek Use Case

**Başlık:** {use_case.title}
**Alan:** {use_case.area}
**Yargı bölgeleri:** {use_case.jurisdiction}
**Paydaşlar:** {use_case.affected_stakeholders}
**Veri kaynakları:** {use_case.data_sources}

### Detaylı Açıklama
{use_case.description}

## Bilgi Tabanından Getirilen Kaynaklar
{retrieved_chunks}

## Kural Motoru Ön-Bağlamı
{rules_context}

---
Yukarıdaki use case'i değerlendir. Yalnızca JSON şemasını döndür.
"""
```

---

## 7. Kullanım

### 7.1 REST API

```bash
curl -X POST http://localhost:8000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "use_case": {
      "title": "Radyoloji YZ Sistemi",
      "area": "radiology",
      "description": "CNN tabanlı pnömoni tespiti...",
      "jurisdiction": ["EU", "TR"],
      "data_sources": ["MIMIC-CXR"]
    },
    "llm_provider": "groq",
    "rules_enabled": true
  }'
```

### 7.2 Programatik Kullanım

```python
from app.rag.pipeline import EvaluationPipeline
from app.models.schemas import UseCase, EvaluationRequest

# Pipeline başlat
pipeline = EvaluationPipeline()

# Use case tanımla
use_case = UseCase(
    title="Radyoloji YZ Sistemi",
    area="radiology",
    description="...",
    jurisdiction=["EU", "TR"]
)

# Değerlendir
request = EvaluationRequest(
    use_case=use_case,
    llm_provider="groq",
    rules_enabled=True
)

response = await pipeline.evaluate(request)
print(response.ethics_scores)
print(response.legal_compliance)
print(response.rule_violations)
```

---

## 8. Çıktı Yapısı

```json
{
  "evaluation_id": "uuid-...",
  "use_case_summary": "3-5 cümlelik özet",
  "ethics_scores": {
    "fairness": {
      "score": 6.8,
      "rationale": "MIMIC-CXR ABD-merkezli...",
      "sources": ["eu-ai-act-2024#003"]
    },
    "transparency": { "score": 7.5, ... },
    "accountability": { "score": 7.0, ... },
    "privacy": { "score": 8.0, ... },
    "human_oversight": { "score": 6.5, ... }
  },
  "legal_compliance": {
    "eu_ai_act_risk_class": "high",
    "applicable_regulations": ["EU AI Act Art.6", "GDPR Art.9", ...],
    "compliance_gaps": ["DPIA eksik", ...]
  },
  "rule_violations": [
    {
      "rule_id": "ETH-FAIR-001",
      "rule_name": "Demografik temsiliyet kontrolü",
      "severity": "warning",
      "message": "...",
      "affected_dimension": "fairness"
    }
  ],
  "narrative_assessment": "## Genel Değerlendirme\n\n...",
  "retrieved_sources": [
    {
      "doc_id": "eu-ai-act-2024",
      "chunk_id": "eu-ai-act-2024#003",
      "text": "...",
      "similarity_score": 0.89,
      "bm25_score": 0.72,
      "fused_score": 0.028
    }
  ],
  "metadata": {
    "llm_provider": "groq",
    "model_version": "llama-3.1-8b-instant",
    "retrieval_top_k": 5,
    "rules_enabled": true,
    "duration_ms": 3450
  }
}
```

---

## 9. Performans

| Metrik | Groq | Claude | Ollama |
|--------|------|--------|--------|
| Ortalama Latency | 3-5 sn | 7-12 sn | 15-30 sn |
| Retrieval Süresi | ~200 ms | ~200 ms | ~200 ms |
| Rule Check Süresi | ~50 ms | ~50 ms | ~50 ms |
| Token Kullanımı | ~2000 input, ~1500 output | Benzer | Benzer |

---

## 10. Kod Referansları

| Dosya | Satır | Açıklama |
|-------|-------|----------|
| `backend/app/rag/pipeline.py` | 30-50 | EvaluationPipeline sınıfı |
| `backend/app/rag/pipeline.py` | 60-90 | `_build_retrieval_query()` |
| `backend/app/rag/pipeline.py` | 100-130 | `_extract_json()` |
| `backend/app/rag/pipeline.py` | 140-180 | `_apply_rule_penalties()` |
| `backend/app/rag/pipeline.py` | 190-250 | `evaluate()` ana metod |
| `backend/app/rag/retriever.py` | 50-100 | `retrieve()` hibrit arama |
| `backend/app/rag/prompts.py` | 1-50 | SYSTEM_PROMPT |
| `backend/app/rag/prompts.py` | 55-95 | `build_user_prompt()` |
