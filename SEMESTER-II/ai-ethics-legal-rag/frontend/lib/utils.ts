import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreColor(score: number): string {
  if (score >= 7.5) return "text-success";
  if (score >= 5) return "text-warning";
  return "text-destructive";
}

export function scoreBg(score: number): string {
  if (score >= 7.5) return "bg-success/10 border-success/30";
  if (score >= 5) return "bg-warning/10 border-warning/30";
  return "bg-destructive/10 border-destructive/30";
}

export function severityColor(severity: "info" | "warning" | "error") {
  switch (severity) {
    case "info":
      return "bg-info/10 text-info border-info/30";
    case "warning":
      return "bg-warning/10 text-warning border-warning/40";
    case "error":
      return "bg-destructive/10 text-destructive border-destructive/40";
  }
}

export function riskClassLabel(rc: string): { label: string; tone: string } {
  switch (rc) {
    case "prohibited":
      return { label: "Yasaklı", tone: "bg-destructive text-destructive-foreground" };
    case "high":
      return { label: "Yüksek Risk", tone: "bg-warning/90 text-ink-950" };
    case "limited":
      return { label: "Sınırlı Risk", tone: "bg-info/90 text-cream-50" };
    case "minimal":
      return { label: "Minimal Risk", tone: "bg-success/90 text-cream-50" };
    default:
      return { label: rc, tone: "bg-muted text-foreground" };
  }
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export const ETHICS_DIMENSIONS = [
  { key: "fairness", label: "Adalet", icon: "scale" },
  { key: "transparency", label: "Şeffaflık", icon: "eye" },
  { key: "accountability", label: "Hesap Verebilirlik", icon: "shield" },
  { key: "privacy", label: "Mahremiyet", icon: "lock" },
  { key: "human_oversight", label: "İnsan Denetimi", icon: "users" },
] as const;
