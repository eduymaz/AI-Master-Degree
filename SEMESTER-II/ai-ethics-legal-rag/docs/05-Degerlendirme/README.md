# 05 — Değerlendirme ve Doğrulama

> **Rubric Maddesi:** Değerlendirme ve Doğrulama (10 puan)

---

## 1. Genel Bakış

Bu klasör, sistemin **3 use case** üzerinde ürettiği değerlendirmelerin kalite, tutarlılık ve kural motoru etkisi analizini içerir.

### Test Edilen Use Case'ler

| # | Use Case | Alan | Yargı Bölgeleri |
|---|----------|------|-----------------|
| UC1 | Radyolojide YZ destekli akciğer X-ray çoklu patoloji tanısı | radiology | EU, TR, US, IT |
| UC2 | Sepsis erken uyarı klinik karar destek sistemi (CDSS) | clinical_decision_support | EU, TR, IT |
| UC3 | Federated learning + sentetik veri ile meme MRI eğitim konsorsiyumu | data_governance | EU, TR |

---

## 2. Dosya Yapısı

```
05-Degerlendirme/
├── README.md                            ← Bu dosya
├── results/                             ← Ham JSON çıktıları
│   ├── uc1-radyoloji-rules-on.json
│   ├── uc1-radyoloji-rules-off.json
│   ├── uc2-cdss-rules-on.json
│   ├── uc2-cdss-rules-off.json
│   ├── uc3-veri-rules-on.json
│   └── uc3-veri-rules-off.json
├── ablation/                            ← Kural motoru açık/kapalı karşılaştırma
│   ├── ablation-summary.md
│   └── ablation-table.csv
└── ornek_ciktilar/                      ← Örnek anlatılar
    ├── uc1-narrative.md
    ├── uc2-narrative.md
    └── uc3-narrative.md
```

---

## 3. Metodoloji

### 3.1 Değerlendirme Boyutları

| Boyut | Açıklama | Ölçüm Yöntemi |
|-------|----------|---------------|
| **İçerik Kalitesi** | LLM'in tutarlı, kaynaklara dayalı analiz üretmesi | Manuel inceleme |
| **Kaynak Referansları** | Her iddia için chunk_id atfı | Atıf sayısı / iddia sayısı |
| **Risk Sınıfı Doğruluğu** | AB YZ Yasası risk sınıfının doğru tespiti | Beklenen vs. gerçek |
| **Kural Motoru Etkisi** | Açık vs. kapalı karşılaştırma | Skor farkı (Δ) |
| **A Raporu Tutarlılığı** | İnsan-uzman analiziyle uyum | Anahtar bulgu eşleşmesi |

### 3.2 Çalıştırma Yöntemi

Her use case için iki değerlendirme yapıldı:

```bash
# Rules ON (kural motoru açık)
curl -X POST http://localhost:8000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{"use_case": {...}, "rules_enabled": true}' \
  > results/uc1-radyoloji-rules-on.json

# Rules OFF (kural motoru kapalı)
curl -X POST http://localhost:8000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{"use_case": {...}, "rules_enabled": false}' \
  > results/uc1-radyoloji-rules-off.json
```

### 3.3 Test Konfigürasyonu

| Parametre | Değer |
|-----------|-------|
| LLM Provider | Groq (Llama 3.1 8B) |
| Retrieval Top-K | 5 |
| Temperature | 0.3 |
| Tekrar Sayısı | 3 (ortalama alındı) |

---

## 4. Ablation Analizi Sonuçları

### 4.1 Özet Tablo

| Use Case | Mode | Ort. Skor | Risk Sınıfı | Tetiklenen Kurallar |
|----------|------|-----------|-------------|---------------------|
| UC1 — Radyoloji | ON | 6.52 | high | 4 |
| UC1 — Radyoloji | OFF | 7.12 | high | — |
| UC2 — CDSS | ON | 5.86 | high | 6 |
| UC2 — CDSS | OFF | 6.74 | high | — |
| UC3 — Veri Yönetişimi | ON | 7.44 | high | 2 |
| UC3 — Veri Yönetişimi | OFF | 7.82 | high | — |

### 4.2 Skor Farkları (Δ)

| Use Case | Δ (ON - OFF) | Yorumu |
|----------|--------------|--------|
| UC1 | -0.60 | Kural motoru konservatif kalibrasyon sağlıyor |
| UC2 | -0.88 | En yüksek düzeltme (6 kural tetiklendi) |
| UC3 | -0.38 | Düşük düzeltme (2 kural tetiklendi) |

### 4.3 Kural Motoru Değeri

1. **Konservatif Kalibrasyon:** LLM'in "ortalama 7-8" iyimserliğini dengeliyor
2. **Açıklanabilir Düzeltme:** Her skor düşüşü bir `rule_id` ile bağlı
3. **Düzenleyici Farkındalık:** Spesifik maddeleri otomatik tetikliyor
4. **Tekrarlanabilirlik:** Kural penalty'leri stabil; LLM varyansını düzeltiyor

---

## 5. Detaylı Sonuçlar

### 5.1 UC1 — Radyoloji

**Tetiklenen Kurallar:**
| Rule ID | İsim | Severity | Ceza |
|---------|------|----------|------|
| ETH-FAIR-001 | Demografik temsiliyet kontrolü | warning | 2.0 |
| ETH-TRANS-001 | XAI yöntemi tanımlı mı | warning | 1.5 |
| LEG-EU-001 | Yüksek-risk sınıflandırma | info | — |
| LEG-DP-001 | DPIA gereksinimi | warning | 1.0 |

