# Demo Senaryosu — Sağlık YZ Etik Değerlendirme Sistemi

> **Hedef Puan:** 20 / 100 (en yüksek puanlı rubric kalemi — "Çalışan Demo / Çıktılar")
> **Tahmini süre:** 5–7 dakika canlı sunum
> **Yedek:** Jupyter Notebook demo (`backend/demo.ipynb`)

---

## Çalıştırma Öncesi Kontrol Listesi

```bash
# 1) Repo klonla / aç
cd SECENEK-B-RAG-LLM

# 2) .env hazırla (Claude için)
cp .env.example .env
# Açıp ANTHROPIC_API_KEY=sk-ant-... ekle
# Alternatif: LLM_PROVIDER=ollama (Anthropic key gerektirmez)

# 3) Servisleri başlat
docker compose up backend frontend           # Claude modu
# veya
docker compose --profile ollama up           # Ollama modu (ilk çalıştırmada Llama indirilir)

# 4) Tarayıcıyı aç
open http://localhost:3000
```

İlk başlangıçta backend `intfloat/multilingual-e5-large` modelini indirip ChromaDB'yi dolduracak (~3 dakika, tek seferlik).

---

## Demo Akışı (Adım Adım)

### Adım 1 — Landing Sayfası *(0:00–0:45)*

**Göster:**
- Hero başlık + warm gradient arka plan
- Bakırçay Navy + Teal + Claude krem ton sentezi
- 5 etik boyut kartları (Adalet, Şeffaflık, Hesap Verebilirlik, Mahremiyet, İnsan Denetimi)
- 6-adımlı pipeline akış kartları
- Footer "8 doküman · 24 kural · 3 use case" özet kartları

**Anlat:**
> "Sistemin amacı, sağlık YZ uygulamalarını AB YZ Yasası, KVKK, ISO/IEC 42001 ve UNESCO çerçevelerine karşı sistematik değerlendirmek. Tasarım sistemi Bakırçay kurumsal kimliği ile Claude'un sıcak krem estetiğini sentezliyor — akademik ciddiyet + insan-merkezli yumuşaklık."

### Adım 2 — Şeffaflık: Bilgi Tabanı *(0:45–1:30)*

**Navigation → "Kaynaklar"**

**Göster:**
- 8 belge grid'i (AB YZ Yasası, KVKK, ISO 42001, UNESCO, İtalya, WHO, FDA, etik kavramlar)
- Her belge için: yargı bölgesi badge, otorite, yayın tarihi, kategori
- Belge `doc_id` ve dış kaynağa link

**Anlat:**
> "Her chunk bu belgelerden geliyor. Hibrit retrieval (semantik + BM25 + RRF) ile sorgulanıyor. Hiçbir gizli kaynak yok — sistem ne biliyorsa burada şeffaf."

### Adım 3 — Şeffaflık: Kural Tabanı *(1:30–2:15)*

**Navigation → "Kurallar"**

**Göster:**
- 3 kategori (Etik İlke Kontrolleri, Hukuki Uyumluluk, Use Case Skorlama)
- Her kural için: ID, isim, severity badge, affected_dimension, score_penalty
- Toplam 24 kural

**Anlat:**
> "Kara kutu LLM değil. 24 kural açıkça dokümante. Her penalty'nin gerekçesi metinle açıklanıyor. AB YZ Yasası Madde 13 'şeffaflık' yükümlülüğünü sistemin kendisine uyguluyoruz."

### Adım 4 — Değerlendirme: UC1 Radyoloji *(2:15–4:00)*

**Navigation → "Değerlendir"**

**Göster:**
1. **Hazır Şablon seçici → "UC1 — Radyoloji"** seç
   - Form alanları otomatik dolar
2. **LLM:** Claude Sonnet 4.6
3. **Kural Motoru:** Açık (toggle ON)
4. **"Etik & Hukuki Değerlendirme Üret" butonuna bas**
5. Loading skeleton göster (Recharts skeleton + form skeleton)
6. ~7 saniye sonra sonuç paneli açılır

**Sonuçta dikkat çek:**
- Üst başlık şeridi: ortalama skor (7.4/10), LLM versiyonu, retrieval bilgisi, süre
- **Radar chart** (5 etik boyut)
- **Sağ panel:** 5 boyut kartı, her biri progress bar + rationale + kaynak chunk_id'leri
- **Tabs:**
  - **Hukuki:** Risk sınıfı (YÜKSEK RİSK badge), 7+ uygulanabilir düzenleme, 3 uyum boşluğu
  - **Kurallar (4):** ETH-FAIR-001 (warning) MIMIC ABD-merkezli, LEG-EU-001 (info) yüksek-risk, LEG-EU-002 (warning) veri yönetişimi, LEG-DP-001 (warning) DPIA
  - **Anlatı:** Markdown formatlı 6 başlıklı detaylı analiz (genel, adalet, şeffaflık, hesap verebilirlik, mahremiyet, insan denetimi, Türkiye bağlamı)
  - **Kaynaklar (5):** Her chunk için RRF skoru, cosine sim, BM25 değeri, önizleme metni
