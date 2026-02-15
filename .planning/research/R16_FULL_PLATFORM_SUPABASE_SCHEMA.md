# R16: Full Platform Supabase Schema — Adaptive Learning + Skill Tree + VCM Diagnostics

**Source:** Claude (synthesized from R1-R15)
**Filed:** 2026-02-14
**Prompt:** R16 from RESEARCH_PROMPTS.md
**Status:** COMPLETE

---

## 1. Complete CREATE TABLE Statements

### Core User Tables

```sql
-- ============================================================
-- PROFILES & SETTINGS
-- ============================================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    -- Demographics (from Settings page)
    industry TEXT,
    role_title TEXT,
    experience_level TEXT CHECK (experience_level IN ('student', 'early_career', 'mid_career', 'senior', 'executive')),
    -- Goals (from Profile wizard)
    long_term_goals JSONB DEFAULT '[]'::jsonb,  -- TreeSelection[]
    focus_areas JSONB,                           -- TreeSelection
    -- Self-assessment
    self_assessment JSONB DEFAULT '{}'::jsonb,   -- { challenges, triggers, strengths }
    additional_context TEXT,
    preferences TEXT,
    -- Diagnostic onboarding
    onboarding_responses JSONB DEFAULT '{}'::jsonb,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- Filler detection thresholds
    filler_rate_good DECIMAL DEFAULT 2.0,
    filler_rate_warning DECIMAL DEFAULT 5.0,
    -- Timer settings
    timer_warning_seconds INT DEFAULT 10,
    timer_critical_seconds INT DEFAULT 5,
    -- Notification preferences
    review_reminders BOOLEAN DEFAULT TRUE,
    streak_notifications BOOLEAN DEFAULT TRUE,
    reminder_time TIME DEFAULT '08:00',
    -- UI preferences
    theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);
```

### Skill Tree & Mastery

```sql
-- ============================================================
-- SKILL TREE (Reference Data)
-- ============================================================

CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,           -- 'labeling', 'mirroring', etc.
    description TEXT,
    framework TEXT NOT NULL CHECK (framework IN (
        'voss', 'mi', 'cbt', 'nvc', 'crucial_conversations',
        'difficult_conversations', 'foundational', 'corporate'
    )),
    tier INT NOT NULL CHECK (tier BETWEEN 1 AND 5),
    skill_type TEXT NOT NULL CHECK (skill_type IN (
        'syntax_driven', 'judgment_based', 'recognition'
    )),
    -- Drill/simulation classification (from R10)
    practice_environment TEXT NOT NULL CHECK (practice_environment IN (
        'drill_first', 'simulation_preferred', 'both'
    )),
    -- Decay rates (from R15)
    default_decay_rate DECIMAL NOT NULL DEFAULT 0.08,
    default_half_life_days INT NOT NULL DEFAULT 14,
    -- Mastery thresholds
    drill_mastery_threshold INT DEFAULT 10,    -- correct attempts to move to simulation
    -- Display
    icon TEXT,
    color TEXT,
    sort_order INT DEFAULT 0,
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skill_prerequisites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    prerequisite_skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    requirement_type TEXT NOT NULL CHECK (requirement_type IN ('hard', 'soft')),
    -- hard = must be Proficient (level 3+) before attempting
    -- soft = recommended but not enforced
    required_mastery_level INT DEFAULT 3 CHECK (required_mastery_level BETWEEN 1 AND 4),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(skill_id, prerequisite_skill_id),
    CHECK (skill_id != prerequisite_skill_id)
);

-- ============================================================
-- USER SKILL MASTERY + SPACED REPETITION (from R15)
-- ============================================================

CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    mastery_level INT NOT NULL DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 4),
    -- 0=Not Started, 1=Attempted, 2=Familiar, 3=Proficient, 4=Mastered

    -- Spaced repetition (from R15)
    last_practiced TIMESTAMPTZ,
    next_review_date TIMESTAMPTZ,
    review_interval_days INT DEFAULT 7,
    half_life_days DECIMAL DEFAULT 14.0,

    -- Performance tracking
    consecutive_correct INT DEFAULT 0,
    total_attempts INT DEFAULT 0,
    total_correct INT DEFAULT 0,

    -- Streak
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_review_result TEXT CHECK (last_review_result IN ('correct', 'incorrect', 'partial')),

    -- Decay tracking
    skill_decay_rate DECIMAL DEFAULT 0.08,
    estimated_retention DECIMAL,

    -- Implicit practice (from R15 section 6)
    implicit_practice_count INT DEFAULT 0,

    -- Milestones
    first_attempted_at TIMESTAMPTZ,
    proficient_achieved_at TIMESTAMPTZ,
    mastered_achieved_at TIMESTAMPTZ,

    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

CREATE TABLE skill_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_skill_id UUID NOT NULL REFERENCES user_skills(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reviewed_at TIMESTAMPTZ DEFAULT NOW(),
    review_type TEXT NOT NULL CHECK (review_type IN (
        'drill', 'simulation', 'retention_check', 'mixed_assessment'
    )),
    result TEXT NOT NULL CHECK (result IN ('correct', 'incorrect', 'partial')),
    response_time_seconds INT,
    format_used TEXT,             -- which drill format was used
    context JSONB DEFAULT '{}'    -- scenario details, errors, etc.
);
```

