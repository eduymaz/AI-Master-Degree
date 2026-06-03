# Sağlık YZ Etik — Değerlendirme Platformu

> **Akademik Bağlam:** YZM 714 Yapay Zekânın Etik ve Hukuki Boyutu · Seçenek B Final Projesi
> **Geliştirici:** Elif Duymaz Yılmaz · **Dönem:** 2025–2026 Bahar
> **Üniversite:** İzmir Bakırçay Üniversitesi — Fen Bilimleri Enstitüsü

---

## 📋 İçindekiler

1. [Proje Tanımı](#-proje-tanımı)
2. [Sistem Mimarisi](#-sistem-mimarisi)
3. [Nasıl Çalışır?](#-nasıl-çalışır)
4. [Hızlı Başlangıç (Docker)](#-hızlı-başlangıç-docker-ile-kurulum)
5. [Manuel Kurulum](#-manuel-kurulum-docker-olmadan)
6. [Kullanım](#-kullanım)
7. [API Referansı](#-api-referansı)
8. [Sorun Giderme](#-sorun-giderme)
9. [Klasör Yapısı](#-klasör-yapısı)

---

## 📖 Proje Tanımı

**Sağlık YZ Etik Değerlendirme Platformu**, sağlık alanındaki yapay zekâ uygulamalarını çoklu düzenleyici ve etik çerçevelere karşı sistematik biçimde değerlendiren **kural tabanlı RAG-LLM** (Retrieval-Augmented Generation + Large Language Model) sistemidir.

### Değerlendirme Çerçeveleri

| Çerçeve | Açıklama |
|---------|----------|
| **AB YZ Yasası** (EU AI Act 2024/1689) | Risk sınıflandırması, yüksek-risk gereksinimleri |
| **KVKK** + Üretken YZ Rehberi (Kasım 2025) | Türkiye veri koruma, sağlık verisi işleme |
| **ISO/IEC 42001** | YZ Yönetim Sistemi standardı |
| **UNESCO YZ Etiği Tavsiyesi** (2021) | Küresel etik ilkeler |
| **İtalya YZ Yasası** (Ekim 2025) | Sağlık YZ için özel hükümler |
| **WHO Sağlıkta YZ Etiği** | Sağlık sektörü kılavuzları |
| **FDA AI/ML SaMD** | ABD tıbbi cihaz düzenlemeleri |

### Sistem Çıktıları

Her değerlendirme için:

- **5 Etik Boyut Skoru** (0-10): Adalet, Şeffaflık, Hesap Verebilirlik, Mahremiyet, İnsan Denetimi
- **AB YZ Yasası Risk Sınıfı**: Yasak / Yüksek / Sınırlı / Minimal
- **Uygulanabilir Düzenlemeler Listesi**
- **Uyumluluk Boşlukları**
- **Markdown Narratif Değerlendirme**
- **Kaynak Referansları** (retrieval skorları ile)

---

## 🏗 Sistem Mimarisi

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js 15)                          │
│                     http://localhost:3000                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Anasayfa   │  │  /evaluate  │  │   /rules    │  │  /sources   │     │
│  │  Playground │  │  Form+Sonuç │  │  24 Kural   │  │  8 Belge    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ REST API
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (FastAPI)                              │
│                     http://localhost:8000                                │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                      RAG Pipeline                                 │   │
│  │  ┌────────────┐   ┌────────────┐   ┌────────────┐                │   │
│  │  │ 1. Query   │──▶│ 2. Hybrid  │──▶│ 3. Pre-LLM │                │   │
│  │  │ Build      │   │ Retrieval  │   │ Rule Check │                │   │
│  │  └────────────┘   └────────────┘   └────────────┘                │   │
│  │        │                │                │                        │   │
│  │        ▼                ▼                ▼                        │   │
│  │  ┌────────────┐   ┌────────────┐   ┌────────────┐                │   │
│  │  │ 4. LLM     │──▶│ 5. Post-   │──▶│ 6. Format  │                │   │
│  │  │ Generation │   │ LLM Adjust │   │ Response   │                │   │
│  │  └────────────┘   └────────────┘   └────────────┘                │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  ChromaDB   │  │ Rule Engine │  │  Retriever  │  │ LLM Provider│     │
│  │  (Vectors)  │  │ (24 Rules)  │  │ (Hybrid)    │  │ Groq/Claude │     │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

### Ana Bileşenler

| Bileşen | Teknoloji | Açıklama |
|---------|-----------|----------|
| **Frontend** | Next.js 15, React 19, Tailwind v4, shadcn/ui | Modern web arayüzü |
| **Backend** | FastAPI, Python 3.11+ | REST API ve RAG pipeline |
| **Vector DB** | ChromaDB | Semantik arama için embedding depolama |
| **Embeddings** | intfloat/multilingual-e5-base | Çok dilli embedding modeli (~400 MB) |
| **LLM** | Groq (Llama 3.1 8B) | Ücretsiz, hızlı LLM API |
| **Retriever** | Semantic + BM25 + RRF | Hibrit arama (semantik + lexical) |

---

## ⚙ Nasıl Çalışır?

### 1. Bilgi Tabanı (Knowledge Base)

8 küratörlü Markdown belge, sisteme yüklenirken:
- ~350 token'lık chunk'lara bölünür
- Her chunk `multilingual-e5-base` ile embedding'e dönüştürülür
- ChromaDB'de metadata ile birlikte saklanır
- BM25 indeksi oluşturulur

**Sonuç:** 8 belge → 58 chunk

### 2. Kural Motoru (Rule Engine)

24 deklaratif kural, 3 kategoride:

| Kategori | Kural Sayısı | Örnek |
|----------|--------------|-------|
| **Etik İlkeler** | 13 | Demografik temsiliyet, XAI gereksinimi, HITL paradigması |
| **Hukuki Uyumluluk** | 8 | AB YZ Yasası Madde 6, KVKK ikincil kullanım |
| **Skorlama** | 3 | Baz skor, ceza sistemi |

Kurallar:
- **Pre-LLM:** Use case'den tetiklenen kuralları belirler, LLM'e bağlam olarak verir
- **Post-LLM:** LLM skorlarına ceza uygular (örn: MIMIC veri seti → -2.0 fairness)

### 3. Hibrit Retrieval

```
Query: "Radyolojide YZ pnömoni tespiti MIMIC-CXR"
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
   Semantic Search         BM25 Search
   (Cosine Similarity)     (Keyword Match)
        │                       │
        └───────────┬───────────┘
                    ▼
            Reciprocal Rank Fusion (RRF)
                    │
                    ▼
            Top-5 Chunks (fused scores)
```

### 4. LLM Değerlendirme

Groq Cloud üzerinden Llama 3.1 8B:
- Sistem promptu: 5 etik boyut tanımları, JSON şeması
- Kullanıcı promptu: Use case + retrieved chunks + kural bağlamı
- Çıktı: Yapılandırılmış JSON (skorlar, gerekçeler, kaynaklar)

### 5. Post-Processing

- LLM çıktısı JSON olarak parse edilir
- Kural motorundan gelen cezalar uygulanır
- Final skorlar ve metadata eklenir
- Frontend'e JSON response döner

---

## 🚀 Hızlı Başlangıç (Docker ile Kurulum)

**En kolay yöntem.** Docker Desktop yüklüyse, tek komutla çalıştırabilirsiniz.

### Önkoşullar

| Yazılım | Sürüm | Kontrol | İndirme |
|---------|-------|---------|---------|
| **Docker Desktop** | 4.0+ | `docker --version` | https://www.docker.com/products/docker-desktop |
| **Git** *(opsiyonel)* | herhangi | `git --version` | https://git-scm.com/downloads |

### Adım 1: Projeyi İndirin

```bash
# Git ile
git clone <repo-url>
cd ai-ethics-legal-rag

# VEYA zip olarak indirdiyseniz, klasöre girin
cd ai-ethics-legal-rag
```

### Adım 2: Groq API Anahtarı Alın (Ücretsiz, 2 dakika)

1. Tarayıcıda açın: **https://console.groq.com**
2. **Continue with Google** ile giriş yapın (kredi kartı gerekmez)
3. Sol menü → **API Keys** → **Create API Key**
4. İsim verin (örn: `saglik-yz`) → **Submit**
5. Anahtarı kopyalayın: `gsk_...` ile başlar

> ⚠️ Bu sayfa kapanınca anahtar bir daha gösterilmez!

### Adım 3: Yapılandırma Dosyasını Oluşturun

```bash
# Şablonu kopyalayın
cp .env.example .env

# Düzenleyin (nano, vim, VS Code, herhangi bir editör)
nano .env
```

`.env` dosyasında şu satırı bulup anahtarınızı yapıştırın:

```
GROQ_API_KEY=gsk_BURAYA_KENDI_ANAHTARINIZI_YAPIŞTIRIN
```

### Adım 4: Docker Compose ile Başlatın

```bash
docker compose up
```

**İlk çalıştırma süresi:** ~5-10 dakika
- Docker image'ları build edilir
- Python paketleri yüklenir
- Embedding modeli indirilir (~400 MB)
- Bilgi tabanı oluşturulur

**Sonraki çalıştırmalar:** ~30 saniye

### Adım 5: Tarayıcıda Açın

Şu mesajları gördüğünüzde sistem hazırdır:

```
yzm714-backend   | ✓ Bilgi tabanı kuruldu: 8 belge, 58 chunk
yzm714-backend   | INFO: Uvicorn running on http://0.0.0.0:8000
yzm714-frontend  | ✓ Ready in 220ms
```

**Tarayıcıda açın:** http://localhost:3000

### Durdurmak İçin

```bash
# Terminalde Ctrl+C veya
docker compose down
```

---

## 🛠 Manuel Kurulum (Docker Olmadan)

Docker kullanmak istemiyorsanız, backend ve frontend'i ayrı ayrı kurabilirsiniz.

### Önkoşullar

| Yazılım | Sürüm | Kontrol | İndirme |
|---------|-------|---------|---------|
| **Python** | 3.11+ | `python3 --version` | https://www.python.org/downloads/ |
| **Node.js** | 20+ | `node --version` | https://nodejs.org/ |
| **Git** *(opsiyonel)* | herhangi | `git --version` | https://git-scm.com/downloads |

### Adım 1-3: Proje ve API Anahtarı

Docker kurulumu ile aynı (yukarıya bakın).

### Adım 4: Backend Kurulumu

```bash
cd backend

# Sanal ortam oluştur
python3 -m venv .venv

# Aktive et
source .venv/bin/activate          # macOS / Linux
# .venv\Scripts\activate            # Windows PowerShell

# Bağımlılıkları yükle (CPU-only PyTorch)
pip install --upgrade pip
pip install --index-url https://download.pytorch.org/whl/cpu torch==2.5.1
pip install -r requirements.txt

# .env dosyasını backend klasörüne kopyala
cp ../.env .env

# Bilgi tabanını oluştur (ilk seferde ~3-5 dakika)
python scripts/ingest_all.py
```

Başarılı çıktı:
```
✓ Bilgi tabanı kuruldu: 8 belge, 58 chunk
```

**Backend'i başlat:**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Terminali açık bırakın.

### Adım 5: Frontend Kurulumu

**Yeni terminal açın:**

```bash
cd frontend

# Bağımlılıkları yükle
npm install --legacy-peer-deps

# Geliştirme sunucusunu başlat
npm run dev
```

Başarılı çıktı:
```
✓ Ready in XYZ ms
- Local: http://localhost:3000
```

### Adım 6: Tarayıcıda Açın

http://localhost:3000

---

## 🎮 Kullanım

### Sayfalar

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| **Anasayfa** | `/` | Platform tanıtımı, 3 hazır use case ile Playground |
| **Değerlendirme** | `/evaluate` | Use case formu, LLM seçimi, sonuç görüntüleme |
| **Kurallar** | `/rules` | 24 kuralın detaylı dokümantasyonu |
| **Kaynaklar** | `/sources` | 8 küratörlü belge ve içerikleri |

### Hızlı Test (3 dakika)

1. `/evaluate` sayfasını açın
2. **Hazır Şablon** dropdown'undan **"UC1 — Radyoloji"** seçin
3. **LLM Sağlayıcı:** `Groq · Llama 3.1 8B` (varsayılan)
4. **Kural Motoru:** Açık (varsayılan)
5. **"Etik & Hukuki Değerlendirme Üret"** butonuna tıklayın
6. ~3-5 saniye içinde sonuçlar görünür:
   - 5 boyutlu radar grafiği
   - AB YZ Yasası risk sınıfı
   - Tetiklenen kurallar
   - Markdown değerlendirme
   - Kaynak referansları

### 3 Hazır Use Case

| ID | Başlık | Alan | Yargı Bölgeleri |
|----|--------|------|-----------------|
| UC1 | Radyolojide YZ destekli akciğer X-ray çoklu patoloji tanısı | Radyoloji | EU, TR, US, IT |
| UC2 | Sepsis erken uyarı klinik karar destek sistemi (CDSS) | Klinik Karar Destek | EU, TR, IT |
| UC3 | Federated learning + sentetik veri ile çok-merkezli meme MRI eğitim konsorsiyumu | Veri Yönetişimi | EU, TR |

---

## 📡 API Referansı

**Base URL:** `http://localhost:8000`

**Swagger UI:** `http://localhost:8000/docs`

### Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/health` | Sağlık kontrolü |
| `GET` | `/api/use-cases` | 3 hazır use case listesi |
| `GET` | `/api/use-cases/{id}` | Tek use case detayı |
| `GET` | `/api/rules` | 24 kural listesi |
| `GET` | `/api/sources` | 8 belge ve chunk bilgileri |
| `POST` | `/api/evaluate` | Use case değerlendirmesi |

### Örnek: Değerlendirme İsteği

```bash
curl -X POST http://localhost:8000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "use_case": {
      "title": "Radyoloji YZ Sistemi",
      "area": "radiology",
      "description": "Gogus rontgeni goruntulerde pnomoni tespiti icin CNN tabanli bir YZ sistemi.",
      "jurisdiction": ["EU", "TR"],
      "affected_stakeholders": ["hastalar", "radyologlar"],
      "data_sources": ["MIMIC-CXR"]
    },
    "llm_provider": "groq",
    "rules_enabled": true
  }'
```

---

## 🆘 Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| **Docker: YAML syntax error** | `docker-compose.yml` dosyasında Türkçe karakter sorunu. Güncel dosyayı kullanın. |
| **Docker: transformers import error** | `requirements.txt`'te `transformers>=4.44.0,<5.0.0` olduğundan emin olun. |
| **Docker: f-string syntax error** | `prompts.py` dosyası güncel olmalı. |
| **Backend: "GROQ_API_KEY boş"** | `.env` dosyasında anahtarı doğru yapıştırdığınızdan emin olun. |
| **Backend: Model indirme çok yavaş** | İlk seferde ~400 MB model indirilir. 5-10 dakika bekleyin. |
| **Backend: Port 8000 kullanımda** | `lsof -i :8000` ile kontrol edin, veya `--port 8001` kullanın. |
| **Frontend: Port 3000 kullanımda** | Next.js otomatik 3001'e geçer; terminal çıktısına bakın. |
| **Groq: 429 Rate limit** | Ücretsiz tier limiti doldu; 30-60 saniye bekleyin. |
| **Groq: 413 Payload too large** | `.env`'de `RETRIEVAL_TOP_K=3` ayarlayın. |

---

## 📁 Klasör Yapısı

```
ai-ethics-legal-rag/
├── README.md                      ← Bu dosya
├── .env.example                   ← Yapılandırma şablonu
├── docker-compose.yml             ← Docker orkestrasyonu
│
├── backend/                       ← FastAPI + Python 3.11+
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env                       ← API anahtarları (gitignore)
│   ├── scripts/
│   │   └── ingest_all.py          ← Bilgi tabanı oluşturma
│   └── app/
│       ├── main.py                ← FastAPI app
│       ├── config.py              ← Ayarlar
│       ├── models/schemas.py      ← Pydantic modeller
│       ├── api/                   ← REST endpoints
│       │   ├── evaluate.py        ← POST /api/evaluate
│       │   ├── rules.py           ← GET /api/rules
│       │   ├── sources.py         ← GET /api/sources
│       │   └── use_cases.py       ← GET /api/use-cases
│       ├── knowledge/
│       │   ├── documents/         ← 8 Markdown belge
│       │   ├── ingest.py          ← Chunk + embed
│       │   └── chroma_db/         ← Vector database
│       ├── rules/
│       │   ├── rules.yaml         ← 24 kural tanımı
│       │   └── engine.py          ← Kural değerlendirici
│       ├── rag/
│       │   ├── pipeline.py        ← Ana RAG orkestratörü
│       │   ├── retriever.py       ← Hibrit arama
│       │   └── prompts.py         ← LLM promptları
│       └── llm/
│           ├── base.py            ← Abstract provider
│           ├── groq_provider.py   ← Groq Cloud (varsayılan)
│           ├── claude_provider.py ← Anthropic Claude
│           ├── ollama_provider.py ← Yerel Ollama
│           └── factory.py         ← Provider seçici
│
├── frontend/                      ← Next.js 15 + React 19
│   ├── Dockerfile
│   ├── package.json
│   ├── app/                       ← App Router sayfaları
│   │   ├── page.tsx               ← Anasayfa
│   │   ├── evaluate/page.tsx      ← Değerlendirme formu
│   │   ├── rules/page.tsx         ← Kurallar
│   │   └── sources/page.tsx       ← Kaynaklar
│   ├── components/                ← React bileşenleri
│   │   ├── use-case-form.tsx
│   │   ├── evaluation-results.tsx
│   │   ├── ethics-radar.tsx       ← Radar grafiği
│   │   └── ...
│   └── lib/
│       ├── api.ts                 ← API client
│       └── types.ts               ← TypeScript tipleri
│
└── docs/                          ← Proje dokümantasyonu
    ├── 05-Degerlendirme/          ← Ablation study sonuçları
    └── 06-TeknikRapor/            ← Teknik rapor
```

---

## 🧠 Teknik Detaylar

### Bilgi Tabanı İçeriği

| Belge | Dosya | Yetki | Yargı Bölgesi |
|-------|-------|-------|---------------|
| AB YZ Yasası | `ab-yz-yasasi.md` | European Commission | EU |
| KVKK + Üretken YZ | `kvkk-saglik-yz.md` | KVKK | TR |
| ISO/IEC 42001 | `iso-iec-42001.md` | ISO/IEC | Global |
| UNESCO YZ Etiği | `unesco-yz-etigi.md` | UNESCO | Global |
| İtalya YZ Yasası | `italya-yz-yasasi.md` | Italian Parliament | IT |
| WHO Sağlık YZ | `who-saglik-yz-etigi.md` | WHO | Global |
| FDA AI/ML SaMD | `fda-aiml-samd.md` | FDA | US |
| Etik Kavramlar | `etik-kavramlar-saglik.md` | Akademik | Global |

### LLM Sağlayıcıları

| Sağlayıcı | Model | Latency | Maliyet | Kullanım |
|-----------|-------|---------|---------|----------|
| **Groq** (varsayılan) | Llama 3.1 8B | ~2-5 sn | Ücretsiz | `LLM_PROVIDER=groq` |
| **Claude** | Claude Sonnet | ~5-10 sn | Ücretli | `LLM_PROVIDER=claude` |
| **Ollama** | Llama 3.2 3B | ~10-30 sn | Ücretsiz (yerel) | `LLM_PROVIDER=ollama` |

---

## 🔒 Akademik Dürüstlük

- Bu sistem **bireysel** YZM 714 final projesi olarak geliştirilmiştir.
- Sistem **klinik tıbbi tavsiye vermez**; çıktısı yalnızca etik ve hukuki değerlendirmedir.
- Geliştirme sürecinde **Claude (Anthropic)** YZ aracı kodlama yardımcısı olarak kullanılmıştır; tüm tasarım kararları, kural çerçevesi ve raporlama yazara aittir.

---

## 📞 Erişim Noktaları

| Kaynak | URL |
|--------|-----|
| **Web Arayüzü** | http://localhost:3000 |
| **API Dokümantasyonu** | http://localhost:8000/docs |
| **Sağlık Kontrolü** | http://localhost:8000/api/health |

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

```
MIT License
Copyright (c) 2025-2026 Elif Duymaz Yılmaz
```