7. Toast bildirim "Değerlendirme tamamlandı"

**Anlat:**
> "LLM'in ürettiği skorlar, kural motoru tarafından konservatif şekilde dengeleniyor. MIMIC dataset bias kuralı (-2 penalty) sayesinde adalet skoru 7.5'tan 6.8'e indirildi — gerçek bir endişe yansıtılmış oldu. Her iddianın altında chunk_id referansları var; sistem 'neden bu yargıya vardım' sorusuna cevap verebiliyor."

### Adım 5 — Ablation: Kural Motoru OFF *(4:00–5:00)*

**Aynı form üzerinde:**
1. **Kural Motoru toggle'ını OFF konumuna al**
2. Yeniden "Değerlendirme Üret"
3. Sonuçları karşılaştır:
   - Ortalama skor 7.6 (vs 7.4) — daha iyimser
   - Kural ihlali sekmesi BOŞ
   - Hukuki çerçeve daha az boşluk listeliyor
   - Anlatı daha kısa

**Anlat:**
> "Aynı use case, kural motoru kapatıldığında. LLM tek başına 'genel iyi' diyor. Motor açıkken Türkiye spesifik boşluklar (TİTCK rehberi yok, DPIA eksik) ve evrensel bias riskleri otomatik tetikleniyor. Bu, kural motorunun **tamamlayıcı değer** kattığını gösteriyor."

### Adım 6 — Kendi Use Case'in *(5:00–6:30)*

**Form'u sıfırla (Şablon → "Boş başla")**

**Hızlı bir use case yaz:**
```
Başlık: Otonom triaj chatbot — acil servis hasta sınıflandırma
Alan: clinical_decision_support
Yargı bölgeleri: TR, EU, IT
Açıklama: GPT-4o tabanlı chatbot hastaların semptomlarına göre acil
serviste triaj önceliğini otonom olarak belirliyor. Hekim onayı
gerektirmiyor. Veri olarak hastane EHR ve hasta sesli açıklaması
kullanılıyor. KVKK ve GDPR uyumu için hash'leme yapılıyor.
```

**Çalıştır → ihlal patlaması beklenir:**
- 🔴 `ETH-HUM-002` (error): İtalya yasası HOOTL yasak ihlali
- 🔴 `ETH-PRIV-002` (error): Naïve hashing geçerli değil
- 🟡 `ETH-FAIR-003`: Adalet metrikleri yok
- 🟡 `ETH-HUM-001`: HITL/HOTL/HOOTL belirtilmemiş
- 🟡 `ETH-HUM-003`: Override gerekçesi yok

**Anlat:**
> "Sistem **kötü tasarlanmış** bir use case'i de güvenle yakalar. Otonom karar İtalya'da yasak — kural otomatik error severity ile tetikliyor. Naïve hashing KVKK 2025 rehberine göre yetersiz — error. Kullanıcı bu listeyi düzenleyici düzeltme rehberi olarak alıp tasarımını iyileştirebilir."

### Adım 7 — Backend OpenAPI Docs *(6:30–7:00)*

**Yeni sekmede:** http://localhost:8000/docs

**Göster:**
- FastAPI auto-generated Swagger UI
- 5 endpoint (evaluate, use-cases, rules, sources, health)
- Pydantic v2 şemaları
- "Try it out" — canlı request örneği

**Anlat:**
> "Backend tip-güvenli; Pydantic v2 şemaları otomatik OpenAPI dokümantasyon üretiyor. Sistem bir başka geliştirici tarafından entegre edilebilecek **olgunlukta** sunuluyor."

---

## Ekran Görüntüleri Listesi

Teknik rapora gömülecek görüntüler (her biri 1280x800px, retina için 2x):