### Skills Lab (Drills)

```sql
-- ============================================================
-- DRILL SCENARIOS & ATTEMPTS (Skills Lab)
-- ============================================================

CREATE TABLE drill_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    format TEXT NOT NULL CHECK (format IN (
        'prompt_response', 'audio_spoken', 'multiple_choice',
        'rewrite', 'spot_the_technique'
    )),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    category TEXT,                  -- 'salary', 'workplace', 'personal', etc.
    -- Scenario content
    title TEXT NOT NULL,
    situation TEXT NOT NULL,        -- scenario description
    prompt TEXT NOT NULL,           -- what the user sees/hears
    -- For multiple choice
    options JSONB,                  -- [{text, is_correct, explanation}]
    -- For rewrite exercises
    original_text TEXT,             -- text to be rewritten
    -- Expected responses / scoring rubric
    scoring_rubric JSONB NOT NULL DEFAULT '{}'::jsonb,
    example_responses JSONB DEFAULT '[]'::jsonb,
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drill_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES drill_scenarios(id) ON DELETE CASCADE,
    -- Attempt details
    format TEXT NOT NULL,
    user_response TEXT,
    -- Scoring (from R5 rubric)
    form_score INT CHECK (form_score BETWEEN 0 AND 3),
    accuracy_score INT CHECK (accuracy_score BETWEEN 0 AND 3),
    impact_level INT CHECK (impact_level BETWEEN 0 AND 3),
    timing_score INT CHECK (timing_score BETWEEN 0 AND 2),
    composite_score DECIMAL,       -- weighted: 0.25*form + 0.35*accuracy + 0.3*impact + 0.1*timing
    -- Affect feedback (from redesign)
    affect_level TEXT CHECK (affect_level IN (
        'guarded', 'acknowledged', 'understood', 'deeply_connected'
    )),
    -- AI response
    ai_response TEXT,
    ai_feedback JSONB,             -- { pattern_to_explore, examples, positive_notes }
    -- Duration
    duration_seconds INT,
    -- Metadata
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Simulation Studio

```sql
-- ============================================================
-- SIMULATION SCENARIOS, SESSIONS & TURNS (Simulation Studio)
-- ============================================================

CREATE TABLE simulation_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Taxonomy (from R4: 6 domains x 5 levels x 4 goal types)
    domain TEXT NOT NULL CHECK (domain IN (
        'workplace', 'personal', 'sales', 'customer_service',
        'leadership', 'conflict_resolution'
    )),
    difficulty_level INT NOT NULL CHECK (difficulty_level BETWEEN 1 AND 5),
    -- 1=Cooperative, 2=Hesitant, 3=Resistant, 4=Aggressive, 5=Deceptive
    goal_type TEXT NOT NULL CHECK (goal_type IN (
        'agreement', 'information_discovery', 'de_escalation', 'relationship_repair'
    )),
    -- Content
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    user_role TEXT NOT NULL,        -- who the user plays
    ai_role TEXT NOT NULL,          -- who the AI plays
    -- AI opponent configuration (from R14)
    system_prompt TEXT NOT NULL,
    hidden_concern TEXT,
    concession_ladder JSONB DEFAULT '[]'::jsonb,
    -- Control dials (from R14)
    assertiveness INT NOT NULL CHECK (assertiveness BETWEEN 1 AND 5),
    reactivity INT NOT NULL CHECK (reactivity BETWEEN 1 AND 5),
    emotional_volatility INT NOT NULL CHECK (emotional_volatility BETWEEN 1 AND 5),
    -- Focus techniques
    target_techniques TEXT[] DEFAULT '{}',  -- techniques this scenario is designed to practice
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE simulation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES simulation_scenarios(id) ON DELETE CASCADE,
    -- Session config
    focus_type TEXT NOT NULL CHECK (focus_type IN (
        'guided', 'scaffolded', 'free_form'
    )),
    -- Session-level scores (from R5: 6 flow dimensions)
    flow_scores JSONB,
    -- { technique_variety, emotional_awareness, strategic_thinking,
    --   adaptability, conversation_control, relationship_building }
    -- Summary
    key_moments JSONB DEFAULT '[]'::jsonb,    -- [{turn, description, technique, quality}]
    summary_feedback TEXT,
    -- Final state
    final_state JSONB,              -- final state object
    final_trust_level INT,
    revelation_stage_reached INT DEFAULT 0,
    outcome TEXT CHECK (outcome IN (
        'agreement', 'partial_agreement', 'impasse', 'hostile_exit', 'incomplete'
    )),
    -- Duration
    turn_count INT DEFAULT 0,
    duration_seconds INT,
    -- Metadata
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE simulation_turns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES simulation_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    turn_number INT NOT NULL,
    speaker TEXT NOT NULL CHECK (speaker IN ('user', 'ai')),
    content TEXT NOT NULL,
    -- AI state at this turn (from R4/R14)
    ai_state JSONB,
    -- { mood, trust_level, concessions, active_constraints,
    --   last_tactic_detected, revelation_stage, objections_used }
    -- Techniques detected in this turn (from R5)
    techniques_detected JSONB DEFAULT '[]'::jsonb,
    -- [{ technique_type, confidence, evidence_span,
    --    form_score, accuracy_score, impact_level, timing_score }]
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Technique Detections (Normalized)

