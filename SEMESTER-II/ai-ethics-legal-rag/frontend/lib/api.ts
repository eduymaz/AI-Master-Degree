import type {
  EvaluationRequest,
  EvaluationResponse,
  PresetUseCaseEntry,
  RuleDefinition,
  SourceMetadata,
  UseCase,
} from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  evaluate: (req: EvaluationRequest) =>
    http<EvaluationResponse>("/api/evaluate", {
      method: "POST",
      body: JSON.stringify(req),
    }),

  listUseCases: () =>
    http<{ use_cases: PresetUseCaseEntry[] }>("/api/use-cases"),

  getUseCase: (id: string) => http<UseCase>(`/api/use-cases/${id}`),

  listRules: () =>
    http<{ metadata: Record<string, unknown>; rules: RuleDefinition[] }>("/api/rules"),

  listSources: () =>
    http<{ total: number; sources: SourceMetadata[] }>("/api/sources"),

  getSource: (id: string) =>
    http<{ metadata: SourceMetadata; body: string }>(`/api/sources/${id}`),

  health: () => http<{ status: string }>("/api/health"),
};
