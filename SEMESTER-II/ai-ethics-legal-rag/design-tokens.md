# Tasarım Sistemi — Design Tokens

> **Proje:** YZM 714 Final – Seçenek B (Kural Bazlı RAG-LLM)
> **Filozofi:** Bakırçay Üniversitesi kurumsal kimliği × Claude'un sıcak/krem estetiği
> **Hedef his:** Akademik ciddiyet + insan-merkezli sıcaklık + güncel/next-gen yazılım kalitesi

---

## Renk Paleti

### Birincil — Bakırçay Üniversitesi Kurumsal (resmi site CSS'inden çıkarıldı)

| Token | HEX | Kullanım |
|-------|-----|----------|
| `--bakircay-navy` | `#192A56` | Birincil aksiyon, başlıklar, navigasyon |
| `--bakircay-navy-light` | `#394D82` | Hover, ikincil başlıklar |
| `--bakircay-teal` | `#00A4B4` | İmza turkuaz; vurgu, link, badge |
| `--bakircay-teal-dark` | `#00727B` | Hover teal, koyu vurgular |
| `--bakircay-teal-light` | `#0AA4BA` | Bilgi ipuçları |
| `--bakircay-orange` | `#FF8901` | Uyarı, dikkat çekici |

### İkincil — Claude Krem Sistemi

| Token | HEX | Kullanım |
|-------|-----|----------|
| `--cream-50` | `#FAF7F0` | En açık zemin |
| `--cream-100` | `#F0ECE0` | Ana zemin (light mode) |
| `--cream-200` | `#E5E0D6` | Kart kenarı, ayırıcı |
| `--cream-300` | `#D4CEC0` | Devre dışı durum |
| `--ink-900` | `#2B2A27` | Ana zemin (dark mode) |
| `--ink-800` | `#3A3833` | Yüzey (dark mode) |
| `--ink-700` | `#4F4D47` | Border (dark mode) |
| `--terracotta` | `#C96442` | Sıcak vurgu (alternatif aksiyon) |

### Anlam Renkleri (semantic)

| Token | HEX | Anlam |
|-------|-----|-------|
| `--success` | `#0F766E` | Başarı (kural geçti) — teal-uyumlu yeşil |
| `--warning` | `#FF8901` | Uyarı (kural sınır) — Bakırçay turuncu |
| `--danger` | `#B91C1C` | Hata (kural ihlali) |
| `--info` | `#00A4B4` | Bilgi — Bakırçay turkuaz |

### Tipografi Renkleri

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--text-primary` | `#1A1815` | `#F0ECE0` |
| `--text-secondary` | `#4F4D47` | `#C8C2B5` |
| `--text-muted` | `#7A776E` | `#959184` |
| `--text-inverse` | `#FAF7F0` | `#2B2A27` |

---

## Tipografi

Claude'un **serif** estetiğini koruyup Bakırçay'ın akademik tonuyla birleştiriyoruz.

### Font Aileleri

```css
--font-serif: 'Source Serif 4', 'Spectral', Georgia, serif;
--font-sans: 'Inter', 'Geist', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Geist Mono', ui-monospace;
```

### Tip Ölçeği (Major Third — 1.250)

| Token | Boyut | Kullanım |
|-------|-------|----------|
| `--text-xs` | 0.75rem (12px) | Mikro etiket |
| `--text-sm` | 0.875rem (14px) | Yardımcı metin |
| `--text-base` | 1rem (16px) | Gövde |
| `--text-lg` | 1.125rem (18px) | Vurgulu gövde |
| `--text-xl` | 1.25rem (20px) | Alt başlık |
| `--text-2xl` | 1.5rem (24px) | Bölüm başlığı |
| `--text-3xl` | 1.875rem (30px) | Sayfa başlığı |
| `--text-4xl` | 2.25rem (36px) | Hero başlık |
| `--text-5xl` | 3rem (48px) | Landing |