```sql
-- ============================================================
-- TECHNIQUE DETECTIONS (Normalized for querying)
-- ============================================================

CREATE TABLE technique_detections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- Source (drill or simulation)
    source_type TEXT NOT NULL CHECK (source_type IN ('drill', 'simulation')),
    drill_attempt_id UUID REFERENCES drill_attempts(id) ON DELETE SET NULL,
    simulation_turn_id UUID REFERENCES simulation_turns(id) ON DELETE SET NULL,
    -- Detection details
    technique_type TEXT NOT NULL,    -- 'labeling', 'mirroring', etc.
    skill_id UUID REFERENCES skills(id),
    confidence DECIMAL CHECK (confidence BETWEEN 0 AND 1),
    evidence_span TEXT,              -- the actual text that was detected
    -- Quality scores (from R5)
    form_score INT CHECK (form_score BETWEEN 0 AND 3),
    accuracy_score INT CHECK (accuracy_score BETWEEN 0 AND 3),
    impact_level INT CHECK (impact_level BETWEEN 0 AND 3),
    timing_score INT CHECK (timing_score BETWEEN 0 AND 2),
    composite_quality DECIMAL,
    -- Context
    detection_phase TEXT CHECK (detection_phase IN ('per_turn', 'session_end')),
    -- Metadata
    detected_at TIMESTAMPTZ DEFAULT NOW()
);
```

### VCM Diagnostics

```sql
-- ============================================================
-- VCM DIAGNOSTIC STATE (from R11)
-- ============================================================

CREATE TABLE vcm_diagnostic_state (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    gate TEXT NOT NULL CHECK (gate IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H')),
    -- Diagnosis
    gate_status TEXT NOT NULL DEFAULT 'unknown' CHECK (gate_status IN (
        'passing', 'failing', 'at_risk', 'unknown'
    )),
    root_cause TEXT,                -- e.g., 'low_self_efficacy', 'no_felt_urgency'
    confidence DECIMAL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 1),
    diagnosis_type TEXT DEFAULT 'provisional' CHECK (diagnosis_type IN (
        'provisional', 'confirmed'
    )),
    -- Evidence
    evidence_session_count INT DEFAULT 0,
    evidence_sessions UUID[] DEFAULT '{}',  -- session IDs that informed this
    -- Meta flags (from R5)
    avoidance_flag BOOLEAN DEFAULT FALSE,
    shutdown_flag BOOLEAN DEFAULT FALSE,
    scripted_behavior_flag BOOLEAN DEFAULT FALSE,
    -- Metadata
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, gate)
);

CREATE TABLE vcm_diagnostic_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    gate TEXT NOT NULL CHECK (gate IN ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H')),
    -- Previous state
    previous_status TEXT,
    previous_root_cause TEXT,
    -- New state
    new_status TEXT NOT NULL,
    new_root_cause TEXT,
    -- Why changed
    change_reason TEXT,
    trigger_session_id UUID,
    confidence DECIMAL,
    -- Metadata
    changed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Recommendations

```sql
-- ============================================================
-- RECOMMENDATIONS (from R3, R11)
-- ============================================================

CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- What was recommended
    recommendation_type TEXT NOT NULL CHECK (recommendation_type IN (
        'specific_drill', 'technique_category', 'behavioral_nudge',
        'simulation_scenario', 'content_item', 'schedule_change'
    )),
    -- Target
    target_skill_id UUID REFERENCES skills(id),
    target_scenario_id UUID,        -- drill or simulation scenario
    target_content_id UUID,
    -- Source
    source_gate TEXT,               -- which VCM gate triggered this
    source_root_cause TEXT,
    is_user_aligned BOOLEAN DEFAULT FALSE,  -- user wants this vs system diagnosed
    -- Presentation
    message TEXT NOT NULL,          -- what the user sees (positive framing)
    presentation_style TEXT DEFAULT 'subtle' CHECK (presentation_style IN (
        'subtle', 'light_explanation'
    )),
    -- User response
    status TEXT DEFAULT 'shown' CHECK (status IN (
        'shown', 'accepted', 'ignored', 'completed', 'dismissed'
    )),
    responded_at TIMESTAMPTZ,
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Audio & Hume Analysis

