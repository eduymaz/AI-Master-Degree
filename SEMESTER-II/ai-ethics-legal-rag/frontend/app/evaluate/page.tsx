"use client";

import { useState } from "react";
import { UseCaseForm } from "@/components/use-case-form";
import { EvaluationResults } from "@/components/evaluation-results";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { SAMPLE_RESULTS } from "@/lib/sample-data";
import type { EvaluationRequest, EvaluationResponse } from "@/lib/types";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export default function EvaluatePage() {
  const [result, setResult] = useState<EvaluationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (req: EvaluationRequest) => {
    setLoading(true);
    setResult(null);
    const start = Date.now();
    try {
      const r = await api.evaluate(req);
      setResult(r);
      toast.success("Değerlendirme tamamlandı", {
        description: `${((Date.now() - start) / 1000).toFixed(1)}s · ${r.rule_violations.length} kural bulgusu`,
      });
    } catch {
      // Backend yoksa: form içeriğine en yakın örneği eşle (alan üzerinden)
      const area = req.use_case.area;
      const fallbackId =
        area === "radiology"
          ? "uc1-radyoloji"
          : area === "clinical_decision_support"
            ? "uc2-cdss"
            : "uc3-veri";
      const sample = SAMPLE_RESULTS[fallbackId];
      // Use case başlığını koru
      const tailored: EvaluationResponse = {
        ...sample,
        use_case_summary: `${req.use_case.title} — ${sample.use_case_summary}`,
      };
      await new Promise((r) => setTimeout(r, 1200));
      setResult(tailored);
      toast.info("Örnek değerlendirme gösteriliyor", {
        description: "Backend ulaşılamadı. Önceden hesaplanmış benzer use case sonucu açıldı.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          Use Case Değerlendir
        </h1>
        <p className="text-muted-foreground">
          Bir sağlık YZ uygulamasını tanımla; sistem 8 dokümanlı bilgi tabanı, 24 kural ve
          LLM ile etik & hukuki değerlendirme üretsin.
        </p>
      </header>

      <UseCaseForm onSubmit={handleSubmit} isLoading={loading} />

      {loading && <LoadingSkeleton />}

      {result && !loading && <EvaluationResults result={result} />}

      {!result && !loading && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="inline-flex size-12 items-center justify-center rounded-full bg-accent/10">
              <Sparkles className="size-5 text-accent" />
            </div>
            <p className="font-serif text-base font-medium">
              Sonuçlar burada görüntülenecek
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Form üzerinde bir hazır şablon seç ya da kendi use case'ini tanımla; ardından
              "Etik & Hukuki Değerlendirme Üret"e bas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 p-6">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="grid gap-3 pt-2 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-6 lg:grid-cols-5">
        <Skeleton className="h-72 lg:col-span-3" />
        <div className="space-y-3 lg:col-span-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    </div>
  );
}
