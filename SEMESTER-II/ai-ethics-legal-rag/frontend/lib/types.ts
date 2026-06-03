/**
 * Backend Pydantic şemalarının TypeScript karşılıkları.
 * Manuel senkron tutuyoruz — geliştirme aşamasında basit, küçük yüzey.
 */

export type HealthcareArea =
  | "radiology"
  | "clinical_decision_support"
  | "data_governance"
  | "drug_discovery"
  | "patient_facing"
  | "other";

export type RiskClass = "prohibited" | "high" | "limited" | "minimal";
export type Severity = "info" | "warning" | "error";
export type LLMProvider = "groq" | "claude" | "ollama";

export interface UseCase {
  title: string;
  area: HealthcareArea;
  description: string;
  data_sources?: string[];
  affected_stakeholders?: string[];
  technical_architecture?: string | null;
  jurisdiction?: string[];
}

export interface EvaluationRequest {
  use_case: UseCase;
  llm_provider?: LLMProvider;
  rules_enabled?: boolean;
  retrieval_top_k?: number;
  include_narrative?: boolean;
}

export interface EthicsScoreDetail {
  score: number;
  rationale: string;
  sources: string[];
}

export interface EthicsScores {
  fairness: EthicsScoreDetail;
  transparency: EthicsScoreDetail;
  accountability: EthicsScoreDetail;
  privacy: EthicsScoreDetail;
  human_oversight: EthicsScoreDetail;
}

export interface LegalCompliance {
  eu_ai_act_risk_class: RiskClass;
  applicable_regulations: string[];
  compliance_gaps: string[];
  sources: string[];
}

export interface RuleViolation {
  rule_id: string;
  rule_name: string;
  severity: Severity;
  message: string;
  affected_dimension?: string | null;
}

export interface RetrievedChunk {
  doc_id: string;
  chunk_id: string;
  title: string;
  authority: string;
  jurisdiction: string;
  text: string;
  similarity_score: number;
  bm25_score: number;
  fused_score: number;
}

export interface EvaluationMetadata {
  llm_provider: string;
  model_version: string;
  retrieval_top_k: number;
  rules_enabled: boolean;
  duration_ms: number;
  tokens_used?: { input: number; output: number };
  timestamp: string;
}

export interface EvaluationResponse {
  evaluation_id: string;
  use_case_summary: string;
  ethics_scores: EthicsScores;
  legal_compliance: LegalCompliance;
  rule_violations: RuleViolation[];
  narrative_assessment: string;
  retrieved_sources: RetrievedChunk[];
  metadata: EvaluationMetadata;
}

export interface PresetUseCaseEntry {
  id: string;
  title: string;
  area: HealthcareArea;
  jurisdiction: string[];
}

export interface SourceMetadata {
  doc_id: string;
  title: string;
  authority: string;
  jurisdiction: string;
  category: string;
  publication_date: string;
  source_url?: string;
}

export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  affected_dimension?: string | null;
  score_penalty?: number;
}
