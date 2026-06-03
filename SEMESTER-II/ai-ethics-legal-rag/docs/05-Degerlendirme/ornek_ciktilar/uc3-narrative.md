# UC3 — Federated Learning + Sentetik Veri · Sistem Anlatısal Değerlendirmesi

> Sistem tarafından üretildi (kural motoru açık, Claude Sonnet 4.6).

## Genel Değerlendirme

Üç üniversite hastanesinin meme MRI konsorsiyumu (UC3), **gizlilik koruyucu YZ eğitiminin altın standart yapılandırmasını** uyguluyor: FedAvg + Secure Aggregation + DP-SGD (ε=4) + DP-CTGAN sentetik veri. Bu use case **özenle tasarlanmış** ve kural motoru en az penalty uyguluyor (sadece 2 bulgu).

## Adalet

Üç hastane non-IID veri sorunu için FedProx önerilebilir. Sentetik veride bias amplifikasyonu riski (Stoyanovich et al., 2022) için **subgroup utility-privacy trade-off raporu** zorunlu kılınmalı.

## Şeffaflık

**Datasheets for Datasets** + **Model Cards** + **Privacy Budget raporu** (ε, δ açıkça paylaşılır) üçlü dokümantasyon sağlanıyor. Bu, GDPR Madde 13/14 ve EHDS şeffaflık gereksinimleriyle uyumlu.

## Hesap Verebilirlik

**Data Use Agreement (DUA) + Master Consortium Agreement + Data Sharing Agreement (DSA)** üçlü sözleşme katmanı çok-aktörlü hesap verebilirliği netleştiriyor. Joint controllership belirsizliği (GDPR Madde 26) referans modeli oluşturulmalı.

## Mahremiyet

**Üç katmanlı savunma:**
1. Federated learning — veri hastane sınırını terk etmez ✓
2. Differential privacy (DP-SGD, ε=4) — membership inference attack matematiksel sınırlı ✓
3. Sentetik veri — diffusion modellerinde memorization riski **membership inference attack testleri** ile yönetiliyor ✓

KVKK Kasım 2025 rehberindeki "**geri döndürülemezlik**" şartı sağlanıyor.

## Güvenlik (Ek — Bu use case'e özgü)

Gradient inversion attack savunması (Secure Aggregation + homomorphic), model poisoning karşı Krum aggregator, blockchain-temelli zkFL araştırma yönü olabilir.

## İnsan Denetimi

**HOTL (Human-on-the-loop)** — Konsorsiyum Veri Yönetişim Kurulu yapısal denetim sağlıyor. EHDS Health Data Access Body modeline uygun. Türkiye için yerel Health Data Access Body çerçevesi geliştirilmesi gerekiyor.

## Türkiye Bağlamı

Bu use case Türkiye için **stratejik öncelik**: e-Nabız altyapısının ikincil kullanım çerçevesi geliştirilmesi (KVKK + Sağlık Bakanlığı YZ Onay Birimi 2026 entegrasyonu). UYZS 2024-2025 yerli sağlık LLM hedefiyle uyumlu.

---

## Anahtar Kural Bulguları

- ℹ `ETH-PRIV-003`: Lokal işleme + federated mevcut ✓ (penalty yok)
- ✅ `LEG-DP-002`: KVKK açık rıza / EHDS belirtilmiş ✓ (penalty yok)

**Sonuç:** UC3, sistem tarafından test edilen **en yüksek ortalama skoru** (8.1/10) elde eden use case; özenle tasarlanmış bir gizlilik-koruyucu YZ eğitiminin örnek mimarisidir.
