---
doc_id: ethics-concepts-health-2026
title: Sağlık YZ Etik Kavramları — Akademik Sentez
authority: YZM 714 Final Projesi Bilgi Tabanı
jurisdiction: International
publication_date: 2026-05-27
language: tr
source_url: internal
category: academic_synthesis
applicable_areas: [healthcare]
---

# Sağlık YZ Etik Kavramları — Operasyonel Tanımlar

## 1. Adalet ve Algoritmik Önyargı

### Üç Adalet Metriği (Kleinberg vd., 2017)

Bu üç metrik **matematiksel olarak eş zamanlı sağlanamaz** (Impossibility Theorem):

- **Independence (Demographic Parity):** P(Ŷ=1 | A=a) = P(Ŷ=1 | A=b) — Demografik gruplar arasında pozitif tahmin oranları eşit
- **Separation (Equalized Odds):** TPR ve FPR demografik gruplar arası eşit — Sağlık YZ için en kritik kriter
- **Sufficiency:** P(Y=1 | Ŷ=s, A=a) = P(Y=1 | Ŷ=s, A=b) — Kalibrasyon eşitliği

### Somut Sağlık Vakaları

- **Dermatoloji (Daneshjou vd., 2025):** Fitzpatrick IV-VI cilt tipinde duyarlılık ve AUROC düşüşü; veri setlerinin Fitzpatrick I-III hâkimiyetinden
- **Radyoloji (Yang vd., 2024 — Nature Medicine):** Laboratuvarda eşitlenmiş modellerin gerçek dünyada cinsiyet, ırk ve sosyoekonomik bias üretmesi
- **Vision-Language Models (Glocker vd., 2025 — Science Advances):** GPT-4V dahil uzman düzeyinde YZ'lerin radyologlara kıyasla **tutarlı demografik bias**

## 2. Şeffaflık ve Açıklanabilirlik (XAI)

### Hâkim Teknikler

- **Grad-CAM:** Görüntü tabanlı modellerde class activation mapping; **akciğer X-ray COVID tespitinde %89.47-96.55 doğruluk** (BMC Medical Imaging, 2025)
- **SHAP (Shapley Additive Explanations):** Lundberg & Lee (2017); tabular ve görüntü her ikisinde de kullanılır; klinisyen-yönelik SHAP waterfall plot popüler
- **LIME:** Yerel doğrusal yaklaşım; daha az popüler ama belirli vakalar için güçlü
- **Attention rollout (ViT):** Vision Transformer'larda doğal açıklama
- **Counterfactual explanations:** Wachter vd. (2018); "X özelliği farklı olsaydı tahmin nasıl değişirdi?"

### Mevcut Sınırlar (Frontiers in Radiology, 2025)

> "Mevcut XAI yöntemleri prensipte uyuyor, ancak **klinisyen ihtiyaçlarına yeterince esnek/uyarlı değil**. Ölçeklenebilirlik ve standardizasyon eksiklikleri sürmektedir."

## 3. Hesap Verebilirlik ve Sorumluluk Zinciri

### Aktör Hiyerarşisi

1. **Üretici (Provider/Manufacturer)** — Algoritma performansı, klinik onay öncesi doğrulama, post-market sürveyans (FDA PCCP), AB YZ Yasası Madde 9 risk yönetimi
2. **Dağıtıcı (Deployer/Hospital)** — Doğru entegrasyon, klinisyen eğitimi, kalite kontrol, ISO/IEC 42001 sertifikasyonu
3. **Hekim/Klinisyen** — Klinik yargı uygulaması, nihai karar (İtalya yasası), override gerekçelendirmesi
4. **Hasta** — Aydınlatılmış onam, YZ kullanımının bildirilmesi (İtalya yasası), telafi hakkı

### 2025 Hukuki Manzara Değişiklikleri

- **AB YZ Sorumluluk Direktifi (AILD)** — Şubat 2025'te geri çekildi; ürün sorumluluğu + sektörel kurallar çerçevesi yeterli kabul edildi (White & Case, 2025)
- **Science (2025):** AB mahkemelerinde tıbbi YZ üreticilerine karşı ilk davalar başladı

## 4. Mahremiyet ve Veri Koruma

### Yasal Çerçeveler

