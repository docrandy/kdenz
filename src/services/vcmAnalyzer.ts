/**
 * VCM (Volitional Constraint Model) Transcript Analyzer
 * Scans post-session transcripts for diagnostic phrase matches.
 * Results stored silently — VCM labels are NEVER shown to users.
 */

import type {
  CodebookEntry,
  PhraseMatch,
  GateScore,
  VcmAnalysisResult,
  VcmGate,
} from "../types/vcm";
import { GATE_NAMES } from "../types/vcm";
import codebook from "../../docs/archive/vcm_diagnostic_codebook.json";

const entries = codebook as CodebookEntry[];

const ALL_GATES: VcmGate[] = ["C0", "C1", "C2", "C3", "C4", "C5", "C6A", "C6B"];

/**
 * Analyze a transcript for VCM diagnostic phrase matches.
 * Runs POST-SESSION on the final transcript — not real-time.
 */
export function analyzeTranscript(text: string): VcmAnalysisResult {
  const lower = text.toLowerCase();
  const allMatches: PhraseMatch[] = [];

  for (const entry of entries) {
    // Check diagnostic phrases
    for (const phrase of entry.diagnostic_phrases) {
      const idx = lower.indexOf(phrase.toLowerCase());
      if (idx !== -1) {
        allMatches.push({
          root_cause_id: entry.root_cause_id,
          gate: entry.gate as VcmGate,
          matched_phrase: phrase,
          source: "diagnostic",
          position: idx,
        });
      }
    }

    // Check semantic variants
    for (const variant of entry.semantic_variants) {
      const idx = lower.indexOf(variant.toLowerCase());
      if (idx !== -1) {
        allMatches.push({
          root_cause_id: entry.root_cause_id,
          gate: entry.gate as VcmGate,
          matched_phrase: variant,
          source: "semantic",
          position: idx,
        });
      }
    }
  }

  // Build gate-level scores
  const gateScores = {} as Record<VcmGate, GateScore>;
  for (const gate of ALL_GATES) {
    const gateMatches = allMatches.filter((m) => m.gate === gate);
    const rootCauses = [...new Set(gateMatches.map((m) => m.root_cause_id))];
    gateScores[gate] = {
      gate,
      gate_name: GATE_NAMES[gate],
      match_count: gateMatches.length,
      matched_root_causes: rootCauses,
      matches: gateMatches,
    };
  }

  return {
    timestamp: Date.now(),
    total_matches: allMatches.length,
    gate_scores: gateScores,
    all_matches: allMatches,
  };
}

const VCM_STORAGE_KEY = "voicelab_vcm_analyses";

/** Store VCM analysis result alongside session data (silently) */
export function storeVcmAnalysis(
  sessionTimestamp: number,
  result: VcmAnalysisResult,
): void {
  try {
    const stored = localStorage.getItem(VCM_STORAGE_KEY);
    const analyses: Record<string, VcmAnalysisResult> = stored
      ? JSON.parse(stored)
      : {};
    analyses[String(sessionTimestamp)] = result;

    // Keep only last 30 analyses
    const keys = Object.keys(analyses).sort().reverse();
    if (keys.length > 30) {
      for (const key of keys.slice(30)) {
        delete analyses[key];
      }
    }

    localStorage.setItem(VCM_STORAGE_KEY, JSON.stringify(analyses));
  } catch {
    // Storage unavailable — silently fail
  }
}

/** Retrieve stored VCM analyses */
export function getStoredVcmAnalyses(): Record<string, VcmAnalysisResult> {
  try {
    const stored = localStorage.getItem(VCM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}
