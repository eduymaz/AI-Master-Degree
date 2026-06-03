---
doc_id: fda-aiml-samd-2025
title: FDA AI/ML Software as a Medical Device (SaMD) Çerçevesi
authority: U.S. Food and Drug Administration
jurisdiction: United States
publication_date: 2025-08-15
language: tr
source_url: https://www.fda.gov/medical-devices/software-medical-device-samd
category: primary_regulation
applicable_areas: [healthcare, medical_devices]
---

# FDA AI/ML Software as a Medical Device (SaMD) Çerçevesi

## Tarihsel Gelişim

- **2019:** Önerilen Düzenleyici Çerçeve (AI/ML SaMD Modification Framework)
- **2021:** AI/ML SaMD Eylem Planı (Action Plan)
- **2023:** İyi Makine Öğrenmesi Uygulamaları (Good Machine Learning Practice — GMLP)
- **Ocak 2025:** Total Product Lifecycle (TPLC) Yönetim Taslak Rehberi
- **Ağustos 2025:** **Predetermined Change Control Plans (PCCP) Nihai Rehberi**

## SaMD Sınıflandırması (IMDRF temelli)

FDA, **uluslararası tıbbi cihaz regülatörleri forumu (IMDRF)** sınıflandırmasını benimser. Sağlık YZ uygulamaları risk düzeyine göre 4 kategoride değerlendirilir:

- **Class I:** Düşük risk (örn. genel sağlık bilgi uygulamaları)
- **Class II:** Orta risk — **510(k)** veya **De Novo** yolu (radyoloji CADx, klinik karar destek)
- **Class III:** Yüksek risk — **PMA (Premarket Approval)** yolu (yaşam-destek YZ)

## Predetermined Change Control Plan (PCCP) — 2025 Devrimi

PCCP, **YZ'nin doğası gereği post-market değişebilir** olduğu gerçeğini kabul eden devrim niteliğindeki bir mekanizmadır. Bileşenler:

### 1. SaMD Pre-Specifications (SPS)

Üreticinin **öngördüğü değişiklik türleri**:
- Performans değişiklikleri (sensitivite, spesifisite)
- Girdi/çıktı değişiklikleri (yeni modaliteler, yeni hasta popülasyonu)
- Hedef değişiklikleri (yeni endikasyonlar — sınırlı)

### 2. Algorithm Change Protocol (ACP)

Her değişikliğin **nasıl doğrulanacağını** tanımlayan metodoloji:
- Doğrulama veri seti tanımı
- Performance kabul kriterleri (örn. AUROC en az 0.85)
- Test prosedürleri
- Karşılaştırmalı analiz (eski vs. yeni model)

### 3. Real-World Performance Monitoring

- Klinik dağıtım sonrası **canlı performans takibi**
- Subgroup performance (yaş, cinsiyet, etnisite)
- Concept drift detection
- Yan etki/yanlış sonuç raporlama

## 2025 İstatistikleri

FDA, 2025 sonu itibarıyla **1.451 YZ-temelli tıbbi cihaza pazarlama yetkisi** vermiştir:
- **%75-76 radyoloji** (en yüksek pay)
- Kardiyoloji ve nöroloji büyüme alanları
- En çok onay alan üretici: **GE HealthCare (115 cihaz)** — Caption Health, Bay Labs, BK Medical, MIM Software, icometrix gibi alımlarla
- Q4 2025'te 72 yeni onay (55'i radyoloji)

## Klinik Karar Destek Sistemleri için Özel Hükümler

ABD 21st Century Cures Act 1135. maddesi, **klinisyenin bağımsız yargı uygulayabildiği** CDS'leri FDA düzenlemesinden muaf tutar. Ancak modern ML-CDSS'ler (Epic Sepsis Modeli gibi) bu muafiyetin dışındadır çünkü:
- Açıklanabilirlik yetersizliği → bağımsız yargı kısıtlı
- Akut zaman baskısı → klinisyen klinik yargı uygulayamaz
- Wong vd. (2021) JAMA çalışması — Epic Sepsis %33 sensitivite

FDA 2022 CDS Final Rule'u bu sınırı netleştirmiştir: **ML-temelli CDSS Class II tıbbi cihazdır**.

## AB YZ Yasası ile Karşılaştırma

| Boyut | FDA | AB YZ Yasası |
|-------|-----|--------------|
| Yaklaşım | Sektörel (tıbbi cihaz odaklı) | Yatay + sektörel |
| Risk sınıfı | I/II/III + SaMD level | Yasaklı / Yüksek / Sınırlı / Minimal |
| Post-market değişiklik | **PCCP (önceden onaylı)** | Substantial modification kavramı |
| Şeffaflık | TPLC önerir | Madde 13 zorunlu |
| Yaptırım | FDA recall, civil penalty, malpraktis | İdari ceza (%3 ciro) + CE iptali |

## Türkiye İçin Çıkarımlar

PCCP modeli Türkiye için **uyarlanabilir** bir mekanizmadır:
- TİTCK'nın YZ-tıbbi cihaz değerlendirme rehberinde benzer bir "öngörülen değişiklik planı" oluşturulabilir
- Bu, üreticilerin her küçük model güncellemesi için yeniden onay almasının önüne geçer
- Türkiye'nin hızlı dijital sağlık dönüşümü stratejisi ile uyumludur
