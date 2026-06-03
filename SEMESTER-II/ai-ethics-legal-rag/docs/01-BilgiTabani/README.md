# 01 — Bilgi Tabanı (Knowledge Base)

> **Rubric Maddesi:** Doküman toplama + chunk'lara bölme + embedding + vektör DB kurulumu (10 puan)

---

## 1. Genel Bakış

Bilgi tabanı, sağlık YZ uygulamalarının etik ve hukuki değerlendirmesi için **8 küratörlü belge** içerir. Bu belgeler sisteme yüklenirken:

1. YAML frontmatter'dan metadata çıkarılır
2. ~350 token'lık chunk'lara bölünür (~50 token overlap)
3. `intfloat/multilingual-e5-base` modeli ile embedding'e dönüştürülür
4. ChromaDB'de metadata ile birlikte saklanır
5. BM25 indeksi oluşturulur (lexical arama için)

**Sonuç:** 8 belge → 58 chunk

---

## 2. Dosya Yapısı

```
backend/app/knowledge/
├── documents/                      ← 8 küratörlü Markdown belge
│   ├── ab-yz-yasasi.md            (AB YZ Yasası — EU 2024/1689)
│   ├── kvkk-saglik-yz.md          (KVKK + Üretken YZ Rehberi, Kasım 2025)
│   ├── iso-iec-42001.md           (ISO/IEC 42001 YZ Yönetim Sistemi)
│   ├── unesco-yz-etigi.md         (UNESCO YZ Etiği Tavsiyesi 2021)
│   ├── italya-yz-yasasi.md        (İtalya YZ Yasası, Ekim 2025)
│   ├── who-saglik-yz-etigi.md     (WHO Sağlıkta YZ Etiği)
│   ├── fda-aiml-samd.md           (FDA AI/ML SaMD Action Plan)
│   └── etik-kavramlar-saglik.md   (Akademik kavram sentezi)
├── ingest.py                       ← Chunking + embedding + ChromaDB ingest
└── chroma_db/                      ← Persistent vektör veritabanı
```

---

## 3. Belge Detayları

| # | Belge | Dosya | Yetki | Yargı Bölgesi | Kategori |
|---|-------|-------|-------|---------------|----------|
| 1 | AB YZ Yasası (EU AI Act) | `ab-yz-yasasi.md` | European Commission | EU | primary_regulation |
| 2 | KVKK Sağlık & Üretken YZ | `kvkk-saglik-yz.md` | KVKK | TR | primary_regulation |
| 3 | ISO/IEC 42001 | `iso-iec-42001.md` | ISO/IEC | Global | standard |
| 4 | UNESCO YZ Etiği | `unesco-yz-etigi.md` | UNESCO | Global | recommendation |
| 5 | İtalya YZ Yasası | `italya-yz-yasasi.md` | Italian Parliament | IT | primary_regulation |
| 6 | WHO Sağlık YZ Etiği | `who-saglik-yz-etigi.md` | WHO | Global | guidance |
| 7 | FDA AI/ML SaMD | `fda-aiml-samd.md` | FDA | US | guidance |
| 8 | Etik Kavramlar Sentezi | `etik-kavramlar-saglik.md` | Akademik | Global | academic |

---

## 4. Teknik Özellikler

### 4.1 Embedding Modeli

| Özellik | Değer |
|---------|-------|
| **Model** | `intfloat/multilingual-e5-base` |
| **Boyut** | 768 dimension |
| **Dil Desteği** | Türkçe + İngilizce (multilingual) |
| **Model Boyutu** | ~400 MB |
| **Prefix** | `passage:` (chunk), `query:` (sorgu) |

### 4.2 Chunking Stratejisi

| Parametre | Değer |
|-----------|-------|
| **Hedef Chunk Boyutu** | ~350 token |
| **Overlap** | ~50 token |
| **Bölme Yöntemi** | Markdown header-aware + cümle sınırı |
| **Karakter/Token Oranı** | ~4 (Türkçe için yaklaşık) |

### 4.3 Vektör Veritabanı

