"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BakircayLogo } from "@/components/bakircay-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const links = [
  { href: "/", label: "Anasayfa" },
  { href: "/evaluate", label: "Değerlendir" },
  { href: "/sources", label: "Kaynaklar" },
  { href: "/rules", label: "Kurallar" },
];

export function Navigation() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Anasayfa"
          className="rounded-md focus-visible:outline-none"
        >
          <BakircayLogo />
        </Link>
        <nav className="flex items-center gap-1">
          {links.slice(0, 4).map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "hidden rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:inline-flex",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Button asChild size="sm" className="ml-2 hidden h-9 md:inline-flex">
            <Link href="/evaluate">
              Değerlendir
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
