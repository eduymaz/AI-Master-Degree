import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientMesh } from "@/components/gradient-mesh";
import { AnimatedCounter } from "@/components/animated-counter";
import { PlaygroundDemo } from "@/components/playground-demo";
import {
  ArrowRight,
  BookOpen,
  Eye,
  Lock,
  Scale,
  Shield,
  Users,
  Zap,
  Database,
  Network,
  ShieldCheck,
  FileText,
  Layers,
  Sparkles,
  Gavel,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="-mt-8 space-y-24">
      {/* ─── HERO ───────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border bg-card">
        <GradientMesh variant="hero" />
        <div className="relative z-10 px-6 py-20 sm:px-12 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <Badge variant="outline" className="mb-6">
              <span className="mr-1.5 inline-flex size-1.5 animate-pulse rounded-full bg-accent" />
              Yapay Zekâ Etik Değerlendirme Platformu
            </Badge>

            <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Sağlık YZ uygulamaları için{" "}
              <span className="text-primary">etik ve hukuki değerlendirme</span>,
              bilgi tabanı destekli.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              <strong className="text-foreground">AB YZ Yasası</strong>,{" "}
              <strong className="text-foreground">KVKK</strong>,{" "}
              <strong className="text-foreground">ISO/IEC 42001</strong>,{" "}
              <strong className="text-foreground">UNESCO</strong> ve{" "}
              <strong className="text-foreground">İtalya YZ Yasası</strong> çerçevelerine
              karşı sistematik karşılaştırma. Hibrit retrieval (semantik + BM25) ile sorgu;
              24 kural ile post-doğrulama; LLM ile anlatısal değerlendirme.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild className="h-11 px-6 text-base">
                <Link href="#playground">
                  <Sparkles className="size-4" />
                  Canlı Deneyim
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-11 px-6 text-base">
                <Link href="/evaluate">
                  Değerlendirme Aracı
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat label="Belge" value={8} />
              <Stat label="Kural" value={24} />
              <Stat label="Use Case" value={3} />
              <Stat label="Yargı Bölgesi" value={4} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE PLAYGROUND ─────────────────────────── */}
      <section id="playground" className="scroll-mt-20">
        <PlaygroundDemo />
      </section>

      {/* ─── 5 ETİK BOYUT ──────────────────────────────────── */}
      <section className="space-y-10">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">
            <Scale className="mr-1 size-3 text-accent" />
            Beş Etik Boyut
          </Badge>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Her use case beş boyutta sistematik skorlama
          </h2>
          <p className="mt-4 text-muted-foreground">
            0–10 ölçekte skor, kanıta dayalı gerekçe ve kaynak referansı. Kural motoru
            açıkken konservatif kalibrasyon uygulanır.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <DimensionCard icon={<Scale />} title="Adalet" blurb="Independence, Separation ve Sufficiency metrikleri ile algoritmik önyargı." />
          <DimensionCard icon={<Eye />} title="Şeffaflık" blurb="Grad-CAM, SHAP ve LIME ile açıklanabilirlik; hasta bilgilendirme." />
          <DimensionCard icon={<Shield />} title="Hesap Verebilirlik" blurb="Üretici–dağıtıcı–klinisyen zinciri; audit log; ürün sorumluluğu." />
          <DimensionCard icon={<Lock />} title="Mahremiyet" blurb="GDPR Md.9 + KVKK Md.6; federated learning; differential privacy." />
          <DimensionCard icon={<Users />} title="İnsan Denetimi" blurb="HITL · HOTL · HOOTL paradigm; İtalya yasası uyumu." />
        </div>
      </section>

      {/* ─── PIPELINE ───────────────────────────────────────── */}
      <section className="rounded-2xl border bg-card p-8 sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-3">
            <Zap className="mr-1 size-3 text-accent" />
            Pipeline
          </Badge>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Şeffaf, denetlenebilir, açıklanabilir
          </h2>
          <p className="mt-4 text-muted-foreground">
            Her adım gözlemlenebilir; her skor bir kural ve kaynağa bağlı.
          </p>
        </div>
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <StepCard num="01" icon={<FileText />} label="Use Case" sub="Form veya şablon" />
          <StepCard num="02" icon={<Network />} label="Retrieval" sub="Semantik + BM25" />
          <StepCard num="03" icon={<ShieldCheck />} label="Kural Filtre" sub="24 kural" />
          <StepCard num="04" icon={<Sparkles />} label="LLM" sub="Claude / Ollama" />
          <StepCard num="05" icon={<Layers />} label="Doğrulama" sub="Post-kural kontrol" />
          <StepCard num="06" icon={<Gavel />} label="Çıktı" sub="Skor + kaynak" />
        </div>
      </section>

      {/* ─── ŞEFFAFLIK ŞERIDI ───────────────────────────────── */}
      <section className="grid gap-4 md:grid-cols-3">
        <TransparencyCard
          href="/sources"
          icon={<Database />}
          title="Bilgi Tabanı"
          subtitle="8 küratörlü belge"
          description="AB YZ Yasası, KVKK, ISO 42001, UNESCO, İtalya, WHO, FDA ve etik kavram sentezi."
        />
        <TransparencyCard
          href="/rules"
          icon={<ShieldCheck />}
          title="Kural Tabanı"
          subtitle="24 kural · YAML"
          description="Etik ilkeler, hukuki uyumluluk ve use case skorlama. Her penalty kural-id ile gerekçeli."
        />
        <TransparencyCard
          href="/evaluate"
          icon={<Sparkles />}
          title="Değerlendir"
          subtitle="Hazır şablon veya özel"
          description="Form ile kendi use case'ini tanımla veya hazır şablonlardan birini seç."
        />
      </section>

      {/* ─── FOOTER CTA (deep blue) ─────────────────────────── */}
      <section className="bg-deep-blue rounded-2xl px-8 py-14 sm:px-12">
        <div className="mx-auto max-w-2xl text-center text-white">
          <h2 className="font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Şeffaflık, etik tasarımın temelidir.
          </h2>
          <p className="mt-4 text-white/80">
            Sistem AB YZ Yasası Madde 13 "şeffaflık" yükümlülüğünü kendi tasarımına
            uyguluyor: her kaynak, her kural, her skor görünür.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="h-11 bg-white px-6 text-base text-primary hover:bg-cream-50"
            >
              <Link href="/evaluate">
                Hemen Dene
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-11 border-white/30 bg-transparent px-6 text-base text-white hover:bg-white/10"
            >
              <Link href="/sources">
                <BookOpen className="size-4" />
                Kaynakları Gör
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-background/60 px-4 py-4 text-center backdrop-blur-sm">
      <p className="font-serif text-3xl font-semibold tabular-nums text-primary">
        <AnimatedCounter to={value} />
      </p>
      <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function DimensionCard({
  icon,
  title,
  blurb,
}: {
  icon: React.ReactNode;
  title: string;
  blurb: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md">
      <div className="mb-3 inline-flex size-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <span className="[&_svg]:size-5">{icon}</span>
      </div>
      <h3 className="font-serif text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{blurb}</p>
    </div>
  );
}

function StepCard({
  num,
  icon,
  label,
  sub,
}: {
  num: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div className="relative rounded-xl border bg-background p-4">
      <span className="absolute right-3 top-2.5 font-mono text-[10px] text-muted-foreground/60">
        {num}
      </span>
      <div className="mb-2 inline-flex size-8 items-center justify-center rounded-md bg-primary/8 text-primary">
        <span className="[&_svg]:size-4">{icon}</span>
      </div>
      <p className="font-serif text-sm font-semibold text-foreground">{label}</p>
      <p className="text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function TransparencyCard({
  href,
  icon,
  title,
  subtitle,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/8 text-primary">
          <span className="[&_svg]:size-5">{icon}</span>
        </div>
        <ArrowRight className="size-4 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>
      <h3 className="mt-4 font-serif text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="text-sm text-accent">{subtitle}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </Link>
  );
}
