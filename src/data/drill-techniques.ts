/**
 * src/data/drill-techniques.ts
 *
 * Authoritative source of truth for all 8 Tier A techniques in the v3.0
 * Generic Drill Engine. Each technique includes complete syntax_rules so the
 * Phase 20 scoring engine can evaluate form automatically via regex/negation/
 * inclusion pattern matching.
 *
 * Technique IDs: 'mirroring', 'labeling', 'open-ended-question', 'i-statement',
 *                'no-oriented-question', 'nvc-observation', 'nvc-feeling', 'accusation-audit'
 *
 * NOTE: 'accusation-audit' maps to what the 8 Tier A list calls "Contrasting".
 * The id uses the existing feature module name because Accusation Audit IS
 * the Voss implementation of the Contrasting mechanic.
 */

import { Technique } from "../types/drill";

// ---------------------------------------------------------------------------
// Technique definitions
// ---------------------------------------------------------------------------

export const drillTechniques: Record<string, Technique> = {
  // -------------------------------------------------------------------------
  // 1. Mirroring (Voss)
  // -------------------------------------------------------------------------
  mirroring: {
    id: "mirroring",
    name: "Mirroring",
    description:
      "Repeat the last 1-3 words of what someone said, with a downward inflection. " +
      "Creates connection, invites elaboration, and surfaces hidden information without " +
      "asking a direct question.",
    framework: "Voss",
    tier: "A",
    skill_type: "syntax",
    primary_format: "prompt-response",
    supported_formats: ["prompt-response", "audio-spoken", "multiple-choice"],
    syntax_template: "Back of [last 1-3 words]",
    syntax_rules: [
      {
        id: "stem-match",
        type: "regex",
        pattern: "^(Back of|back of)\\s+\\S",
        examples: [
          "Back of not sure what to do.",
          "Back of feels like too much.",
        ],
        weight: 1.0,
      },
      {
        id: "no-question-mark",
        type: "negation",
        pattern: "\\?$",
        examples: [
          "Back of confused? (wrong — statement form, no question mark)",
          "Back of uncertain? (wrong)",
        ],
        weight: 1.0,
      },
    ],
    prerequisites: [],
    difficulty: 1,
  },

  // -------------------------------------------------------------------------
  // 2. Labeling (Voss)
  // -------------------------------------------------------------------------
  labeling: {
    id: "labeling",
    name: "Labeling",
    description:
      "Name what you observe in the other person's emotional state using the " +
      "'It seems/sounds/looks like...' stem. Subject is always 'it', never 'I' or 'you'. " +
      "Statement form, not a question.",
    framework: "Voss",
    tier: "A",
    skill_type: "syntax",
    primary_format: "prompt-response",
    supported_formats: [
      "prompt-response",
      "audio-spoken",
      "rewrite",
      "multiple-choice",
    ],
    syntax_template: "It seems/sounds/looks like [observation].",
    syntax_rules: [
      {
        id: "opener-match",
        type: "regex",
        pattern:
          "^(It seems like|It sounds like|It looks like|it seems like|it sounds like|it looks like)",
        examples: [
          "It seems like this is putting you in a tough spot.",
          "It sounds like you have a lot riding on this.",
          "It looks like something just shifted for you.",
        ],
        weight: 1.0,
      },
      {
        id: "no-i-frame",
        type: "negation",
        pattern:
          "^(I('m| am) (hearing|sensing|feeling|getting|noticing)|I think|I feel like)",
        examples: [
          "I'm hearing that you're frustrated. (wrong — use 'It sounds like')",
          "I think you seem concerned. (wrong)",
        ],
        weight: 1.0,
      },
      {
        id: "no-you-frame",
        type: "negation",
        pattern: "^You (seem|are|look|sound|appear)",
        examples: [
          "You seem upset. (wrong — direct accusation)",
          "You look frustrated. (wrong)",
        ],
        weight: 1.0,
      },
      {
        id: "no-question-mark",
        type: "negation",
        pattern: "\\?$",
        examples: [
          'It seems like you are hesitant, right? (wrong — "right?" breaks statement form)',
          "It seems like you're upset? (wrong)",
        ],
        weight: 1.0,
      },
    ],
    prerequisites: [],
    difficulty: 1,
  },

  // -------------------------------------------------------------------------
  // 3. Open-Ended Questions (MI)
  // -------------------------------------------------------------------------
  "open-ended-question": {
    id: "open-ended-question",
    name: "Open-Ended Questions",
    description:
      "Ask questions that cannot be answered with yes or no. Begin with 'What', 'How', " +
      "'Why', 'When', 'Where', or 'Tell me'. Open questions invite elaboration and give " +
      "the counterpart autonomy.",
    framework: "MI",
    tier: "A",
    skill_type: "syntax",
    primary_format: "prompt-response",
    supported_formats: ["prompt-response", "multiple-choice", "rewrite"],
    syntax_template: "What/How/Why/Tell me [open question]?",
    syntax_rules: [
      {
        id: "open-stem",
        type: "inclusion",
        pattern: "^(what|how|why|when|where|tell me|help me understand)",
        examples: [
          "What would make this work for you?",
          "How do you see this playing out?",
          "Tell me more about what concerns you.",
        ],
        weight: 1.0,
      },
      {
        id: "no-closed-stem",
        type: "negation",
        pattern:
          "^(will|did|do|can|would|should|is|are|have|has|was|were|could)",
        examples: [
          "Will you accept the offer? (wrong — yes/no question)",
          "Did you consider the timeline? (wrong — closed)",
          "Can we move forward? (wrong)",
        ],
        weight: 1.0,
      },
    ],
    prerequisites: [],
    difficulty: 1,
  },

  // -------------------------------------------------------------------------
  // 4. I-Statements (CBT)
  // -------------------------------------------------------------------------
  "i-statement": {
    id: "i-statement",
    name: "I-Statements",
    description:
      "Express your own feelings without blaming the other person. Formula: " +
      "'I feel [emotion] when [specific behavior] because [impact on you].' " +
      "Avoids 'you always/never' accusations that trigger defensiveness.",
    framework: "CBT",
    tier: "A",
    skill_type: "syntax",
    primary_format: "prompt-response",
    supported_formats: ["prompt-response", "rewrite", "multiple-choice"],
    syntax_template: "I feel [emotion] when [behavior] because [impact].",
    syntax_rules: [
      {
        id: "i-feel-stem",
        type: "regex",
        pattern: "^I feel\\s+",
        examples: [
          "I feel overlooked when my input is skipped in meetings.",
          "I feel anxious when deadlines shift without notice because I lose my planning anchors.",
        ],
        weight: 0.8,
      },
      {
        id: "no-you-accusation",
        type: "negation",
        pattern: "^You (always|never|keep|constantly|make me)",
        examples: [
          "You always ignore my suggestions. (wrong — accusation, not I-statement)",
          "You never listen. (wrong — triggers defensiveness)",
        ],
        weight: 1.0,
      },
      {
        id: "has-when-or-because",
        type: "inclusion",
        pattern: "(when|because)",
        examples: [
          "I feel frustrated when meetings run long because I lose my afternoon focus time.",
          "I feel excluded when decisions are made without my input.",
        ],
        weight: 0.8,
      },
    ],
    prerequisites: [],
    difficulty: 1,
  },

  // -------------------------------------------------------------------------
  // 5. No-Oriented Questions (Voss)
  // -------------------------------------------------------------------------
  "no-oriented-question": {
    id: "no-oriented-question",
    name: "No-Oriented Questions",
    description:
      "Frame questions so the desired answer is 'No', which people can say more freely " +
      "than 'Yes'. People feel safe saying No; it gives them a sense of control. " +
      "Use stems like 'Would it be ridiculous to...', 'Have you given up on...', " +
      "'Is it a bad idea to...'.",
    framework: "Voss",
    tier: "A",
    skill_type: "syntax",
    primary_format: "prompt-response",
    supported_formats: ["prompt-response", "multiple-choice", "rewrite"],
    syntax_template: "Would it be ridiculous to...? / Have you given up on...?",
    syntax_rules: [
      {
        id: "no-oriented-stem",
        type: "regex",
        pattern:
          "^(Would it be ridiculous|Have you given up on|Is it a bad idea|Is it too crazy|Would you be against|Would it be out of the question)",
        examples: [
          "Would it be ridiculous to explore a phased timeline?",
          "Have you given up on finding a solution that works for both sides?",
          "Is it a bad idea to revisit the terms next quarter?",
        ],
        weight: 1.0,
      },
      {
        id: "no-yes-framing",
        type: "negation",
        pattern:
          "^(Would you like|Do you want|Can you|Are you willing|Will you)",
        examples: [
          "Would you like to reconsider? (wrong — yes-oriented, easier to deflect)",
          "Are you willing to look at other options? (wrong — yes-oriented)",
        ],
        weight: 1.0,
      },
    ],
    prerequisites: ["labeling"],
    difficulty: 2,
  },

  // -------------------------------------------------------------------------
  // 6. NVC Observation (NVC)
  // -------------------------------------------------------------------------
  "nvc-observation": {
    id: "nvc-observation",
    name: "NVC Observation",
    description:
      "State only what you can directly observe — no interpretation, evaluation, or " +
      "judgment. NVC observations separate facts from stories. 'You were late' is " +
      "evaluation; 'The meeting started at 9 and you arrived at 9:15' is observation.",
    framework: "NVC",
    tier: "A",
    skill_type: "syntax",
    primary_format: "prompt-response",
    supported_formats: ["prompt-response", "rewrite", "spot-the-technique"],
    syntax_template: "When I see/hear/notice [specific observable fact]...",
    syntax_rules: [
      {
        id: "observation-stem",
        type: "regex",
        pattern:
          "^(When I (see|hear|notice|observe|read)|When you (said|wrote|did|arrived|left)|In the last|Over the past|On [A-Z])",
        examples: [
          "When I notice the report has been in draft for three days...",
          "When you said the deadline was flexible...",
          "Over the past two weeks, I have noticed three meetings ran past their scheduled end time.",
        ],
        weight: 0.8,
      },
      {
        id: "no-evaluation",
        type: "negation",
        pattern:
          "(always|never|constantly|keep|refuse to|won't|lazy|irresponsible|disrespectful|rude|difficult)",
        examples: [
          "You're always late. (wrong — evaluation, not observation)",
          "You never follow through. (wrong — generalization, not specific fact)",
        ],
        weight: 1.0,
      },
    ],
    prerequisites: [],
    difficulty: 1,
  },

  // -------------------------------------------------------------------------
  // 7. NVC Feeling (NVC)
  // -------------------------------------------------------------------------
  "nvc-feeling": {
    id: "nvc-feeling",
    name: "NVC Feeling",
    description:
      "Express genuine feelings using emotion vocabulary — not pseudo-feelings that blame " +
      "others. 'I feel unheard' is a pseudo-feeling (implies someone is doing something to " +
      "you). 'I feel lonely' or 'I feel anxious' are genuine feelings. NVC distinguishes " +
      "feelings from interpretations.",
    framework: "NVC",
    tier: "A",
    skill_type: "syntax",
    primary_format: "prompt-response",
    supported_formats: ["prompt-response", "multiple-choice", "rewrite"],
    syntax_template: "I feel [genuine emotion word]...",
    syntax_rules: [
      {
        id: "feeling-stem",
        type: "regex",
        pattern:
          "^I feel\\s+(anxious|sad|frustrated|scared|grateful|relieved|confused|excited|disappointed|hopeful|overwhelmed|lonely|hurt|angry|nervous|surprised|embarrassed|curious|proud|peaceful)",
        examples: [
          "I feel anxious when the timeline shifts without notice.",
          "I feel frustrated when my input is not included in the decision.",
          "I feel relieved when we can address this directly.",
        ],
        weight: 1.0,
      },
      {
        id: "no-pseudo-feeling",
        type: "negation",
        pattern:
          "^I feel (like|that|as if|unheard|unseen|ignored|dismissed|attacked|manipulated|abandoned|betrayed)",
        examples: [
          "I feel like you don't respect my time. (wrong — 'feel like' is interpretation)",
          "I feel ignored. (wrong — pseudo-feeling that implies blame)",
          "I feel attacked when you raise your voice. (wrong — interpretation)",
        ],
        weight: 1.0,
      },
    ],
    prerequisites: ["nvc-observation"],
    difficulty: 1,
  },

  // -------------------------------------------------------------------------
  // 8. Accusation Audit (Voss)
  //    Maps to "Contrasting" in the 8 Tier A list. Using 'accusation-audit' as
  //    the id because the existing src/features/accusation-audit/ module uses
  //    this name and the Accusation Audit IS the Voss implementation of Contrasting.
  // -------------------------------------------------------------------------
  "accusation-audit": {
    id: "accusation-audit",
    name: "Accusation Audit",
    description:
      "Pre-emptively name every negative assumption the counterpart might have about you " +
      "before they can voice it. Defuses their objections before they form. Creates " +
      "psychological safety by showing you understand their perspective. " +
      "Stems: 'You probably think...', 'I know this might seem...', 'You might be thinking...'.",
    framework: "Voss",
    tier: "A",
    skill_type: "syntax",
    primary_format: "prompt-response",
    supported_formats: ["prompt-response", "rewrite", "multiple-choice"],
    syntax_template:
      "You probably think I'm [worst assumption]. / I know this might seem like [negative].",
    syntax_rules: [
      {
        id: "audit-stem",
        type: "regex",
        pattern:
          "^(You probably think|You might think|I know this (might|probably) seem|You might be thinking|I know it might look like|You may think)",
        examples: [
          "You probably think I'm only asking for more money.",
          "I know this might seem like I'm going over your head.",
          "You might be thinking this is all about me.",
        ],
        weight: 1.0,
      },
      {
        id: "includes-negative",
        type: "inclusion",
        pattern:
          "(ungrateful|selfish|greedy|difficult|not a team player|unrealistic|over|too much|demanding|pushy|naive|entitled)",
        examples: [
          "You probably think I'm being ungrateful for what I already have.",
          "I know this might seem like I'm being difficult.",
          "You might think this is unrealistic given the budget.",
        ],
        weight: 0.8,
      },
      {
        id: "no-defensive-opener",
        type: "negation",
        pattern:
          "^(I just want|I only|I simply|I need you to understand|I want to be clear|I'm not trying to)",
        examples: [
          "I just want to be honest about what I need. (wrong — defensive, not auditing their assumptions)",
          "I'm not trying to be difficult. (wrong — denial rather than naming their assumption directly)",
        ],
        weight: 1.0,
      },
    ],
    prerequisites: ["labeling"],
    difficulty: 2,
  },
};

// ---------------------------------------------------------------------------
// Convenience export for components that need to iterate
// ---------------------------------------------------------------------------

/** All 8 Tier A techniques as an array. */
export const drillTechniquesArray: Technique[] = Object.values(drillTechniques);