```sql
-- ============================================================
-- AUDIO STORAGE & HUME ANALYSIS (from R1, R7)
-- ============================================================

CREATE TABLE audio_recordings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL CHECK (session_type IN (
        'voice_practice', 'drill', 'simulation'
    )),
    related_session_id UUID,        -- voice_session, drill_attempt, or simulation_session ID
    -- Storage
    storage_path TEXT NOT NULL,     -- Supabase Storage path
    format TEXT DEFAULT 'webm',
    size_bytes BIGINT,
    duration_seconds INT,
    -- Processing status
    hume_status TEXT DEFAULT 'pending' CHECK (hume_status IN (
        'pending', 'processing', 'completed', 'failed', 'skipped'
    )),
    hume_job_id TEXT,
    -- Auto-cleanup
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE hume_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    audio_recording_id UUID NOT NULL REFERENCES audio_recordings(id) ON DELETE CASCADE,
    -- Hume prosody results
    avg_stress DECIMAL,
    avg_confidence DECIMAL,
    avg_engagement DECIMAL,
    -- Detailed results
    prosody_timeline JSONB,         -- [{timestamp, stress, confidence, engagement}]
    expression_summary JSONB,       -- aggregate emotion breakdown
    freeze_events JSONB DEFAULT '[]'::jsonb,  -- [{start, end, duration}]
    -- Metadata
    analyzed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Voice Practice (Existing Feature)

```sql
-- ============================================================
-- VOICE PRACTICE SESSIONS (migrated from localStorage)
-- ============================================================

CREATE TABLE voice_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- Session type
    focus_mode TEXT NOT NULL CHECK (focus_mode IN ('filler', 'pace')),
    -- Duration
    planned_duration_seconds INT,
    actual_duration_seconds INT,
    -- Filler metrics
    filler_count INT DEFAULT 0,
    filler_rate DECIMAL,            -- fillers per minute
    filler_words JSONB DEFAULT '[]'::jsonb,  -- [{word, timestamp, confidence}]
    -- Pace metrics
    wpm_average DECIMAL,
    wpm_segments JSONB DEFAULT '[]'::jsonb,  -- [{start, end, wpm}]
    word_count INT DEFAULT 0,
    -- Transcript
    transcript TEXT,
    transcript_segments JSONB DEFAULT '[]'::jsonb,
    -- Speaking prompt used
    prompt_id TEXT,
    prompt_title TEXT,
    -- Scorecard
    scorecard JSONB,                -- {assessment, recommendations}
    ai_summary TEXT,
    -- Metadata
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```

### Institute Content

```sql
-- ============================================================
-- INSTITUTE CONTENT (from R12)
-- ============================================================

CREATE TABLE content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    -- Content type
    content_type TEXT NOT NULL CHECK (content_type IN (
        'video_explainer', 'video_demonstration', 'video_before_after',
        'article', 'annotated_example'
    )),
    -- Content
    title TEXT NOT NULL,
    description TEXT,
    -- Type-specific fields
    video_url TEXT,                  -- for video types
    video_duration_seconds INT,
    content_markdown TEXT,           -- for articles
    -- Taxonomy (from R12: tag everything)
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    framework TEXT,
    tags TEXT[] DEFAULT '{}',
    -- Metadata
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    -- Question type (from R12)
    question_type TEXT NOT NULL CHECK (question_type IN (
        'technique_identification', 'scenario_ranking', 'sentence_rewrite',
        'predictive', 'comparative', 'multiple_choice'
    )),
    -- Content
    question_text TEXT NOT NULL,
    -- For multiple choice / ranking
    options JSONB,                   -- [{text, is_correct, rank, explanation}]
    -- For rewrite exercises
    original_text TEXT,
    -- Correct answer / rubric
    correct_answer TEXT,
    explanation TEXT,
    -- Difficulty
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    -- Metadata
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    -- Attempt
    user_answer TEXT,
    is_correct BOOLEAN,
    score DECIMAL,                   -- for partial credit (ranking, rewrite)
    -- Metadata
    attempted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    -- Progress
    is_completed BOOLEAN DEFAULT FALSE,
    progress_percent INT DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    -- Metadata
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    UNIQUE(user_id, content_id)
);
```

### Behavioral Events (for VCM Diagnostics)

```sql
-- ============================================================
-- BEHAVIORAL EVENTS (for VCM gate detection - from R11)
-- ============================================================

