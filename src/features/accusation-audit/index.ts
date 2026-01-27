/**
 * Accusation Audit Practice Module
 * Based on Chris Voss accusation audit technique
 */

export { AccusationAuditPractice } from './AccusationAuditPractice';
export { useAuditSession } from './useAuditSession';
export { analyzeAudit } from './auditAnalyzer';
export { getAuditPatterns, saveAuditAttempt, clearAuditData } from './auditStorage';
export { AUDIT_SCENARIOS, getRandomScenario, getScenarioById } from './scenarios';

export type {
  AuditScenario,
  AuditAttempt,
  AuditAnalysis,
  AuditPatterns,
  AuditSessionData,
  AIResponse,
  CoverageScore,
  DeliveryScore,
  StructureScore,
} from './types';
