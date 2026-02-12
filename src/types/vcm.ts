/**
 * Types for VCM (Volitional Constraint Model) diagnostic analysis.
 * Used for background language pattern detection — never surfaced as VCM labels.
 */

export type VcmGate = "C0" | "C1" | "C2" | "C3" | "C4" | "C5" | "C6A" | "C6B";

export const GATE_NAMES: Record<VcmGate, string> = {
  C0: "Environmental Permeability",
  C1: "Believability",
  C2: "Desire",
  C3: "Will",
  C4: "Intention",
  C5: "Commitment",
  C6A: "Action Initiation",
  C6B: "Action Persistence",
};

/** A single root cause entry from the diagnostic codebook */
export interface CodebookEntry {
  root_cause_id: string;
  gate: VcmGate;
  gate_name: string;
  root_cause_name: string;
  diagnostic_phrases: string[];
  semantic_variants: string[];
}

/** A phrase match found in a transcript */
export interface PhraseMatch {
  root_cause_id: string;
  gate: VcmGate;
  matched_phrase: string;
  source: "diagnostic" | "semantic";
  /** Position in the transcript (character index) */
  position: number;
}

/** Gate-level score from a single session */
export interface GateScore {
  gate: VcmGate;
  gate_name: string;
  match_count: number;
  matched_root_causes: string[];
  matches: PhraseMatch[];
}

/** Complete VCM analysis result for one transcript */
export interface VcmAnalysisResult {
  timestamp: number;
  total_matches: number;
  gate_scores: Record<VcmGate, GateScore>;
  all_matches: PhraseMatch[];
}
