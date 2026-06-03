"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { LegalCompliance } from "@/lib/types";
import { riskClassLabel } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Gavel, ScrollText } from "lucide-react";

export function LegalCompliancePanel({ legal }: { legal: LegalCompliance }) {
  const risk = riskClassLabel(legal.eu_ai_act_risk_class);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Gavel className="size-4 text-accent" />
            <CardTitle>Hukuki Çerçeve</CardTitle>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${risk.tone}`}
          >
            AB YZ Yasası · {risk.label}
          </span>
        </div>
        <CardDescription>
          Bu use case için uygulanabilir düzenlemeler ve tespit edilen boşluklar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <section>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <ScrollText className="size-3.5" />
            Uygulanabilir Düzenlemeler
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {legal.applicable_regulations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belirtilmedi.</p>
            ) : (
              legal.applicable_regulations.map((r) => (
                <Badge key={r} variant="secondary" className="font-mono text-xs">
                  {r}
                </Badge>
              ))
            )}
          </div>
        </section>

        <Separator />

        <section>
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {legal.compliance_gaps.length === 0 ? (
              <CheckCircle2 className="size-3.5 text-success" />
            ) : (
              <AlertTriangle className="size-3.5 text-warning" />
            )}
            Uyumluluk Boşlukları
          </h4>
          {legal.compliance_gaps.length === 0 ? (
            <p className="text-sm text-success">Belirgin bir uyumluluk boşluğu tespit edilmedi.</p>
          ) : (
            <ul className="space-y-1.5 text-sm">
              {legal.compliance_gaps.map((g, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-md bg-warning/5 px-3 py-2 leading-relaxed"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
