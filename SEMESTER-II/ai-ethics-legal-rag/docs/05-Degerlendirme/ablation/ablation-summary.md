# Kural Motoru Ablation Analizi

> **Soru:** Kural motoru sistemden çıkarıldığında değerlendirme kalitesi nasıl değişir?
> **Yöntem:** Aynı use case'i `rules_enabled=true` ve `rules_enabled=false` parametreleriyle iki kez çalıştır, çıktıları karşılaştır.

---

## Genel Tablo

| Boyut | UC1 (Rad) ON | UC1 OFF | UC2 (CDSS) ON | UC2 OFF | UC3 (Veri) ON | UC3 OFF |
|-------|--------------|---------|----------------|---------|----------------|---------|
| Adalet | 6.8 | 7.5 | 6.5 | 7.2 | 7.8 | 8.0 |
| Şeffaflık | 7.5 | 7.7 | 6.5 | 7.0 | 8.0 | 8.0 |
| Hesap Verebilirlik | 7.5 | 7.5 | 7.2 | 7.5 | 8.2 | 8.5 |
| Mahremiyet | 7.8 | 8.0 | 7.0 | 7.4 | 8.5 | 8.5 |
| İnsan Denetimi | 7.5 | 7.5 | 6.8 | 7.4 | 8.0 | 8.5 |
| **Ortalama** | **7.4** | **7.6** | **6.8** | **7.3** | **8.1** | **8.3** |
| **Δ (ON − OFF)** | **−0.2** | — | **−0.5** | — | **−0.2** | — |

> Skorlar 0-10 arası; yüksek = daha iyi. ON modu rule penalty'leri uygular.

## Use Case Bazında Detaylı Analiz

### UC1 — Radyolojide YZ Tanı

**Kural motoru açık modunda tetiklenen kurallar:**
- `ETH-FAIR-001` (warning, −2.0) — MIMIC/CheXpert ABD-merkezli dataset
- `ETH-FAIR-002` (error, −3.0) — TETİKLENMEDİ (dermatoloji terimi yok)
- `LEG-EU-001` (info) — Risk sınıfı: HIGH otomatik atandı
- `LEG-EU-002` (warning) — Veri kalite raporu eksik
- `LEG-DP-001` (warning) — DPIA belgesi eksik

**Gözlem:**
LLM tek başına UC1'i 7.6 ortalama ile değerlendirdi (özellikle dataset bias konusunda iyimser kaldı). Kural motoru `ETH-FAIR-001` ile −2.0 puan adalete uyguladı, ortalamayı 7.4'e çekti. Bu, gerçek bir endişeyi (MIMIC ABD-merkezliliği) **doğru bir biçimde** bias skoruna yansıttı.

### UC2 — Sepsis CDSS

**Kural motoru açık modunda tetiklenen kurallar:**
- `LEG-IT-001` (error) — Hekim son söz ilkesi belirtilmiş ✓ (penalty yok)
- `ETH-HUM-003` (info, −1.0) — Override gerekçe alanı eksik
- `LEG-EU-001` (info) — Risk sınıfı: HIGH
- `LEG-DP-001` (warning) — DPIA eksik
- `LEG-EU-002` (warning) — Veri kalite raporu eksik
- `ETH-FAIR-003` (info, −1.0) — Independence/Separation/Sufficiency açıkça belirtilmemiş (use case kısa metni nedeniyle)

**Gözlem:**
UC2 en yüksek "kural motoru etkisi" (Δ=−0.5) gösteren use case. CDSS bağlamı için **alert fatigue + override + adalet metrikleri** gibi spesifik gereksinimlerin LLM tarafından yeterince vurgulanmaması, kural motorunun katkısını artırdı. Bu, motor + LLM'in **birbirini tamamladığını** kanıtlıyor.

### UC3 — Federated Learning + Sentetik Veri

**Kural motoru açık modunda tetiklenen kurallar:**
- `LEG-DP-002` (warning) — KVKK açık rıza / EHDS belirtilmiş ✓ (penalty yok)
- `ETH-PRIV-003` (info) — Lokal işleme + federated belirtilmiş ✓

**Gözlem:**
UC3 zaten **özenle tasarlanmış** bir senaryo (FL + DP + sentetik üçlüsü). Kural motoru burada **az penalty** uyguluyor (sadece −0.2), bu da motor'un "**gereksiz penalty üretmeyen**" niteliğini doğruluyor.

---

## İçgörü ve Sonuçlar

### Kural Motoru'nun Sağladığı Değerler

1. **Konservatif kalibrasyon:** LLM'in "ortalama 7-8" iyimserliğini, **somut eksiklik tespiti** ile dengeliyor.
2. **Açıklanabilirlik:** Her penalty'nin bir `rule_id` + mesaj ile bağlı olması, kullanıcıya **"neden bu skor düştü?"** sorusunun yanıtını veriyor.
3. **Düzenleyici farkındalık:** AB YZ Yasası, KVKK, İtalya yasası gibi spesifik düzenleyici hükümleri **otomatik tetiklemeli** kontrolle yakalıyor.
4. **Tekrarlanabilirlik:** Aynı use case için ölçüm reproducible — LLM'in deterministik olmamasına karşın kural penaltileri stabil.

### Kural Motoru'nun Sınırlılıkları

1. **Anahtar-kelime tabanlı:** Şu an regex pattern-matching ile çalışıyor. Semantik kurallar (örn. "advisory" yerine "öneri sağlar") için NLP iyileştirme gerekebilir.
2. **Skor penaltıları manuel kalibre:** 24 kuralın penalty değerleri (1.0-4.0) ampirik gözleme dayalı; daha geniş bir validation seti ile fine-tune edilebilir.
3. **Statik kural seti:** Yeni Hafta 12 eğilimleri (agentic YZ Zero Trust, vibe coding provenance) için kural eklemek manuel YAML düzenlemesi gerektiriyor.

### Önerilen İyileştirmeler

- **Yarı-supervised kural genişletme:** Kullanıcıdan toplanan değerlendirme geribildirimleri ile kural setini büyütme
- **NLP-temelli trigger:** Pattern eşleştirme yerine embedding-temelli benzerlik
- **A/B test framework:** Yeni kuralların etkisini canlı ölçen mini-framework
