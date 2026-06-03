import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GradientMesh } from "@/components/gradient-mesh";
import { api } from "@/lib/api";
import { SAMPLE_RULES } from "@/lib/sample-sources-rules";
import { cn, severityColor } from "@/lib/utils";
import { Scale, ShieldAlert, BarChart3, ShieldCheck } from "lucide-react";
import type { RuleDefinition } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RulesPage() {
  let rules: RuleDefinition[] = SAMPLE_RULES;
  let metaVersion = "1.0.0";
  let isLive = false;
  try {
    const res = await api.listRules();
    if (res?.rules?.length) {
      rules = res.rules;
      metaVersion = (res.metadata?.version as string) ?? metaVersion;
      isLive = true;
    }
  } catch {
    /* fallback */
  }

  const sections = [
    {
      title: "Etik İlke Kontrolleri",
      icon: <Scale />,
      rules: rules.filter((r) => r.id.startsWith("ETH-")),
      tone: "from-bakircay-500/10 to-bakircay-700/5",
    },
    {
      title: "Hukuki Uyumluluk",
      icon: <ShieldAlert />,
      rules: rules.filter((r) => r.id.startsWith("LEG-")),
      tone: "from-navy-500/10 to-navy-700/5",
    },
    {
      title: "Use Case Skorlama + Post-Doğrulama",
      icon: <BarChart3 />,
      rules: rules.filter((r) => r.id.startsWith("SCORE-") || r.id.startsWith("POST-")),
      tone: "from-terracotta-500/10 to-amber-500/5",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-border/40">
        <GradientMesh variant="subtle" />
        <div className="relative z-10 px-6 py-12 sm:px-10 sm:py-16">
          <Badge variant="outline" className="mb-3 bg-card/60 backdrop-blur-md">
            <ShieldCheck className="mr-1 size-3 text-accent" />
            Kural Tabanı
          </Badge>
          <h1 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            YAML tabanlı{" "}
            <span className="bg-gradient-to-br from-terracotta-500 to-amber-500 bg-clip-text text-transparent">
              şeffaf kural motoru
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            {rules.length} kural — etik ilke kontrolleri, hukuki uyumluluk ve use case skorlama
            boyutlarında. Her kural bir tetikleyici desen, severity ve eylem belirtir; LLM çağrısı
            öncesi ve sonrası iki noktada uygulanır.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="accent" className="gap-1">
              <span className={`size-1.5 rounded-full ${isLive ? "bg-success" : "bg-warning"}`} />
              {isLive ? "Canlı kural tabanı" : "Örnek veri (backend kapalı)"}
            </Badge>
            <Badge variant="outline">v{metaVersion}</Badge>
            <Badge variant="outline">{rules.length} kural</Badge>
            <Badge variant="outline">3 boyut</Badge>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section key={section.title} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-accent [&_svg]:size-4">{section.icon}</span>
              <h2 className="font-serif text-xl font-semibold tracking-tight">{section.title}</h2>
            </div>
            <span className="text-sm text-muted-foreground">{section.rules.length} kural</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {section.rules.map((r) => (
              <Card
                key={r.id}
                className="group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${section.tone} opacity-30 transition-opacity group-hover:opacity-60`}
                />
                <CardHeader className="relative pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <code className="rounded bg-secondary/80 px-1.5 py-0.5 font-mono text-[10px] backdrop-blur-sm">
                      {r.id}
                    </code>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                        severityColor(r.severity)
                      )}
                    >
                      {r.severity}
                    </span>
                  </div>
                  <CardTitle className="text-sm leading-snug">{r.name}</CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-2 pt-0">
                  <CardDescription className="text-xs leading-relaxed">
                    {r.description}
                  </CardDescription>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {r.affected_dimension && (
                      <Badge variant="outline" className="text-[10px]">
                        {r.affected_dimension}
                      </Badge>
                    )}
                    {r.score_penalty && r.score_penalty > 0 && (
                      <Badge variant="destructive" className="text-[10px]">
                        −{r.score_penalty} pt
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
