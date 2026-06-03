"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { EthicsScores } from "@/lib/types";
import { ETHICS_DIMENSIONS } from "@/lib/utils";

interface Props {
  scores: EthicsScores;
}

export function EthicsRadar({ scores }: Props) {
  const data = ETHICS_DIMENSIONS.map((dim) => ({
    dimension: dim.label,
    score: scores[dim.key as keyof EthicsScores].score,
    fullMark: 10,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 12, right: 32, bottom: 12, left: 32 }}>
          <PolarGrid
            stroke="var(--color-cream-300)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{
              fill: "var(--foreground)",
              fontSize: 12,
              fontFamily: "var(--font-serif)",
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            stroke="var(--color-cream-300)"
          />
          <Radar
            name="Etik Skor"
            dataKey="score"
            stroke="var(--color-bakircay-500)"
            fill="var(--color-bakircay-500)"
            fillOpacity={0.32}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            }}
            formatter={(v: number) => [`${v.toFixed(1)} / 10`, "Skor"]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