CREATE TABLE behavioral_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    -- Event
    event_type TEXT NOT NULL CHECK (event_type IN (
        'app_open', 'app_close', 'drill_start', 'drill_complete',
        'drill_quit', 'simulation_start', 'simulation_complete',
        'simulation_quit', 'content_view', 'content_complete',
        'recommendation_shown', 'recommendation_accepted',
        'recommendation_ignored', 'streak_maintained', 'streak_broken',
        'review_prompted', 'review_completed', 'review_skipped',
        'settings_changed', 'difficulty_avoided', 'difficulty_selected'
    )),
    -- Context
    related_skill_id UUID REFERENCES skills(id),
    related_session_id UUID,
    -- Behavioral signals (from R11 diagnostic table)
    metadata JSONB DEFAULT '{}'::jsonb,
    -- { time_to_start_ms, hover_duration_ms, exit_point_percent,
    --   session_duration_planned, session_duration_actual,
    --   difficulty_selected, difficulty_avoided }
    -- Metadata
    occurred_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. RLS Policies

```sql
-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all user-data tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_turns ENABLE ROW LEVEL SECURITY;
ALTER TABLE technique_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE vcm_diagnostic_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE vcm_diagnostic_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_events ENABLE ROW LEVEL SECURITY;

-- USER POLICIES: Users see only their own data
-- (Pattern: same policy for SELECT, INSERT, UPDATE, DELETE)

CREATE POLICY "Users can view own profile"
    ON profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own settings"
    ON user_settings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own skills"
    ON user_skills FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reviews"
    ON skill_reviews FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own drill attempts"
    ON drill_attempts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own simulation sessions"
    ON simulation_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own simulation turns"
    ON simulation_turns FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own technique detections"
    ON technique_detections FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own VCM state"
    ON vcm_diagnostic_state FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own VCM history"
    ON vcm_diagnostic_history FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own recommendations"
    ON recommendations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own audio"
    ON audio_recordings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own Hume analyses"
    ON hume_analyses FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own voice sessions"
    ON voice_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own quiz attempts"
    ON quiz_attempts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own content progress"
    ON content_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own behavioral events"
    ON behavioral_events FOR ALL USING (auth.uid() = user_id);

-- REFERENCE DATA: Readable by all authenticated users
-- Skills, scenarios, content are shared reference data

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_prerequisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE simulation_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read skills"
    ON skills FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can read skill prerequisites"
    ON skill_prerequisites FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can read drill scenarios"
    ON drill_scenarios FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can read simulation scenarios"
    ON simulation_scenarios FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can read content items"
    ON content_items FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can read quiz questions"
    ON quiz_questions FOR SELECT USING (TRUE);

-- ADMIN: Read access to all data (for beta debugging)
-- Create admin role via Supabase dashboard custom claims

CREATE POLICY "Admin can read all profiles"
    ON profiles FOR SELECT USING (
        auth.uid() = id OR
        (auth.jwt() ->> 'role') = 'admin'
    );

-- Repeat admin pattern for other tables as needed during beta
```

---

## 3. Skill Prerequisite DAG

### Adjacency List Approach (Recommended)

The `skill_prerequisites` table above uses adjacency list. Here's why:

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Adjacency list** | Simple, flexible, easy to update | Requires recursive query for deep checks | Small DAGs (<100 nodes) |
| Closure table | Precomputed = fast queries | Complex to maintain on changes | Large DAGs with frequent reads |
| JSONB array | Simplest | Can't enforce FK constraints | Prototypes only |

For ~57 techniques with max depth 5, adjacency list is optimal.

### Edge Function: can_user_attempt_skill

