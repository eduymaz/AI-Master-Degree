/** Backend-yok fallback için kaynaklar ve kurallar */
import type { RuleDefinition, SourceMetadata } from "@/lib/types";

export const SAMPLE_SOURCES: SourceMetadata[] = [
  {
    doc_id: "eu-ai-act-2024",
    title: "AB Yapay Zekâ Yasası (Regulation (EU) 2024/1689)",
    authority: "European Commission",
    jurisdiction: "EU",
    category: "primary_regulation",
    publication_date: "2024-07-12",
    source_url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
  },
  {
    doc_id: "kvkk-saglik-yz-2025",
    title: "KVKK Sağlık Verileri ve Üretken YZ Rehberi",
    authority: "T.C. Kişisel Verileri Koruma Kurumu",
    jurisdiction: "Türkiye",
    category: "primary_regulation",
    publication_date: "2025-11-24",
    source_url: "https://www.kvkk.gov.tr",
  },
  {
    doc_id: "iso-iec-42001-2023",
    title: "ISO/IEC 42001:2023 — Yapay Zekâ Yönetim Sistemi",
    authority: "ISO/IEC",
    jurisdiction: "International",
    category: "international_standard",
    publication_date: "2023-12-18",
    source_url: "https://www.iso.org/standard/42001",
  },
  {
    doc_id: "unesco-ai-ethics-2021",
    title: "UNESCO Yapay Zekâ Etiği Tavsiyesi",
    authority: "UNESCO",
    jurisdiction: "International",
    category: "international_recommendation",
    publication_date: "2021-11-23",
    source_url: "https://www.unesco.org/en/articles/recommendation-ethics-artificial-intelligence",
  },
  {
    doc_id: "italy-ai-law-2025",
    title: "İtalya Yapay Zekâ Yasası — Sağlık Hükümleri",
    authority: "Repubblica Italiana",
    jurisdiction: "Italy (EU)",
    category: "national_law",
    publication_date: "2025-10-10",
    source_url: "https://www.gazzettaufficiale.it",
  },
  {
    doc_id: "who-health-ai-ethics-2021",
    title: "WHO — Sağlıkta Yapay Zekâ Etiği ve Yönetişimi Rehberi",
    authority: "Dünya Sağlık Örgütü (WHO)",
    jurisdiction: "International",
    category: "international_guidance",
    publication_date: "2021-06-28",
    source_url: "https://www.who.int/publications/i/item/9789240029200",
  },
  {
    doc_id: "fda-aiml-samd-2025",
    title: "FDA AI/ML Software as a Medical Device (SaMD) Çerçevesi",
    authority: "U.S. Food and Drug Administration",
    jurisdiction: "United States",
    category: "primary_regulation",
    publication_date: "2025-08-15",
    source_url: "https://www.fda.gov/medical-devices/software-medical-device-samd",
  },
  {
    doc_id: "ethics-concepts-health-2026",
    title: "Sağlık YZ Etik Kavramları — Akademik Sentez",
    authority: "YZM 714 Final Projesi Bilgi Tabanı",
    jurisdiction: "International",
    category: "academic_synthesis",
    publication_date: "2026-05-27",
    source_url: "",
  },
];

