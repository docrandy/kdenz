/**
 * Audit Analyzer - Core Analysis Logic
 * Evaluates user's accusation audit attempts for coverage, delivery, and structure
 * Returns affect-based feedback (emotional impact on counterpart)
 * Based on Chris Voss research
 */

import type {
  AuditScenario,
  CoverageScore,
  DeliveryScore,
  StructureScore,
  AuditAnalysis,
  AuditGrade,
  AffectLevel,
  AffectResult,
} from './types';
import { AUDIT_AFFECT_FEEDBACK } from './types';

// ===== COVERAGE DETECTION =====

/**
 * Check which criticisms were covered in the transcript
 */
export function analyzeCoverage(
  transcript: string,
  scenario: AuditScenario
): CoverageScore {
  const lower = transcript.toLowerCase();
  const feedback: string[] = [];
  const covered: string[] = [];
  const missed: string[] = [];

  for (const criticism of scenario.commonCriticisms) {
    // Check if any keyword from this criticism appears
    const found = criticism.keywords.some(kw => lower.includes(kw.toLowerCase()));

    if (found) {
      covered.push(criticism.id);
    } else {
      missed.push(criticism.id);
    }
  }

  // Check if critical criticisms were covered
  const criticalOnes = scenario.commonCriticisms.filter(c => c.importance === 'critical');
  const coveredCritical = criticalOnes.every(c => covered.includes(c.id));

  // Calculate coverage percentage (weighted by importance)
  let totalWeight = 0;
  let coveredWeight = 0;
  for (const criticism of scenario.commonCriticisms) {
    const weight = criticism.importance === 'critical' ? 3 :
                   criticism.importance === 'common' ? 2 : 1;
    totalWeight += weight;
    if (covered.includes(criticism.id)) {
      coveredWeight += weight;
    }
  }
  const coveragePercent = Math.round((coveredWeight / totalWeight) * 100);

  // Generate feedback
  if (missed.length > 0) {
    const missedCritical = scenario.commonCriticisms
      .filter(c => missed.includes(c.id) && c.importance === 'critical');

    if (missedCritical.length > 0) {
      feedback.push(`You missed a critical concern: "${missedCritical[0].text}". They're definitely thinking this.`);
    } else if (coveragePercent < 50) {
      feedback.push(`You only addressed ${coveragePercent}% of likely concerns. Cast a wider net.`);
    }
  }

  if (coveragePercent >= 80) {
    feedback.push("Strong coverage - you anticipated most of what they might think.");
  } else if (coveragePercent >= 60 && coveredCritical) {
    feedback.push("Good coverage of the critical concerns.");
  }

  // Calculate points (max 40)
  let coveragePoints = Math.round(coveragePercent * 0.3); // Up to 30
  if (coveredCritical) coveragePoints += 10;
  coveragePoints = Math.min(40, coveragePoints);

  return {
    criticismsCovered: covered,
    criticismsMissed: missed,
    coveragePercent,
    coveredCritical,
    coveragePoints,
    coverageFeedback: feedback,
  };
}

// ===== DELIVERY DETECTION =====

// Defensive markers (bad - shows you're explaining/justifying)
const DEFENSIVE_MARKERS = [
  'but the thing is',
  'but actually',
  'but really',
  'let me explain',
  'the reason is',
  "it's just that",
  'to be fair',
  'in my defense',
  'what happened was',
  'you have to understand',
];

// First person audit phrases (good - owning the perception)
const FIRST_PERSON_AUDIT = [
  "i might seem",
  "i might look like",
  "i might come across",
  "this might look like i'm",
  "this might seem like i'm",
  "i know this might make me look",
  "i know this might seem",
  "i realize this might look",
  "i understand this might seem",
  "you might think i'm",
  "you might be thinking i'm",
  "i could come across as",
];

// Acknowledgment phrases (good - showing empathy)
const ACKNOWLEDGMENT_PHRASES = [
  "i understand",
  "i get why",
  "i can see why",
  "i know that",
  "that would be concerning",
  "that's a fair concern",
  "that makes sense",
  "i appreciate that",
  "i realize that",
];

/**
 * Analyze the delivery of the audit
 */
