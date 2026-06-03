"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { RuleViolation } from "@/lib/types";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";

interface Props {
  violations: RuleViolation[];
}

export function RuleViolationsPanel({ violations }: Props) {
  if (violations.length === 0) {
    return (
      <Alert variant="success">
        <CheckCircle2 className="size-4" />
        <AlertTitle>Kural ihlali tespit edilmedi</AlertTitle>
        <AlertDescription>
          Kural motoru bu use case için herhangi bir uyarı veya hata üretmedi.
        </AlertDescription>
      </Alert>
    );
  }

  const errors = violations.filter((v) => v.severity === "error");
  const warnings = violations.filter((v) => v.severity === "warning");
  const infos = violations.filter((v) => v.severity === "info");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-accent" />
            <CardTitle>Kural Motoru Bulguları</CardTitle>
          </div>
          <div className="flex gap-1.5">
            {errors.length > 0 && (
              <Badge variant="destructive">{errors.length} hata</Badge>
            )}
            {warnings.length > 0 && (
              <Badge variant="warning">{warnings.length} uyarı</Badge>
            )}
            {infos.length > 0 && <Badge variant="info">{infos.length} bilgi</Badge>}
          </div>
        </div>
        <CardDescription>
          24 kuraldan oluşan motorun tespit ettiği etik/hukuki sinyaller.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {violations.map((v) => {
          const Icon =
            v.severity === "error"
              ? AlertCircle
              : v.severity === "warning"
                ? AlertTriangle
                : Info;
          const variant =
            v.severity === "error" ? "destructive" : v.severity === "warning" ? "warning" : "info";

          return (
            <Alert key={v.rule_id + v.message} variant={variant as "destructive" | "warning" | "info"}>
              <Icon className="size-4" />
              <AlertTitle className="flex items-center gap-2 text-sm">
                <code className="rounded bg-background/60 px-1.5 py-0.5 text-[10px] font-medium">
                  {v.rule_id}
                </code>
                <span>{v.rule_name}</span>
                {v.affected_dimension && (
                  <Badge variant="outline" className="ml-auto text-[10px]">
                    {v.affected_dimension}
                  </Badge>
                )}
              </AlertTitle>
              <AlertDescription className="text-sm leading-relaxed">{v.message}</AlertDescription>
            </Alert>
          );
        })}
      </CardContent>
    </Card>
  );
}
