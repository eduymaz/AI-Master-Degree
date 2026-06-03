# 04 — Arayüz (User Interface)

> **Rubric Maddesi:** Streamlit veya Jupyter — kullanıcı use case'i girer, sistem değerlendirir (5 puan)

---

## 1. Genel Bakış

Bu projede **iki arayüz** sağlanmıştır:

| Arayüz | Teknoloji | Kullanım | URL |
|--------|-----------|----------|-----|
| **Web Arayüzü** (birincil) | Next.js 15 + React 19 | Tarayıcı | http://localhost:3000 |
| **Jupyter Notebook** (yedek) | Python + IPython | IDE/Terminal | `backend/demo.ipynb` |

---

## 2. Web Arayüzü (Next.js)

### 2.1 Dosya Yapısı

```
frontend/
├── app/                          ← Next.js App Router
│   ├── page.tsx                  ← Anasayfa (Landing + Playground)
│   ├── evaluate/page.tsx         ← Değerlendirme formu ve sonuçlar
│   ├── rules/page.tsx            ← 24 kuralın listesi
│   ├── sources/page.tsx          ← 8 belgenin listesi
│   ├── layout.tsx                ← Root layout
│   └── globals.css               ← Global stiller
│
├── components/                   ← React bileşenleri
│   ├── use-case-form.tsx         ← Use case giriş formu
│   ├── evaluation-results.tsx    ← Sonuç görüntüleme
│   ├── ethics-radar.tsx          ← 5D radar grafiği (Recharts)
│   ├── score-breakdown.tsx       ← Skor detay kartları
│   ├── rule-violations.tsx       ← Tetiklenen kurallar
│   ├── legal-compliance-panel.tsx← Hukuki uyumluluk paneli
│   ├── source-citations.tsx      ← Kaynak referansları
│   ├── playground-demo.tsx       ← Anasayfa canlı demo
│   ├── navigation.tsx            ← Üst navigasyon
│   └── ui/                       ← shadcn/ui bileşenleri
│
├── lib/
│   ├── api.ts                    ← Backend API client
│   ├── types.ts                  ← TypeScript tip tanımları
│   └── sample-data.ts            ← Fallback demo verisi
│
├── package.json
├── tailwind.config.ts
└── Dockerfile
```

### 2.2 Sayfalar

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| **Anasayfa** | `/` | Platform tanıtımı, 5 etik boyut kartları, canlı playground |
| **Değerlendirme** | `/evaluate` | Use case formu, LLM seçimi, sonuç görüntüleme |
| **Kurallar** | `/rules` | 24 kuralın detaylı dokümantasyonu |
| **Kaynaklar** | `/sources` | 8 belgenin listesi ve içerikleri |

### 2.3 Bileşen Hiyerarşisi

```
app/layout.tsx (RootLayout)
└── Navigation
    └── BakircayLogo

app/page.tsx (Landing)
├── Hero Section (gradient background)
├── 5 DimensionCard (Adalet, Şeffaflık, ...)
├── Pipeline Flow (6 adım)
└── PlaygroundDemo (3 hazır use case)

app/evaluate/page.tsx
├── UseCaseForm
│   ├── Hazır şablon dropdown
│   ├── Form alanları (title, area, description, ...)
│   ├── LLM provider seçici
│   └── Rules toggle
└── EvaluationResults (sonuç geldiğinde)
    ├── Header (ortalama skor + metadata)
    ├── EthicsRadar (Recharts polar chart)
    ├── ScoreBreakdown (5 kart)
    └── Tabs
        ├── LegalCompliancePanel
        ├── RuleViolationsPanel
        ├── NarrativeAssessment (Markdown)
        └── SourceCitations

app/rules/page.tsx
└── RuleCard × 24

app/sources/page.tsx
└── SourceCard × 8
```

### 2.4 Teknolojiler

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| **Framework** | Next.js | 15.x |
| **UI Library** | React | 19.x |
| **Styling** | Tailwind CSS | 4.x |
| **Components** | shadcn/ui + Radix UI | Latest |
| **Charts** | Recharts | 2.15+ |
| **Forms** | React Hook Form + Zod | Latest |
| **Icons** | Lucide React | 0.469+ |
| **Markdown** | react-markdown | Latest |
| **Notifications** | Sonner | Latest |

---

## 3. Çalıştırma

### 3.1 Docker ile (Önerilen)

```bash
docker compose up

# Tarayıcıda aç
open http://localhost:3000
```

### 3.2 Manuel

```bash
cd frontend

# Bağımlılıkları yükle
npm install --legacy-peer-deps

# Geliştirme sunucusu
npm run dev

# Üretim build
npm run build && npm start
```

---

## 4. Kullanım Akışı

### 4.1 Değerlendirme Yapma

1. `/evaluate` sayfasına git
2. **Hazır Şablon** dropdown'undan bir use case seç (veya elle doldur)
   - UC1: Radyoloji
   - UC2: CDSS (Klinik Karar Destek)
   - UC3: Veri Yönetişimi
3. **LLM Sağlayıcı** seç: Groq (varsayılan) / Claude / Ollama
4. **Kural Motoru** toggle'ını ayarla (varsayılan: açık)
5. **"Etik & Hukuki Değerlendirme Üret"** butonuna tıkla
6. ~3-5 saniye bekle
7. Sonuçları incele:
   - Radar grafiği (5 etik boyut)
   - Skor kırılımı (her boyut için rationale)
   - Hukuki uyumluluk (risk sınıfı, düzenlemeler, boşluklar)
   - Tetiklenen kurallar
   - Markdown anlatı
   - Kaynak referansları

