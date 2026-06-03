# Frontend — Next.js 15 + Tailwind v4 + shadcn/ui

Sağlık YZ etik & hukuki değerlendirme sisteminin Web arayüzü.

## Hızlı Çalıştırma

```bash
npm install
npm run dev
# http://localhost:3000
```

## Stack

- **Next.js 15** App Router + Server Components + Turbopack dev
- **Tailwind v4** CSS-first config (`@theme` + design tokens)
- **shadcn/ui** (Radix + class-variance-authority)
- **Recharts** — radar chart (5 etik boyut)
- **Sonner** — toast bildirim
- **Lucide React** — ikon
- **React Markdown** — LLM çıktısı render

## Tema

Tüm tasarım tokenları `app/globals.css` içinde `@theme` bloğunda:
- Bakırçay Navy (`--color-navy-700: #192A56`)
- Bakırçay Teal (`--color-bakircay-500: #00A4B4`)
- Claude Cream (`--color-cream-100: #F0ECE0`)
- Terracotta (`--color-terracotta-500: #C96442`)

Light/dark mode `.dark` class ile değiştirilir.

## Sayfalar

- `/` — Landing (hero + 5 etik boyut + pipeline + footer)
- `/evaluate` — Use case formu + değerlendirme sonuç paneli
- `/sources` — Bilgi tabanı belge gezgini
- `/rules` — Kural tabanı şeffaflığı

## Type Kontrol

```bash
npm run type-check
```
