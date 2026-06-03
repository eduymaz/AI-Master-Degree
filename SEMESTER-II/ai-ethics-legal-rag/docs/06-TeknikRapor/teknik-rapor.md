# Teknik Rapor — Sağlık YZ için Kural Bazlı RAG-LLM Etik & Hukuki Değerlendirme Sistemi

**Proje:** YZM 714 Final Projesi — Seçenek B
**Geliştirici:** Elif Duymaz Yılmaz
**Üniversite:** İzmir Bakırçay Üniversitesi — Fen Bilimleri Enstitüsü
**Dönem:** 2025–2026 Bahar
**Tarih:** 2026-06-04

---

## Yönetici Özeti

Bu rapor, sağlık yapay zekâ uygulamalarını **AB YZ Yasası**, **KVKK**, **ISO/IEC 42001**, **UNESCO YZ Etiği Tavsiyesi**, **İtalya YZ Yasası**, **WHO** ve **FDA AI/ML SaMD** çerçevelerine karşı sistematik biçimde değerlendiren bir **kural bazlı RAG-LLM** sisteminin teknik mimarisini, kural tabanını, değerlendirme sonuçlarını ve sınırlılıklarını sunar.

### Temel Bileşenler

| Bileşen | Teknoloji | Detay |
|---------|-----------|-------|
| **Bilgi Tabanı** | ChromaDB + e5-base | 8 belge → 58 chunk |
| **Kural Motoru** | YAML + Python | 24 kural (3 kategori) |
| **RAG Pipeline** | Hibrit Retrieval + LLM | Semantic + BM25 + RRF |
| **LLM Provider** | Groq (varsayılan) | Llama 3.1 8B |
| **Frontend** | Next.js 15 | React 19 + Tailwind v4 |
| **Backend** | FastAPI | Python 3.11 + Pydantic v2 |

---

## 1. Mimari Tasarım

### 1.1 Sistem Diyagramı

```
┌──────────────────────────────────────────────────────────────────┐
│                          KULLANICI                                │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│           FRONTEND  (Next.js 15 + Tailwind v4)                    │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────────────┐  │
│  │ Landing  │  │ /evaluate    │  │  /sources    /rules        │  │
│  │ Hero     │  │ Form + Sonuç │  │  Şeffaflık ekranları       │  │
│  └──────────┘  └──────────────┘  └────────────────────────────┘  │
└────────────────────────────┬─────────────────────────────────────┘
                             │ REST JSON
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│               BACKEND  (FastAPI 0.115 + Pydantic v2)              │
│  ┌──────────────────────────────────────────────────────────────┐│
│  │  POST /api/evaluate    GET  /api/use-cases                   ││
│  │  GET  /api/rules       GET  /api/sources                     ││
│  │  GET  /api/health                                             ││
│  └──────────────────────────────────────────────────────────────┘│
└──┬────────────────┬──────────────────┬──────────────────────────┘
   │                │                  │
   ▼                ▼                  ▼
┌──────────┐  ┌────────────┐  ┌───────────────────────────────┐
│  RAG     │  │  Kural     │  │  LLM Provider Factory          │
│ Pipeline │  │  Motoru    │  │  ┌──────────┐  ┌────────────┐  │
│          │  │ rules.yaml │  │  │ Groq     │  │ Claude     │  │
│ Hibrit   │  │ + Engine   │  │  │ Llama    │  │ Sonnet     │  │
│ Retrieval│  │ pre+post   │  │  │ (varsay.)│  │ (premium)  │  │
└────┬─────┘  └────────────┘  └───────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Bilgi Tabanı                            │
│  ┌──────────────────────────────────┐    │
│  │ ChromaDB persistent collection   │    │
│  │ multilingual-e5-base embeddings  │    │
│  │ + BM25 lexical index             │    │
│  │ 8 doküman / 58 chunk             │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

### 1.2 Pipeline Akışı

```
[1] Kullanıcı use case tanımlar (form veya hazır şablon)
        ↓
[2] POST /api/evaluate { use_case, llm_provider, rules_enabled }
        ↓