### 4.2 Kuralları İnceleme

1. `/rules` sayfasına git
2. Kategoriye göre filtrele (Etik / Hukuki / Skorlama)
3. Her kuralın detaylarını gör:
   - ID, isim, açıklama
   - Severity (info/warning/error)
   - Skor cezası
   - Tetikleyici koşullar

### 4.3 Kaynakları İnceleme

1. `/sources` sayfasına git
2. 8 belgeyi listele
3. Her belgenin metadata'sını gör:
   - Yetki, yargı bölgesi, kategori
   - Chunk sayısı
   - Yayın tarihi

---

## 5. Form Alanları

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `title` | Text | ✓ | Use case başlığı (min 10 karakter) |
| `area` | Select | ✓ | Alan: radiology, clinical_decision_support, data_governance |
| `description` | Textarea | ✓ | Detaylı açıklama (min 50 karakter) |
| `jurisdiction` | MultiSelect | ✓ | Yargı bölgeleri: EU, TR, US, IT |
| `affected_stakeholders` | Tags | | Etkilenen paydaşlar |
| `data_sources` | Tags | | Veri kaynakları |
| `technical_architecture` | Textarea | | Teknik mimari detayları |
| `llm_provider` | Select | | groq (varsayılan), claude, ollama |
| `rules_enabled` | Toggle | | Kural motoru açık/kapalı |

---

## 6. Tasarım Sistemi

### 6.1 Renkler

| Token | Hex | Kullanım |
|-------|-----|----------|
| Navy Primary | `#1E3A8A` | Başlıklar, birincil butonlar |
| Blue Accent | `#2563EB` | Linkler, vurgular |
| Teal | `#00A4B4` | Bakırçay aksanı |
| Cream | `#FAF7F0` | Kart arka planları |
| Claude Cream | `#F0ECE0` | Subtle arka planlar |

### 6.2 Tipografi

| Element | Font | Weight |
|---------|------|--------|
| Başlıklar | Source Serif 4 | 600-700 |
| Gövde | Inter | 400-500 |
| Kod | JetBrains Mono | 400 |

### 6.3 Bileşen Stilleri

| Bileşen | Border Radius | Shadow |
|---------|---------------|--------|
| Kartlar | `0.75rem` | `shadow-sm` |
| Butonlar | `0.5rem` | `shadow-md` (hover) |
| Inputlar | `0.375rem` | `shadow-inner` |

---

## 7. Jupyter Notebook (Yedek)

Streamlit yerine Jupyter Notebook sağlanmıştır (rubric: "Streamlit VEYA Jupyter").

### 7.1 Dosya

```
backend/demo.ipynb
```

### 7.2 Çalıştırma

```bash
cd backend
source .venv/bin/activate
jupyter notebook demo.ipynb
```

### 7.3 İçerik

```python
# Cell 1: Import ve setup
from app.rag.pipeline import EvaluationPipeline
from app.models.schemas import UseCase, EvaluationRequest

# Cell 2: Pipeline başlat
pipeline = EvaluationPipeline()

# Cell 3-5: 3 use case değerlendirmesi
# UC1: Radyoloji
# UC2: CDSS
# UC3: Veri Yönetişimi

# Cell 6: Sonuçları görselleştir
import matplotlib.pyplot as plt
# Radar chart çizimi
```

---

## 8. Ekran Görüntüleri

| Görsel | Dosya | Açıklama |
|--------|-------|----------|
| Anasayfa | `docs/06-TeknikRapor/sekiller/01-landing.png` | Hero + Playground |
| Değerlendirme Formu | `docs/06-TeknikRapor/sekiller/02-evaluate.png` | Form alanları |
| Değerlendirme Sonucu | `docs/06-TeknikRapor/sekiller/03-result.png` | Radar + skorlar |
| Kurallar | `docs/06-TeknikRapor/sekiller/04-rules.png` | 24 kural listesi |
| Kaynaklar | `docs/06-TeknikRapor/sekiller/05-sources.png` | 8 belge listesi |

---

## 9. API Client

Frontend, backend ile `lib/api.ts` üzerinden iletişim kurar:

```typescript
class API {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  async evaluate(request: EvaluationRequest): Promise<EvaluationResponse> {
    const res = await fetch(`${this.baseUrl}/api/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    return res.json();
  }

  async getUseCases(): Promise<UseCaseListResponse> { ... }
  async getRules(): Promise<RulesResponse> { ... }
  async getSources(): Promise<SourcesResponse> { ... }
}
```

---

## 10. Fallback Mekanizması

Backend erişilemez olduğunda, frontend `lib/sample-data.ts`'den örnek veriler gösterir:

```typescript
// Backend hata verirse
if (!response.ok) {
  return getSampleEvaluationResult(useCase.area);
}
```

Bu sayede demo sırasında backend sorunları kullanıcı deneyimini bozmaz.

---

## 11. Responsive Tasarım

| Breakpoint | Layout |
|------------|--------|
| Mobile (<640px) | Tek kolon, küçük radar |
| Tablet (640-1024px) | İki kolon |
| Desktop (>1024px) | Üç kolon, tam radar |

---

## 12. Kod Referansları

| Dosya | Satır | Açıklama |
|-------|-------|----------|
| `frontend/app/evaluate/page.tsx` | 1-120 | Değerlendirme sayfası |
| `frontend/components/use-case-form.tsx` | 1-300 | Form bileşeni |
| `frontend/components/evaluation-results.tsx` | 1-200 | Sonuç görüntüleme |
| `frontend/components/ethics-radar.tsx` | 1-70 | Radar grafiği |
| `frontend/lib/api.ts` | 1-80 | API client |