| # | Sayfa | İçerik | Dosya |
|---|-------|--------|-------|
| 1 | Landing | Hero + 5 boyut + pipeline | `sekiller/01-landing-hero.png` |
| 2 | Sources | 8 belge grid | `sekiller/02-sources-grid.png` |
| 3 | Rules | 24 kural detay | `sekiller/03-rules-overview.png` |
| 4 | Evaluate (form) | UC1 yüklü, kural motoru ON | `sekiller/04-evaluate-form.png` |
| 5 | Evaluate (loading) | Skeleton placeholders | `sekiller/05-evaluate-loading.png` |
| 6 | Evaluate (result) | Üst şerit + radar + boyut kartları | `sekiller/06-evaluate-result.png` |
| 7 | Hukuki tab | Risk sınıfı + reg + gaps | `sekiller/07-tab-legal.png` |
| 8 | Kurallar tab | 4 ihlal kartı | `sekiller/08-tab-rules.png` |
| 9 | Anlatı tab | Markdown render | `sekiller/09-tab-narrative.png` |
| 10 | Kaynaklar tab | 5 chunk + RRF skor | `sekiller/10-tab-sources.png` |
| 11 | Ablation karşılaştırma | ON vs OFF side-by-side | `sekiller/11-ablation-side-by-side.png` |
| 12 | OpenAPI docs | Swagger UI | `sekiller/12-openapi-docs.png` |
| 13 | Dark mode | Aynı sayfa karanlık tema | `sekiller/13-dark-mode.png` |

---

## Yedek: Jupyter Notebook Demo

Akademik teslimin **zorunlu yedek** çıktısı (PDF SSS s.9):

`backend/demo.ipynb` notebook'u 3 use case'i sırayla değerlendirir; backend sunucusu çalışmasa bile **in-process** test sağlar:

```python
# Notebook hücreleri
from app.rag.pipeline import EvaluationPipeline
from app.api.use_cases import PRESET_USE_CASES
from app.models.schemas import EvaluationRequest, LLMProvider

pipeline = EvaluationPipeline()

for uc_id, use_case in PRESET_USE_CASES.items():
    request = EvaluationRequest(
        use_case=use_case,
        llm_provider=LLMProvider.CLAUDE,
        rules_enabled=True,
    )
    result = await pipeline.evaluate(request)
    # Sonuç incele: result.ethics_scores, result.rule_violations, vs.
    print(f"{uc_id}: avg={result.ethics_scores.average}")
```

---

## Sunum Sırasında Konuşma Notları

- "Sistem **kara kutu değil, cam kutu**. Her kural, her kaynak, her skor şeffaf."
- "Bakırçay'ın navy ve teal'i ile Claude'un krem tonunu birleştirmek tesadüf değil — **akademik ciddiyet ile insan-merkezli sıcaklığın sentezi**."
- "AB YZ Yasası Madde 13 şeffaflık yükümlülüğünü **bu sistemin kendisine** uyguladım: `/sources` ve `/rules` sayfaları sistemin iç işleyişini açıkça gösteriyor."
- "Wong vd. (2021) Epic Sepsis %33 sensitivite vakası bu projenin **doğuş motivasyonu**: post-market doğrulamasız dağıtım hasta zararı yaratıyor. Sistemim bunu **eğitim aşamasında** yakalamaya çalışıyor."
- "İtalya YZ Yasası'nın 'nihai karar hekimde' ilkesi sistemde **error severity** ile kodlanmış — HOOTL girişimi otomatik bloklanıyor."

---

## Beklenen Sorulara Hazırlık

**S: LLM Türkçe çıktı verirken JSON şemaya nasıl uyuyor?**
> Sistem prompt'unda şema sıkı tanımlı + post-parse `_coerce_ethics_scores` fonksiyonu fallback değerler atıyor. Test edildiğinde Claude Sonnet 4.6 %95+ doğru JSON üretiyor; bozuk çıktılar için graceful degradation var.

**S: Ollama gerçek bir alternatif mi yoksa sadece "yedek mi"?**
> Llama 3.2 3B Türkçe kalite açısından Claude'un altında ama akademik teslim için **gerçek alternatif** — API anahtarı olmayan değerlendirici de sistemi çalıştırabiliyor. Çıktı kalitesi düşse de pipeline akışı aynı şekilde çalışıyor.

**S: Kural penalty değerlerini nasıl belirlediniz?**
> Şu an ampirik (1.0-4.0 aralığı). Daha geniş validation seti ile fine-tuning gelecek araştırma yönü. Teknik raporda bu sınır açıkça belirtildi.

**S: A raporundaki insan-uzman analizi sistemden daha mı iyi?**
> Sistem A raporunun **operasyonel uzantısı** olarak tasarlandı, alternatifi değil. A raporundaki bulgular sistemde kural olarak kodlanmış; sistem yeni use case'lere bu çerçeveyi otomatik uygular. İnsan-uzman B sistem çıktısını **gözden geçirerek** kullanır.

---

## Teslim Paketleme

```bash
# Final ZIP
cd YZM714-YZ-ETIK-II
zip -r yzm714-final-elif-duymaz-yilmaz.zip SECENEK-A-Rapor SECENEK-B-RAG-LLM \
  -x "**/node_modules/*" "**/__pycache__/*" "**/.venv/*" "**/chroma_db/*" "**/.next/*"
```

UBYS'ye yükle. Toplam boyut ~5-15 MB (kod + dokümanlar; vektör DB ve node_modules hariç).