| Özellik | Değer |
|---------|-------|
| **DB** | ChromaDB (persistent) |
| **Collection** | `yz-etik-saglik` |
| **Distance Metric** | Cosine |
| **Persist Directory** | `backend/app/knowledge/chroma_db/` |

### 4.4 Belge Metadata Yapısı

Her Markdown belge YAML frontmatter içerir:

```yaml
---
doc_id: eu-ai-act-2024
title: AB Yapay Zekâ Yasası (EU AI Act)
authority: European Commission
jurisdiction: EU
publication_date: 2024-07-12
language: tr
source_url: https://eur-lex.europa.eu/...
category: primary_regulation
applicable_areas: [healthcare, general]
---
```

---

## 5. Kurulum ve Çalıştırma

### Docker ile (Otomatik)

```bash
docker compose up
# Backend ilk açılışta otomatik olarak ingest_all.py çalıştırır
```

### Manuel Kurulum

```bash
cd backend

# Sanal ortam aktive
source .venv/bin/activate

# Bilgi tabanını oluştur
python scripts/ingest_all.py
```

### Beklenen Çıktı

```
2026-06-03 20:47:55 [INFO] Embedding modeli yükleniyor: intfloat/multilingual-e5-base
2026-06-03 20:47:55 [INFO] 8 markdown dosyası bulundu
2026-06-03 20:47:55 [INFO] 58 chunk için embedding hesaplanıyor...
Batches: 100%|██████████| 4/4 [00:03<00:00, 1.21it/s]
2026-06-03 20:47:59 [INFO] ChromaDB güncellendi: {'documents': 8, 'chunks': 58}

✓ Bilgi tabanı kuruldu: 8 belge, 58 chunk
```

---

## 6. İstatistikler

| Metrik | Değer |
|--------|-------|
| Belge Sayısı | 8 |
| Toplam Chunk | 58 |
| Embedding Boyutu | 768 |
| Yargı Bölgeleri | EU, TR, IT, US, Global |
| Dil | Türkçe (birincil) + İngilizce terimler |
| Toplam Karakter | ~120,000 |

---

## 7. Yargı Bölgesi Kapsamı

Rubric gereksinimi: **≥3 yargı bölgesi**

| Yargı Bölgesi | Belgeler |
|---------------|----------|
| **EU (Avrupa Birliği)** | AB YZ Yasası, UNESCO (AB tarafı) |
| **TR (Türkiye)** | KVKK Sağlık & Üretken YZ Rehberi |
| **IT (İtalya)** | İtalya YZ Yasası (Ekim 2025) |
| **US (ABD)** | FDA AI/ML SaMD Action Plan |
| **Global** | UNESCO, WHO, ISO/IEC 42001 |

**Toplam:** 5+ yargı bölgesi ✓

---

## 8. API Erişimi

Bilgi tabanı içeriğine REST API üzerinden erişilebilir:

```bash
# Tüm belgeleri listele
curl http://localhost:8000/api/sources

# Yanıt örneği
{
  "sources": [
    {
      "doc_id": "eu-ai-act-2024",
      "title": "AB Yapay Zekâ Yasası",
      "authority": "European Commission",
      "jurisdiction": "EU",
      "chunk_count": 12
    },
    ...
  ],
  "total_documents": 8,
  "total_chunks": 58
}
```

---

## 9. Kod Referansları

| Dosya | Satır | Açıklama |
|-------|-------|----------|
| `backend/app/knowledge/ingest.py` | 19-25 | SentenceTransformer yükleme |
| `backend/app/knowledge/ingest.py` | 45-70 | YAML frontmatter parse |
| `backend/app/knowledge/ingest.py` | 80-120 | Markdown chunking |
| `backend/app/knowledge/ingest.py` | 130-160 | ChromaDB upsert |
| `backend/app/rag/retriever.py` | 30-50 | BM25 indeks oluşturma |

---

## 10. Bağımlılıklar

```txt
# backend/requirements.txt
chromadb>=0.5.20
sentence-transformers>=3.3.0,<4.0.0
transformers>=4.44.0,<5.0.0
rank-bm25>=0.2.2
pyyaml>=6.0.2
```
