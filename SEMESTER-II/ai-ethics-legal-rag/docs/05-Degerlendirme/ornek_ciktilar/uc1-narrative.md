# UC1 — Radyoloji CADx · Sistem Anlatısal Değerlendirmesi

> Aşağıdaki anlatı, sistem tarafından üretildi (kural motoru açık, Claude Sonnet 4.6).
> A raporundaki insan-uzman değerlendirmesi ile **anahtar bulgular düzeyinde uyumlu**.

## Genel Değerlendirme

Bu radyolojide YZ destekli tanı sistemi (UC1), **AB YZ Yasası Annex I + Madde 6(1) kapsamında YÜKSEK-RİSK** sınıfında konumlanmaktadır. Sistem büyük ölçüde olgun bir mimari (hibrit CNN+ViT + Grad-CAM/SHAP açıklanabilirlik + HITL onay) ve düzenleyici farkındalık sergiliyor.

## Adalet

Çoklu-bölgeli dataset birleşimi (MIMIC + CheXpert + PadChest + VinDr) takdire şayan; ancak MIMIC-CXR ve CheXpert'in ABD-merkezliliği, *Nature Medicine* (Yang et al., 2024) ve *Science Advances* (Glocker et al., 2025) çalışmalarının ortaya koyduğu **demografik bias** riskini taşımakta. Federated learning ile yerel Türkiye verisi entegrasyonu doğru yön; ancak **subgroup performance dashboard** (yaş × cinsiyet × etnisite) sürekli izlenmeli.

## Şeffaflık

Layer-wise Grad-CAM ve SHAP overlay, AB YZ Yasası Madde 13 yükümlülüğünü karşılayacak biçimde tasarlanmış. *Frontiers in Radiology* (2025) eleştirisi — XAI'nin klinisyen iş akışına tam entegre olmayışı — bu sistem için de geçerli olabilir; **radyolog kullanım çalışması** (gözlem + geribildirim) önerilir.

## Hesap Verebilirlik

AILD'nin Şubat 2025'te geri çekilmesi sonrası sorumluluk dağılımı **ürün sorumluluğu + sektörel kurallar** üzerinden işliyor. Sistem 6 paydaş ile çok-aktörlü hesap verebilirlik zinciri kuruyor; audit log + PCCP mekanizmaları + ISO/IEC 42001 sertifikasyonu (önerilir) bu zinciri güçlendirir.

## Mahremiyet

DICOM DEID + federated learning + KVKK/GDPR uyumu güçlü bir gizlilik mimarisi sunuyor. KVKK Kasım 2025 rehberindeki **geri döndürülemezlik** şartı için DEID protokolünün **membership inference attack** ile test edilmesi öneririm.

## İnsan Denetimi

HITL — radyolog her tanıyı onaylar — standart klinik pratik. İtalya yargı bölgesinde "hekim son söz" yasal zorunluluğa uygun. **Lancet (2026)** eleştirisinin önerdiği **doctor-AI consensus rate** metriğinin sürekli izlenmesi, HITL'in "sembolik güvence"ye dönüşmesini önlemek için önemli.

## Türkiye Bağlamı

Bu sistem Türkiye'de pazara giriş için **TİTCK YZ-tıbbi cihaz rehberi**nin yayımlanmasını bekliyor (Sağlık Bakanlığı YZ Onay Birimi 2026 hedefi). Geçici geliştirme döneminde ISO/IEC 42001 sertifikasyonu ve hastane düzeyi etik kurul onayı pragmatik yol.

---

## A Raporu ile Uyum Kontrol Listesi

- ✅ MIMIC/CheXpert ABD-merkezli sorunu — **A raporu Bölüm UC1 (b) Adalet ve A 2.3.1**'de işaretli
- ✅ Grad-CAM/SHAP XAI kısıtları — **A raporu Bölüm UC1 (b) Şeffaflık ve A 2.3.2**'de işaretli
- ✅ AILD geri çekilmesi sonrası sorumluluk — **A raporu Bölüm 2.3.3**'te işaretli
- ✅ DEID re-identification riski — **A raporu Bölüm UC1 (b) Mahremiyet**'te işaretli
- ✅ HITL Lancet 2026 eleştirisi — **A raporu Bölüm 2.3.6 ve UC1 (b) İnsan Denetimi**'nde işaretli
- ✅ TİTCK boşluğu — **A raporu Bölüm 4.5.1**'de işaretli
