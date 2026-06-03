"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EthicsRadar } from "@/components/ethics-radar";
import { ScoreBreakdown } from "@/components/score-breakdown";
import { LegalCompliancePanel } from "@/components/legal-compliance-panel";
import { RuleViolationsPanel } from "@/components/rule-violations";
import { SourceCitations } from "@/components/source-citations";
import type { EvaluationResponse } from "@/lib/types";
import { cn, formatDuration, scoreColor } from "@/lib/utils";
import { Clock, Cpu, Sparkles, FileText, Network, BookText } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Props {
  result: EvaluationResponse;
}

export function EvaluationResults({ result }: Props) {
  const avg =
    (result.ethics_scores.fairness.score +
      result.ethics_scores.transparency.score +
      result.ethics_scores.accountability.score +
      result.ethics_scores.privacy.score +
      result.ethics_scores.human_oversight.score) /
    5;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Üst başlık şeridi */}
      <Card className="bg-warm-gradient overflow-hidden">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-accent" />
                <CardTitle className="text-2xl">Etik & Hukuki Değerlendirme</CardTitle>
              </div>
              <CardDescription className="max-w-2xl text-base">
                {result.use_case_summary || "Kapsamlı değerlendirme tamamlandı."}
              </CardDescription>
            </div>
            <div
              className={cn(
                "rounded-lg border bg-card/80 px-5 py-3 text-center backdrop-blur-sm",
                "shadow-sm"
              )}
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Ortalama Skor
              </p>
              <p
                className={cn(
                  "font-serif text-3xl font-semibold tabular-nums",
                  scoreColor(avg)
                )}
              >
                {avg.toFixed(1)}
                <span className="text-base text-muted-foreground">/10</span>
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="border-t border-border/40 bg-card/40 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <Metric
              icon={<Cpu className="size-3.5" />}
              label="LLM"
              value={`${result.metadata.llm_provider} · ${result.metadata.model_version}`}
            />
            <Metric
              icon={<Network className="size-3.5" />}
              label="Retrieval"
              value={`${result.metadata.retrieval_top_k} chunk (hibrit)`}
            />
            <Metric
              icon={<Clock className="size-3.5" />}
              label="Süre"
              value={formatDuration(result.metadata.duration_ms)}
            />
            <Metric
              icon={<BookText className="size-3.5" />}
              label="Kural Motoru"
              value={result.metadata.rules_enabled ? "Aktif (24 kural)" : "Devre dışı"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skor + Radar */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Etik Boyutlar Skor Profili</CardTitle>
            <CardDescription>
              5 boyutta 0-10 skala (yüksek = daha iyi). Kural motoru aktifken ihlal-temelli
              penalty uygulanır.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EthicsRadar scores={result.ethics_scores} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <ScoreBreakdown scores={result.ethics_scores} />
        </div>
      </div>

      {/* Detaylı tabs */}
      <Tabs defaultValue="legal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="legal">Hukuki</TabsTrigger>
          <TabsTrigger value="rules">Kurallar ({result.rule_violations.length})</TabsTrigger>
          <TabsTrigger value="narrative">Anlatı</TabsTrigger>
          <TabsTrigger value="sources">
            Kaynaklar ({result.retrieved_sources.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="legal">
          <LegalCompliancePanel legal={result.legal_compliance} />
        </TabsContent>
        <TabsContent value="rules">
          <RuleViolationsPanel violations={result.rule_violations} />
        </TabsContent>
        <TabsContent value="narrative">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-accent" />
                <CardTitle>Anlatısal Değerlendirme</CardTitle>
              </div>
              <CardDescription>
                LLM tarafından üretilen, kaynak temelli detaylı analiz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="markdown-body max-w-none text-foreground">
                <ReactMarkdown>
                  {result.narrative_assessment || "*Anlatısal değerlendirme bu yanıtta yer almıyor.*"}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sources">
          <SourceCitations chunks={result.retrieved_sources} />
        </TabsContent>
      </Tabs>

      {/* Token meta */}
      {result.metadata.tokens_used && (
        <p className="text-center text-xs text-muted-foreground">
          Token kullanımı — giriş: {result.metadata.tokens_used.input.toLocaleString("tr-TR")}
          {" · "} çıkış: {result.metadata.tokens_used.output.toLocaleString("tr-TR")}
          {" · "} ID:{" "}
          <code className="font-mono">{result.evaluation_id.slice(0, 8)}</code>
        </p>
      )}
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="font-medium leading-tight">{value}</p>
    </div>
  );
}
