# 02 — Kural Motoru (Rule Engine)

> **Rubric Maddesi:** Etik ve hukuki kuralların YAML/JSON tabanında kodlanması ve değerlendirici motor (15 puan)

---

## 1. Genel Bakış

Kural motoru, sağlık YZ uygulamalarını **24 deklaratif kural** ile değerlendirir. Kurallar üç kategoride organize edilmiştir:

1. **Etik İlkeler** (13 kural) — Adalet, Şeffaflık, Hesap Verebilirlik, Mahremiyet, İnsan Denetimi
2. **Hukuki Uyumluluk** (8 kural) — AB YZ Yasası, GDPR/KVKK, İtalya YZ Yasası
3. **Skorlama** (3 kural) — Baz skor, ceza sistemi, post-doğrulama

---

## 2. Dosya Yapısı

```
backend/app/rules/
├── rules.yaml      ← 24 kural tanımı (YAML formatında)
└── engine.py       ← Kural değerlendirme motoru (Python)
```

---

## 3. Kural Taksonomisi

### 3.1 Etik İlkeler (13 Kural)

| Etik Boyut | ID Öneki | Kural Sayısı | Örnek Kurallar |
|------------|----------|--------------|----------------|
| **Adalet (Fairness)** | `ETH-FAIR-*` | 3 | Demografik temsiliyet, cilt tipi bias, adalet metrikleri |
| **Şeffaflık (Transparency)** | `ETH-TRANS-*` | 2 | XAI yöntemi, İtalya hasta bilgilendirme |
| **Hesap Verebilirlik (Accountability)** | `ETH-ACC-*` | 2 | Sorumluluk zinciri, audit log |
| **Mahremiyet (Privacy)** | `ETH-PRIV-*` | 3 | Özel kategori veri, anonimleştirme, yerel işleme |
| **İnsan Denetimi (Human Oversight)** | `ETH-HUM-*` | 3 | HITL paradigması, otonom karar yasağı, otomasyon bias |

### 3.2 Hukuki Uyumluluk (8 Kural)

| Çerçeve | ID Öneki | Kural Sayısı | Tetikleyici |
|---------|----------|--------------|-------------|
| **AB YZ Yasası** | `LEG-EU-*` | 2 | Yüksek-risk sınıflandırma, veri yönetişimi |
| **GDPR/KVKK** | `LEG-DP-*` | 2 | DPIA gereksinimi, sağlık verisi ikincil kullanım |
| **İtalya YZ Yasası** | `LEG-IT-*` | 1 | Hekim son söz zorunluluğu |
| **FDA SaMD** | `LEG-US-*` | 1 | Predetermined Change Control |
| **Genel** | `LEG-GEN-*` | 2 | Çok-yargı bölgesi uyumluluk |

### 3.3 Skorlama (3 Kural)

| Kural ID | İşlev |
|----------|-------|
| `SCORE-BASE` | Baz skor: 7.0/10 |
| `SCORE-PENALTY` | Kural ihlali başına -0.5 ile -4.0 arası ceza |
| `SCORE-VALID` | 0-10 aralık doğrulaması |

---

## 4. Kural Anatomisi

Her kural aşağıdaki YAML yapısına sahiptir:

```yaml
- id: ETH-FAIR-001
  name: "Demografik temsiliyet kontrolü"
  description: "ABD/Batı-merkezli veri setleri için bias uyarısı"
  triggers:
    - field: use_case.description
      pattern: "(?i)(mimic|chexpert|nih|isic|imagenet)"
    - field: use_case.data_sources
      contains: "MIMIC"
  severity: warning
  score_penalty: 2.0
  message: "Eğitim verisi ABD/Batı-merkezli; subgroup performance raporu ve yerel doğrulama önerilir."
  affected_dimension: fairness
  references:
    - "EU AI Act Art.10"
    - "WHO AI Ethics Guideline 3.2"
```

### Trigger DSL (Domain Specific Language)

