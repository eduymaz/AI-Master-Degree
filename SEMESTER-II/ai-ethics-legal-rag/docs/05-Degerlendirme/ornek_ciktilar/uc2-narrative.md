# UC2 — Sepsis CDSS · Sistem Anlatısal Değerlendirmesi

> Sistem tarafından üretildi (kural motoru açık, Claude Sonnet 4.6).

## Genel Değerlendirme

Sepsis erken uyarı CDSS'i (UC2), **AB YZ Yasası Annex III + Annex I kapsamında YÜKSEK-RİSK** sınıfındadır. İtalya YZ Yasası (Ekim 2025) "**nihai karar daima hekimde**" ilkesi advisory tasarımla karşılanıyor; ancak Wong vd. (2021) Epic Sepsis Modeli **%33 sensitivite** vakasının dersleri yerel doğrulama + concept drift monitoring ile uygulamaya alınmış.

## Adalet

MIMIC-IV üzerinden eğitim + Türkiye hastane verisi ile fine-tuning olumlu adım. Subgroup performance (yaş × cinsiyet × etnisite × komorbidite) sürekli izleme planı eklenmeli. Adalet metrikleri açıkça belirtilmemiş — Independence/Separation/Sufficiency üçlüsünden hangisinin önceliklendirildiği netleştirilmeli (klinik bağlamda **Separation** kritiktir).

## Şeffaflık

SHAP waterfall plot her vaka için en etkili 5 özelliği (laktat, MAP, lökosit, kalp hızı, ateş) gösteriyor — klinisyen iş akışına uygun. Çoklu risk kategorisi (5 seviye) alert fatigue azaltma adımı. **Hasta YZ kullanımı bilgilendirmesi** İtalya yasası uyumu için zorunlu, mevcut tasarımda açıkça belirtilmemiş.

## Hesap Verebilirlik

**Override gerekçe alanı zorunlu** belirtilmemiş; bu boşluk **otomasyon bias** riskini artırır. Audit log ve override loglama eklenmeli.

## Mahremiyet

FHIR R4 + OAuth 2.0 + SMART on FHIR scopes ile **asgari ihtiyaç prensibi** (data minimization) uygulanıyor. KVKK Madde 6 ve GDPR Madde 9 kapsamında EHR PHI işleme için DPIA tamamlanması gerekiyor.

## İnsan Denetimi

HITL advisory — İtalya yasasına uygun. HOOTL (otonom karar) **yasak**; HOTL hastane kalite-emniyet komitesi tarafından uygulanır. Lancet (2026) eleştirisi: ICU'da yoğun ortamda HITL'in "sembolik güvenceye" dönüşme riski — **doctor-AI consensus rate** + alert fatigue metriği izleme önerilir.

## Türkiye Bağlamı

CDSS-spesifik kılavuz Türkiye'de yok; Sağlık Bakanlığı YZ Onay Birimi 2026 operasyonel olduğunda bu boşluk doldurulmalı. KVKK Kurumu + Türk Tabipleri Birliği etik kuralları arası "hekim son söz" ilkesi senkronizasyonu önerilir.

---

## Anahtar Kural Bulguları

- 🟡 `ETH-HUM-003` (info): Override gerekçe alanı eksik
- 🟡 `ETH-FAIR-003` (info): Adalet metrikleri açıkça belirtilmemiş
- 🟡 `LEG-EU-002` (warning): Veri kalite/temsiliyet raporu yok
- 🟡 `LEG-DP-001` (warning): DPIA tamamlanma durumu belirsiz
- ℹ `LEG-EU-001` (info): YÜKSEK-RİSK sınıflandırması atandı
- ℹ `LEG-IT-001`: İtalya hekim son söz ilkesi mevcut ✓ (penalty yok)