export function analyzeDelivery(transcript: string): DeliveryScore {
  const lower = transcript.toLowerCase();
  const feedback: string[] = [];

  // Check for first person framing (good)
  const usesFirstPerson = FIRST_PERSON_AUDIT.some(p => lower.includes(p));

  // Check for defensive markers (bad)
  const defensiveFound = DEFENSIVE_MARKERS.find(m => lower.includes(m));
  const avoidsDefense = !defensiveFound;

  if (!avoidsDefense && defensiveFound) {
    feedback.push(`You slipped into defense mode with '${defensiveFound}'. Just name it, don't explain it.`);
  }

  if (!usesFirstPerson) {
    feedback.push(`Use 'I might seem...' not 'You might think...'. Own it in first person.`);
  }

  // Check for acknowledgment
  const acknowledgesImpact = ACKNOWLEDGMENT_PHRASES.some(p => lower.includes(p));

  if (!acknowledgesImpact) {
    feedback.push(`Add 'I understand why that would be concerning' to show empathy.`);
  }

  // Check for multiple points
  const commaCount = (lower.match(/,/g) || []).length;
  const andCount = (lower.match(/ and /g) || []).length;
  const multiplePoints = commaCount >= 2 || andCount >= 1 || lower.split(/[,.]/).length >= 3;

  if (!multiplePoints) {
    feedback.push("List multiple concerns - an audit should surface everything upfront.");
  }

  // Determine tone
  let appropriateTone: 'defensive' | 'neutral' | 'empathetic' = 'neutral';
  if (!avoidsDefense) {
    appropriateTone = 'defensive';
  } else if (acknowledgesImpact && usesFirstPerson) {
    appropriateTone = 'empathetic';
    feedback.push("Clean delivery - you named concerns without defending yourself.");
  }

  // Calculate points (max 35)
  let deliveryPoints = 0;
  if (usesFirstPerson) deliveryPoints += 10;
  if (avoidsDefense) deliveryPoints += 10;
  if (acknowledgesImpact) deliveryPoints += 10;
  if (multiplePoints) deliveryPoints += 5;

  return {
    usesFirstPerson,
    avoidsDefense,
    acknowledgesImpact,
    multiplePoints,
    appropriateTone,
    deliveryPoints,
    deliveryFeedback: feedback,
  };
}

// ===== STRUCTURE DETECTION =====

// Opener phrases (good)
const OPENER_PHRASES = [
  "i know this might",
  "i realize this might",
  "this might look like",
  "this might seem like",
  "i'm sure it seems like",
  "you might be thinking",
  "i know it might look like",
  "i understand this might",
  "before we start",
  "before i begin",
];

/**
 * Analyze the structure of the audit
 */
export function analyzeStructure(transcript: string): StructureScore {
  const lower = transcript.toLowerCase();
  const feedback: string[] = [];
  const wordCount = lower.split(/\s+/).length;

  // Check for opener
  const hasOpener = OPENER_PHRASES.some(p =>
    lower.startsWith(p) || lower.indexOf(p) < 30
  );

  if (!hasOpener) {
    feedback.push("Start with 'I know this might...' to signal you're aware of perceptions.");
  }

  // Check for multiple criticisms (structure)
  const segments = lower.split(/,| and /).filter(s => s.trim().length > 5);
  const listsMultiple = segments.length >= 2;

  // Check for acknowledgment at end
  const hasAcknowledgment = ACKNOWLEDGMENT_PHRASES.some(p => lower.includes(p));

  // Check appropriate length (not too short, not too long)
  let appropriateLength = true;
  if (wordCount < 15) {
    feedback.push("Your audit was too brief. Surface more of their potential concerns.");
    appropriateLength = false;
  } else if (wordCount > 100) {
    feedback.push("Shorter is better. List concerns, acknowledge, then silence.");
    appropriateLength = false;
  }

  if (hasOpener && listsMultiple && hasAcknowledgment) {
    feedback.push("Good structure - opener, multiple concerns, acknowledgment.");
  }

  // Calculate points (max 25)
  let structurePoints = 0;
  if (hasOpener) structurePoints += 10;
  if (listsMultiple) structurePoints += 5;
  if (hasAcknowledgment) structurePoints += 5;
  if (appropriateLength) structurePoints += 5;

  return {
    hasOpener,
    listsMultiple,
    hasAcknowledgment,
    appropriateLength,
    structurePoints,
    structureFeedback: feedback,
  };
}

// ===== AFFECT CALCULATION =====

/**
 * Calculate affect level based on audit quality
 * Maps internal scoring to observable emotional impact
 */