| Operatör | Açıklama | Örnek |
|----------|----------|-------|
| `field` | Kontrol edilecek use case alanı | `use_case.description` |
| `pattern` | Regex deseni eşleşmesi | `"(?i)(mimic\|chexpert)"` |
| `not_pattern` | Regex deseni eşleşmemesi | `"(?i)(xai\|grad-cam)"` |
| `equals` | Tam eşitlik | `"radiology"` |
| `contains` | İçerme kontrolü | `"MIMIC"` |
| `in` | Liste içinde olma | `["EU", "TR"]` |
| `min_length` | Minimum uzunluk | `3` |
| `and_field` | Ek alan kontrolü (AND) | `use_case.area` |
| `invert` | Sonucu tersine çevir | `true` |

### Severity Seviyeleri

| Severity | Etki | Örnek |
|----------|------|-------|
| `info` | Bilgilendirme (skor değiştirmez) | Risk sınıfı bildirimi |
| `warning` | Skor cezası uygulanır | Dataset bias uyarısı |
| `error` | Ciddi uyarı + yüksek ceza | Otonom karar yasağı ihlali |

---

## 5. Motor Mantığı

### 5.1 İki Aşamalı Değerlendirme

```
┌─────────────────────────────────────────────────────────┐
│                    USE CASE GİRDİSİ                      │
└─────────────────────────────┬───────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│            PRE-LLM KURAL DEĞERLENDİRME                   │
│  • 24 kuralın trigger'ları kontrol edilir               │
│  • Tetiklenen kurallar listelenir                        │
│  • Rules context oluşturulur (LLM'e gönderilir)         │
└─────────────────────────────┬───────────────────────────┘
                              │
                              ▼
                        [LLM ÇAĞRISI]
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│           POST-LLM SKOR AYARLAMA                         │
│  • Her boyut için ceza hesaplanır                        │
│  • final_score = llm_score - cumulative_penalty         │
│  • Risk sınıfı override (gerekirse)                      │
└─────────────────────────────┬───────────────────────────┘
                              │
                              ▼
                     [FINAL DEĞERLENDİRME]
```

### 5.2 Skor Cezası Hesaplama

```python
# Her etik boyut için ayrı hesaplama
for dimension in ["fairness", "transparency", "accountability", "privacy", "human_oversight"]:
    penalties = [r.score_penalty for r in triggered_rules
                 if r.affected_dimension == dimension]
    final_score[dimension] = max(0.0, llm_score[dimension] - sum(penalties))
```

**Örnek:**
- LLM `fairness` için 8.0 puan üretiyor
- `ETH-FAIR-001` tetiklendi (-2.0 penalty)
- Final skor: `max(0.0, 8.0 - 2.0) = 6.0`

### 5.3 Risk Sınıfı Override

`LEG-EU-001` kuralı tetiklendiğinde:
- `area in ["radiology", "clinical_decision_support"]` → Risk sınıfı otomatik **`high`**
- LLM farklı sınıflandırma yapsa bile düzenleyici çerçeveye uygunluk garantilenir

---

## 6. Kullanım

### 6.1 Programatik Kullanım

```python
from app.rules.engine import RuleEngine

# Kural motorunu başlat
engine = RuleEngine.from_yaml("backend/app/rules/rules.yaml")

# Use case değerlendir
result = engine.evaluate(use_case)

# Sonuçlara eriş
print(result.triggered_rules)      # Tetiklenen kurallar
print(result.dimension_penalties)  # Boyut bazlı cezalar
print(result.risk_class_override)  # Risk sınıfı değişikliği
```

### 6.2 API Üzerinden Kural Listesi

```bash
curl http://localhost:8000/api/rules

# Yanıt
{
  "rules": [
    {
      "id": "ETH-FAIR-001",
      "name": "Demografik temsiliyet kontrolü",
      "category": "ethical_principles",
      "subcategory": "fairness",
      "severity": "warning",
      "score_penalty": 2.0
    },
    ...
  ],
  "total_rules": 24,
  "categories": {
    "ethical_principles": 13,
    "legal_compliance": 8,
    "scoring": 3
  }
}
```