```typescript
// supabase/functions/check-skill-unlock/index.ts

import { createClient } from '@supabase/supabase-js'

interface UnlockResult {
  can_attempt: boolean
  reason?: string
  missing_prerequisites?: { skill_name: string; current_level: number; required_level: number }[]
}

Deno.serve(async (req) => {
  const { user_id, skill_id } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Get hard prerequisites for this skill
  const { data: prerequisites } = await supabase
    .from('skill_prerequisites')
    .select('prerequisite_skill_id, required_mastery_level, skills!prerequisite_skill_id(name)')
    .eq('skill_id', skill_id)
    .eq('requirement_type', 'hard')

  if (!prerequisites || prerequisites.length === 0) {
    return new Response(JSON.stringify({ can_attempt: true }))
  }

  // 2. Get user's mastery for all prerequisites
  const prereqIds = prerequisites.map(p => p.prerequisite_skill_id)
  const { data: userSkills } = await supabase
    .from('user_skills')
    .select('skill_id, mastery_level')
    .eq('user_id', user_id)
    .in('skill_id', prereqIds)

  const userSkillMap = new Map(
    (userSkills || []).map(us => [us.skill_id, us.mastery_level])
  )

  // 3. Check each prerequisite
  const missing: UnlockResult['missing_prerequisites'] = []

  for (const prereq of prerequisites) {
    const currentLevel = userSkillMap.get(prereq.prerequisite_skill_id) || 0
    if (currentLevel < prereq.required_mastery_level) {
      missing.push({
        skill_name: (prereq as any).skills?.name || prereq.prerequisite_skill_id,
        current_level: currentLevel,
        required_level: prereq.required_mastery_level
      })
    }
  }

  // 4. Also check tier gating (>=75% of current tier at Proficient)
  const { data: skill } = await supabase
    .from('skills')
    .select('tier')
    .eq('id', skill_id)
    .single()

  if (skill && skill.tier > 1) {
    const prevTier = skill.tier - 1
    const { data: tierSkills } = await supabase
      .from('skills')
      .select('id')
      .eq('tier', prevTier)

    if (tierSkills) {
      const { data: tierMastery } = await supabase
        .from('user_skills')
        .select('mastery_level')
        .eq('user_id', user_id)
        .in('skill_id', tierSkills.map(s => s.id))

      const proficientCount = (tierMastery || [])
        .filter(m => m.mastery_level >= 3).length
      const required = Math.ceil(tierSkills.length * 0.75)

      if (proficientCount < required) {
        return new Response(JSON.stringify({
          can_attempt: false,
          reason: `Need ${required} of ${tierSkills.length} Tier ${prevTier} skills at Proficient. Currently: ${proficientCount}`
        }))
      }
    }
  }

  return new Response(JSON.stringify({
    can_attempt: missing.length === 0,
    missing_prerequisites: missing.length > 0 ? missing : undefined
  }))
})
```

---

## 4. Critical Indexes

```sql
-- ============================================================
-- INDEXES
-- ============================================================

-- User skills: "Get all skills and mastery for user X"
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_user_skills_review ON user_skills(user_id, next_review_date)
    WHERE next_review_date IS NOT NULL;

-- Drill attempts: "Get attempts for user X, technique Y, last 30 days"
CREATE INDEX idx_drill_attempts_user_skill ON drill_attempts(user_id, skill_id, attempted_at DESC);
CREATE INDEX idx_drill_attempts_user_date ON drill_attempts(user_id, attempted_at DESC);

-- Simulation sessions: "Get sessions for user X"
CREATE INDEX idx_sim_sessions_user ON simulation_sessions(user_id, started_at DESC);
CREATE INDEX idx_sim_turns_session ON simulation_turns(session_id, turn_number);

-- Technique detections: "All labeling instances for user X"
CREATE INDEX idx_technique_detections_user_type ON technique_detections(user_id, technique_type, detected_at DESC);
CREATE INDEX idx_technique_detections_quality ON technique_detections(user_id, technique_type, composite_quality)
    WHERE composite_quality IS NOT NULL;

-- VCM: "Current diagnostic state for user X"
CREATE INDEX idx_vcm_state_user ON vcm_diagnostic_state(user_id);

-- Recommendations: "Pending recommendations for user X"
CREATE INDEX idx_recommendations_user_status ON recommendations(user_id, status, created_at DESC);

-- Behavioral events: "Events for user X in last 7 days"
CREATE INDEX idx_behavioral_events_user ON behavioral_events(user_id, occurred_at DESC);
CREATE INDEX idx_behavioral_events_type ON behavioral_events(user_id, event_type, occurred_at DESC);

-- Voice sessions: "Recent sessions for user X"
CREATE INDEX idx_voice_sessions_user ON voice_sessions(user_id, started_at DESC);

-- Content progress: "Progress for user X"
CREATE INDEX idx_content_progress_user ON content_progress(user_id);

-- Skill reviews: "Reviews for a specific user_skill"
CREATE INDEX idx_skill_reviews_user_skill ON skill_reviews(user_skill_id, reviewed_at DESC);

-- Audio: "Find expired recordings for cleanup"
CREATE INDEX idx_audio_expires ON audio_recordings(expires_at)
    WHERE hume_status IN ('completed', 'failed');

-- Quiz attempts
CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id, attempted_at DESC);
```

---

## 5. Migration Strategy from localStorage