function calculateAffect(
  coverage: CoverageScore,
  delivery: DeliveryScore,
  structure: StructureScore,
  scenario: AuditScenario
): AffectResult {
  const score = coverage.coveragePoints + delivery.deliveryPoints + structure.structurePoints;

  // Determine affect level based on multiple factors
  let level: AffectLevel;
  let patternToExplore: string | undefined;

  if (score >= 85 && coverage.coveredCritical && delivery.appropriateTone === 'empathetic') {
    // Comprehensive: addressed critical concerns with empathy
    level = 'deeply_connected';
    patternToExplore = undefined; // No improvement needed at this level
  } else if (score >= 65 && coverage.coveredCritical && delivery.avoidsDefense) {
    // Complete: hit critical concerns, didn't get defensive
    level = 'understood';
    if (!delivery.acknowledgesImpact) {
      patternToExplore = "Try adding 'I understand why that would be concerning' to show empathy";
    } else if (coverage.coveragePercent < 80) {
      patternToExplore = "Cast a wider net - surface more of their potential concerns";
    }
  } else if (score >= 40 && (coverage.coveragePercent >= 50 || delivery.usesFirstPerson)) {
    // Partial: some concerns addressed or good delivery
    level = 'acknowledged';
    if (!coverage.coveredCritical) {
      const missedCritical = scenario.commonCriticisms
        .filter(c => c.importance === 'critical' && coverage.criticismsMissed.includes(c.id))
        .map(c => c.inTheirVoice)[0];
      if (missedCritical) {
        patternToExplore = `Address: "${missedCritical}"`;
      }
    } else if (!delivery.usesFirstPerson) {
      patternToExplore = "Start with 'I might seem like...' to own the perception";
    }
  } else {
    // Incomplete: concerns not adequately addressed
    level = 'guarded';
    if (delivery.appropriateTone === 'defensive') {
      patternToExplore = "Name concerns without explaining or justifying";
    } else if (coverage.coveragePercent < 30) {
      patternToExplore = "Surface more of what they might be thinking about you";
    } else {
      patternToExplore = "Use 'I might seem like...' to own the perception in first person";
    }
  }

  const feedback = AUDIT_AFFECT_FEEDBACK[level];

  return {
    level,
    description: feedback.description,
    observableIndicator: feedback.indicator,
    patternToExplore,
  };
}

// ===== OVERALL ANALYSIS =====

/**
 * Calculate overall grade based on score (internal use)
 */
function calculateGrade(score: number): AuditGrade {
  if (score >= 85) return 'expert';
  if (score >= 65) return 'proficient';
  if (score >= 40) return 'developing';
  return 'novice';
}

/**
 * Generate expert example for this scenario
 */
function generateExpertExample(scenario: AuditScenario): string {
  const criticisms = scenario.commonCriticisms
    .filter(c => c.importance !== 'minor')
    .slice(0, 3)
    .map(c => c.inTheirVoice);

  return `"I know this might seem like ${criticisms[0]}, ${criticisms.slice(1).join(', ')}. I get why that would be concerning."`;
}

/**
 * Full analysis of an accusation audit attempt
 */
export function analyzeAudit(
  transcript: string,
  scenario: AuditScenario
): AuditAnalysis {
  const coverage = analyzeCoverage(transcript, scenario);
  const delivery = analyzeDelivery(transcript);
  const structure = analyzeStructure(transcript);

  const overallScore = Math.min(100,
    coverage.coveragePoints +
    delivery.deliveryPoints +
    structure.structurePoints
  );
  const grade = calculateGrade(overallScore);

  // Calculate affect (the primary feedback shown to user)
  const affect = calculateAffect(coverage, delivery, structure, scenario);

  // Combine all feedback (remove duplicates)
  const allFeedback = [
    ...coverage.coverageFeedback,
    ...delivery.deliveryFeedback,
    ...structure.structureFeedback,
  ].filter((f, i, arr) => arr.indexOf(f) === i);

  // Get missed opportunities (critical and common that were missed)
  const missedOpportunities = scenario.commonCriticisms
    .filter(c =>
      coverage.criticismsMissed.includes(c.id) &&
      c.importance !== 'minor'
    )
    .map(c => c.text);

  return {
    affect,
    coverage,
    delivery,
    structure,
    overallScore,
    grade,
    allFeedback,
    missedOpportunities,
    expertExample: generateExpertExample(scenario),
  };
}

/**
 * Detect defensive language patterns for pattern tracking
 */
export function detectDefensivePhrases(transcripts: string[]): string[] {
  const allDefensive: string[] = [];

  for (const t of transcripts) {
    const lower = t.toLowerCase();
    for (const marker of DEFENSIVE_MARKERS) {
      if (lower.includes(marker) && !allDefensive.includes(marker)) {
        allDefensive.push(marker);
      }
    }
  }

  return allDefensive;
}
