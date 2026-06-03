import { cn } from "@/lib/utils";

/**
 * Marka işareti — kurumsal, sade, anlamlı.
 * "Sağlık YZ Etik" — Türkçe ana ad
 * Sembol: medikal artı + denetim/dengeleme ışıltısı (deep navy gradient).
 */
export function BakircayLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-8 shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="brandg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-blue-700)" />
            <stop offset="100%" stopColor="var(--color-accent-500)" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#brandg)" />
        <path
          d="M16 8.5v15M8.5 16h15"
          stroke="var(--color-cream-50)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="2.4" fill="var(--color-cream-50)" />
      </svg>
      <span className="font-serif text-[17px] font-semibold leading-none tracking-tight text-foreground">
        Sağlık YZ Etik
      </span>
    </div>
  );
}
