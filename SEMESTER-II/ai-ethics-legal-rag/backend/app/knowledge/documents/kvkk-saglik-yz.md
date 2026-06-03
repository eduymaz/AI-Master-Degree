---
doc_id: kvkk-saglik-yz-2025
title: KVKK Sağlık Verileri ve Üretken YZ Rehberi
authority: T.C. Kişisel Verileri Koruma Kurumu
jurisdiction: Türkiye
publication_date: 2025-11-24
language: tr
source_url: https://www.kvkk.gov.tr
category: primary_regulation
applicable_areas: [healthcare, data_governance]
---

# KVKK — Sağlık Verisi ve Yapay Zekâ

## Madde 6 — Özel Nitelikli Kişisel Veri

6698 sayılı KVKK Madde 6, **sağlık verisini özel nitelikli kişisel veri** kategorisine yerleştirir. Bu kategori, GDPR Madde 9'un Türkiye karşılığıdır. Özel nitelikli veriler **açık rıza** veya **kanunda öngörülen istisna** olmaksızın işlenemez. Sağlık YZ eğitiminde kullanılan hasta verisi bu maddenin doğrudan kapsamındadır.

## Madde 3(1)(b) — Anonim Veri

KVKK kapsamı, **anonim** veya **anonimleştirilmiş** kişisel veriler için uygulanmaz. Bu hüküm, sağlık YZ eğitiminde **federated learning + differential privacy + sentetik veri** üçlüsünün hukuki temelini oluşturur. Ancak anonimleştirmenin geçerliliği için **geri döndürülemezlik** şartı aranır.

## Kasım 2025 Üretken YZ Rehberi — Anahtar İlkeler

KVKK Kurumu Kasım 2025'te "Üretken YZ ve Kişisel Verilerin Korunması Rehberi (15 Soruda)" yayımladı. Rehberin sağlık YZ'sine yansıyan kritik maddeleri:

1. **Lokal işleme tercihi:** Sağlık verisinin merkezi bulutlara taşınması yerine, **on-device** veya **kurum-içi** işleme önerilir. Federated learning bu prensibin teknik karşılığıdır.
2. **Anonimleştirme — geri döndürülemezlik şartı:** Naïve hashing (örn. SHA-256) yetersizdir; **k-anonymity, l-diversity, t-closeness, differential privacy** gibi formel teknikler önerilir.
3. **Tasarımda mahremiyet (Privacy by Design):** Veri minimizasyonu eğitim aşamasında uygulanmalı; gerekli olmayan alanlar (örn. tam doğum tarihi yerine yıl) baştan çıkarılmalıdır.
4. **Re-identification (geri-tanımlama) testleri:** Sentetik veri yayımlamadan önce **membership inference attack** ile test edilmelidir.
5. **Veri sahibi hakları:** YZ ile işlenen veri için hasta, **erişim, düzeltme, silme** ve **otomatik karar verme hakkında bilgilendirilme** haklarına sahiptir (KVKK Md.11).

## Yaptırım

KVKK idari para cezası üst limiti **2025 itibarıyla 5.000.000 TL'ye yükseltilmiştir** (Faaliyet Bilgi Notu 2024). Ayrıca TCK 136-137. maddeleri kişisel veri ihlali için **özgürlüğü bağlayıcı ceza** öngörmektedir.

## Sağlık Bakanlığı Bağlamı

KVKK çerçevesi Sağlık Bakanlığı'nın 2026'da kurulması planlanan **YZ Onay Birimi** ile entegre olmak zorundadır. Şu anki boşluk: TİTCK'nın YZ-temelli tıbbi cihaz değerlendirme özel metodoloji rehberi henüz yayımlanmamıştır.
