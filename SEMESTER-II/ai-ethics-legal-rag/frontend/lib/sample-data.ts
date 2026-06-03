/**
 * Backend olmadan da deneyimlenebilmesi için statik örnek veri.
 * 3 use case için pre-baked sonuçlar — `/05-Degerlendirme/results/*.json` ile uyumlu.
 */
import type { EvaluationResponse, PresetUseCaseEntry } from "@/lib/types";

export const SAMPLE_PRESETS: PresetUseCaseEntry[] = [
  {
    id: "uc1-radyoloji",
    title: "Radyolojide YZ destekli akciğer X-ray çoklu patoloji tanısı",
    area: "radiology",
    jurisdiction: ["EU", "TR", "US", "IT"],
  },
  {
    id: "uc2-cdss",
    title: "Sepsis erken uyarı klinik karar destek sistemi (CDSS)",
    area: "clinical_decision_support",
    jurisdiction: ["EU", "TR", "IT"],
  },
  {
    id: "uc3-veri",
    title: "Federated learning + sentetik veri ile meme MRI eğitim konsorsiyumu",
    area: "data_governance",
    jurisdiction: ["EU", "TR"],
  },
];

export const SAMPLE_RESULTS: Record<string, EvaluationResponse> = {
  "uc1-radyoloji": {
    evaluation_id: "sample-uc1-2026-05-28",
    use_case_summary:
      "Hibrit CNN + Vision Transformer (Swin-B + DenseNet-121) mimarisinde akciğer X-ray görüntülerinden 14 patolojiyi çoklu-etiket sınıflandıran bir CADx. MIMIC-CXR + CheXpert + PadChest + VinDr-CXR ile çoklu-bölgeli eğitim; HITL'de radyolog onayı; Grad-CAM + SHAP açıklanabilirlik. AB YZ Yasası Annex I + Madde 6(1) kapsamında YÜKSEK-RİSK.",
    ethics_scores: {
      fairness: {
        score: 6.8,
        rationale:
          "MIMIC-CXR ve CheXpert ABD-merkezli; PadChest (İspanya) ve VinDr-CXR (Vietnam) entegrasyonu çeşitliliği artırıyor ancak Türkiye yerel verisinin federated learning ile eklenmesi kritik. Independence/Separation/Sufficiency metrikleri belirtilmiş.",
        sources: ["eu-ai-act-2024#003", "ethics-concepts-health-2026#001", "fda-aiml-samd-2025#002"],
      },
      transparency: {
        score: 7.5,
        rationale:
          "Layer-wise Grad-CAM + SHAP overlay PACS arayüzünde radyologa görsel ve sayısal açıklama sağlıyor. AB YZ Yasası Madde 13 karşılanıyor; Frontiers in Radiology (2025) eleştirisi geçerli.",
        sources: ["eu-ai-act-2024#004", "ethics-concepts-health-2026#002"],
      },
      accountability: {
        score: 7.5,
        rationale:
          "6 paydaş tanımlı; audit-log + PCCP mekanizması + AB YZ Yasası Madde 9 risk yönetimi. AILD geri çekildiği için sorumluluk ürün sorumluluğu + sektörel kurallar üzerinden.",
        sources: ["fda-aiml-samd-2025#003", "eu-ai-act-2024#002"],
      },
      privacy: {
        score: 7.8,
        rationale:
          "DICOM DEID + federated learning (veri hastane sınırını terk etmez) + KVKK Madde 6 ve GDPR Madde 9 uyumu. KVKK Kasım 2025 geri döndürülemezlik şartı için membership inference attack testi önerilir.",
        sources: ["kvkk-saglik-yz-2025#001", "kvkk-saglik-yz-2025#002"],
      },
      human_oversight: {
        score: 7.5,
        rationale:
          "HITL — radyolog her tanıyı onaylar. İtalya yargı bölgesinde 'hekim son söz' otomatik uygulanır. Lancet (2026) eleştirisi: doctor-AI consensus rate metriği önerilir.",
        sources: ["italya-yz-yasasi-2025#001", "ethics-concepts-health-2026#003"],
      },
    },
    legal_compliance: {
      eu_ai_act_risk_class: "high",
      applicable_regulations: [
        "EU AI Act Art.6(1) + Annex I",
        "EU MDR (Class IIa+)",
        "GDPR Art.9 + Art.22",
        "KVKK Md.6 + Md.12",
        "FDA SaMD (510(k) + PCCP)",
        "Italy AI Law (Oct 2025)",
        "ISO/IEC 42001",
      ],
      compliance_gaps: [
        "TİTCK YZ-tıbbi cihaz değerlendirme metodolojisi henüz yayımlanmamış",
        "Veri çeşitlilik raporu (AB YZ Yasası Madde 10) Türkiye yerel datasında etnik temsiliyet için standart eksik",
        "DPIA (GDPR Madde 35) tamamlama durumu belirtilmemiş",
      ],
      sources: ["eu-ai-act-2024#001", "fda-aiml-samd-2025#001", "kvkk-saglik-yz-2025#003"],
    },
    rule_violations: [
      {
        rule_id: "ETH-FAIR-001",
        rule_name: "Demografik temsiliyet kontrolü",
        severity: "warning",
        message:
          "Eğitim verisi ABD/Batı-merkezli; subgroup performance raporu ve yerel doğrulama önerilir (AB YZ Yasası Madde 10).",
        affected_dimension: "fairness",
      },
      {
        rule_id: "LEG-EU-001",
        rule_name: "Yüksek-risk sınıflandırma — tıbbi cihaz",
        severity: "info",
        message:
          "Bu use case AB YZ Yasası Madde 6(1) + Annex I kapsamında YÜKSEK-RİSK sınıfındadır. Madde 9-15 yükümlülükleri uygulanır.",
      },
      {
        rule_id: "LEG-EU-002",
        rule_name: "Veri yönetişimi - Madde 10",
        severity: "warning",
        message:
          "AB YZ Yasası Madde 10 — veri yönetişimi yükümlülüğü için veri kalitesi ve temsiliyet dokümantasyonu gerekir.",
      },
      {
        rule_id: "LEG-DP-001",
        rule_name: "DPIA gerekliliği",
        severity: "warning",
        message:
          "GDPR Madde 35 — yüksek-risk veri işleme için Veri Koruma Etki Değerlendirmesi (DPIA) zorunludur.",
      },
    ],
    narrative_assessment: `## Genel Değerlendirme

Bu radyolojide YZ destekli tanı sistemi (UC1), **AB YZ Yasası Annex I + Madde 6(1) kapsamında YÜKSEK-RİSK** sınıfında konumlanmaktadır. Sistem olgun bir mimari (hibrit CNN+ViT + Grad-CAM/SHAP açıklanabilirlik + HITL onay) ve düzenleyici farkındalık sergiliyor.

## Adalet

Çoklu-bölgeli dataset birleşimi takdire şayan; ancak MIMIC-CXR ve CheXpert'in ABD-merkezliliği, *Nature Medicine* (Yang et al., 2024) ve *Science Advances* (Glocker et al., 2025) çalışmalarının ortaya koyduğu **demografik bias** riskini taşımakta.

## Şeffaflık

Layer-wise Grad-CAM ve SHAP overlay, AB YZ Yasası Madde 13 yükümlülüğünü karşılayacak biçimde tasarlanmış. **Radyolog kullanım çalışması** önerilir.

## Türkiye Bağlamı

Bu sistem Türkiye'de pazara giriş için **TİTCK YZ-tıbbi cihaz rehberi**nin yayımlanmasını bekliyor. Geçici geliştirme döneminde ISO/IEC 42001 sertifikasyonu pragmatik yol.`,
    retrieved_sources: [
      {
        doc_id: "eu-ai-act-2024",
        chunk_id: "eu-ai-act-2024#001",
        title: "AB Yapay Zekâ Yasası",
        authority: "European Commission",
        jurisdiction: "EU",
        text: "Madde 6(1): Annex I'de listelenen Birlik uyum mevzuatı kapsamındaki ürünlerin güvenlik bileşeni olarak veya kendisi bu mevzuat kapsamına giren YZ sistemleri ve üçüncü taraf uygunluk değerlendirmesi gerektirenler yüksek-risk olarak kabul edilir. Bu, MDR (Tıbbi Cihaz Yönetmeliği) ve IVDR kapsamındaki Class IIa+ tıbbi cihazlara entegre YZ sistemlerini doğrudan etkiler.",
        similarity_score: 0.892,
        bm25_score: 0.781,
        fused_score: 0.0287,
      },
      {
        doc_id: "kvkk-saglik-yz-2025",
        chunk_id: "kvkk-saglik-yz-2025#001",
        title: "KVKK Sağlık Verileri ve Üretken YZ Rehberi",
        authority: "T.C. Kişisel Verileri Koruma Kurumu",
        jurisdiction: "Türkiye",
        text: "6698 sayılı KVKK Madde 6, sağlık verisini özel nitelikli kişisel veri kategorisine yerleştirir. Bu kategori, GDPR Madde 9'un Türkiye karşılığıdır. Özel nitelikli veriler açık rıza veya kanunda öngörülen istisna olmaksızın işlenemez.",
        similarity_score: 0.847,
        bm25_score: 0.692,
        fused_score: 0.0254,
      },
      {
        doc_id: "fda-aiml-samd-2025",
        chunk_id: "fda-aiml-samd-2025#001",
        title: "FDA AI/ML Software as a Medical Device (SaMD) Çerçevesi",
        authority: "U.S. Food and Drug Administration",
        jurisdiction: "United States",
        text: "FDA, 2025 sonu itibarıyla 1.451 YZ-temelli tıbbi cihaza pazarlama yetkisi vermiştir. %75-76 radyoloji alanındadır. En çok onay alan üretici: GE HealthCare (115 cihaz). PCCP (Predetermined Change Control Plan) mekanizması model güncellemelerinin önceden onaylanmasını sağlar.",
        similarity_score: 0.823,
        bm25_score: 0.731,
        fused_score: 0.0249,
      },
      {
        doc_id: "italya-yz-yasasi-2025",
        chunk_id: "italya-yz-yasasi-2025#001",
        title: "İtalya Yapay Zekâ Yasası — Sağlık Hükümleri",
        authority: "Repubblica Italiana",
        jurisdiction: "Italy (EU)",
        text: "İtalya YZ Yasası (Ekim 2025) sağlık alanında tam otomatik tıbbi kararları yasaklar. 'Nihai karar daima hekimde' ilkesi yasal zorunluluktur. Tedavisinde YZ kullanılan her hasta bu durumdan haberdar edilmelidir.",
        similarity_score: 0.798,
        bm25_score: 0.654,
        fused_score: 0.0238,
      },
      {
        doc_id: "ethics-concepts-health-2026",
        chunk_id: "ethics-concepts-health-2026#001",
        title: "Sağlık YZ Etik Kavramları — Akademik Sentez",
        authority: "YZM 714 Final Projesi Bilgi Tabanı",
        jurisdiction: "International",
        text: "Adalet metrikleri Kleinberg vd. (2017) İmkânsızlık Teoremi gereği eş zamanlı sağlanamaz: Independence (P(Ŷ=1|A=a) = P(Ŷ=1|A=b)), Separation (TPR ve FPR demografik gruplar arası eşit), Sufficiency (kalibrasyon eşitliği). Klinik bağlamda Separation kritiktir.",
        similarity_score: 0.776,
        bm25_score: 0.612,
        fused_score: 0.0226,
      },
    ],
    metadata: {
      llm_provider: "claude",
      model_version: "claude-sonnet-4-6",
      retrieval_top_k: 5,
      rules_enabled: true,
      duration_ms: 7234,
      tokens_used: { input: 4823, output: 1456 },
      timestamp: "2026-05-28T14:30:00Z",
    },
  },

  "uc2-cdss": {
    evaluation_id: "sample-uc2-2026-05-28",
    use_case_summary:
      "Sepsis erken uyarı CDSS — LightGBM + LSTM ensemble + 5 risk kategorisi + SHAP açıklanabilirlik. İtalya 'hekim son söz' uyumlu advisory tasarım. Wong vd. (2021) Epic Sepsis %33 sensitivite vakası ışığında yerel doğrulama + concept drift monitoring.",
    ethics_scores: {
      fairness: { score: 6.5, rationale: "MIMIC-IV ABD ICU verisi; Türkiye etnik dağılım farkı için yerel re-calibration gerekli.", sources: ["mimic-iv-bias"] },
      transparency: { score: 6.5, rationale: "SHAP waterfall klinisyen-uyumlu; hasta YZ bildirimi belirtilmemiş.", sources: ["ethics-concepts-health-2026#002"] },
      accountability: { score: 7.2, rationale: "Override gerekçe alanı eksik; otomasyon bias riski.", sources: ["italya-yz-yasasi-2025#001"] },
      privacy: { score: 7.0, rationale: "FHIR R4 + OAuth + asgari ihtiyaç. DPIA tamamlanma durumu belirtilmemiş.", sources: ["kvkk-saglik-yz-2025#001"] },
      human_oversight: { score: 6.8, rationale: "HITL advisory uygun; alert fatigue ICU'da risk; doctor-AI consensus rate izleme önerilir.", sources: ["italya-yz-yasasi-2025#001"] },
    },
    legal_compliance: {
      eu_ai_act_risk_class: "high",
      applicable_regulations: ["EU AI Act Annex III", "EU MDR Class IIa+", "Italy AI Law", "GDPR Art.9", "KVKK Md.6", "FDA CDS Final Rule"],
      compliance_gaps: ["DPIA belirsiz", "Override gerekçe alanı zorunlu kılınmalı", "Subgroup performance dashboard yok"],
      sources: ["italya-yz-yasasi-2025#001", "eu-ai-act-2024#003"],
    },
    rule_violations: [
      { rule_id: "ETH-HUM-003", rule_name: "Otomasyon bias farkındalığı", severity: "info", message: "CDSS bağlamında otomasyon bias ve alert fatigue riskleri belirtilmeli; override gerekçe alanı önerilir.", affected_dimension: "human_oversight" },
      { rule_id: "LEG-IT-001", rule_name: "Nihai karar daima hekimde", severity: "info", message: "Mevcut tasarım advisory; İtalya yasası uyumu doğru ✓" },
      { rule_id: "ETH-FAIR-003", rule_name: "Adalet metrikleri tanımı eksik", severity: "info", message: "Independence/Separation/Sufficiency metrikleri açıkça belirtilmemiş.", affected_dimension: "fairness" },
      { rule_id: "LEG-EU-002", rule_name: "Veri yönetişimi - Madde 10", severity: "warning", message: "Veri kalitesi ve temsiliyet dokümantasyonu gerekir." },
      { rule_id: "LEG-DP-001", rule_name: "DPIA gerekliliği", severity: "warning", message: "GDPR Madde 35 — DPIA zorunludur." },
      { rule_id: "LEG-EU-001", rule_name: "Yüksek-risk sınıflandırma", severity: "info", message: "Annex III stand-alone CDSS YÜKSEK-RİSK." },
    ],
    narrative_assessment: `## Genel Değerlendirme

Sepsis erken uyarı CDSS'i, **AB YZ Yasası Annex III + Annex I** kapsamında YÜKSEK-RİSK. İtalya YZ Yasası (Ekim 2025) "nihai karar daima hekimde" ilkesi advisory tasarımla karşılanıyor.

## Wong (2021) Dersleri

Epic Sepsis Modeli **%33 sensitivite** vakası: yerel doğrulama + concept drift monitoring + alert fatigue azaltma kritik. Bu sistem 5 risk kategorisi ile fatigue'i adresliyor — olumlu adım.

## Anahtar Boşluk

**Override gerekçe alanı** zorunlu kılınmalı; bu boşluk otomasyon bias riskini artırır.`,
    retrieved_sources: [
      { doc_id: "italya-yz-yasasi-2025", chunk_id: "italya-yz-yasasi-2025#001", title: "İtalya Yapay Zekâ Yasası", authority: "Repubblica Italiana", jurisdiction: "Italy (EU)", text: "Sağlık alanında tam otomatik tıbbi karar yasaktır. Nihai karar daima hekimdedir...", similarity_score: 0.911, bm25_score: 0.832, fused_score: 0.0312 },
      { doc_id: "fda-aiml-samd-2025", chunk_id: "fda-aiml-samd-2025#002", title: "FDA AI/ML SaMD", authority: "FDA", jurisdiction: "United States", text: "Wong vd. (2021) Epic Sepsis Modeli %33 sensitivite vakası FDA CDS Final Rule (2022) ile ML-temelli CDSS Class II tıbbi cihaz olarak netleşti...", similarity_score: 0.876, bm25_score: 0.741, fused_score: 0.0269 },
      { doc_id: "ethics-concepts-health-2026", chunk_id: "ethics-concepts-health-2026#003", title: "Sağlık YZ Etik Kavramları", authority: "YZM 714", jurisdiction: "International", text: "HITL paradigması Lancet (2026) eleştirisi: yapısal kısıtlar altında sembolik güvenceye dönüşme riski. Doctor-AI consensus rate metriği önerilir...", similarity_score: 0.834, bm25_score: 0.687, fused_score: 0.0251 },
      { doc_id: "eu-ai-act-2024", chunk_id: "eu-ai-act-2024#003", title: "AB YZ Yasası", authority: "European Commission", jurisdiction: "EU", text: "Madde 14 — yüksek-risk YZ sistemleri için insan denetimi zorunludur. Madde 13 — şeffaflık yükümlülüğü kullanıcı bilgilendirmesini içerir...", similarity_score: 0.798, bm25_score: 0.654, fused_score: 0.0237 },
      { doc_id: "kvkk-saglik-yz-2025", chunk_id: "kvkk-saglik-yz-2025#003", title: "KVKK Üretken YZ Rehberi", authority: "KVKK", jurisdiction: "Türkiye", text: "EHR PHI işleyen CDSS için lokal işleme tercihi; merkezi bulut yerine kurum-içi veya on-device. KVKK Kasım 2025 rehberi geri döndürülemezlik şartı...", similarity_score: 0.756, bm25_score: 0.623, fused_score: 0.0227 },
    ],
    metadata: { llm_provider: "claude", model_version: "claude-sonnet-4-6", retrieval_top_k: 5, rules_enabled: true, duration_ms: 7891, tokens_used: { input: 4912, output: 1523 }, timestamp: "2026-05-28T14:35:00Z" },
  },

  "uc3-veri": {
    evaluation_id: "sample-uc3-2026-05-28",
    use_case_summary:
      "Üç üniversite hastanesinin federated learning konsorsiyumu — meme MRI ile erken evre kanser tespiti. FedAvg + Secure Aggregation + DP-SGD (ε=4) + DP-CTGAN sentetik EHR. Gizlilik koruyucu YZ eğitiminin altın standart yapılandırması.",
    ethics_scores: {
      fairness: { score: 7.8, rationale: "Üç hastane çeşitliliği + FedProx önerisi; sentetik veride bias amplifikasyonu izleme.", sources: ["who-health-ai-ethics-2021#005"] },
      transparency: { score: 8.0, rationale: "Datasheets for Datasets + Model Cards + Privacy Budget açık raporlama.", sources: ["unesco-ai-ethics-2021#001"] },
      accountability: { score: 8.2, rationale: "DUA + Master Consortium Agreement + DSA üçlü sözleşme katmanı.", sources: ["iso-iec-42001-2023#001"] },
      privacy: { score: 8.5, rationale: "FL + DP (ε=4) + sentetik veri üç katmanlı savunma. KVKK Kasım 2025 geri döndürülemezlik karşılanıyor.", sources: ["kvkk-saglik-yz-2025#001", "kvkk-saglik-yz-2025#002"] },
      human_oversight: { score: 8.0, rationale: "HOTL — Veri Yönetişim Kurulu. EHDS Health Data Access Body modeli.", sources: ["ethics-concepts-health-2026#003"] },
    },
    legal_compliance: {
      eu_ai_act_risk_class: "high",
      applicable_regulations: ["GDPR Art.9 + Art.35", "EHDS (2025/327)", "KVKK Md.6", "Common Rule 45 CFR 46", "Helsinki Declaration"],
      compliance_gaps: ["TR için Health Data Access Body çerçevesi yok", "Joint controllership referans modeli eksik", "Diffusion model memorization standart testi yok"],
      sources: ["kvkk-saglik-yz-2025#001"],
    },
    rule_violations: [
      { rule_id: "ETH-PRIV-003", rule_name: "Lokal işleme tercihi", severity: "info", message: "Federated learning ve lokal işleme açıkça mevcut ✓" },
      { rule_id: "LEG-DP-002", rule_name: "KVKK ikincil kullanım", severity: "info", message: "Açık rıza / EHDS çerçevesi belirtilmiş ✓" },
    ],
    narrative_assessment: `## Genel Değerlendirme

Bu use case **gizlilik koruyucu YZ eğitiminin altın standart yapılandırması**: FL + DP-SGD + sentetik veri üçlüsü. Sistem en yüksek ortalama skoru elde eden use case (8.1/10).

## Üç Katmanlı Mahremiyet Mimarisi

1. **Federated Learning** — veri hastane sınırını terk etmez ✓
2. **Differential Privacy** (ε=4) — membership inference matematiksel sınırlı ✓
3. **Sentetik Veri** — diffusion memorization riski membership inference attack testi ile yönetiliyor ✓

## Türkiye Stratejik Önemi

e-Nabız altyapısının ikincil kullanım çerçevesi geliştirilmesi öncelikli politika. UYZS 2024-2025 yerli sağlık LLM hedefiyle uyumlu.`,
    retrieved_sources: [
      { doc_id: "kvkk-saglik-yz-2025", chunk_id: "kvkk-saglik-yz-2025#002", title: "KVKK Sağlık Verileri ve Üretken YZ", authority: "KVKK", jurisdiction: "Türkiye", text: "Federated learning + DP + sentetik veri kombinasyonu KVKK Madde 3(1)(b) anonim veri kapsam dışılığı ile uyumlu. Geri döndürülemezlik şartı...", similarity_score: 0.923, bm25_score: 0.851, fused_score: 0.0321 },
      { doc_id: "unesco-ai-ethics-2021", chunk_id: "unesco-ai-ethics-2021#001", title: "UNESCO YZ Etiği Tavsiyesi", authority: "UNESCO", jurisdiction: "International", text: "Mahremiyet ve veri koruma, sürdürülebilirlik, sorumluluk ve hesap verebilirlik. Etik Etki Değerlendirmesi (EIA) her yeni YZ dağıtımında zorunlu.", similarity_score: 0.871, bm25_score: 0.732, fused_score: 0.0267 },
      { doc_id: "iso-iec-42001-2023", chunk_id: "iso-iec-42001-2023#001", title: "ISO/IEC 42001 YZ Yönetim Sistemi", authority: "ISO/IEC", jurisdiction: "International", text: "A.4 — YZ Kaynakları envanteri; A.5 — Etki Değerlendirmesi; A.9 — Paydaş etkileşimi ve sürdürülebilirlik. Konsorsiyum sözleşme katmanları...", similarity_score: 0.834, bm25_score: 0.701, fused_score: 0.0255 },
      { doc_id: "who-health-ai-ethics-2021", chunk_id: "who-health-ai-ethics-2021#005", title: "WHO Sağlıkta YZ Etiği Rehberi", authority: "WHO", jurisdiction: "International", text: "Kapsayıcılık ve hakkaniyet: YZ sistemleri yaş, cinsiyet, etnisite, sosyoekonomik durum bağımsız eşit erişim sağlamalı. Algoritmik önyargı aktif izlenip giderilmelidir.", similarity_score: 0.792, bm25_score: 0.681, fused_score: 0.0242 },
      { doc_id: "ethics-concepts-health-2026", chunk_id: "ethics-concepts-health-2026#003", title: "Sağlık YZ Etik Kavramları", authority: "YZM 714", jurisdiction: "International", text: "HOTL (Human-on-the-loop) — Veri Yönetişim Kurulu yapısal denetim; EHDS Health Data Access Body modeli; Türkiye için yerel uyarlama...", similarity_score: 0.756, bm25_score: 0.634, fused_score: 0.0231 },
    ],
    metadata: { llm_provider: "claude", model_version: "claude-sonnet-4-6", retrieval_top_k: 5, rules_enabled: true, duration_ms: 6432, tokens_used: { input: 4567, output: 1234 }, timestamp: "2026-05-28T14:40:00Z" },
  },
};
