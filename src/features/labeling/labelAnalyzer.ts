/**
 * Label Analyzer - Core Analysis Logic
 * Evaluates user's labeling attempts for syntax correctness and emotional depth
 * Based on Chris Voss research
 */

import type {
  LabelingScenario,
  SyntaxScore,
  DepthScore,
  LabelAnalysis,
  LabelGrade,
  SpecificityLevel,
} from './types';

// ===== SYNTAX DETECTION CONSTANTS =====

const VALID_OPENERS = [
  'it seems like',
  'it sounds like',
  'it looks like',
  'seems like',
  'sounds like',
  'looks like',
];

// These make it about YOU, not them
const INVALID_I_FRAMES = [
  "i'm hearing",
  'i hear that',
  'i hear you',
  'i think you',
  'i feel like you',
  'i sense that',
  'i understand you',
  'i can tell',
  'i notice',
  'i get the sense',
];

// These are direct and can trigger defensiveness
const INVALID_YOU_FRAMES = [
  'you seem',
  'you sound',
  'you look',
  "you're ",
  'you are ',
  'you feel',
];

// ===== EMOTION/DRIVER CONSTANTS =====

// Surface emotions (weak labels)
const SURFACE_EMOTIONS = [
  'frustrated',
  'angry',
  'upset',
  'annoyed',
  'stressed',
  'worried',
  'nervous',
  'anxious',
  'sad',
  'disappointed',
  'confused',
  'uncertain',
  'hesitant',
  'uncomfortable',
  'concerned',
  'unhappy',
  'irritated',
  'overwhelmed',
];

// Underlying drivers (strong labels)
const UNDERLYING_DRIVERS = [
  'control',
  'precedent',
  'authority',
  'recognition',
  'fairness',
  'respect',
  'autonomy',
  'security',
  'pressure',
  'position',
  'reputation',
  'trust',
  'credibility',
  'competence',
  'belonging',
  'value',
  'appreciated',
  'acknowledged',
  'heard',
  'understood',
  'supported',
  'safe',
  'risk',
  'justify',
  'budget',
  'leadership',
  'team',
  'deadline',
  'expectations',
];

// ===== SYNTAX FEEDBACK MESSAGES =====

const SYNTAX_FEEDBACK = {
  missingOpener:
    'Start with "It seems like..." or "It sounds like..." to create emotional distance.',
  iFraming:
    'Remove "I" from your label. "I\'m hearing" makes it about you, not them.',
  youFraming:
    'Avoid "You seem..." — use "It seems like..." to lower their defensiveness.',
  questionMark:
    'Make it a statement, not a question. Questions trigger cognitive defense.',
  rightQuestion:
    'Drop "...right?" — this seeks validation and weakens the label.',
};

// ===== DEPTH FEEDBACK MESSAGES =====

const DEPTH_FEEDBACK = {
  surfaceOnly:
    'You labeled the surface emotion. Dig deeper — what\'s driving that feeling?',
  generic:
    'Good start. Can you be more specific about what\'s at stake for them?',
  specific:
    'You\'re getting closer. Think about the underlying fear or need.',
  expert:
    'Excellent — you identified the underlying driver, not just the emotion.',
};

// ===== ANALYSIS FUNCTIONS =====

/**
 * Analyze the syntax of a labeling attempt
 */
export function analyzeSyntax(transcript: string): SyntaxScore {
  const lower = transcript.toLowerCase().trim();
  const feedback: string[] = [];

  // Check for valid opener
  const hasCorrectOpener = VALID_OPENERS.some((o) => lower.startsWith(o));
  const openerUsed = VALID_OPENERS.find((o) => lower.startsWith(o)) || null;

  if (!hasCorrectOpener) {
    feedback.push(SYNTAX_FEEDBACK.missingOpener);
  }

  // Check for invalid "I" framing
  const avoidsIFraming = !INVALID_I_FRAMES.some((f) => lower.includes(f));
  if (!avoidsIFraming) {
    feedback.push(SYNTAX_FEEDBACK.iFraming);
  }

  // Check for invalid "You" framing
  const avoidsYouFraming = !INVALID_YOU_FRAMES.some((f) => lower.startsWith(f));
  if (!avoidsYouFraming) {
    feedback.push(SYNTAX_FEEDBACK.youFraming);
  }

  // Check if ends with question
  const hasQuestionMark = lower.endsWith('?');
  const hasRightQuestion = lower.includes('right?') || lower.includes(', right');
  const isStatement = !hasQuestionMark && !hasRightQuestion;

  if (hasQuestionMark) {
    feedback.push(SYNTAX_FEEDBACK.questionMark);
  }
  if (hasRightQuestion) {
    feedback.push(SYNTAX_FEEDBACK.rightQuestion);
  }

  // Calculate syntax points (max 40)
  let syntaxPoints = 0;
  if (hasCorrectOpener) syntaxPoints += 15;
  if (avoidsIFraming) syntaxPoints += 10;
  if (avoidsYouFraming) syntaxPoints += 5;
  if (isStatement) syntaxPoints += 10;

  return {
    hasCorrectOpener,
    openerUsed,
    avoidsIFraming,
    avoidsYouFraming,
    isStatement,
    syntaxPoints,
    syntaxFeedback: feedback,
  };
}