---

## 7. Kural Listesi (Tam)

### Etik İlkeler

| ID | İsim | Severity | Ceza |
|----|------|----------|------|
| ETH-FAIR-001 | Demografik temsiliyet kontrolü | warning | 2.0 |
| ETH-FAIR-002 | Cilt tipi / dermatoloji bias | warning | 2.0 |
| ETH-FAIR-003 | Adalet metrikleri tanımı eksik | info | 1.0 |
| ETH-TRANS-001 | XAI yöntemi tanımlı mı | warning | 1.5 |
| ETH-TRANS-002 | İtalya hasta bilgilendirme | warning | 1.0 |
| ETH-ACC-001 | Sorumluluk zinciri tanımı | warning | 1.0 |
| ETH-ACC-002 | Audit log mekanizması | info | 0.5 |
| ETH-PRIV-001 | Özel kategori veri farkındalığı | warning | 1.0 |
| ETH-PRIV-002 | Anonimleştirme yöntemi | info | 0.5 |
| ETH-PRIV-003 | Yerel işleme tercihi | info | 0.5 |
| ETH-HUM-001 | HITL paradigması tanımı | warning | 2.0 |
| ETH-HUM-002 | Otonom karar yasağı (İtalya) | error | 3.0 |
| ETH-HUM-003 | Otomasyon bias farkındalığı | info | 0.5 |

### Hukuki Uyumluluk

| ID | İsim | Severity | Etki |
|----|------|----------|------|
| LEG-EU-001 | Yüksek-risk sınıflandırma | info | Risk sınıfı override |
| LEG-EU-002 | Veri yönetişimi (Art.10) | warning | 1.0 ceza |
| LEG-DP-001 | DPIA gereksinimi | warning | 1.0 ceza |
| LEG-DP-002 | KVKK ikincil kullanım | warning | 1.0 ceza |
| LEG-IT-001 | Hekim son söz | error | 2.0 ceza |
| LEG-US-001 | FDA PCCP | info | Bilgilendirme |
| LEG-GEN-001 | Çok-yargı uyumluluk | info | Bilgilendirme |
| LEG-GEN-002 | Yerel düzenleme boşluğu | warning | 0.5 ceza |

---

## 8. Test

```bash
cd backend
pytest app/tests/test_rule_engine.py -v

# Çıktı
test_rule_loading ... PASSED
test_trigger_pattern_matching ... PASSED
test_penalty_calculation ... PASSED
test_risk_class_override ... PASSED
...
```

---

## 9. Kod Referansları

| Dosya | Satır | Açıklama |
|-------|-------|----------|
| `backend/app/rules/rules.yaml` | 1-300 | Tüm kural tanımları |
| `backend/app/rules/engine.py` | 20-50 | RuleEngine sınıfı |
| `backend/app/rules/engine.py` | 60-100 | Trigger eşleştirme |
| `backend/app/rules/engine.py` | 110-150 | Skor cezası hesaplama |
| `backend/app/rag/pipeline.py` | 80-100 | Pre-LLM kural çağrısı |
| `backend/app/rag/pipeline.py` | 150-180 | Post-LLM skor ayarlama |

---

## 10. Genişletme

Yeni kural eklemek için `rules.yaml` dosyasına:

```yaml
- id: ETH-NEW-001
  name: "Yeni kural ismi"
  description: "Kural açıklaması"
  triggers:
    - field: use_case.description
      pattern: "(?i)(anahtar_kelime)"
  severity: warning
  score_penalty: 1.0
  message: "Kullanıcıya gösterilecek mesaj"
  affected_dimension: fairness  # veya başka boyut
```

Sistem yeniden başlatıldığında kural otomatik yüklenir.