[3] RAG Pipeline:
    (a) Sorgu inşası → title + area + description + jurisdiction
    (b) RETRIEVAL — Hibrit (semantik + BM25 → RRF)
        - e5-base embed sorgu → ChromaDB top-k semantik hit
        - BM25 paralel top-k lexical hit
        - Reciprocal Rank Fusion (k=60) → top-5 chunk
    (c) PRE-LLM KURAL FİLTRELEME
        - 24 kural tetikleyici eşleşmesi
        - Rules context oluştur
    (d) PROMPT İNŞASI
        - SYSTEM_PROMPT: 5 etik boyut, JSON şema
        - USER_PROMPT: use case + 5 chunk + rules context
    (e) LLM ÜRETİMİ (Groq varsayılan)
        - temperature=0.3, max_tokens=4096
    (f) JSON PARSE + POST-LLM DOĞRULAMA
        - Skor cezaları uygula
        - Risk sınıfı override
[4] EvaluationResponse → Frontend
```

---

## 2. Bilgi Tabanı

### 2.1 Küratörlü Belgeler

| # | Belge | Yetki | Yargı | Chunk |
|---|-------|-------|-------|-------|
| 1 | AB YZ Yasası (EU AI Act 2024/1689) | European Commission | EU | 12 |
| 2 | KVKK + Üretken YZ Rehberi (Kasım 2025) | KVKK | TR | 8 |
| 3 | ISO/IEC 42001 | ISO/IEC | Global | 6 |
| 4 | UNESCO YZ Etiği Tavsiyesi (2021) | UNESCO | Global | 7 |
| 5 | İtalya YZ Yasası (Ekim 2025) | Italian Parliament | IT | 5 |
| 6 | WHO Sağlıkta YZ Etiği | WHO | Global | 8 |
| 7 | FDA AI/ML SaMD Action Plan | FDA | US | 6 |
| 8 | Etik Kavramlar Sentezi | Akademik | Global | 6 |
| **Toplam** | | | | **58** |

### 2.2 Embedding ve Chunking

| Parametre | Değer |
|-----------|-------|
| **Embedding Model** | `intfloat/multilingual-e5-base` |
| **Embedding Boyutu** | 768 dimension |
| **Chunk Boyutu** | ~350 token |
| **Overlap** | ~50 token |
| **Vektör DB** | ChromaDB (persistent) |
| **Distance Metric** | Cosine |

---

## 3. Kural Motoru

### 3.1 Kural Taksonomisi

| Kategori | Kural Sayısı | Örnek |
|----------|--------------|-------|
| **Etik İlkeler** | 13 | Demografik temsiliyet, XAI, HITL |
| **Hukuki Uyumluluk** | 8 | AB YZ Yasası, KVKK, İtalya |
| **Skorlama** | 3 | Baz skor, ceza, doğrulama |
| **Toplam** | **24** | |

### 3.2 İki Aşamalı Değerlendirme

**Pre-LLM:**
- Use case alanlarına karşı trigger pattern eşleştirme
- Tetiklenen kuralları LLM'e context olarak gönderme

**Post-LLM:**
- Her etik boyut için cumulative ceza hesaplama
- `final_score = llm_score - sum(penalties)`
- Risk sınıfı override (gerekirse)

### 3.3 Kural Anatomi

```yaml
- id: ETH-FAIR-001
  name: "Demografik temsiliyet kontrolü"
  triggers:
    - field: use_case.description
      pattern: "(?i)(mimic|chexpert|nih)"
  severity: warning
  score_penalty: 2.0
  affected_dimension: fairness
  message: "ABD-merkezli dataset; subgroup raporu önerilir"
