export type ArchetypeId =
  | "grounded_authority"
  | "fm_dj"
  | "warm_connector"
  | "motivator"
  | "analytical_clarifier"
  | "calm_negotiator"
  | "playful_persuader";

export interface VoiceArchetype {
  id: ArchetypeId;
  name: string;
  description: string;
  reference_communicators: string[]; // 2-3 well-known examples
  markers: {
    speech_rate_wpm: { min: number; max: number };
    filler_density_per_100: { target: number; max: number };
    avg_pause_duration_s: { min: number; max: number };
  };
  feeling_words: string[]; // words people associate with this archetype
  common_gap: string; // what typically gets in the way
}

export interface UserAspiration {
  primary_archetype_id: ArchetypeId;
  secondary_archetype_id?: ArchetypeId;
  aspiration_text?: string; // free text from Q1 (reference communicator)
  gap_awareness?: string[]; // selected gap barriers from Q3 (stored for coaching context)
  set_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}
