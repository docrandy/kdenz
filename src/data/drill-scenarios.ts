/**
 * src/data/drill-scenarios.ts
 *
 * 40 drill scenarios for the v3.0 Generic Drill Engine — 5 per technique.
 *
 * Sourcing strategy:
 * - 'labeling': Extracted and translated from src/features/labeling/scenarioBank.ts
 * - 'accusation-audit': Extracted and translated from src/features/accusation-audit/scenarios.ts
 * - All other 6 techniques: Original workplace/personal scenarios written for v3.0
 *
 * Difficulty levels: 1 or 2 only (v3.0 scope). Scenarios 1-3 = level 1, 4-5 = level 2.
 * context_tags: [] — deferred to Phase 23+
 * counterpart_mood: undefined — deferred to Phase 23+
 */

import type { Scenario } from "../types/drill";

export const drillScenarios: Record<string, Scenario[]> = {
  // ---------------------------------------------------------------------------
  // MIRRORING — 5 scenarios (new content)
  // syntax_template: "Back of [last 1-3 words]"
  // ---------------------------------------------------------------------------
  mirroring: [
    {
      id: "mirror-1",
      technique_id: "mirroring",
      prompt:
        "Your partner says: 'I don't know if I want to go to that party.' Use mirroring to invite them to say more.",
      syntax_template: "Back of [last 1-3 words]",
      model_answer: "Back of don't know if you want to go.",
      difficulty_level: 1,
      evaluation_notes:
        "Check that response begins with 'Back of' and echoes the last 3-5 words in statement form without adding interpretation.",
      context_tags: [],
    },
    {
      id: "mirror-2",
      technique_id: "mirroring",
      prompt:
        "A colleague says: 'This project has too many moving parts.' Respond using mirroring.",
      syntax_template: "Back of [last 1-3 words]",
      model_answer: "Back of too many moving parts.",
      difficulty_level: 1,
      evaluation_notes:
        "Check for 'Back of' stem echoing the last 2-4 meaningful words. Should be statement form, not a question.",
      context_tags: [],
    },
    {
      id: "mirror-3",
      technique_id: "mirroring",
      prompt:
        "A client says: 'We weren't expecting the cost to be this high.' Respond using mirroring to invite elaboration.",
      syntax_template: "Back of [last 1-3 words]",
      model_answer: "Back of weren't expecting the cost to be this high.",
      difficulty_level: 1,
      evaluation_notes:
        "Check for 'Back of' stem. Longer mirror is acceptable here — captures the core of their concern.",
      context_tags: [],
    },
    {
      id: "mirror-4",
      technique_id: "mirroring",
      prompt:
        "Your manager says: 'I'm not sure this is the right time to discuss a raise.' Respond using mirroring.",
      syntax_template: "Back of [last 1-3 words]",
      model_answer: "Back of not sure this is the right time.",
      difficulty_level: 2,
      evaluation_notes:
        "Check for 'Back of' stem. Should NOT add interpretation like 'for a raise' — pure echo.",
      context_tags: [],
    },
    {
      id: "mirror-5",
      technique_id: "mirroring",
      prompt:
        "A direct report says: 'I feel like my ideas never get heard in this team.' Respond using mirroring.",
      syntax_template: "Back of [last 1-3 words]",
      model_answer: "Back of ideas never get heard in this team.",
      difficulty_level: 2,
      evaluation_notes:
        "Check for 'Back of' stem. Dropping 'I feel like' to echo the core concern is correct technique.",
      context_tags: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // LABELING — 5 scenarios (extracted from src/features/labeling/scenarioBank.ts)
  // Source IDs: salary-001, sayno-001, difficult-001, salary-003, workplace-001
  // syntax_template: "It seems/sounds/looks like [observation]."
  // model_answer values are exact expertLabel values from scenarioBank.ts
  // ---------------------------------------------------------------------------
  labeling: [
    {
      id: "label-1",
      technique_id: "labeling",
      prompt:
        "You asked your manager for a 15% raise. They pause and say: 'I don't know if we can make that work right now.' Use a label to name what you observe.",
      syntax_template: "It seems/sounds/looks like [observation].",
      model_answer:
        "It sounds like you're concerned this could set a precedent that's hard to manage.",
      difficulty_level: 1,
      evaluation_notes:
        "Check for 'It seems/sounds/looks like' opener. Subject must be 'it', not 'I' or 'you'. Statement form — no question mark.",
      context_tags: [],
    },
    {
      id: "label-2",
      technique_id: "labeling",
      prompt:
        "A colleague approaches you about a project with a tight deadline: 'I really need you on this. You're the only one who can do it.' Use a label to name what you observe.",
      syntax_template: "It seems/sounds/looks like [observation].",
      model_answer:
        "It sounds like you're under a lot of pressure to deliver this.",
      difficulty_level: 1,
      evaluation_notes:
        "Check opener syntax. Reward labeling the underlying pressure/driver rather than just 'desperate' surface emotion.",
      context_tags: [],
    },
    {
      id: "label-3",
      technique_id: "labeling",
      prompt:
        "Your partner comes home withdrawn. When you ask how they are, they say: 'I had a rough day today.' Use a label to name what you observe.",
      syntax_template: "It seems/sounds/looks like [observation].",
      model_answer:
        "It sounds like you need to just decompress without me trying to fix anything.",
      difficulty_level: 1,
      evaluation_notes:
        "Check opener syntax. The best labels here name the need (to decompress) not just the surface emotion (tired/stressed).",
      context_tags: [],
    },
    {
      id: "label-4",
      technique_id: "labeling",
      prompt:
        "After presenting your case for a promotion, your manager says: 'Let me think about it and get back to you.' Use a label to name what you observe.",
      syntax_template: "It seems/sounds/looks like [observation].",
      model_answer:
        "It sounds like you want to make sure you're making the right call here.",
      difficulty_level: 2,
      evaluation_notes:
        "Check opener syntax and statement form. Labeling the need (to make the right call) beats labeling the stalling behavior.",
      context_tags: [],
    },
    {
      id: "label-5",
      technique_id: "labeling",
      prompt:
        "In a meeting, a colleague interrupts your presentation: 'Actually, we tried that before and it didn't work.' Use a label to name what you observe.",
      syntax_template: "It seems/sounds/looks like [observation].",
      model_answer:
        "It sounds like you have valuable experience with this that hasn't been acknowledged.",
      difficulty_level: 2,
      evaluation_notes:
        "Check opener syntax. Reward naming the underlying desire for recognition over just 'dismissive' surface read.",
      context_tags: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // OPEN-ENDED QUESTIONS — 5 scenarios (new content)
  // syntax_template: "What/How/Why/Tell me [open question]?"
  // ---------------------------------------------------------------------------
  "open-ended-question": [
    {
      id: "oeq-1",
      technique_id: "open-ended-question",
      prompt:
        "A team member seems disengaged during your one-on-one. They give short answers. You want to understand what's going on. Ask an open-ended question.",
      syntax_template: "What/How/Why/Tell me [open question]?",
      model_answer: "What's been taking up most of your energy this week?",
      difficulty_level: 1,
      evaluation_notes:
        "Check that the question begins with 'What', 'How', 'Why', 'When', 'Where', or 'Tell me'. It must be impossible to answer with just yes or no.",
      context_tags: [],
    },
    {
      id: "oeq-2",
      technique_id: "open-ended-question",
      prompt:
        "A client says the proposal doesn't feel right but can't explain why. Ask an open-ended question to understand their concern.",
      syntax_template: "What/How/Why/Tell me [open question]?",
      model_answer: "What would need to be different for this to feel right?",
      difficulty_level: 1,
      evaluation_notes:
        "Check open stem. Reward questions that invite the client to articulate their own criteria rather than offering options.",
      context_tags: [],
    },
    {
      id: "oeq-3",
      technique_id: "open-ended-question",
      prompt:
        "Your partner says they're stressed but brushes it off when you ask. You want to create space for them to share. Ask an open-ended question.",
      syntax_template: "What/How/Why/Tell me [open question]?",
      model_answer: "What's been weighing on you most?",
      difficulty_level: 1,
      evaluation_notes:
        "Check open stem. Short, open questions work better here than long compound questions. Penalize yes/no question forms.",
      context_tags: [],
    },
    {
      id: "oeq-4",
      technique_id: "open-ended-question",
      prompt:
        "A direct report says they're 'fine' with the new process, but their body language suggests otherwise. Ask an open-ended question to surface the real concern.",
      syntax_template: "What/How/Why/Tell me [open question]?",
      model_answer:
        "How has the new process been landing for you on a day-to-day level?",
      difficulty_level: 2,
      evaluation_notes:
        "Check open stem. Reward questions that invite concrete experience ('how has it been') over abstract agreement ('do you think it works').",
      context_tags: [],
    },
    {
      id: "oeq-5",
      technique_id: "open-ended-question",
      prompt:
        "In a negotiation, the other party says 'We just can't do that.' You want to understand what's actually driving their position. Ask an open-ended question.",
      syntax_template: "What/How/Why/Tell me [open question]?",
      model_answer: "What would make that possible from your side?",
      difficulty_level: 2,
      evaluation_notes:
        "Check open stem. This is a 'What would it take' question — one of the most powerful negotiation open questions. Penalize closed-form alternatives.",
      context_tags: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // I-STATEMENTS — 5 scenarios (new content)
  // syntax_template: "I feel [emotion] when [behavior] because [impact]."
  // ---------------------------------------------------------------------------
  "i-statement": [
    {
      id: "ist-1",
      technique_id: "i-statement",
      prompt:
        "A colleague keeps interrupting you during meetings and you want to address it without blaming them. Write an I-statement.",
      syntax_template: "I feel [emotion] when [behavior] because [impact].",
      model_answer:
        "I feel sidelined when I'm interrupted mid-thought because I lose track of my point and feel like my input doesn't matter.",
      difficulty_level: 1,
      evaluation_notes:
        "Check for 'I feel' opener with a genuine emotion word. Reward inclusion of 'when' (behavior) and 'because' (impact). Penalize 'you always' framing.",
      context_tags: [],
    },
    {
      id: "ist-2",
      technique_id: "i-statement",
      prompt:
        "Your manager assigns you extra work without asking if you have capacity. You need to address it. Write an I-statement.",
      syntax_template: "I feel [emotion] when [behavior] because [impact].",
      model_answer:
        "I feel overwhelmed when new tasks are added without checking my current workload because I can't prioritize effectively.",
      difficulty_level: 1,
      evaluation_notes:
        "Check 'I feel' stem and genuine emotion word. The behavior clause ('when') should be specific and observable, not a generalization.",
      context_tags: [],
    },
    {
      id: "ist-3",
      technique_id: "i-statement",
      prompt:
        "Your partner makes plans that affect both of you without consulting you first. Write an I-statement.",
      syntax_template: "I feel [emotion] when [behavior] because [impact].",
      model_answer:
        "I feel left out when plans are made without checking with me first because it makes me feel like my schedule doesn't factor in.",
      difficulty_level: 1,
      evaluation_notes:
        "Check 'I feel' stem. 'Left out' is a genuine feeling here. Penalize pseudo-feelings like 'I feel ignored' or 'I feel like you don't care'.",
      context_tags: [],
    },
    {
      id: "ist-4",
      technique_id: "i-statement",
      prompt:
        "A client dismisses your recommendation without engaging with your reasoning. You want to express your concern. Write an I-statement.",
      syntax_template: "I feel [emotion] when [behavior] because [impact].",
      model_answer:
        "I feel frustrated when a recommendation is set aside before I can explain the reasoning because it makes it harder for us to find the best solution together.",
      difficulty_level: 2,
      evaluation_notes:
        "Check 'I feel' stem and emotion word. In professional contexts, 'frustrated' is appropriate. Penalize blaming language like 'when you dismiss me'.",
      context_tags: [],
    },
    {
      id: "ist-5",
      technique_id: "i-statement",
      prompt:
        "Your skip-level manager keeps giving you direct feedback without going through your manager. You need to address it. Write an I-statement.",
      syntax_template: "I feel [emotion] when [behavior] because [impact].",
      model_answer:
        "I feel uncertain when I receive direction from two levels at once because I'm not sure which priorities to act on first.",
      difficulty_level: 2,
      evaluation_notes:
        "Check 'I feel' stem and genuine emotion ('uncertain'). Reward 'I' ownership of the feeling. Penalize language that accuses or assigns blame.",
      context_tags: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // NO-ORIENTED QUESTIONS — 5 scenarios (new content)
  // syntax_template: "Would it be ridiculous to...? / Have you given up on...?"
  // ---------------------------------------------------------------------------
  "no-oriented-question": [
    {
      id: "noq-1",
      technique_id: "no-oriented-question",
      prompt:
        "You want to propose a phased implementation timeline to a hesitant stakeholder. Use a no-oriented question.",
      syntax_template:
        "Would it be ridiculous to...? / Have you given up on...?",
      model_answer:
        "Would it be ridiculous to start with a two-week pilot before committing to the full rollout?",
      difficulty_level: 1,
      evaluation_notes:
        "Check for 'Would it be ridiculous to', 'Have you given up on', or similar no-oriented stem. The desired answer from the counterpart should be 'No'.",
      context_tags: [],
    },
    {
      id: "noq-2",
      technique_id: "no-oriented-question",
      prompt:
        "A client went quiet after your proposal. You want to check if they're still interested without pressuring them. Use a no-oriented question.",
      syntax_template:
        "Would it be ridiculous to...? / Have you given up on...?",
      model_answer:
        "Have you given up on finding something that could work here?",
      difficulty_level: 1,
      evaluation_notes:
        "Check for no-oriented stem. 'Have you given up on' is a classic Voss no-oriented framing. Penalize yes-oriented questions like 'Are you still interested?'",
      context_tags: [],
    },
    {
      id: "noq-3",
      technique_id: "no-oriented-question",
      prompt:
        "You want to explore a salary increase with a manager who seems reluctant. Use a no-oriented question to open the conversation.",
      syntax_template:
        "Would it be ridiculous to...? / Have you given up on...?",
      model_answer:
        "Would it be out of the question to revisit my compensation in the next quarter?",
      difficulty_level: 2,
      evaluation_notes:
        "Check for no-oriented stem. The framing should invite 'No, that's not out of the question' as the natural response.",
      context_tags: [],
    },
    {
      id: "noq-4",
      technique_id: "no-oriented-question",
      prompt:
        "A vendor has been unresponsive about a contract renewal. You want to reach out without sounding desperate. Use a no-oriented question.",
      syntax_template:
        "Would it be ridiculous to...? / Have you given up on...?",
      model_answer: "Have you given up on moving forward with our partnership?",
      difficulty_level: 2,
      evaluation_notes:
        "Check for no-oriented stem. This framing creates urgency without pressure. Penalize 'Would you like to...' or similar yes-oriented forms.",
      context_tags: [],
    },
    {
      id: "noq-5",
      technique_id: "no-oriented-question",
      prompt:
        "After a negotiation stall, you want to re-engage without seeming weak. Use a no-oriented question.",
      syntax_template:
        "Would it be ridiculous to...? / Have you given up on...?",
      model_answer:
        "Is it a bad idea to get back together this week to see if there's a path forward?",
      difficulty_level: 2,
      evaluation_notes:
        "Check for no-oriented stem. 'Is it a bad idea to' is valid. The question structure should make 'No' the natural, comfortable answer.",
      context_tags: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // NVC OBSERVATION — 5 scenarios (new content)
  // syntax_template: "When I see/hear/notice [specific observable fact]..."
  // ---------------------------------------------------------------------------
  "nvc-observation": [
    {
      id: "nvc-obs-1",
      technique_id: "nvc-observation",
      prompt:
        "You want to address a pattern you've noticed with a colleague: they've been late to the last three team meetings. Write a pure NVC observation — no evaluation, no interpretation.",
      syntax_template: "When I see/hear/notice [specific observable fact]...",
      model_answer:
        "Over the past three weeks, I noticed you arrived after the meeting had started on three occasions.",
      difficulty_level: 1,
      evaluation_notes:
        "Check that the statement contains only observable facts — specific times, counts, behaviors. Penalize generalizations ('always late') or interpretations ('doesn't respect the team's time').",
      context_tags: [],
    },
    {
      id: "nvc-obs-2",
      technique_id: "nvc-observation",
      prompt:
        "Your partner has been spending more time on their phone during dinner for the past week. You want to raise this without judgment. Write a pure NVC observation.",
      syntax_template: "When I see/hear/notice [specific observable fact]...",
      model_answer:
        "In the last week, I noticed you checked your phone during dinner each evening.",
      difficulty_level: 1,
      evaluation_notes:
        "Check for specific, observable fact. 'Each evening' is a count; acceptable. Penalize 'You're always on your phone' or 'You clearly don't want to talk to me'.",
      context_tags: [],
    },
    {
      id: "nvc-obs-3",
      technique_id: "nvc-observation",
      prompt:
        "A direct report submitted their project report two days after the agreed deadline. Write a pure NVC observation to open the conversation.",
      syntax_template: "When I see/hear/notice [specific observable fact]...",
      model_answer:
        "The report was due on Tuesday and I received it on Thursday.",
      difficulty_level: 1,
      evaluation_notes:
        "Check for specific dates and facts only. 'The report was due on' and 'I received it on' are pure observation. Penalize 'You were late' or 'You missed the deadline again'.",
      context_tags: [],
    },
    {
      id: "nvc-obs-4",
      technique_id: "nvc-observation",
      prompt:
        "In three recent one-on-ones, your manager has cut the meeting short or rescheduled at the last minute. You want to name this pattern. Write a pure NVC observation.",
      syntax_template: "When I see/hear/notice [specific observable fact]...",
      model_answer:
        "In the last three one-on-ones, the meeting either ended early or was rescheduled the same day.",
      difficulty_level: 2,
      evaluation_notes:
        "Check for specific count and observable behavior. 'Ended early' and 'rescheduled the same day' are facts. Penalize 'You don't seem to value our one-on-ones'.",
      context_tags: [],
    },
    {
      id: "nvc-obs-5",
      technique_id: "nvc-observation",
      prompt:
        "A client has not responded to your last two emails about a pending contract, sent 7 and 4 days ago. Write a pure NVC observation to open your follow-up.",
      syntax_template: "When I see/hear/notice [specific observable fact]...",
      model_answer:
        "I sent a follow-up on the contract seven days ago and again four days ago, and I haven't received a response to either.",
      difficulty_level: 2,
      evaluation_notes:
        "Check for specific counts and observable facts. Penalize 'You've been ignoring my emails' or 'You're clearly not a priority-setter'.",
      context_tags: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // NVC FEELING — 5 scenarios (new content)
  // syntax_template: "I feel [genuine emotion word]..."
  // ---------------------------------------------------------------------------
  "nvc-feeling": [
    {
      id: "nvc-feel-1",
      technique_id: "nvc-feeling",
      prompt:
        "Your request for feedback on a project was dismissed without engagement. Express your feeling using NVC — a genuine emotion word, not a pseudo-feeling.",
      syntax_template: "I feel [genuine emotion word]...",
      model_answer:
        "I feel disappointed when a request for feedback doesn't get a response.",
      difficulty_level: 1,
      evaluation_notes:
        "Check 'I feel' stem with a genuine emotion. 'Disappointed' is genuine. Penalize pseudo-feelings: 'I feel ignored', 'I feel like you don't care', 'I feel unheard'.",
      context_tags: [],
    },
    {
      id: "nvc-feel-2",
      technique_id: "nvc-feeling",
      prompt:
        "You found out a decision affecting your project was made without your input. Express your feeling using NVC.",
      syntax_template: "I feel [genuine emotion word]...",
      model_answer:
        "I feel anxious when decisions that affect my work are made without my involvement.",
      difficulty_level: 1,
      evaluation_notes:
        "Check 'I feel' stem and genuine emotion. 'Anxious' is genuine. 'Excluded' is borderline — if used, check that it's an emotion not an accusation. Penalize 'I feel overlooked'.",
      context_tags: [],
    },
    {
      id: "nvc-feel-3",
      technique_id: "nvc-feeling",
      prompt:
        "You completed a major deliverable on time and it was received positively. Express your feeling using NVC.",
      syntax_template: "I feel [genuine emotion word]...",
      model_answer: "I feel proud when a project I worked hard on lands well.",
      difficulty_level: 1,
      evaluation_notes:
        'Check "I feel" stem and genuine positive emotion. This scenario tests that learners apply NVC in positive contexts, not just complaints.',
      context_tags: [],
    },
    {
      id: "nvc-feel-4",
      technique_id: "nvc-feeling",
      prompt:
        "During a tense conversation, you noticed your voice rising and your body tightening. You want to name what you are feeling before responding. Write an NVC feeling statement.",
      syntax_template: "I feel [genuine emotion word]...",
      model_answer:
        "I feel scared that this conversation is heading somewhere neither of us wants it to go.",
      difficulty_level: 2,
      evaluation_notes:
        "Check 'I feel' stem and genuine emotion. 'Scared' is genuine. This tests the real-time self-awareness application of NVC feelings. Penalize pseudo-feelings like 'I feel attacked'.",
      context_tags: [],
    },
    {
      id: "nvc-feel-5",
      technique_id: "nvc-feeling",
      prompt:
        "A colleague you've worked closely with is leaving the team. You want to express how you feel about it. Write an NVC feeling statement.",
      syntax_template: "I feel [genuine emotion word]...",
      model_answer:
        "I feel sad that you're leaving and grateful for the collaboration we've had.",
      difficulty_level: 2,
      evaluation_notes:
        "Check 'I feel' stem and genuine emotions. 'Sad' and 'grateful' are genuine. This tests positive relational NVC use. Penalize 'I feel abandoned' (pseudo-feeling).",
      context_tags: [],
    },
  ],

  // ---------------------------------------------------------------------------
  // ACCUSATION AUDIT — 5 scenarios (extracted from src/features/accusation-audit/scenarios.ts)
  // Source IDs: audit-salary-001, audit-sayno-001, audit-sayno-002, audit-difficult-001, audit-workplace-001
  // syntax_template: "You probably think I'm [worst assumption]. / I know this might seem like [negative]."
  // model_answer synthesized from commonCriticisms[0] and commonCriticisms[1]
  // ---------------------------------------------------------------------------
  "accusation-audit": [
    {
      id: "aa-1",
      technique_id: "accusation-audit",
      prompt:
        "You are about to ask your manager for a 15% raise during your annual review. Before making your ask, do an accusation audit — name the negative assumptions they might have about you.",
      syntax_template:
        "You probably think I'm [worst assumption]. / I know this might seem like [negative].",
      model_answer:
        "You probably think I'm being ungrateful for what I already have. And you might think I'm only motivated by money.",
      difficulty_level: 1,
      evaluation_notes:
        "Check for audit stem ('You probably think', 'You might think', 'I know this might seem'). Reward naming 2+ negative assumptions. Penalize defensive openers like 'I just want to be honest'.",
      context_tags: [],
    },
    {
      id: "aa-2",
      technique_id: "accusation-audit",
      prompt:
        "Your boss is about to ask you to take on an extra project and you need to decline. Before declining, do an accusation audit — name what they might be thinking.",
      syntax_template:
        "You probably think I'm [worst assumption]. / I know this might seem like [negative].",
      model_answer:
        "You might be thinking I'm not being a team player. And I know this might seem like I'm not committed enough to step up when the team needs it.",
      difficulty_level: 1,
      evaluation_notes:
        "Check for audit stem. Reward naming 2 critical criticisms from the scenario (not-team-player, not-committed). Penalize 'I'm not trying to' defensive framing.",
      context_tags: [],
    },
    {
      id: "aa-3",
      technique_id: "accusation-audit",
      prompt:
        "Your close friend wants you to do free consulting for their startup and you need to decline. Do an accusation audit before you say no.",
      syntax_template:
        "You probably think I'm [worst assumption]. / I know this might seem like [negative].",
      model_answer:
        "You probably think I don't value our friendship. And I know this might seem like I'm being selfish.",
      difficulty_level: 1,
      evaluation_notes:
        "Check for audit stem. Reward naming the friendship concern and the selfish label. Penalize justifications or explanations instead of auditing assumptions.",
      context_tags: [],
    },
    {
      id: "aa-4",
      technique_id: "accusation-audit",
      prompt:
        "You are about to give critical performance feedback to a direct report. Do an accusation audit before starting the conversation.",
      syntax_template:
        "You probably think I'm [worst assumption]. / I know this might seem like [negative].",
      model_answer:
        "You probably think I'm being unfair. And I know this might seem like I don't see how hard you've been trying.",
      difficulty_level: 2,
      evaluation_notes:
        "Check for audit stem. Reward naming the 'unfair' and 'don't see effort' criticisms. This is a harder context — penalize defensive hedging.",
      context_tags: [],
    },
    {
      id: "aa-5",
      technique_id: "accusation-audit",
      prompt:
        "You are about to ask your manager for remote work flexibility when the company prefers in-office. Do an accusation audit.",
      syntax_template:
        "You probably think I'm [worst assumption]. / I know this might seem like [negative].",
      model_answer:
        "You probably think I'm not as committed to the team if I'm not in the office. And I know this might seem like I'm looking for an excuse to do less.",
      difficulty_level: 2,
      evaluation_notes:
        "Check for audit stem. Reward naming 'not committed' and 'slack off' assumptions. Two assumptions is the right level for this difficulty.",
      context_tags: [],
    },
  ],
};
