/**
 * src/data/instituteContent.ts
 *
 * Seed data for Institute content items.
 *
 * 10 items covering all 8 communicator patterns. Each item carries full
 * routing tags: addresses_patterns, supports_aspirations, technique_ids,
 * vcm_gates. These tags are what make personalized content routing possible.
 *
 * Items are stubs — metadata + routing tags only. Actual content pages
 * are built in a later phase. The debrief_hook is the "why now" message
 * that appears in the session debrief card immediately after the pattern
 * reveal ("holy shit moment").
 */

import type { InstituteContentItem } from "../types/institute";

export const INSTITUTE_CONTENT: InstituteContentItem[] = [
  {
    id: "inst-001",
    title: 'The Cost of "Right?"',
    content_type: "article",
    technique_ids: ["labeling"],
    addresses_patterns: ["hedger"],
    supports_aspirations: ["grounded_authority", "calm_negotiator"],
    vcm_gates: ["belief"],
    prerequisite_ids: [],
    tier: 1,
    practice_before_exposure: true,
    duration_minutes: 5,
    difficulty: "intro",
    debrief_eligible: true,
    debrief_hook:
      "You hedged {count} labels this session. This article shows why the hedge closes the space you just opened.",
    description:
      "Why adding 'right?' and 'maybe' to an accurate label undermines its impact — and what to do instead.",
  },
  {
    id: "inst-002",
    title: "Seeing Past the Surface",
    content_type: "video_explainer",
    technique_ids: ["labeling", "open-ended-questions"],
    addresses_patterns: ["surface-reader"],
    supports_aspirations: ["fm_dj", "calm_negotiator", "warm_connector"],
    vcm_gates: ["awareness"],
    prerequisite_ids: [],
    tier: 1,
    practice_before_exposure: false,
    duration_minutes: 7,
    difficulty: "intro",
    debrief_eligible: true,
    debrief_hook:
      "Your labels landed on the surface emotion every time. This video shows the layer beneath.",
    description:
      "How to read what is actually happening beneath someone's words — the subtext that drives their behavior.",
  },
  {
    id: "inst-003",
    title: "The Righting Reflex",
    content_type: "article",
    technique_ids: ["labeling", "nvc-feeling"],
    addresses_patterns: ["fixer"],
    supports_aspirations: ["warm_connector", "calm_negotiator"],
    vcm_gates: ["initiation"],
    prerequisite_ids: [],
    tier: 1,
    practice_before_exposure: true,
    duration_minutes: 6,
    difficulty: "intro",
    debrief_eligible: true,
    debrief_hook:
      "You moved to solutions before the other person felt heard. This is the righting reflex — and how to override it.",
    description:
      "The automatic impulse to fix, advise, or correct — and why it shuts down the connection you are trying to build.",
  },
  {
    id: "inst-004",
    title: "Stating vs. Exploring",
    content_type: "before_after",
    technique_ids: ["mirroring", "labeling"],
    addresses_patterns: ["presumptuous"],
    supports_aspirations: ["analytical_clarifier", "calm_negotiator"],
    vcm_gates: ["belief"],
    prerequisite_ids: [],
    tier: 1,
    practice_before_exposure: true,
    duration_minutes: 4,
    difficulty: "intro",
    debrief_eligible: true,
    debrief_hook:
      "You stated interpretations as facts. This before/after shows the cost — and how to stay in exploration mode.",
    description:
      "Side-by-side comparison of declarative vs. exploratory framing — and why the difference changes everything.",
  },
  {
    id: "inst-005",
    title: "The Power of Silence",
    content_type: "video_demo",
    technique_ids: ["labeling"],
    addresses_patterns: ["rusher"],
    supports_aspirations: ["calm_negotiator", "grounded_authority", "fm_dj"],
    vcm_gates: ["persistence"],
    prerequisite_ids: [],
    tier: 1,
    practice_before_exposure: false,
    duration_minutes: 6,
    difficulty: "intro",
    debrief_eligible: true,
    debrief_hook:
      "You averaged {avgWordCount} words before the other person could respond. This demo shows what happens when you stop.",
    description:
      "A demonstration of intentional silence after labeling — and how pausing generates more information than filling.",
  },
  {
    id: "inst-006",
    title: "When Analysis Replaces Connection",
    content_type: "article",
    technique_ids: ["nvc-feeling", "nvc-observation"],
    addresses_patterns: ["intellectualizer"],
    supports_aspirations: ["warm_connector", "fm_dj"],
    vcm_gates: ["awareness", "belief"],
    prerequisite_ids: [],
    tier: 2,
    practice_before_exposure: true,
    duration_minutes: 8,
    difficulty: "standard",
    debrief_eligible: true,
    debrief_hook:
      "You analyzed this situation when the other person needed to feel understood first. Here is the distinction.",
    description:
      "How analytical framing creates distance in emotionally charged conversations — and when to switch registers.",
  },
  {
    id: "inst-007",
    title: "The Diplomat Trap",
    content_type: "annotated_example",
    technique_ids: ["accusation-audit", "no-oriented-questions"],
    addresses_patterns: ["diplomat"],
    supports_aspirations: ["grounded_authority", "playful_persuader"],
    vcm_gates: ["initiation", "belief"],
    prerequisite_ids: [],
    tier: 2,
    practice_before_exposure: true,
    duration_minutes: 9,
    difficulty: "standard",
    debrief_eligible: true,
    debrief_hook:
      "Your responses avoided naming what was actually in the room. This annotated exchange shows what it cost you.",
    description:
      "An annotated real exchange where excessive diplomacy hides the real read — and how to say the difficult thing directly.",
  },
  {
    id: "inst-008",
    title: "Less is More: The Over-Explanation Pattern",
    content_type: "before_after",
    technique_ids: ["mirroring", "no-oriented-questions"],
    addresses_patterns: ["explainer"],
    supports_aspirations: ["grounded_authority", "analytical_clarifier"],
    vcm_gates: ["persistence"],
    prerequisite_ids: [],
    tier: 1,
    practice_before_exposure: true,
    duration_minutes: 5,
    difficulty: "intro",
    debrief_eligible: true,
    debrief_hook:
      "You averaged {avgWordCount} words per response. This comparison shows what happens when you cut it in half.",
    description:
      "Before/after comparison of over-explanation vs. concise response — and how brevity signals confidence.",
  },
  {
    id: "inst-009",
    title: "Identity Labels: The Deep Read",
    content_type: "exercise",
    technique_ids: ["labeling"],
    addresses_patterns: ["surface-reader", "hedger"],
    supports_aspirations: ["calm_negotiator", "fm_dj", "warm_connector"],
    vcm_gates: ["awareness", "desire"],
    prerequisite_ids: ["inst-002"],
    tier: 2,
    practice_before_exposure: false,
    duration_minutes: 10,
    difficulty: "standard",
    debrief_eligible: false,
    debrief_hook: "",
    description:
      "A guided exercise for labeling beneath the surface emotion — identity-level labeling that produces breakthroughs.",
  },
  {
    id: "inst-010",
    title: "Voice of Authority: Delivery Matters",
    content_type: "video_demo",
    technique_ids: ["labeling", "i-statements"],
    addresses_patterns: ["hedger", "diplomat"],
    supports_aspirations: ["grounded_authority", "fm_dj"],
    vcm_gates: ["belief", "initiation"],
    prerequisite_ids: [],
    tier: 2,
    practice_before_exposure: false,
    duration_minutes: 8,
    difficulty: "standard",
    debrief_eligible: true,
    debrief_hook:
      "Your technique was right but your delivery signaled uncertainty. This demo shows the same label with authority.",
    description:
      "How delivery — pace, tone, frame — transforms an accurate label into one that lands with authority.",
  },
];

/**
 * Returns all Institute content items.
 */
export function getAllContent(): InstituteContentItem[] {
  return INSTITUTE_CONTENT;
}

/**
 * Looks up a content item by ID.
 * Returns undefined if not found.
 */
export function getContentById(id: string): InstituteContentItem | undefined {
  return INSTITUTE_CONTENT.find((item) => item.id === id);
}