export const SAMPLE_RULES: RuleDefinition[] = [
  // ETİK İLKELER
  { id: "ETH-FAIR-001", name: "Demografik temsiliyet kontrolü", description: "Veri kaynakları çoğul demografik gruplara temsil sağlıyor mu?", severity: "warning", affected_dimension: "fairness", score_penalty: 2.0 },
  { id: "ETH-FAIR-002", name: "Cilt tipi / dermatoloji bias kontrolü", description: "Dermatoloji sistemlerinde Fitzpatrick IV-VI temsiliyeti", severity: "error", affected_dimension: "fairness", score_penalty: 3.0 },
  { id: "ETH-FAIR-003", name: "Adalet metrikleri tanımı eksik", description: "Use case Independence/Separation/Sufficiency belirtmiyor", severity: "info", affected_dimension: "fairness", score_penalty: 1.0 },
  { id: "ETH-TRANS-001", name: "XAI yöntemi tanımlı mı", description: "Sistemde Grad-CAM, SHAP, LIME açıklama mevcut mu?", severity: "warning", affected_dimension: "transparency", score_penalty: 2.0 },
  { id: "ETH-TRANS-002", name: "Hasta bilgilendirme - İtalya yasası", description: "Hastaya YZ kullanımı bildirilecek mi?", severity: "error", affected_dimension: "transparency", score_penalty: 2.5 },
  { id: "ETH-ACC-001", name: "Sorumluluk zinciri tanımı", description: "Geliştirici/dağıtıcı/klinisyen rol ayrımı belirgin mi?", severity: "warning", affected_dimension: "accountability", score_penalty: 1.5 },
  { id: "ETH-ACC-002", name: "Audit log mekanizması", description: "Karar logları tutulacak mı?", severity: "info", affected_dimension: "accountability", score_penalty: 1.0 },
  { id: "ETH-PRIV-001", name: "Özel kategori veri farkındalığı", description: "Sağlık verisi GDPR Md.9 / KVKK Md.6 kapsamında", severity: "warning", affected_dimension: "privacy", score_penalty: 2.0 },
  { id: "ETH-PRIV-002", name: "Anonimleştirme yöntemi", description: "Naïve hashing yeterli değil; DP / federated / sentetik gerekli", severity: "error", affected_dimension: "privacy", score_penalty: 3.0 },
  { id: "ETH-PRIV-003", name: "Lokal işleme tercihi", description: "Merkezi bulut yerine on-device veya kurum-içi", severity: "info", affected_dimension: "privacy", score_penalty: 1.0 },
  { id: "ETH-HUM-001", name: "İnsan denetimi paradigması", description: "HITL/HOTL/HOOTL ayrımı belirtilmiş mi?", severity: "warning", affected_dimension: "human_oversight", score_penalty: 2.0 },
  { id: "ETH-HUM-002", name: "Otonom karar yasağı - İtalya", description: "Sağlıkta HOOTL (otonom) İtalya yasası ile yasak", severity: "error", affected_dimension: "human_oversight", score_penalty: 4.0 },
  { id: "ETH-HUM-003", name: "Otomasyon bias farkındalığı", description: "Klinisyen modeli körü körüne kabul edebilir mi?", severity: "info", affected_dimension: "human_oversight", score_penalty: 1.0 },

  // HUKUKİ UYUMLULUK
  { id: "LEG-EU-001", name: "Yüksek-risk sınıflandırma — tıbbi cihaz", description: "MDR/IVDR kapsamında YZ otomatik yüksek-risk", severity: "info" },
  { id: "LEG-EU-002", name: "Veri yönetişimi - Madde 10", description: "Eğitim verisinin kalite ve temsiliyeti", severity: "warning" },
  { id: "LEG-DP-001", name: "DPIA gerekliliği", description: "Yüksek-risk veri işleme için DPIA zorunlu", severity: "warning" },
  { id: "LEG-DP-002", name: "KVKK ikincil kullanım", description: "Sağlık verisi YZ eğitiminde — açık rıza veya istisna", severity: "warning" },
  { id: "LEG-IT-001", name: "Nihai karar daima hekimde", description: "Tam otonom tıbbi karar İtalya'da yasak", severity: "error" },

  // USE CASE SKORLAMA
  { id: "SCORE-META-001", name: "Yeterli detay seviyesi", description: "Use case açıklaması yeterince ayrıntılı mı?", severity: "info" },
  { id: "POST-VAL-001", name: "Skor aralığı ihlali", description: "Skor 0-10 aralığında olmalı", severity: "error" },
  { id: "POST-VAL-002", name: "Tıbbi tavsiye yasağı ihlali", description: "Sistem klinik tıbbi tavsiye üretmemeli", severity: "error" },
];