```typescript
// src/lib/migrateToSupabase.ts

import { supabase } from './supabaseClient'

interface MigrationResult {
  success: boolean
  migrated: {
    profile: boolean
    settings: boolean
    voiceSessions: number
    drillAttempts: number
  }
  errors: string[]
}

export async function migrateFromLocalStorage(): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    migrated: { profile: false, settings: false, voiceSessions: 0, drillAttempts: 0 },
    errors: []
  }

  try {
    // 1. Ensure user is authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      result.errors.push('User not authenticated')
      return result
    }

    // 2. Migrate profile
    const profileData = localStorage.getItem('kdenz-profile')
    if (profileData) {
      const profile = JSON.parse(profileData)
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        display_name: profile.name,
        long_term_goals: profile.longTermGoals || [],
        focus_areas: profile.focusAreas || null,
        self_assessment: profile.selfAssessment || {},
        additional_context: profile.additionalContext || null,
        preferences: profile.preferences || null,
        onboarding_responses: profile.diagnosticResponses || {},
        onboarding_completed: profile.onboardingComplete || false
      })
      if (error) result.errors.push(`Profile: ${error.message}`)
      else result.migrated.profile = true
    }

    // 3. Migrate settings
    const settingsData = localStorage.getItem('kdenz-settings')
    if (settingsData) {
      const settings = JSON.parse(settingsData)
      const { error } = await supabase.from('user_settings').upsert({
        user_id: user.id,
        filler_rate_good: settings.fillerRateGood || 2.0,
        filler_rate_warning: settings.fillerRateWarning || 5.0,
        timer_warning_seconds: settings.timerWarning || 10,
        timer_critical_seconds: settings.timerCritical || 5
      })
      if (error) result.errors.push(`Settings: ${error.message}`)
      else result.migrated.settings = true
    }

    // 4. Migrate voice sessions
    const sessionsData = localStorage.getItem('kdenz-sessions')
    if (sessionsData) {
      const sessions = JSON.parse(sessionsData)
      for (const session of sessions) {
        const { error } = await supabase.from('voice_sessions').insert({
          user_id: user.id,
          focus_mode: session.focusMode || 'filler',
          planned_duration_seconds: session.plannedDuration,
          actual_duration_seconds: session.actualDuration,
          filler_count: session.fillerCount || 0,
          filler_rate: session.fillerRate,
          wpm_average: session.wpmAverage,
          word_count: session.wordCount || 0,
          transcript: session.transcript,
          prompt_id: session.promptId,
          prompt_title: session.promptTitle,
          scorecard: session.scorecard,
          ai_summary: session.aiSummary,
          started_at: session.startedAt || session.date
        })
        if (error) result.errors.push(`Session: ${error.message}`)
        else result.migrated.voiceSessions++
      }
    }

    // 5. Migrate drill attempts (labeling, accusation audit)
    for (const key of ['kdenz-labeling-attempts', 'kdenz-audit-attempts']) {
      const data = localStorage.getItem(key)
      if (data) {
        const attempts = JSON.parse(data)
        for (const attempt of attempts) {
          // Map to new schema
          const { error } = await supabase.from('drill_attempts').insert({
            user_id: user.id,
            skill_id: null, // will need skill ID lookup
            scenario_id: null, // will need scenario ID lookup
            format: 'prompt_response',
            user_response: attempt.response,
            form_score: attempt.scores?.form,
            accuracy_score: attempt.scores?.accuracy,
            impact_level: attempt.scores?.impact,
            composite_score: attempt.scores?.composite,
            affect_level: attempt.affectLevel,
            ai_response: attempt.aiResponse,
            duration_seconds: attempt.duration,
            attempted_at: attempt.attemptedAt || attempt.date
          })
          if (error) result.errors.push(`Drill: ${error.message}`)
          else result.migrated.drillAttempts++
        }
      }
    }

    // 6. Verify migration
    const { count: profileCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('id', user.id)

    const { count: sessionCount } = await supabase
      .from('voice_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (profileCount && profileCount > 0) {
      result.success = result.errors.length === 0
    }

    // 7. Don't clear localStorage until user confirms
    // localStorage.clear() — called manually after verification

    return result
  } catch (err) {
    result.errors.push(`Unexpected: ${(err as Error).message}`)
    return result
  }
}
```

---

## 6. Edge Function Stubs

### calculate_next_review

```typescript
// supabase/functions/calculate-next-review/index.ts
// Implements simple interval fallback from R15

const INTERVAL_SCHEDULES: Record<string, number[]> = {
  syntax_driven: [3, 7, 14, 30, 60, 90],
  judgment_based: [3, 7, 21, 45, 75, 90],
  recognition: [7, 14, 30, 60, 90, 90]
}

Deno.serve(async (req) => {
  const { user_skill_id, result } = await req.json()

  const supabase = createClient(/* ... */)

  const { data: userSkill } = await supabase
    .from('user_skills')
    .select('*, skills(skill_type)')
    .eq('id', user_skill_id)
    .single()

  if (!userSkill) return new Response('Not found', { status: 404 })

  const skillType = (userSkill as any).skills.skill_type
  const schedule = INTERVAL_SCHEDULES[skillType] || INTERVAL_SCHEDULES.syntax_driven

  let newConsecutive = userSkill.consecutive_correct
  if (result === 'correct') {
    newConsecutive++
  } else {
    newConsecutive = Math.max(0, newConsecutive - 2)
  }

  const index = Math.min(newConsecutive, schedule.length - 1)
  const nextIntervalDays = schedule[index]
  const nextReview = new Date(Date.now() + nextIntervalDays * 86400000)

  await supabase.from('user_skills').update({
    consecutive_correct: newConsecutive,
    last_practiced: new Date().toISOString(),
    next_review_date: nextReview.toISOString(),
    review_interval_days: nextIntervalDays,
    last_review_result: result,
    total_attempts: userSkill.total_attempts + 1,
    total_correct: userSkill.total_correct + (result === 'correct' ? 1 : 0),
    updated_at: new Date().toISOString()
  }).eq('id', user_skill_id)

  return new Response(JSON.stringify({
    next_review_date: nextReview.toISOString(),
    interval_days: nextIntervalDays,
    consecutive_correct: newConsecutive
  }))
})
```

