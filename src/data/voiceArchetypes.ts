import type { VoiceArchetype, ArchetypeId } from "../types/aspiration";

export const VOICE_ARCHETYPES: Record<ArchetypeId, VoiceArchetype> = {
  grounded_authority: {
    id: "grounded_authority",
    name: "Grounded Authority",
    description:
      "Boardroom presence. Calm, measured, decisive. People listen because you speak with certainty.",
    reference_communicators: ["Obama", "Brene Brown (keynotes)", "Simon Sinek"],
    markers: {
      speech_rate_wpm: { min: 120, max: 145 },
      filler_density_per_100: { target: 0.5, max: 2 },
      avg_pause_duration_s: { min: 1.5, max: 3.0 },
    },
    feeling_words: ["respected", "confident", "commanding", "trustworthy"],
    common_gap:
      "Speaking too fast under pressure, filling pauses with qualifiers",
  },
  fm_dj: {
    id: "fm_dj",
    name: "Calm Broadcaster",
    description:
      'The "late-night FM DJ" voice. Warm yet authoritative. Makes people feel safe and heard.',
    reference_communicators: ["Chris Voss", "Terry Gross", "Ira Glass"],
    markers: {
      speech_rate_wpm: { min: 130, max: 155 },
      filler_density_per_100: { target: 1, max: 3 },
      avg_pause_duration_s: { min: 1.0, max: 2.5 },
    },
    feeling_words: ["calm", "warm", "safe", "heard"],
    common_gap:
      "Dropping the warmth when stakes rise, reverting to flat affect",
  },
  warm_connector: {
    id: "warm_connector",
    name: "Warm Connector",
    description:
      "Brene Brown at a fireside chat. Authentic, vulnerable, emotionally present. Some fillers OK — they signal realness.",
    reference_communicators: ["Brene Brown (talks)", "Oprah", "Trevor Noah"],
    markers: {
      speech_rate_wpm: { min: 140, max: 165 },
      filler_density_per_100: { target: 3, max: 5 },
      avg_pause_duration_s: { min: 0.8, max: 2.0 },
    },
    feeling_words: ["understood", "connected", "welcomed", "authentic"],
    common_gap: "Over-sharing or rambling when trying to connect",
  },
  motivator: {
    id: "motivator",
    name: "Motivator",
    description:
      "Dynamic range. Peaks of energy, dramatic slowing for emphasis. The rally voice.",
    reference_communicators: [
      "Tony Robbins",
      "Gary Vee",
      "Michelle Obama (speeches)",
    ],
    markers: {
      speech_rate_wpm: { min: 160, max: 200 },
      filler_density_per_100: { target: 2, max: 4 },
      avg_pause_duration_s: { min: 0.5, max: 2.0 },
    },
    feeling_words: ["energized", "inspired", "pumped", "moved"],
    common_gap:
      "Maintaining high energy without becoming exhausting or performative",
  },
  analytical_clarifier: {
    id: "analytical_clarifier",
    name: "Analytical Clarifier",
    description:
      "Precise, measured, structured. People trust you because every word is chosen deliberately.",
    reference_communicators: [
      "Yuval Noah Harari",
      "Malcolm Gladwell",
      "Naval Ravikant",
    ],
    markers: {
      speech_rate_wpm: { min: 130, max: 155 },
      filler_density_per_100: { target: 0.5, max: 2 },
      avg_pause_duration_s: { min: 1.5, max: 3.5 },
    },
    feeling_words: ["clear", "informed", "precise", "logical"],
    common_gap: "Coming across as cold or detached when warmth is needed",
  },
  calm_negotiator: {
    id: "calm_negotiator",
    name: "Calm Negotiator",
    description:
      "The therapist voice. Slowest pace, longest pauses. Makes people feel there is all the time in the world.",
    reference_communicators: [
      "Chris Voss (hostage mode)",
      "Carl Rogers",
      "Esther Perel",
    ],
    markers: {
      speech_rate_wpm: { min: 110, max: 140 },
      filler_density_per_100: { target: 0.5, max: 1.5 },
      avg_pause_duration_s: { min: 2.0, max: 5.0 },
    },
    feeling_words: ["safe", "unhurried", "deeply heard", "grounded"],
    common_gap: "Losing patience and speeding up when counterpart is hostile",
  },
  playful_persuader: {
    id: "playful_persuader",
    name: "Playful Persuader",
    description:
      'Voss\'s "playful" default. Light, disarming, naturally varied. People drop their guard because you feel safe.',
    reference_communicators: [
      "Chris Voss (default)",
      "Ryan Reynolds",
      "Conan O'Brien",
    ],
    markers: {
      speech_rate_wpm: { min: 150, max: 175 },
      filler_density_per_100: { target: 2, max: 4 },
      avg_pause_duration_s: { min: 0.5, max: 1.5 },
    },
    feeling_words: ["relaxed", "disarmed", "light", "entertained"],
    common_gap:
      "Being perceived as unserious when the situation demands gravity",
  },
};

export function getArchetypeById(id: ArchetypeId): VoiceArchetype {
  return VOICE_ARCHETYPES[id];
}

export const ARCHETYPE_LIST: VoiceArchetype[] = Object.values(VOICE_ARCHETYPES);
