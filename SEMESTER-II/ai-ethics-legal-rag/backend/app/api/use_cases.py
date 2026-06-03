"""Hazır örnek use case'ler — A raporundaki üç use case ile aynı."""
from __future__ import annotations

from fastapi import APIRouter

from app.models.schemas import HealthcareArea, UseCase

router = APIRouter(prefix="/api", tags=["use-cases"])


PRESET_USE_CASES: dict[str, UseCase] = {
    "uc1-radyoloji": UseCase(
        title="Radyolojide YZ destekli akciğer X-ray çoklu patoloji tanısı",
        area=HealthcareArea.RADIOLOGY,
        description=(
            "Hibrit CNN + Vision Transformer (Swin-B + DenseNet-121) mimarisinde "
            "akciğer X-ray görüntülerinden 14 patolojiyi çoklu-etiket sınıflandıran "
            "bir bilgisayar destekli tespit (CADx) sistemi. Eğitim için MIMIC-CXR, "
            "CheXpert, PadChest ve VinDr-CXR datasetleri birleştirildi. Açıklanabilirlik "
            "için layer-wise Grad-CAM ve SHAP kullanılır. HITL paradigmasında radyolog "
            "her tanıyı onaylar. KVKK ve GDPR Madde 9 uyumlu federated learning ile "
            "Türkiye yerel verisi entegre edildi. Adalet metrikleri: Independence, "
            "Separation ve Sufficiency stratified test setleri ile değerlendirilir. "
            "Audit log her tahmin için tutulur. Sistem FDA 510(k) ve AB MDR Class IIa+ "
            "yolu ile pazara giriş hedefler; PCCP ile model güncellemeleri yönetilir."
        ),
        data_sources=["MIMIC-CXR", "CheXpert", "PadChest", "VinDr-CXR", "Türkiye yerel hastane verisi (federated)"],
        affected_stakeholders=["radyolog", "klinisyen", "hasta", "hastane", "üretici", "sigorta"],
        jurisdiction=["EU", "TR", "US", "IT"],
        technical_architecture=(
            "DICOM girişi → DEID anonimizasyonu → Preprocessing → "
            "SwinTransformer-B + DenseNet-121 hibrit → 14 patoloji skoru → "
            "Layer-wise Grad-CAM + SHAP → PACS arayüzü (HITL onay) → Audit log"
        ),
    ),
    "uc2-cdss": UseCase(
        title="Sepsis erken uyarı klinik karar destek sistemi (CDSS)",
        area=HealthcareArea.CDSS,
        description=(
            "Yoğun bakım ve genel servislerde sepsis riskini gerçek zamanlı tahmin eden "
            "bir CDSS. LightGBM gradient boosting + LSTM zaman serisi ensemble. "
            "EHR'dan saat başı vital bulgular, laboratuvar sonuçları, ilaç ve "
            "komorbidite çekilir (FHIR R4). Çıktı tek-eşikli uyarı değil, beş risk "
            "kategorisi (alert fatigue yönetimi için). SHAP waterfall plot ile "
            "hekim için açıklama. İtalya YZ Yasası (Ekim 2025) uyumlu: hekim son söz "
            "ilkesi advisory modda uygulanır; hasta YZ kullanımı hakkında bilgilendirilir. "
            "Override gerekçe alanı zorunludur. Wong vd. (2021) Epic Sepsis %33 "
            "sensitivite vakası ışığında yerel doğrulama ve concept drift monitoring "
            "uygulanır. Subgroup performance (yaş × cinsiyet × etnisite) sürekli izlenir."
        ),
        data_sources=["MIMIC-IV", "Üniversite hastanesi EHR (yerel doğrulama)"],
        affected_stakeholders=[
            "yoğun bakım hekimi",
            "hemşire",
            "hasta",
            "hastane kalite-emniyet komitesi",
            "ödeme kurumu",
        ],
        jurisdiction=["EU", "TR", "IT"],
        technical_architecture=(
            "Epic/Cerner EHR → FHIR R4 → Feature engineering → "
            "LightGBM + LSTM ensemble → Risk kategorisi (5 seviye) + SHAP → "
            "CDSS Hooks 1.0 → Advisory UI (İtalya yasası uyumlu) → "
            "Override gerekçe alanı + audit log + concept drift monitoring"
        ),
    ),
    "uc3-veri": UseCase(
        title="Federated learning + sentetik veri ile çok-merkezli meme MRI eğitim konsorsiyumu",
        area=HealthcareArea.DATA_GOVERNANCE,
        description=(
            "Türkiye'de üç üniversite hastanesinin oluşturduğu varsayımsal federated "
            "learning konsorsiyumu (TFDA/DKTK Avrupa modeline uyarlanmış). Meme MRI "
            "verisinden erken evre kanser tespiti için YZ modeli eğitilir. Hasta "
            "verisi hastane sınırını terk etmez; FedAvg + Secure Aggregation ile "
            "şifreli gradient agregasyonu. DP-SGD (epsilon=4) ile membership inference "
            "saldırılarına karşı koruma. DP-CTGAN ile sentetik EHR verisi üretilir; "
            "open data konsorsiyumu için yayımlanır. KVKK Madde 6 (özel nitelikli) ve "
            "GDPR Madde 9 uyumu; Kasım 2025 KVKK Üretken YZ Rehberi'nin geri "
            "döndürülemezlik şartına uygun anonimleştirme. EHDS ikincil kullanım "
            "çerçevesi ile uyumlu pilot."
        ),
        data_sources=["Hacettepe MRI", "İstanbul Tıp MRI", "Ege MRI (federated)"],
        affected_stakeholders=[
            "hasta",
            "hastane (veri kontrolörü)",
            "araştırmacı",
            "etik kurul",
            "KVKK Kurumu",
        ],
        jurisdiction=["EU", "TR"],
        technical_architecture=(
            "3 hastane yerel MRI → lokal eğitim (DP-SGD) → "
            "Secure Aggregation → Global Model (DP budget izlenir) → "
            "DP-CTGAN sentetik EHR → Membership inference attack testleri → "
            "EHDS / KVKK uyumlu açık erişim"
        ),
    ),
}


@router.get("/use-cases")
async def list_use_cases() -> dict:
    """Hazır use case'lerin listesi."""
    return {
        "use_cases": [
            {
                "id": uc_id,
                "title": uc.title,
                "area": uc.area.value,
                "jurisdiction": uc.jurisdiction,
            }
            for uc_id, uc in PRESET_USE_CASES.items()
        ]
    }


@router.get("/use-cases/{uc_id}")
async def get_use_case(uc_id: str) -> UseCase:
    """Belirli bir hazır use case'i döndür."""
    from fastapi import HTTPException

    uc = PRESET_USE_CASES.get(uc_id)
    if uc is None:
        raise HTTPException(status_code=404, detail=f"Use case bulunamadı: {uc_id}")
    return uc