- **GDPR Madde 9:** Özel kategori veri — sağlık verisi
- **GDPR Madde 22:** Otomatik karar verme — hasta hakkı: insan müdahalesi talep
- **GDPR Madde 35:** Yüksek-risk işleme için DPIA (Veri Koruma Etki Değerlendirmesi) zorunlu
- **KVKK Madde 6:** Özel nitelikli kişisel veri
- **KVKK Madde 3(1)(b):** Anonim veri kapsam dışı
- **HIPAA:** ABD; Protected Health Information (PHI) koruması
- **EHDS (Regulation 2025/327):** İkincil kullanım çerçevesi; 2029'a kadar tam operasyonel değil

### Teknik Mahremiyet Mekanizmaları

- **Federated Learning (FL):** Veri hastane sınırını terk etmez; FedAvg, FedProx, SCAFFOLD algoritmaları
- **Differential Privacy (DP):** ε-DP garanti; DP-SGD per-sample gradient clipping + Gaussian noise
- **Sentetik Veri:** GAN, VAE, Diffusion modelleri; DP-CTGAN gibi DP-entegre versiyonlar
- **Secure Aggregation:** FL'de gradient'lerin şifrelenmiş toplanması
- **Zero-Knowledge Proofs (ZKP):** Veri kullanımının kanıtlanması ama veri açıklanmadan

## 5. Güvenlik

### Tehdit Modeli

- **Adversarial saldırılar** (Finlayson vd., 2019 — Science): Göze görünmez perturbasyon ile yanlış tanı
- **Data poisoning:** Eğitim verisinin manipüle edilmesi (kullanım: deepfake tıbbi görüntü)
- **Model extraction:** Modelin kopyalanması (IP hırsızlığı)
- **Membership inference attack:** Bireysel hasta verisinin eğitim setinde olduğunun tespiti
- **Agentic ajan açıkları** (JMIR, 2026 — Moltbook vakası): Confused deputy, indirect prompt injection, identity spoofing

### Savunma Mimarileri

- **Adversarial training** (FGSM, PGD)
- **Secure Aggregation** (FL için)
- **Zero Trust mimarisi** (NIST 800-207, agentic YZ için)

## 6. İnsan Denetimi: HITL / HOTL / HOOTL

### Paradigma Spektrumu

- **HITL (Human-in-the-Loop):** Her karar için insan onayı zorunlu — radyoloji CADx, İtalya yasası gereği CDSS
- **HOTL (Human-on-the-Loop):** İnsan izler, gerektiğinde müdahale eder — hastane kalite-emniyet komitesi, EHDS Health Data Access Body
- **HOOTL (Human-out-of-the-Loop):** Otonom karar — İtalya yasası sağlıkta **yasaklamıştır**

### Kritik Eleştiri (Jacobs vd., 2026 — Lancet)

> "HITL paradigması, kurumsal yapı, zaman bütçesi ve bilişsel yük dikkate alınmadan yasal yükümlülüğe dönüştürüldüğünde, **sembolik güvenceye** dönüşür. Klinisyenler, algoritmik çıktıları anlamlı şekilde sorgulayamayacak yapısal kısıtlar altındadır."

### Operasyonel Yeterlilik Metrikleri

- **Doktor-YZ Konsensüs Oranı (doctor-AI consensus rate):** Hekimin model çıktısını ne sıklıkta "körü körüne" onayladığı
- **Override Gerekçe Alanı:** Hekim modeli reddederken yazılı gerekçe bırakmalı
- **Alert Fatigue Metrikleri:** Toplam uyarı / gerçek pozitif oranı
- **Subgroup Performance Dashboard:** Yaş × cinsiyet × etnisite başarım takibi

## AB YZ Yasası Risk Sınıflandırması Eşleme

| Risk Sınıfı | Sağlık YZ Örnekleri |
|-------------|---------------------|
| **Yasaklı** | Sosyal puanlama temelli sağlık erişimi (yok) |
| **Yüksek-risk (Annex I + III)** | Radyoloji CADx, CDSS, sigorta fiyatlandırma, klinik triaj |
| **Sınırlı-risk** | Hasta chatbot, semptom kontrolü (şeffaflık zorunlu) |
| **Minimal-risk** | Hastane operasyonel YZ (yatak yönetimi, faturalandırma) |