**Skor Kırılımı (ON):**
| Boyut | LLM Skoru | Ceza | Final |
|-------|-----------|------|-------|
| Fairness | 8.0 | -2.0 | 6.0 |
| Transparency | 7.5 | -1.5 | 6.0 |
| Accountability | 7.0 | 0 | 7.0 |
| Privacy | 7.5 | 0 | 7.5 |
| Human Oversight | 6.5 | 0 | 6.5 |

### 5.2 UC2 — CDSS

**Tetiklenen Kurallar:**
| Rule ID | İsim | Severity | Ceza |
|---------|------|----------|------|
| ETH-FAIR-003 | Adalet metrikleri tanımı eksik | info | 1.0 |
| ETH-HUM-001 | HITL paradigması tanımı | warning | 2.0 |
| ETH-HUM-003 | Otomasyon bias farkındalığı | info | 0.5 |
| LEG-EU-001 | Yüksek-risk sınıflandırma | info | — |
| LEG-IT-001 | Hekim son söz | error | 2.0 |
| LEG-DP-001 | DPIA gereksinimi | warning | 1.0 |

### 5.3 UC3 — Veri Yönetişimi

**Tetiklenen Kurallar:**
| Rule ID | İsim | Severity | Ceza |
|---------|------|----------|------|
| ETH-PRIV-003 | Yerel işleme tercihi | info | 0.5 |
| LEG-DP-002 | KVKK ikincil kullanım | warning | 1.0 |

---

## 6. A Raporu Tutarlılığı

Her use case için B sistem çıktısı, A raporundaki insan-uzman analizleriyle karşılaştırıldı:

### UC1 Anahtar Bulgular

| A Raporu Bulgusu | B Sistemi Çıktısı | Uyum |
|------------------|-------------------|------|
| MIMIC/CheXpert ABD-merkezli bias | ETH-FAIR-001 tetiklendi | ✓ |
| Grad-CAM/SHAP XAI gerekliliği | ETH-TRANS-001 tetiklendi | ✓ |
| TİTCK rehber boşluğu | Compliance gap olarak belirtildi | ✓ |
| DEID re-identifikasyon riski | Privacy rationale'de bahsedildi | ✓ |

### UC2 Anahtar Bulgular

| A Raporu Bulgusu | B Sistemi Çıktısı | Uyum |
|------------------|-------------------|------|
| Epic Sepsis %33 sensitivite | Fairness rationale'de referans | ✓ |
| İtalya hekim son söz | LEG-IT-001 tetiklendi | ✓ |
| Alert fatigue riski | Human oversight rationale'de | ✓ |
| Otomasyon bias | ETH-HUM-003 tetiklendi | ✓ |

### UC3 Anahtar Bulgular

| A Raporu Bulgusu | B Sistemi Çıktısı | Uyum |
|------------------|-------------------|------|
| FL+DP+sentetik üçlü mimari | Use case summary'de | ✓ |
| KVKK geri döndürülemezlik | LEG-DP-002 tetiklendi | ✓ |
| EHDS 2029 gecikmesi | Compliance gap olarak | ✓ |

---

## 7. Sistem Sınırlılıkları

| Sınırlılık | Açıklama | Önerilen Çözüm |
|------------|----------|----------------|
| **LLM Kalite Varyansı** | Ollama çıktıları daha kısa | Groq/Claude tercih et |
| **Türkiye Kaynakları** | TİTCK rehberi mevcut değil | Yayınlandığında ekle |
| **Sentetik Veri** | Sınırlı kural kapsamı | Ek kurallar ekle |
| **Skor Kalibrasyon** | Baz skor 7/10 | Daha geniş test seti ile kalibre et |

---

## 8. Çalıştırma

### Tüm Değerlendirmeleri Tekrarla

```bash
cd backend
source .venv/bin/activate

# Her use case için
python -c "
import asyncio
from app.rag.pipeline import EvaluationPipeline
from app.models.schemas import EvaluationRequest, UseCase

async def run():
    pipeline = EvaluationPipeline()

    # UC1
    uc1 = UseCase(
        title='Radyolojide YZ destekli akciğer X-ray çoklu patoloji tanısı',
        area='radiology',
        description='...',
        jurisdiction=['EU', 'TR', 'US', 'IT']
    )

    # Rules ON
    result_on = await pipeline.evaluate(EvaluationRequest(use_case=uc1, rules_enabled=True))

    # Rules OFF
    result_off = await pipeline.evaluate(EvaluationRequest(use_case=uc1, rules_enabled=False))

    print(f'ON: {result_on.ethics_scores}')
    print(f'OFF: {result_off.ethics_scores}')

asyncio.run(run())
"
```

---

## 9. Sonuç

Ablation analizi, kural motorunun **konservatif kalibrasyon** ve **açıklanabilir geribildirim** sağladığını göstermiştir:

- **Ortalama skor düşüşü:** -0.62 (makul aralıkta)
- **Tetiklenen kural sayısı:** 2-6 arası (use case karmaşıklığına bağlı)
- **Risk sınıfı tutarlılığı:** %100 (tüm use case'ler doğru "high" olarak sınıflandırıldı)
- **A raporu uyumu:** Yüksek (tüm anahtar bulgular sistemde yansıtılmış)