```

---

## 4. LLM Sağlayıcıları

### 4.1 Karşılaştırma

| Sağlayıcı | Model | Latency | Maliyet | Kalite |
|-----------|-------|---------|---------|--------|
| **Groq** (varsayılan) | Llama 3.1 8B | ~3 sn | Ücretsiz | ⭐⭐⭐⭐ |
| Claude | Sonnet 4 | ~8 sn | Ücretli | ⭐⭐⭐⭐⭐ |
| Ollama | Llama 3.2 3B | ~20 sn | Ücretsiz | ⭐⭐⭐ |

### 4.2 Prompt Mühendisliği

**System Prompt İçeriği:**
- 5 etik boyut operasyonel tanımları
- Hukuki çerçeve kategorileri
- JSON çıktı şeması
- Kısıtlamalar (Türkçe, kaynak atfı, klinik tavsiye yasağı)

**User Prompt İçeriği:**
- Use case detayları
- Retrieved chunks (5 adet)
- Rules context (tetiklenen kurallar)

---

## 5. Değerlendirme Sonuçları

### 5.1 Ablation Analizi

3 use case × 2 mod (rules on/off) = 6 değerlendirme

| Use Case | Mode | Ort. Skor | Tetiklenen Kurallar |
|----------|------|-----------|---------------------|
| UC1 — Radyoloji | ON | 6.52 | 4 |
| UC1 — Radyoloji | OFF | 7.12 | — |
| UC2 — CDSS | ON | 5.86 | 6 |
| UC2 — CDSS | OFF | 6.74 | — |
| UC3 — Veri Yönetişimi | ON | 7.44 | 2 |
| UC3 — Veri Yönetişimi | OFF | 7.82 | — |

**Ortalama Δ:** -0.62 (kural motoru konservatif kalibrasyon sağlıyor)

### 5.2 Kural Motoru Değeri

1. **Konservatif Kalibrasyon:** LLM iyimserliğini dengeliyor
2. **Açıklanabilir Düzeltme:** Her penalty bir rule_id ile bağlı
3. **Düzenleyici Farkındalık:** Spesifik maddeleri otomatik tetikliyor
4. **Tekrarlanabilirlik:** Stabil penalty'ler

---

## 6. Frontend

### 6.1 Teknolojiler

| Kategori | Teknoloji |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind v4 |
| Components | shadcn/ui + Radix UI |
| Charts | Recharts (Radar) |
| Forms | React Hook Form + Zod |

### 6.2 Sayfalar

| URL | Açıklama |
|-----|----------|
| `/` | Landing + Playground |
| `/evaluate` | Use case formu + sonuçlar |
| `/rules` | 24 kuralın dokümantasyonu |
| `/sources` | 8 belgenin listesi |

### 6.3 Tasarım Sistemi

| Token | Değer | Kullanım |
|-------|-------|----------|
| Navy Primary | `#1E3A8A` | Başlıklar |
| Blue Accent | `#2563EB` | Linkler |
| Teal | `#00A4B4` | Bakırçay aksanı |
| Cream | `#FAF7F0` | Kart arka planları |

---

## 7. Deployment

### 7.1 Docker Compose

```yaml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - LLM_PROVIDER=groq
      - GROQ_API_KEY=${GROQ_API_KEY}
    volumes:
      - chroma_data:/app/app/knowledge/chroma_db
      - hf_cache:/root/.cache/huggingface

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on:
      backend:
        condition: service_healthy
```

### 7.2 Çalıştırma

```bash
# Docker ile
docker compose up

# Manuel
cd backend && uvicorn app.main:app --port 8000
cd frontend && npm run dev
```

---

## 8. Sınırlılıklar ve Gelecek Çalışmalar

### 8.1 Mevcut Sınırlılıklar

| Sınırlılık | Açıklama |
|------------|----------|
| LLM Varyansı | Farklı provider'lar farklı kalitede çıktı |
| Türkiye Kaynakları | TİTCK rehberi henüz yayınlanmamış |
| Kural Granülerliği | Sentetik veri için ek kurallar gerekli |
| Skor Kalibrasyon | Daha geniş test seti ile iyileştirilebilir |

### 8.2 Gelecek İyileştirmeler

- Embedding-temelli trigger (pattern yerine similarity)
- Batch evaluation (portföy düzeyi)
- Streaming çıktı (SSE)
- Multi-language UI (i18n)
- Audit trail persistence

---

## 9. Sonuç

Bu sistem, sağlık YZ uygulamalarının etik ve hukuki değerlendirmesi için **kural bazlı RAG-LLM** mimarisinin uygulanabilirliğini göstermektedir.

**Ana Katkılar:**
1. Çok-paydaşlı düzenleyici çerçeve sentezi (AB + TR + IT + US + Global)
2. Sembolik (kural) + Neural (LLM) hibrit yaklaşım
3. Şeffaflık tasarımı (`/sources`, `/rules` sayfaları)
4. Türkiye bağlamı için referans mimari

---

## Ekler

- **Ek A:** Kaynak kodu → `backend/`, `frontend/`
- **Ek B:** Bilgi tabanı → `backend/app/knowledge/documents/`
- **Ek C:** Kural tabanı → `backend/app/rules/rules.yaml`
- **Ek D:** Değerlendirme sonuçları → `docs/05-Degerlendirme/`

---

**Akademik Dürüstlük Beyanı:** Bu proje YZM 714 bireysel final ödevidir. Geliştirme sürecinde Claude (Anthropic) YZ aracı kodlama yardımcısı olarak kullanılmıştır; tüm tasarım kararları, kural çerçevesi ve değerlendirme yazara aittir.

**İzmir Bakırçay Üniversitesi onur koduna uyduğumu ve çalışmanın tamamen bana ait olduğunu beyan ederim.**

— Elif Duymaz Yılmaz, 4 Haziran 2026
