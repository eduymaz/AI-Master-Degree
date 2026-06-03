"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { EthicsScores } from "@/lib/types";
import { ETHICS_DIMENSIONS, cn, scoreColor } from "@/lib/utils";
import { Eye, Lock, Scale, Shield, Users } from "lucide-react";

const icons = {
  scale: Scale,
  eye: Eye,
  shield: Shield,
  lock: Lock,
  users: Users,
} as const;

export function ScoreBreakdown({ scores }: { scores: EthicsScores }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1">
      {ETHICS_DIMENSIONS.map((dim) => {
        const detail = scores[dim.key as keyof EthicsScores];
        const Icon = icons[dim.icon as keyof typeof icons];
        return (
          <Card key={dim.key} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-accent/10 p-1.5 text-accent">
                    <Icon className="size-4" />
                  </div>
                  <CardTitle className="text-base">{dim.label}</CardTitle>
                </div>
                <span
                  className={cn(
                    "font-serif text-xl font-semibold tabular-nums",
                    scoreColor(detail.score)
                  )}
                >
                  {detail.score.toFixed(1)}
                  <span className="text-sm text-muted-foreground">/10</span>
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              <Progress value={detail.score * 10} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {detail.rationale}
              </p>
              {detail.sources.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {detail.sources.slice(0, 3).map((s) => (
                    <Badge key={s} variant="outline" className="font-mono text-[10px]">
                      {s}
                    </Badge>
                  ))}
                  {detail.sources.length > 3 && (
                    <Badge variant="outline" className="text-[10px]">
                      +{detail.sources.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