### run_vcm_diagnostic

```typescript
// supabase/functions/run-vcm-diagnostic/index.ts
// Stub — rule-based implementation from R11

Deno.serve(async (req) => {
  const { user_id, session_id } = await req.json()

  const supabase = createClient(/* ... */)

  // 1. Gather behavioral signals from last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString()

  const { data: events } = await supabase
    .from('behavioral_events')
    .select('*')
    .eq('user_id', user_id)
    .gte('occurred_at', sevenDaysAgo)
    .order('occurred_at', { ascending: false })

  // 2. Compute gate signals (from R11 behavioral signal table)
  const signals = computeGateSignals(events || [])

  // 3. Update VCM state for each failing gate
  for (const gate of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']) {
    const gateSignal = signals[gate]
    if (gateSignal.status !== 'unknown') {
      // Upsert current state
      await supabase.from('vcm_diagnostic_state').upsert({
        user_id,
        gate,
        gate_status: gateSignal.status,
        root_cause: gateSignal.root_cause,
        confidence: gateSignal.confidence,
        evidence_session_count: gateSignal.evidence_count,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,gate' })

      // Log history
      await supabase.from('vcm_diagnostic_history').insert({
        user_id,
        gate,
        new_status: gateSignal.status,
        new_root_cause: gateSignal.root_cause,
        confidence: gateSignal.confidence,
        trigger_session_id: session_id,
        change_reason: gateSignal.reason
      })
    }
  }

  // 4. Generate recommendations based on failing gates
  // (from R11 prescription engine)
  const failingGates = Object.entries(signals)
    .filter(([_, s]) => (s as any).status === 'failing')
    .sort((a, b) => (b[1] as any).confidence - (a[1] as any).confidence)

  // Prescribe for the highest-confidence failing gate
  if (failingGates.length > 0) {
    const [gate, signal] = failingGates[0]
    const prescription = prescribeIntervention(gate, (signal as any).root_cause)

    await supabase.from('recommendations').insert({
      user_id,
      recommendation_type: prescription.type,
      source_gate: gate,
      source_root_cause: (signal as any).root_cause,
      message: prescription.message,
      is_user_aligned: false
    })
  }

  return new Response(JSON.stringify({ signals, recommendations_generated: failingGates.length }))
})

// Placeholder — implement with R11 rules
function computeGateSignals(events: any[]) {
  // Gate C: check for difficulty avoidance, quit-after-failure patterns
  // Gate F: check for streak breaks, incomplete sessions
  // Gate G: check for multi-day absences after bad performance
  // etc.
  return {}
}

function prescribeIntervention(gate: string, rootCause: string) {
  // From R11 rule-based system
  return { type: 'behavioral_nudge', message: '' }
}
```

---

## KEY IMPLEMENTATION TAKEAWAYS

### Table Count: 22 tables total
- 2 user tables (profiles, user_settings)
- 4 skill tree tables (skills, skill_prerequisites, user_skills, skill_reviews)
- 2 drill tables (drill_scenarios, drill_attempts)
- 3 simulation tables (simulation_scenarios, simulation_sessions, simulation_turns)
- 1 detection table (technique_detections)
- 2 VCM tables (vcm_diagnostic_state, vcm_diagnostic_history)
- 1 recommendation table
- 2 audio tables (audio_recordings, hume_analyses)
- 1 voice session table
- 3 content tables (content_items, quiz_questions, quiz_attempts, content_progress)
- 1 behavioral events table

### Migration Path
1. Deploy schema (single migration file)
2. Seed skills + skill_prerequisites (reference data)
3. Seed drill_scenarios + simulation_scenarios (content)
4. Run localStorage migration for existing users
5. Verify data integrity
6. Remove localStorage code paths

### JSONB vs Normalized Decision
- **Normalized**: technique_detections (need aggregate queries, trend charts)
- **JSONB**: ai_state per turn, flow_scores, metadata, options (flexible, rarely queried across rows)
- **Hybrid**: techniques_detected on simulation_turns is JSONB (for quick access) PLUS normalized in technique_detections (for cross-session queries)
