"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EvaluationResults } from "@/components/evaluation-results";
import { SAMPLE_PRESETS, SAMPLE_RESULTS } from "@/lib/sample-data";
import { cn, riskClassLabel } from "@/lib/utils";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Loader2,
  Sparkles,
  Stethoscope,
  Database,
  Activity,
} from "lucide-react";

const icons = {
  "uc1-radyoloji": Stethoscope,
  "uc2-cdss": Activity,
  "uc3-veri": Database,
} as const;

/**
 * Landing'e gömülü interaktif demo.
 * Backend olmadan **örnek veri** üzerinden değerlendirme deneyimini canlandırır.
 */
export function PlaygroundDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleRun = async (id: string) => {
    setSelected(id);
    setLoading(true);
    setShowResult(false);
    // Simüle edilmiş gecikme — gerçek deneyim hissi için
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setShowResult(true);
  };

  const result = selected ? SAMPLE_RESULTS[selected] : null;

  return (
    <section className="space-y-8">
      <header className="mx-auto max-w-2xl text-center">
        <Badge variant="outline" className="mb-4 gap-1">
          <Sparkles className="size-3 text-accent" />
          Canlı Deneyim
        </Badge>
        <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
          Bir use case seç,{" "}
          <span className="bg-gradient-to-r from-bakircay-600 via-bakircay-500 to-terracotta-500 bg-clip-text text-transparent">
            sistemin nasıl değerlendirdiğini gör
          </span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          Aşağıdaki üç use case için önceden hesaplanmış değerlendirme çıktıları. Gerçek pipeline
          aynı şekilde çalışır — backend ayağa kalkınca canlı LLM çağrısı yapılır.
        </p>
      </header>

      {/* Use case seçici kartlar */}
      <div className="grid gap-4 md:grid-cols-3">
        {SAMPLE_PRESETS.map((preset) => {
          const Icon = icons[preset.id as keyof typeof icons];
          const isActive = selected === preset.id;
          const sample = SAMPLE_RESULTS[preset.id];
          const risk = riskClassLabel(sample.legal_compliance.eu_ai_act_risk_class);
          const avg =
            (sample.ethics_scores.fairness.score +
              sample.ethics_scores.transparency.score +
              sample.ethics_scores.accountability.score +
              sample.ethics_scores.privacy.score +
              sample.ethics_scores.human_oversight.score) /
            5;

          return (
            <button
              key={preset.id}
              onClick={() => handleRun(preset.id)}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-card p-5 text-left transition-all",
                "hover:border-accent/60 hover:shadow-lg hover:-translate-y-0.5",
                isActive && "border-accent ring-2 ring-accent/30"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-bakircay-500/5 to-transparent" />
              )}
              <div className="relative space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="inline-flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Icon className="size-5" />
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${risk.tone}`}>
                    {risk.label}
                  </span>
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold leading-tight">{preset.title}</h3>
                  <p className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                    {preset.jurisdiction.map((j) => (
                      <span key={j} className="rounded bg-secondary px-1.5 py-0.5">
                        {j}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="flex items-end justify-between border-t pt-3">
                  <span className="text-xs text-muted-foreground">Ortalama skor</span>
                  <span className="font-serif text-2xl font-semibold tabular-nums text-foreground">
                    {avg.toFixed(1)}
                    <span className="text-xs text-muted-foreground">/10</span>
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-accent">
                    {isActive ? (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        Seçili
                      </>
                    ) : (
                      <>
                        Değerlendirmeyi gör
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <span className="text-muted-foreground">{sample.rule_violations.length} bulgu</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading && (
        <Card className="overflow-hidden">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="relative">
              <div className="inline-flex size-12 items-center justify-center rounded-full bg-accent/10">
                <Brain className="size-6 text-accent" />
              </div>
              <span className="absolute inset-0 animate-pulse-ring rounded-full" aria-hidden="true" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-serif font-medium">Retrieval → Kural Filtre → LLM → Doğrulama</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                Değerlendirme üretiliyor...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sonuç */}
      {showResult && result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-bakircay-300/40 bg-bakircay-50/30 px-4 py-2.5 dark:bg-bakircay-900/20">
            <p className="flex items-center gap-2 text-xs">
              <Sparkles className="size-3.5 text-accent" />
              <span className="font-medium">Örnek çıktı —</span>
              <span className="text-muted-foreground">
                Önceden hesaplanmış değerlendirme. Backend ayağa kalktığında canlı LLM çağrısı yapılır.
              </span>
            </p>
            <Button asChild size="sm" variant="ghost">
              <a href="/evaluate">
                Tam değerlendirme aracı
                <ArrowRight className="size-3.5" />
              </a>
            </Button>
          </div>
          <EvaluationResults result={result} />
        </div>
      )}

      {!selected && !loading && (
        <Card className="border-dashed bg-card/40">
          <CardContent className="flex items-center justify-center gap-3 py-8 text-center text-muted-foreground">
            <Sparkles className="size-4 text-accent" />
            <p className="text-sm">Yukarıdaki üç use case'ten birini seç, değerlendirme akışı canlanır.</p>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