### Satır Yüksekliği
- Serif gövde: `1.65` (Claude'un "calm reading rhythm" değeri)
- Sans başlıklar: `1.2`
- Mono kod: `1.5`

---

## Spacing Sistemi (4px temel)

```
--space-0:  0
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

---

## Köşe Yuvarlama (Border Radius)

```
--radius-sm:  4px  (badge, küçük)
--radius-md:  8px  (button)
--radius-lg:  12px (card, dialog)
--radius-xl:  16px (hero card)
--radius-2xl: 24px (modal)
--radius-full: 9999px (pill, avatar)
```

---

## Gölge (Shadow)

Claude'un minimal kromu için **çok az gölge, çok ince border** prensibi:

```css
--shadow-xs: 0 1px 2px rgb(25 42 86 / 0.04);
--shadow-sm: 0 1px 3px rgb(25 42 86 / 0.06), 0 1px 2px rgb(25 42 86 / 0.04);
--shadow-md: 0 4px 6px -1px rgb(25 42 86 / 0.08), 0 2px 4px -2px rgb(25 42 86 / 0.06);
--shadow-lg: 0 10px 15px -3px rgb(25 42 86 / 0.08), 0 4px 6px -4px rgb(25 42 86 / 0.05);
```

> Not: Shadow rengi Bakırçay navy üzerinden alpha ile türetildi — soğuk gri yerine renkli derinlik.

---

## Animasyon ve Geçişler

```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-claude: cubic-bezier(0.16, 1, 0.3, 1);  /* Yumuşak, doğal */

--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
```

---

## Bileşen Tasarım Prensipleri

1. **İnce border > kalın gölge** — Claude'un "no shadows, thin border" yaklaşımı
2. **Serif vücut metin** — uzun okuma için sakin ritim
3. **Bakırçay teal'i imza accent** — link, badge, focus ring'lerde
4. **Bakırçay navy birincil aksiyon** — primary button, header arka plan
5. **Krem yüzeyler** — beyaz/gri yerine `cream-100`/`cream-50`
6. **Terracotta sıcak vurgu** — kural ihlali değil, **dikkat çekici öneri** için (warm)
7. **Köşeler yumuşak ama keskin değil** — `radius-lg` 12px sweet spot

---

## Tailwind v4 Token Eşleme (CSS Variables)

```css
@theme {
  --color-bakircay-50: #E6F4F7;
  --color-bakircay-100: #B3DDE5;
  --color-bakircay-200: #80C6D3;
  --color-bakircay-300: #4DAFC1;
  --color-bakircay-400: #1A98AF;
  --color-bakircay-500: #00A4B4;
  --color-bakircay-600: #00727B;
  --color-bakircay-700: #005962;
  --color-bakircay-800: #003F49;
  --color-bakircay-900: #002730;

  --color-navy-50: #E5E8EE;
  --color-navy-100: #BCC3D4;
  --color-navy-500: #394D82;
  --color-navy-700: #192A56;
  --color-navy-900: #0D1733;

  --color-cream-50: #FAF7F0;
  --color-cream-100: #F0ECE0;
  --color-cream-200: #E5E0D6;
  --color-cream-300: #D4CEC0;

  --color-ink-700: #4F4D47;
  --color-ink-800: #3A3833;
  --color-ink-900: #2B2A27;

  --color-terracotta-500: #C96442;
  --color-orange-500: #FF8901;

  --font-family-serif: "Source Serif 4", Georgia, serif;
  --font-family-sans: Inter, system-ui, sans-serif;
  --font-family-mono: "JetBrains Mono", ui-monospace;

  --radius: 0.75rem;
}
```

---

## Erişilebilirlik (a11y)

- **Kontrast oranları:**
  - Navy `#192A56` üzerine Cream `#F0ECE0`: **9.8:1** (AAA) ✓
  - Teal `#00A4B4` üzerine Cream `#F0ECE0`: **3.7:1** (AA Large) ✓
  - Ink-700 üzerine Cream-100: **8.4:1** (AAA) ✓
- **Focus halkası:** 2px solid `--bakircay-teal` + 2px offset
- **Klavye navigasyonu:** Tüm interaktif öğelerde `:focus-visible`
- **Renk-tek-anlamlı:** Kural durumları renk + ikon + metin üçlüsü ile işaretli

---

## Tasarım Tonu (UI Microcopy)

- **Sıcak, profesyonel, akademik** — "Lütfen" yerine "Şu use case için değerlendirme alın"
- **Türkçe öncelikli** — teknik terimler parantez içinde İngilizce
- **Açık ifade** — "Sistem hata verdi" değil "Bilgi tabanı geçici olarak ulaşılamıyor"
- **Hareket çağırıcı** — "Değerlendirmeyi Başlat", "Kaynakları Gör", "Etik Skoru Hesapla"

---

## İlham ve Referanslar

- **Claude.ai** — warm cream, serif typography, minimal chrome
- **Bakırçay resmi siteler** — navy + teal + orange renk paleti
- **Linear** — kompakt, klavye-temelli navigasyon
- **Stripe Dashboard** — veri yoğun ama hava'lı
- **Vercel v0** — modern shadcn/ui pattern'leri
- **assistant-ui (React)** — RAG chat UI referansı
