import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { Toaster } from "sonner";
import "./globals.css";

const fontSans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans-app",
  display: "swap",
});

const fontSerif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif-app",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-app",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sağlık YZ Etik — Değerlendirme Platformu",
  description:
    "Sağlık yapay zekâ uygulamalarını AB YZ Yasası, KVKK, ISO/IEC 42001 ve UNESCO çerçevelerine göre sistematik biçimde değerlendiren kural bazlı RAG-LLM platformu.",
  authors: [{ name: "Elif Duymaz Yılmaz" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        <footer className="mt-24 border-t border-border/60 bg-card">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-4 text-sm sm:flex-row sm:items-center">
              <div className="space-y-1">
                <p className="font-serif text-base font-semibold tracking-tight text-foreground">
                  Sağlık YZ Etik — Değerlendirme Platformu
                </p>
                <p className="text-xs text-muted-foreground">
                  Akademik araştırma prototipi. Klinik karar yerine geçmez.
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                © 2026 · İzmir Bakırçay Üniversitesi, Fen Bilimleri Enstitüsü
              </p>
            </div>
          </div>
        </footer>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--foreground)",
            },
          }}
        />
      </body>
    </html>
  );
}