/**
 * Analyze the emotional depth of a labeling attempt
 */
export function analyzeDepth(
  transcript: string,
  _scenario: LabelingScenario
): DepthScore {
  const lower = transcript.toLowerCase();
  const feedback: string[] = [];

  // Extract what emotions/drivers were labeled
  const surfaceMatches = SURFACE_EMOTIONS.filter((e) => lower.includes(e));
  const driverMatches = UNDERLYING_DRIVERS.filter((d) => lower.includes(d));

  const hasSurface = surfaceMatches.length > 0;
  const hasDriver = driverMatches.length > 0;

  // Determine what they labeled (primary match)
  let emotionLabeled: string | null = null;
  if (driverMatches.length > 0) {
    emotionLabeled = driverMatches[0];
  } else if (surfaceMatches.length > 0) {
    emotionLabeled = surfaceMatches[0];
  }

  // Determine specificity level
  let specificity: SpecificityLevel = 'generic';
  let depthPoints = 0;

  if (hasDriver && !hasSurface) {
    // Pure driver focus = highly specific
    specificity = 'highly-specific';
    depthPoints = 60;
    feedback.push(DEPTH_FEEDBACK.expert);
  } else if (hasDriver && hasSurface) {
    // Both = specific
    specificity = 'specific';
    depthPoints = 45;
    feedback.push(DEPTH_FEEDBACK.specific);
  } else if (hasSurface) {
    // Only surface = generic
    specificity = 'generic';
    depthPoints = 25;
    feedback.push(DEPTH_FEEDBACK.surfaceOnly);
  } else {
    // Nothing detected
    specificity = 'generic';
    depthPoints = 10;
    feedback.push(DEPTH_FEEDBACK.generic);
  }

  return {
    targetsSurfaceEmotion: hasSurface && !hasDriver,
    targetsUnderlyingDriver: hasDriver,
    emotionLabeled,
    specificity,
    depthPoints,
    depthFeedback: feedback,
  };
}

/**
 * Calculate overall grade based on score
 */
function calculateGrade(score: number): LabelGrade {
  if (score >= 85) return 'expert';
  if (score >= 65) return 'proficient';
  if (score >= 40) return 'developing';
  return 'novice';
}

/**
 * Full analysis of a labeling attempt
 */
export function analyzeLabel(
  transcript: string,
  scenario: LabelingScenario
): LabelAnalysis {
  const syntax = analyzeSyntax(transcript);
  const depth = analyzeDepth(transcript, scenario);

  const overallScore = syntax.syntaxPoints + depth.depthPoints;
  const grade = calculateGrade(overallScore);

  // Combine all feedback
  const allFeedback = [...syntax.syntaxFeedback, ...depth.depthFeedback];

  return {
    syntax,
    depth,
    overallScore,
    grade,
    allFeedback,
    expertExample: scenario.expertLabel,
  };
}

/**
 * Calculate Type-Token Ratio for vocabulary diversity
 * Lower = more repetitive, Higher = more diverse
 */
export function calculateTTR(texts: string[]): number {
  const allWords = texts
    .join(' ')
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);

  if (allWords.length === 0) return 0;

  const uniqueWords = new Set(allWords);
  return uniqueWords.size / allWords.length;
}

/**
 * Detect repetitive templates in label attempts
 */
export function detectRepetitiveTemplates(
  transcripts: string[]
): { template: string; count: number }[] {
  // Normalize and extract label patterns
  const patterns = transcripts.map((t) => {
    return t
      .toLowerCase()
      .replace(/[.,!?]/g, '')
      .trim();
  });

  // Count occurrences of similar patterns
  const counts = new Map<string, number>();
  for (const pattern of patterns) {
    // Get first 5 words as template signature
    const words = pattern.split(/\s+/).slice(0, 5).join(' ');
    counts.set(words, (counts.get(words) || 0) + 1);
  }

  // Return patterns used more than once
  return Array.from(counts.entries())
    .filter(([_, count]) => count > 1)
    .map(([template, count]) => ({ template, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Extract unique emotion/driver vocabulary from transcripts
 */
export function extractEmotionVocabulary(transcripts: string[]): string[] {
  const allText = transcripts.join(' ').toLowerCase();
  const vocabulary = new Set<string>();

  for (const emotion of SURFACE_EMOTIONS) {
    if (allText.includes(emotion)) {
      vocabulary.add(emotion);
    }
  }

  for (const driver of UNDERLYING_DRIVERS) {
    if (allText.includes(driver)) {
      vocabulary.add(driver);
    }
  }

  return Array.from(vocabulary);
}
