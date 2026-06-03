---
doc_id: eu-ai-act-2024
title: AB Yapay Zekâ Yasası (Regulation (EU) 2024/1689)
authority: European Commission
jurisdiction: EU
publication_date: 2024-07-12
language: tr
source_url: https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
category: primary_regulation
applicable_areas: [healthcare, general]
---

# AB Yapay Zekâ Yasası — Sağlık Alanı İçin Kritik Maddeler

## Madde 6 — Yüksek-Risk YZ Sistemleri Sınıflandırma Kuralları

Madde 6(1): Annex I'de listelenen Birlik uyum mevzuatı kapsamındaki ürünlerin güvenlik bileşeni olarak veya kendisi bu mevzuat kapsamına giren YZ sistemleri ve üçüncü taraf uygunluk değerlendirmesi gerektirenler **yüksek-risk** olarak kabul edilir. Bu, **MDR (Tıbbi Cihaz Yönetmeliği)** ve **IVDR** kapsamındaki Class IIa+ tıbbi cihazlara entegre YZ sistemlerini doğrudan etkiler.

Madde 6(2): Annex III'te listelenen kullanım alanları yüksek-risk kabul edilir; sağlık alanında özellikle "Acil sağlık hizmetlerine erişimde önceliklendirme" ve "Risk değerlendirme ve fiyatlandırma — sağlık sigortası" kategorileri yer alır.

## Madde 9 — Risk Yönetim Sistemi

Yüksek-risk YZ sağlayıcıları, sistemin yaşam döngüsü boyunca sürekli iteratif bir risk yönetim sistemi kurmalıdır. Bu, **post-market sürveyans** ile birleşir; FDA PCCP modeline benzer bir "öngörülen değişiklik planı" çerçevesi gerektirir.

## Madde 10 — Veri Yönetişimi ve Veri Kalitesi

Eğitim, doğrulama ve test veri setleri **yüksek kaliteli**, **temsili**, **hatasız** ve **tam** olmalıdır. Bu madde, sağlık YZ'sinde algoritmik önyargı (örn. Fitzpatrick IV-VI cilt tipinde dermatoloji modellerinin yetersizliği) için doğrudan uygulama alanıdır. Türkiye yargı bölgesindeki bir sistem için **etnik/coğrafi çeşitlilik** raporlama standardı geliştirilmesi gereken bir boşluk olarak öne çıkar.

## Madde 13 — Kullanıcı Bilgilendirmesi ve Şeffaflık

Yüksek-risk YZ sistemleri, kullanıcıların çıktıyı yorumlayabilmesini ve uygun şekilde kullanabilmesini sağlayacak şekilde **şeffaf** olmalıdır. Sağlık bağlamında bu, klinisyene yönelik **açıklanabilirlik (XAI)** çıktıları (örn. Grad-CAM ısı haritası, SHAP waterfall) ve hastaya yönelik **YZ kullanımı bildirimi** anlamına gelir.

## Madde 14 — İnsan Denetimi

Yüksek-risk YZ sistemleri, gerçek kişiler tarafından etkin biçimde denetlenebilecek şekilde tasarlanmalı ve geliştirilmelidir. Sağlık alanında bu **HITL (Human-in-the-Loop)** zorunluluğuna dönüşür: radyoloji CADx sistemlerinde radyolog onayı, CDSS'lerde hekim son sözü. İtalya YZ Yasası bu hükmü ulusal düzeyde "nihai karar daima hekimde" ilkesiyle somutlaştırmıştır.

## Madde 15 — Doğruluk, Sağlamlık ve Siber Güvenlik

Sistemler uygun düzeyde doğruluk, sağlamlık ve siber güvenlik düzeyinde tasarlanmalıdır. "Uygun düzey" tanımı **operasyonel olarak belirsizdir** — Wong vd. (2021) Epic Sepsis Modeli %33 sensitivite vakası bu boşluğun somut sonucudur.

## Uyum Tarihleri

- **2 Şubat 2025:** Yasaklı YZ sistemleri + YZ okuryazarlığı (Madde 4)
- **2 Ağustos 2026:** Annex III yüksek-risk (stand-alone CDSS dahil)
- **2 Ağustos 2027:** Annex I yüksek-risk (MDR/IVDR'a entegre YZ — radyoloji CADx vb.)
- **Digital Omnibus (öneri):** Yüksek-risk tarihleri Aralık 2027 / Ağustos 2028'e ertelenebilir

## Risk Sınıflandırmaları

- **Yasaklı (prohibited):** Sosyal puanlama, gerçek-zamanlı biyometrik tanımlama (sağlık dışı)
- **Yüksek-risk (high-risk):** Tıbbi cihaz YZ (CADx, CDSS), sağlık sigortası fiyatlandırması
- **Sınırlı-risk (limited-risk):** Sağlık chatbot'ları (şeffaflık zorunlu)
- **Minimal-risk (minimal):** Hastane operasyonel YZ (yatak yönetimi vb.)
