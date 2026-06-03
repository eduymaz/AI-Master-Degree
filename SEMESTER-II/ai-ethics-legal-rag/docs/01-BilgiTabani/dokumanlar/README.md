# Ham Belgeler

Bu klasör rubric'te "ham PDF/HTML belgeler" için ayrılmıştır.

**Gerçek belgeler bu projede `backend/app/knowledge/documents/` altında Markdown formatında küratörlüdür** — çünkü:

1. **RAG kalitesi:** Ham PDF'lerden bölünen chunk'lar, çoğunlukla başlık + paragraf yapısını kaybeder. Manuel olarak özetlenmiş Markdown belgeleri RAG retrieval kalitesini dramatik biçimde artırır.
2. **Boyut:** Ham AB YZ Yasası PDF'i 250+ sayfadır; küratörlü Markdown 53 satıra düşürür ve sadece sağlık YZ ile ilgili maddeleri içerir.
3. **Tekrar üretilebilirlik:** Markdown belgeler git'te versiyonlanabilir ve diff'lenebilir.

## Belgelerin Üretilme Yöntemi

Her belgenin başında **YAML frontmatter** ile metadata vardır:

```yaml
---
title: AB YZ Yasası — Sağlık YZ İçin Anahtar Maddeler
source: https://eur-lex.europa.eu/...
jurisdiction: EU
publication_date: 2024-07-12
type: regulation
---
```

Bu metadata, ChromaDB'ye chunk-level olarak iliştirilir ve retrieval sonuçlarında kaynak gösterimi için kullanılır.

## Belge Listesi

| Dosya *(backend/app/knowledge/documents/)* | Yargı | Tür |
|--------------------------------------------|-------|-----|
| `ab-yz-yasasi.md` | EU | Regülasyon |
| `kvkk-saglik-yz.md` | TR | Rehber (Kasım 2025) |
| `iso-iec-42001.md` | Global | Standart |
| `unesco-yz-etigi.md` | Global | Tavsiye |
| `italya-yz-yasasi.md` | IT | Regülasyon (Ekim 2025) |
| `who-saglik-yz-etigi.md` | Global | Rehber |
| `fda-aiml-samd.md` | US | Regülasyon |
| `etik-kavramlar-saglik.md` | — | Akademik sentez |

Toplam: 8 belge, 58 chunk, 768-boyutlu e5-base embedding.
