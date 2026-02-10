"""
KDENZ Voice Lab — VCM Root Cause Database (Code-Ready Module)
==============================================================

Complete Volitional Chain Model data structure.
8 gates, 56 primary entries + 4 C0-P subtypes = 60 total diagnostic entries.

Import into feedback_mapping.py and vcm_gate_detection.py:
    from vcm_database import VCM_GATES, VOCAL_MARKERS, get_gate, get_entry

CONFIDENTIAL — PROPRIETARY IP
"""

from typing import Optional


# ═══════════════════════════════════════════════════════════════════════
# VCM GATES — 8 sequential constraint gates
# ═══════════════════════════════════════════════════════════════════════

VCM_GATES = {
    # ─── C0: Environmental Permeability ──────────────────────────
    "C0": {
        "name": "Environmental Permeability",
        "constraint_type": "Environment",
        "core_question": "Can the person physically act?",
        "neural_systems": ["Sensory Cortex", "Lateral PFC", "Medial PFC", "Dorsal Anterior Insula"],
        "vocal_signature": "Flat affect, resignation tone, low energy baseline, absence of vocal effort markers",
        "entries": {
            "C0-P": {
                "name": "Physical/Biological Limitation",
                "definition": "Medical, neurological, or metabolic conditions block action regardless of motivation.",
                "mechanism": "Structural biological constraint prevents motor output regardless of psychological state.",
                "decision_computation": "IF Physical_Limitation = TRUE THEN Action_Blocked (regardless of motivation state)",
                "diagnostic_signals": ["Chronic fatigue reports", "Medical history of relevant conditions", "Consistent inability across all goal domains"],
                "interventions": ["Medical evaluation", "Reduce goal scope", "Change structure"],
                "effect_size": "N/A — routes to medical evaluation",
                "subtypes": {
                    "C0-3": {"name": "Psychomotor Retardation", "mechanism": "Dopamine/motor system slowing"},
                    "C0-4": {"name": "Motor Readiness Failure", "mechanism": "Structural motor pathway damage"},
                    "C0-5": {"name": "Metabolic Insufficiency", "mechanism": "ATP/energy depletion"},
                    "C0-6": {"name": "HPA Axis Exhaustion", "mechanism": "Autonomic burnout"},
                },
            },
            "C0-1": {
                "name": "Environmental Friction",
                "definition": "Environmental friction (distance, setup time, clutter) raises initiation threshold above motor readiness.",
                "mechanism": "Environmental friction increases perceived effort cost beyond willingness-to-act threshold.",
                "decision_computation": "IF Environmental_Friction > Activation_Threshold THEN Action_Blocked",
                "diagnostic_signals": ["Setup time complaints", "Distance/access barriers cited", "Clutter/disorganization prevents starting"],
                "interventions": ["Reduce activation cost", "Environmental redesign", "Reduce friction"],
                "effect_size": "d = 0.3-0.8",
            },
            "C0-2": {
                "name": "Situational Blockage",
                "definition": "Structural, resource, or social constraints make goal objectively non-viable.",
                "mechanism": "Objective structural constraints prevent action regardless of internal motivation state.",
                "decision_computation": "IF Resource_Available = FALSE OR Access_Blocked = TRUE THEN Goal_Non_Viable",
                "diagnostic_signals": ["Chronic environment excuses (legitimate)", "Resource constraints verified", "Social/legal barriers present"],
                "interventions": ["Change structure", "Modify context", "Reduce goal scope"],
                "effect_size": "d = 0.3-0.6",
            },
        },
    },

    # ─── C1: Believability ───────────────────────────────────────
    "C1": {
        "name": "Believability",
        "constraint_type": "Perception",
        "core_question": "Does the person believe the goal is achievable?",
        "neural_systems": ["Ventral Striatum", "vmPFC", "Lateral PFC"],
        "vocal_signature": "Low confidence markers, pitch instability on self-referential statements, hedging language, rising intonation on declaratives, hesitation clusters",
        "entries": {
            "C1-1": {
                "name": "Cognitive Biases (Overconfidence/Planning Fallacy)",
                "definition": "Overconfident predictions override realistic assessment; planning fallacy creates prediction-reality gap.",
                "mechanism": "Inside view dominance; base-rate neglect inflates success expectations.",
                "decision_computation": "IF Confidence > Evidence_Base THEN Prediction_Error_HIGH",
                "diagnostic_signals": ["History of underestimating timelines", "Surprise at failures", "No contingency planning"],
                "interventions": ["Rebuild efficacy", "Increase specificity", "Mastery experiences"],
                "effect_size": "d = 0.5-0.7",
            },
            "C1-2": {
                "name": "Fixed Mindset",
                "definition": "Belief that personal limitations are unchangeable biases efficacy updating downward.",
                "mechanism": "Entity theory of ability; perceived ceiling on growth biases efficacy updating downward, especially in at-risk populations.",
                "decision_computation": "IF Belief(Ability_Fixed) = TRUE THEN Efficacy_Updating_Biased_Downward",
                "diagnostic_signals": ["'I'm just not good at this'", "'Some people can, I can't'", "Avoids challenge"],
                "interventions": ["Rebuild efficacy", "Mastery experiences", "Reframe reward"],
                "effect_size": "d = 0.05-0.20",
            },
            "C1-3": {
                "name": "No Relatable Models",
                "definition": "Absence of proximal role models undermines vicarious efficacy.",
                "mechanism": "Vicarious efficacy pathway blocked; no similar-other success evidence available.",
                "decision_computation": "IF Proximal_Models = 0 THEN Vicarious_Efficacy = LOW",
                "diagnostic_signals": ["'Nobody like me has done this'", "'I don't know anyone who succeeded'"],
                "interventions": ["Rebuild efficacy", "Increase value alignment"],
                "effect_size": "d = 0.15-0.35",
            },
            "C1-4": {
                "name": "Meta-Cognitive Doubt",
                "definition": "Meta-level self-doubt halts belief formation.",
                "mechanism": "Second-order doubt; questioning own cognitive processes prevents stable belief.",
                "decision_computation": "IF Trust(Own_Judgment) = LOW THEN Belief_Formation_Halted",
                "diagnostic_signals": ["'I can't trust my own decisions'", "'What if I'm wrong about being able to do this?'"],
                "interventions": ["Rebuild efficacy", "Increase perceived control", "Mastery experiences"],
                "effect_size": "d = 0.3-0.5",
            },
            "C1-5": {
                "name": "Insufficient Evidence",
                "definition": "Insufficient information about goal feasibility prevents stable belief.",
                "mechanism": "Belief formation requires minimum evidence threshold; insufficient data prevents commitment.",
                "decision_computation": "IF Evidence(Feasibility) < Belief_Threshold THEN Belief_Unstable",
                "diagnostic_signals": ["'I don't know enough to know if I can do this'", "Excessive research without action"],
                "interventions": ["Rebuild efficacy", "Mastery experiences", "Simulate context"],
                "effect_size": "d = 0.2-0.5",
            },
            "C1-6": {
                "name": "Fragile Confidence",
                "definition": "Confidence easily undermined by setbacks or external criticism.",
                "mechanism": "Efficacy representation unstable; single negative signal collapses belief structure.",
                "decision_computation": "IF Setback_Sensitivity = HIGH AND Setback_Occurs THEN Efficacy_Collapse",
                "diagnostic_signals": ["Confidence drops after minor criticism", "One bad day erases weeks of progress"],
                "interventions": ["Rebuild efficacy", "Reward persistence", "Mastery experiences"],
                "effect_size": "d = 0.4-0.6",
            },
            "C1-7": {
                "name": "Social Disconfirmation",
                "definition": "Social pressure or negative feedback undermines belief; external skepticism erodes self-efficacy through Bandura's verbal persuasion pathway.",
                "mechanism": "Verbal persuasion pathway (Bandura, 1977): negative social feedback degrades self-efficacy beliefs.",
                "decision_computation": "IF Social_Feedback = NEGATIVE THEN Efficacy_Erosion",
                "diagnostic_signals": ["'Everyone says I can't'", "'My family doesn't believe in me'"],
                "interventions": ["Rebuild efficacy", "Increase perceived control", "Change structure"],
                "effect_size": "d = 0.2-0.4",
            },
            "C1-8": {
                "name": "Impostor Attribution Pattern",
                "definition": "Success attributed to external factors prevents efficacy consolidation; impostor phenomenon pattern.",
                "mechanism": "External attribution bias; self-efficacy cannot update from success experiences. Foundational: Weiner (1985) attribution theory.",
                "decision_computation": "IF Attribution(Success) = EXTERNAL THEN Efficacy_Update_Blocked",
                "diagnostic_signals": ["'I got lucky'", "'Someone helped me'", "'It was easy, doesn't count'"],
                "interventions": ["Rebuild efficacy", "Increase perceived control"],
                "effect_size": "d = 0.3-0.5 (estimated)",
            },
        },
    },

    # ─── C2: Desire ──────────────────────────────────────────────
    "C2": {
        "name": "Desire",
        "constraint_type": "Desire",
        "core_question": "Does the person genuinely want the goal?",
        "neural_systems": ["Midbrain Dopamine", "Ventral Striatum", "vmPFC"],
        "vocal_signature": "Flat engagement when discussing goal, vocal tension on commitment statements, energy drops during future-casting, mismatch between verbal enthusiasm and prosodic markers",
        "entries": {
            "C2-1": {
                "name": "Value Misalignment",
                "definition": "Goal pursued for extrinsic reasons, not authentic values.",
                "mechanism": "Goal-value incongruence; vmPFC cannot assign authentic value to misaligned goal.",
                "decision_computation": "IF Goal_Value_Alignment < Threshold THEN Intrinsic_Motivation = LOW",
                "diagnostic_signals": ["'I should want this but I don't'", "'Everyone says this is important'", "Flat tone discussing goal"],
                "interventions": ["Increase value alignment", "Reframe reward"],
                "effect_size": "d = 0.4-0.7",
            },
            "C2-2": {
                "name": "Fear-Suppressed Desire",
                "definition": "Desire exists but suppressed by anticipated loss or disruption.",
                "mechanism": "Amygdala threat response overrides approach motivation; desire present but gated by fear.",
                "decision_computation": "IF Fear(Consequence) > Desire(Goal) THEN Approach_Blocked",
                "diagnostic_signals": ["'I want to but what if...'", "'It could ruin everything'", "Visible tension when imagining success"],
                "interventions": ["Reduce cost", "Reframe reward", "Simulate context"],
                "effect_size": "d = 0.5-0.7",
            },
            "C2-3": {
                "name": "Emotional Avoidance",
                "definition": "Emotional discomfort associated with goal blocks desire.",
                "mechanism": "Experiential avoidance; emotional cost of engagement exceeds perceived benefit.",
                "decision_computation": "IF Emotional_Cost(Engagement) > Perceived_Benefit THEN Avoidance_Dominates",
                "diagnostic_signals": ["Avoidance behavior", "Negative self-talk about goal", "Physical discomfort discussing goal"],
                "interventions": ["Reduce cost", "Reframe reward", "Simulate context"],
                "effect_size": "d = 0.5-0.8",
            },
            "C2-4": {
                "name": "Autonomy Threat (Reactance)",
                "definition": "External pressure triggers oppositional motivation; boomerang effect enhances competing desire.",
                "mechanism": "Psychological reactance; perceived freedom threat generates Competing_Desire_Activated(Freedom_Restoration). Brehm (1966): desire ENHANCEMENT, not suppression.",
                "decision_computation": "IF Perceived_Control_Loss = TRUE THEN Competing_Desire_Activated(Freedom_Restoration)",
                "diagnostic_signals": ["'Don't tell me what to do'", "'The more they push, the less I want to'"],
                "interventions": ["Increase perceived control", "Reduce cost", "Change structure"],
                "effect_size": "d = 0.3-0.5",
            },
            "C2-5": {
                "name": "Approach-Avoidance Conflict",
                "definition": "Simultaneous desire and anti-desire cancel motivation; net motivation = 0.",
                "mechanism": "Dual-process conflict; approach and avoidance systems simultaneously activated.",
                "decision_computation": "IF Approach_Force ≈ Avoidance_Force THEN Oscillation + Anxiety + BIS_Activation",
                "diagnostic_signals": ["'Part of me wants to, part of me doesn't'", "Oscillating commitment", "Decision paralysis about wanting"],
                "interventions": ["Reduce cost", "Reframe reward", "Increase value alignment"],
                "effect_size": "d = 0.4-0.6",
            },
            "C2-6": {
                "name": "External Motivation",
                "definition": "Goal pursued exclusively for approval/reward from others.",
                "mechanism": "SDT framework; external rewards undermine internalization.",
                "decision_computation": "IF Intrinsic_Motivation = 0 AND Only_External_Rewards = TRUE THEN Motivation_Fragile",
                "diagnostic_signals": ["'I'm doing this to impress others'", "'Without external reward, I lose interest'"],
                "interventions": ["Increase value alignment", "Autonomy support", "Internalization facilitation"],
                "effect_size": "d = 0.3-0.5",
            },
            "C2-7": {
                "name": "Purpose Deficit",
                "definition": "No sense of purpose attached to goal; subjective value = 0.",
                "mechanism": "Meaning-making failure; goal lacks connection to superordinate purpose.",
                "decision_computation": "IF Subjective_Value(Goal) = 0 THEN vmPFC_Value_Assignment = FAILED",
                "diagnostic_signals": ["'What's the point?'", "'This doesn't matter'", "Low pleasure anticipation"],
                "interventions": ["Increase value alignment", "Reframe reward"],
                "effect_size": "d = 0.3-0.7",
            },
            "C2-8": {
                "name": "Lack of Future Relevance",
                "definition": "Goal does not connect to long-term identity or future self.",
                "mechanism": "Temporal discounting inflates distance penalty; future benefit psychologically distant.",
                "decision_computation": "IF Temporal_Distance(Goal) > Discounting_Threshold THEN Present_Motivation = LOW",
                "diagnostic_signals": ["'I won't care about this in 5 years'", "'This doesn't matter for my future'"],
                "interventions": ["Increase value alignment", "Reframe reward"],
                "effect_size": "d = 0.3-0.5",
            },
        },
    },

    # ─── C3: Will ────────────────────────────────────────────────
    "C3": {
        "name": "Will",
        "constraint_type": "Will",
        "core_question": "Is the person willing to bear the cost?",
        "neural_systems": ["dACC", "Anterior Insula", "dlPFC"],
        "vocal_signature": "Stress spikes when discussing effort/sacrifice, vocal strain on cost descriptions, pitch elevation during effort estimation, breath pattern disruption",
        "entries": {
            "C3-1": {
                "name": "Self-Control Fatigue",
                "definition": "Reduced willingness to engage effortful control following prolonged cognitive demands; reflects motivational shift rather than capacity loss.",
                "mechanism": "Metabolic-then-motivational: prolonged cognitive work causes glutamate accumulation in lPFC, triggering motivational shift from 'have-to' to 'want-to' tasks. Not resource depletion.",
                "decision_computation": "IF Sustained_Effort_Duration > Fatigue_Threshold THEN Motivation_Shifts_To_Less_Effortful_Options",
                "diagnostic_signals": ["'I'm too tired'", "'I have nothing left'", "Effort avoidance across domains", "Recovery with increased incentives"],
                "interventions": ["Effort pacing", "Energy pacing", "Reduce goal scope", "Increase task engagement/autonomy"],
                "effect_size": "d = 0.31-0.35 (intensive protocols); near-zero with brief protocols",
            },
            "C3-2": {
                "name": "Delayed Gratification Intolerance",
                "definition": "Unable to tolerate delay between effort and reward.",
                "mechanism": "Hyperbolic discounting; future reward drastically devalued against immediate cost.",
                "decision_computation": "IF Discount_Rate(Reward) > Effort_Cost_Tolerance THEN Commitment_Rejected",
                "diagnostic_signals": ["'I need to see results now'", "'Why bother if payoff is years away'"],
                "interventions": ["Mini-deadlines", "Reframe reward", "Increase intrinsic cues"],
                "effect_size": "d = 0.4-0.6 (clinical); r = 0.10-0.20 (prediction)",
            },
            "C3-3": {
                "name": "Effort Overestimation",
                "definition": "Perceived effort judged excessive relative to reward.",
                "mechanism": "Effort computation error; posterior insula and ACC over-represent anticipated discomfort (brain regions corrected from anterior insula).",
                "decision_computation": "IF Perceived_Effort >> Actual_Effort THEN Commitment_Blocked",
                "diagnostic_signals": ["'This will be horrible'", "'I can't handle that much work'", "Task rationalization"],
                "interventions": ["Reduce cost", "Simulate context", "Micro-starts"],
                "effect_size": "FLAG: estimated composite, no meta-analytic anchor",
            },
            "C3-4": {
                "name": "Insufficient Perceived Reward",
                "definition": "Expected reward is not salient or valued enough to justify effort.",
                "mechanism": "Effort-reward tradeoff: dopamine's role is behavioral activation and effort allocation (Salamone), not hedonic 'liking' (Berridge framing).",
                "decision_computation": "IF Expected_Reward < Expected_Cost THEN Effort_Rejected",
                "diagnostic_signals": ["'It's not worth it'", "'The payoff doesn't match the work'"],
                "interventions": ["Reframe reward", "Increase value alignment", "Increase intrinsic cues"],
                "effect_size": "d = 0.3-0.5",
            },
            "C3-5": {
                "name": "Failure Cost Aversion",
                "definition": "Fear of loss from failed attempt exceeds potential gain.",
                "mechanism": "Loss aversion; asymmetric valuation of potential outcomes.",
                "decision_computation": "IF Loss(Failure) > Gain(Success) THEN Risk_Rejected",
                "diagnostic_signals": ["'What if I fail and lose everything?'", "'I'd rather not try than fail'"],
                "interventions": ["Reduce cost", "Reframe reward", "Simulate context"],
                "effect_size": "d = 0.5-0.8",
            },
            "C3-6": {
                "name": "Decision Paralysis (Analysis Paralysis)",
                "definition": "Inability to commit due to excessive option evaluation.",
                "mechanism": "Maximizing tendency; decision cost exceeds any single option's value.",
                "decision_computation": "IF Decision_Cost > Any_Option_Value THEN Commitment_Stalled",
                "diagnostic_signals": ["Endless comparison", "'I need more information'", "Chronic indecision"],
                "interventions": ["Increase specificity", "Mini-deadlines", "Pre-commitment"],
                "effect_size": "d = 0.0-0.5 (highly conditional)",
            },
        },
    },

    # ─── C4: Intention ───────────────────────────────────────────
    "C4": {
        "name": "Intention",
        "constraint_type": "Intention",
        "core_question": "Have they formed a concrete plan?",
        "neural_systems": ["dlPFC", "Posterior Parietal Cortex", "Mid-lateral PFC"],
        "vocal_signature": "Vague language, generic planning phrases, low specificity markers, hesitation on 'when' and 'how' questions, confident tone on 'what' but uncertain on execution details",
        "entries": {
            "C4-1": {
                "name": "Conflicting Plans",
                "definition": "Multiple active plans compete for the same execution resources.",
                "mechanism": "Goal-plan conflict; dlPFC cannot prioritize among competing action schemas.",
                "decision_computation": "IF Active_Plans > Executive_Capacity THEN Plan_Interference",
                "diagnostic_signals": ["Multiple concurrent goals", "'I have too many things going on'"],
                "interventions": ["Increase specificity", "Increase structure", "Use implementation intentions"],
                "effect_size": "d = 0.5-0.7",
            },
            "C4-2": {
                "name": "Chronic Replanning",
                "definition": "Continuous plan revision substitutes for execution.",
                "mechanism": "Planning as procrastination; dopamine from planning mimics action reward.",
                "decision_computation": "IF Replanning_Frequency > Execution_Frequency THEN Planning_Loop",
                "diagnostic_signals": ["Constant plan updates", "'I need to rethink my approach'", "Plans never stabilize"],
                "interventions": ["Implementation intentions", "Mini-deadlines", "Reduce friction"],
                "effect_size": "d = 0.4-0.6",
            },
            "C4-3": {
                "name": "Plan Selection Failure",
                "definition": "Cannot choose among viable plans; selection anxiety blocks commitment.",
                "mechanism": "Option overload; too many viable pathways prevents commitment to any.",
                "decision_computation": "IF Viable_Plans > Selection_Capacity THEN Selection_Paralysis",
                "diagnostic_signals": ["'I don't know which approach to take'", "Flip-flopping between strategies"],
                "interventions": ["Increase specificity", "Pre-commitment", "Satisficing over maximizing"],
                "effect_size": "d = 0.4-0.6",
            },
            "C4-4": {
                "name": "Cognitive Overload",
                "definition": "Plan complexity exceeds working memory capacity.",
                "mechanism": "WM capacity exceeded; plan cannot be maintained in active representation.",
                "decision_computation": "IF Plan_Complexity > WM_Capacity THEN Plan_Degradation",
                "diagnostic_signals": ["Forgets steps", "'It's too complicated'", "Simplification resistance"],
                "interventions": ["Increase structure", "Reduce goal scope", "External scaffolding"],
                "effect_size": "d = 0.5-0.8",
            },
            "C4-5": {
                "name": "Action Ambiguity",
                "definition": "Next step is unclear; no concrete first action identified.",
                "mechanism": "Intention-action gap; abstract goal not decomposed into executable steps.",
                "decision_computation": "IF First_Action = UNDEFINED THEN Execution_Blocked",
                "diagnostic_signals": ["'I don't know where to start'", "'What should I do first?'"],
                "interventions": ["Implementation intentions", "Increase specificity", "Micro-starts"],
                "effect_size": "d = 0.6-0.9",
            },
            "C4-6": {
                "name": "Recursive Justification",
                "definition": "Continuous re-justification of the plan delays execution.",
                "mechanism": "Doubt-justify loop; each justification cycle depletes executive resources.",
                "decision_computation": "IF Justification_Cycles > Threshold THEN Executive_Depletion",
                "diagnostic_signals": ["'Am I doing this for the right reasons?'", "Repeatedly defends plan to self"],
                "interventions": ["Pre-commitment", "Reduce friction", "Implementation intentions"],
                "effect_size": "d = 0.3-0.5",
            },
            "C4-7": {
                "name": "Weak Cue-Response Binding",
                "definition": "Situational cues fail to trigger planned action.",
                "mechanism": "IF-THEN binding failure; implementation intention not encoded strongly enough.",
                "decision_computation": "IF Cue_Response_Strength < Activation_Threshold THEN Cue_Missed",
                "diagnostic_signals": ["'I forgot to do it'", "'The moment passed'", "Inconsistent trigger response"],
                "interventions": ["Implementation intentions", "Habit stacking", "Immediate cues"],
                "effect_size": "d = 0.5-0.7",
            },
        },
    },

    # ─── C5: Commitment ──────────────────────────────────────────
    "C5": {
        "name": "Commitment",
        "constraint_type": "Commitment",
        "core_question": "Is their commitment robust?",
        "neural_systems": ["Anterior Cingulum Bundle", "dlPFC", "vmPFC"],
        "vocal_signature": "Engagement drops when alternatives mentioned, hedging on timeline questions, vocal energy decline across commitment statements, confidence pattern inconsistency",
        "entries": {
            "C5-1": {
                "name": "Competing Commitments",
                "definition": "Other obligations compete for same attentional/motivational resources; commitment diluted.",
                "mechanism": "Motivational/attentional competition; multiple active goals compete for limited prioritization bandwidth. Not resource depletion.",
                "decision_computation": "IF Commitment_Load > Prioritization_Bandwidth THEN New_Commitment_Fragile",
                "diagnostic_signals": ["'I have too many obligations'", "Frequent priority conflicts"],
                "interventions": ["Increase structure", "Pre-commitment", "Reduce goal scope"],
                "effect_size": "d = 0.4-0.6",
            },
            "C5-2": {
                "name": "Environmental Disruption",
                "definition": "External events destabilize commitment context.",
                "mechanism": "Context change invalidates commitment conditions; re-commitment required.",
                "decision_computation": "IF Context_Changed = TRUE THEN Commitment_Invalidated",
                "diagnostic_signals": ["Life changes disrupt routines", "'Everything changed, I can't keep going'"],
                "interventions": ["Change structure", "Modify context", "Re-commitment protocol"],
                "effect_size": "d = 0.4-0.7",
            },
            "C5-3": {
                "name": "No External Monitoring",
                "definition": "No accountability structure; commitment relies solely on internal resolve.",
                "mechanism": "Social commitment absent; no external cost to abandonment.",
                "decision_computation": "IF External_Monitoring = 0 THEN Abandonment_Cost = LOW",
                "diagnostic_signals": ["No one knows about the goal", "'I only answer to myself'"],
                "interventions": ["Pre-commitment", "Raise abandonment cost", "Monitor progress"],
                "effect_size": "d = 0.32-0.48",
            },
            "C5-4": {
                "name": "Insufficient Stakes",
                "definition": "Nothing meaningful at risk if commitment abandoned.",
                "mechanism": "Low sunk cost; abandonment is psychologically cheap.",
                "decision_computation": "IF Abandonment_Cost < Threshold THEN Commitment_Fragile",
                "diagnostic_signals": ["'I can always quit'", "'Nothing bad happens if I stop'"],
                "interventions": ["Raise abandonment cost", "Ulysses pact", "Pre-commitment"],
                "effect_size": "d = 0.2-0.7",
            },
            "C5-5": {
                "name": "Lack of Urgency",
                "definition": "No time pressure; commitment diffuses across infinite horizon.",
                "mechanism": "Temporal diffusion; unlimited time horizon removes urgency signals.",
                "decision_computation": "IF Deadline = NONE THEN Urgency = 0; Commitment_Diffuses",
                "diagnostic_signals": ["'I'll get to it eventually'", "'There's no rush'"],
                "interventions": ["Mini-deadlines", "Change timing", "Immediate cues"],
                "effect_size": "d = 0.5-0.8",
            },
            "C5-6": {
                "name": "Value Contradiction",
                "definition": "Goal conflicts with another deeply held value.",
                "mechanism": "Value hierarchy conflict; pursuing goal requires violating another value.",
                "decision_computation": "IF Goal_Value conflicts_with Core_Value THEN Commitment_Unstable",
                "diagnostic_signals": ["'This goes against what I believe'", "Guilt about pursuing goal"],
                "interventions": ["Increase value alignment", "Reframe reward", "Reduce cost"],
                "effect_size": "d = 0.3-0.6",
            },
            "C5-7": {
                "name": "Identity Misalignment",
                "definition": "Goal doesn't match self-concept; 'this isn't who I am.'",
                "mechanism": "Identity-goal incongruence; self-concept rejects goal as foreign.",
                "decision_computation": "IF Goal not_in Identity_Schema THEN Commitment_Rejected",
                "diagnostic_signals": ["'That's not really me'", "'People like me don't do that'"],
                "interventions": ["Increase value alignment", "Rebuild efficacy", "Identity work"],
                "effect_size": "d = 0.4-0.7",
            },
            "C5-8": {
                "name": "Identity-Behavior Dissonance",
                "definition": "Current behavior contradicts committed identity; dissonance erodes commitment.",
                "mechanism": "Cognitive dissonance; gap between self-concept and behavior creates instability.",
                "decision_computation": "IF Behavior != Identity_Commitment THEN Dissonance_Escalates",
                "diagnostic_signals": ["'I'm not living up to who I said I'd be'", "Shame about gaps"],
                "interventions": ["Self-compassion training", "Reduce cost", "Rebuild efficacy", "Micro-starts"],
                "effect_size": "d = 0.4-0.6 (ESTIMATED/INFERRED)",
            },
        },
    },

    # ─── C6A: Action Initiation ──────────────────────────────────
    "C6A": {
        "name": "Action Initiation",
        "constraint_type": "Action Initiation",
        "core_question": "Can they start?",
        "neural_systems": ["SMA", "Pre-SMA", "ACC motor zone", "Basal Ganglia"],
        "vocal_signature": "Freeze response markers, speech onset delays, vocal tremor at commitment moments, breath-holding patterns, sudden silence before action descriptions",
        "entries": {
            "C6A-1": {
                "name": "Motor Initiation Threshold",
                "definition": "Motor threshold to begin action is high; basal ganglia gate locked, inertia dominates.",
                "mechanism": "Motor initiation threshold elevated; striatal gate requires higher signal to open.",
                "decision_computation": "IF Motor_Signal < Activation_Threshold THEN Basal_Ganglia_Gate_Locked",
                "diagnostic_signals": ["'I just can't start'", "'I sit there wanting to begin but can't'", "Procrastination despite readiness"],
                "interventions": ["Reduce activation cost", "Micro-starts", "Reduce inertia"],
                "effect_size": "d = 0.4-0.8",
            },
            "C6A-2": {
                "name": "Last-Minute Deliberation",
                "definition": "Re-evaluating the plan at the moment of action; deliberation replaces execution.",
                "mechanism": "Executive override at motor gate; prefrontal re-engages at action threshold.",
                "decision_computation": "IF Deliberation_At_Action_Point = TRUE THEN Motor_Output_Blocked",
                "diagnostic_signals": ["'Wait, let me think about this more'", "Hesitation at action point"],
                "interventions": ["Pre-commitment", "Implementation intentions", "Reduce friction"],
                "effect_size": "d = 0.4-0.7",
            },
            "C6A-3": {
                "name": "Attention Diversion",
                "definition": "Attention captured by competing stimulus at initiation moment.",
                "mechanism": "Attentional hijack; salient alternative captures executive resources.",
                "decision_computation": "IF Competing_Salience > Task_Salience THEN Attention_Diverted",
                "diagnostic_signals": ["'I got distracted right when I was about to start'", "Phone/email/notification interference"],
                "interventions": ["Environmental control", "Remove distractors", "Add friction to alternatives"],
                "effect_size": "d = 0.5-0.8",
            },
            "C6A-4": {
                "name": "Waiting for Readiness",
                "definition": "Waiting for optimal internal state that never arrives.",
                "mechanism": "Readiness illusion; perfectionist criteria for starting are unattainable.",
                "decision_computation": "IF Readiness < Perfect_Threshold THEN Wait_Continues",
                "diagnostic_signals": ["'I'll start when I feel ready'", "'The timing isn't right'"],
                "interventions": ["Micro-starts", "Implementation intentions", "Start imperfectly"],
                "effect_size": "d = 0.5-0.7",
            },
            "C6A-5": {
                "name": "Over-Simulation",
                "definition": "Mental rehearsal substitutes for action; simulation feels like progress.",
                "mechanism": "Mental simulation completion effect; imagining doing triggers completion signal.",
                "decision_computation": "IF Mental_Rehearsal_Satisfaction > Action_Drive THEN Simulation_Loop",
                "diagnostic_signals": ["Extensive planning without action", "'I've thought about it a lot'", "Vivid plans, no execution"],
                "interventions": ["Micro-starts", "Implementation intentions", "Reduce friction"],
                "effect_size": "d = 0.4-0.6",
            },
            "C6A-6": {
                "name": "Self-Sabotage",
                "definition": "Unconscious creation of obstacles to protect self-concept from failure.",
                "mechanism": "Self-handicapping; creating failure excuse preserves self-esteem.",
                "decision_computation": "IF Self_Esteem_Threat > Goal_Value THEN Create_Obstacle",
                "diagnostic_signals": ["Creates obstacles before starting", "'I didn't really try'", "Last-minute interference"],
                "interventions": ["Rebuild efficacy", "Reduce cost", "Reframe reward"],
                "effect_size": "d = 0.4-0.7",
            },
            "C6A-7": {
                "name": "Momentum Dependency",
                "definition": "Cannot cold-start despite desire/planning/capability; continuation easy once momentum achieved. Common in ADHD (low tonic dopamine).",
                "mechanism": "Dopaminergic initiation deficit; tonic dopamine insufficient for cold-start but adequate for continuation.",
                "decision_computation": "IF Initiation_Threshold >> Continuation_Threshold THEN Cold_Start_Failure",
                "diagnostic_signals": ["'Once I start I'm fine, it's just starting'", "'I need a push to get going'"],
                "interventions": ["Micro-starts", "Reduce inertia", "Environmental redesign"],
                "effect_size": "d = 0.4-0.8",
            },
            "C6A-8": {
                "name": "Trauma-Related Freeze",
                "definition": "Threat-protective immobility; defense cascade via amygdala-PAG circuitry overrides volitional control.",
                "mechanism": "Defense cascade via amygdala-periaqueductal gray (PAG) circuitry: threat detection triggers escalating defensive responses (arousal → fight/flight → freeze → tonic immobility → collapse).",
                "decision_computation": "IF Threat_Detection = TRUE THEN Defense_Cascade_Freeze",
                "diagnostic_signals": ["Physical immobility", "'I shut down'", "'I can't move or think'"],
                "interventions": ["Trauma-informed therapy (EMDR, SE, CPT)", "Gradual exposure", "Professional support"],
                "effect_size": "Clinical — requires specialized treatment",
            },
        },
    },

    # ─── C6B: Action Persistence ─────────────────────────────────
    "C6B": {
        "name": "Action Persistence",
        "constraint_type": "Action Persistence",
        "core_question": "Can they sustain action?",
        "neural_systems": ["Dorsal Striatum", "ACC Persistence Circuit", "Motor Cortex"],
        "vocal_signature": "Energy decay across session, fatigue markers in later segments, rising frustration prosody, disengagement indicators (shortened responses, falling pitch contour)",
        "entries": {
            "C6B-1": {
                "name": "Task Boredom",
                "definition": "Task becomes unstimulating; dopaminergic drive decays.",
                "mechanism": "Hedonic adaptation; reward prediction error approaches zero with repetition.",
                "decision_computation": "IF Reward_Prediction_Error → 0 THEN Dopamine_Drive_Decays",
                "diagnostic_signals": ["'This is boring'", "'I've lost interest'", "Increasing task-switching"],
                "interventions": ["Increase intrinsic cues", "Reframe reward", "Add variety"],
                "effect_size": "d = 0.4-0.6",
            },
            "C6B-2": {
                "name": "Competing Stimuli (Distraction)",
                "definition": "More rewarding alternatives divert attention mid-task.",
                "mechanism": "Reward comparison; alternative options offer higher immediate reward.",
                "decision_computation": "IF Alternative_Reward > Current_Task_Reward THEN Attention_Shifts",
                "diagnostic_signals": ["Phone checking", "'Something more interesting came up'"],
                "interventions": ["Environmental control", "Add friction to alternatives", "Remove distractors"],
                "effect_size": "d = 0.5-0.7",
            },
            "C6B-3": {
                "name": "Mood-Dependent Execution",
                "definition": "Action only occurs in specific mood states; action stops when mood shifts.",
                "mechanism": "State-dependent motivation; action conditional on feeling state.",
                "decision_computation": "IF Current_Mood != Required_Mood THEN Action_Suspended",
                "diagnostic_signals": ["'I only work when I feel like it'", "'I wasn't in the mood'"],
                "interventions": ["Implementation intentions", "Habit stacking", "Decouple mood from action"],
                "effect_size": "d = 0.4-0.7",
            },
            "C6B-4": {
                "name": "Single-Error Catastrophizing",
                "definition": "One mistake triggers complete abandonment.",
                "mechanism": "All-or-nothing thinking; single deviation = total failure.",
                "decision_computation": "IF Error_Count >= 1 THEN Total_Failure_Declared",
                "diagnostic_signals": ["'I blew it, why bother continuing'", "'One mistake ruins everything'"],
                "interventions": ["Reward persistence", "Reframe reward", "Error normalization"],
                "effect_size": "d = 0.5-0.8",
            },
            "C6B-5": {
                "name": "Perfectionism",
                "definition": "Standards so high that adequate performance feels like failure.",
                "mechanism": "Unrealistic reference point; anything less than perfect triggers dissatisfaction.",
                "decision_computation": "IF Performance < Perfect THEN Satisfaction = 0",
                "diagnostic_signals": ["'It's not good enough'", "Excessive revision", "Never finishing"],
                "interventions": ["Reframe reward", "Reduce cost", "Progress feedback"],
                "effect_size": "d = 0.4-0.7",
            },
            "C6B-6": {
                "name": "Invisible Progress",
                "definition": "No visible feedback on progress; effort feels wasted.",
                "mechanism": "Progress signal absent; no reinforcement loop to sustain effort.",
                "decision_computation": "IF Progress_Visible = FALSE THEN Effort_Feels_Wasted",
                "diagnostic_signals": ["'I'm not getting anywhere'", "'Nothing is changing'"],
                "interventions": ["Progress feedback", "Monitor progress", "Mini-deadlines"],
                "effect_size": "d = 0.4-0.7",
            },
            "C6B-7": {
                "name": "High Restart Cost",
                "definition": "After interruption, cost of re-engaging exceeds motivation.",
                "mechanism": "Context-switching penalty; cognitive overhead of re-entry blocks resumption.",
                "decision_computation": "IF Restart_Cost > Remaining_Motivation THEN Abandonment",
                "diagnostic_signals": ["'I stopped and couldn't get back into it'", "'Starting over is too hard'"],
                "interventions": ["Reduce friction", "Save progress checkpoints", "Reduce restart cost"],
                "effect_size": "d = 0.4-0.7",
            },
            "C6B-8": {
                "name": "Shame-Driven Withdrawal",
                "definition": "Shame from perceived failure triggers withdrawal and avoidance instead of continued effort. Distinct from guilt, which motivates reparative action.",
                "mechanism": "Shame-driven avoidance: perceived failure activates shame (global self-evaluation: 'I am bad'), triggering withdrawal from the goal domain. NOT guilt ('I did something bad'), which motivates repair.",
                "decision_computation": "IF Perceived_Failure = TRUE AND Shame_Proneness = HIGH THEN Avoidance_Response_Activated",
                "diagnostic_signals": ["'I feel terrible about missing a day'", "'I beat myself up'", "'I withdraw instead of trying again'"],
                "interventions": ["Self-compassion training", "Error normalization", "Reduce cost", "Monitor progress"],
                "effect_size": "d = 0.3-0.5",
            },
        },
    },
}


# ═══════════════════════════════════════════════════════════════════════
# VOCAL MARKERS — Gate-level detection rules with thresholds
# ═══════════════════════════════════════════════════════════════════════

VOCAL_MARKERS = {
    "C0": {
        "name": "Environmental Permeability Markers",
        "markers": [
            {"id": "c0_flat_affect", "signal": "flat_affect", "metric": "pitch_range_hz", "threshold": "<30", "description": "Minimal pitch variation indicating resignation"},
            {"id": "c0_low_energy", "signal": "low_energy", "metric": "intensity_db", "threshold": "<-25", "description": "Below-normal vocal energy baseline"},
            {"id": "c0_resignation_tone", "signal": "resignation_tone", "metric": "engagement_score", "threshold": "<0.20", "description": "Very low engagement across entire session"},
            {"id": "c0_no_effort", "signal": "absence_of_effort", "metric": "intensity_variability", "threshold": "<0.05", "description": "No vocal effort modulation"},
        ],
        "detection_rules": [
            {"id": "c0_environmental_block", "requires": ["c0_flat_affect", "c0_low_energy"], "optional": ["c0_resignation_tone", "c0_no_effort"], "min_required": 2, "confidence_weight": 0.7},
        ],
    },

    "C1": {
        "name": "Believability Markers",
        "markers": [
            {"id": "c1_low_confidence", "signal": "low_confidence", "metric": "confidence_score", "threshold": "<0.30", "description": "Sustained low vocal confidence"},
            {"id": "c1_pitch_instability", "signal": "pitch_instability_self_ref", "metric": "pitch_stability", "threshold": "<0.35", "description": "Pitch wobbles on self-referential statements"},
            {"id": "c1_hedging", "signal": "hedging_language", "metric": "hedge_word_count", "threshold": ">5_per_minute", "description": "Excessive hedging words (maybe, kind of, sort of, I guess)"},
            {"id": "c1_uptalk", "signal": "uptalk", "metric": "rising_intonation_pct", "threshold": ">0.30", "description": "Rising intonation on declarative statements"},
            {"id": "c1_hesitation_cluster", "signal": "hesitation_clusters", "metric": "pause_cluster_count", "threshold": ">3_per_minute", "description": "Grouped hesitation pauses (um, uh clusters)"},
        ],
        "detection_rules": [
            {"id": "c1_believability_deficit", "requires": ["c1_low_confidence"], "optional": ["c1_pitch_instability", "c1_hedging", "c1_uptalk", "c1_hesitation_cluster"], "min_required": 2, "confidence_weight": 0.8},
        ],
    },

    "C2": {
        "name": "Desire Markers",
        "markers": [
            {"id": "c2_flat_engagement", "signal": "flat_engagement_goal", "metric": "engagement_score", "threshold": "<0.30", "description": "Low engagement when discussing goals"},
            {"id": "c2_commitment_tension", "signal": "tension_on_commitment", "metric": "stress_score", "threshold": ">0.50", "description": "Stress spike on commitment words"},
            {"id": "c2_energy_drop", "signal": "energy_drop_future", "metric": "intensity_delta", "threshold": "<-3dB", "description": "Energy drops when discussing future/goals"},
            {"id": "c2_prosody_mismatch", "signal": "content_prosody_mismatch", "metric": "enthusiasm_prosody_gap", "threshold": ">0.30", "description": "Words say 'excited' but voice says 'flat'"},
        ],
        "detection_rules": [
            {"id": "c2_desire_deficit", "requires": ["c2_flat_engagement"], "optional": ["c2_commitment_tension", "c2_energy_drop", "c2_prosody_mismatch"], "min_required": 2, "confidence_weight": 0.75},
        ],
    },

    "C3": {
        "name": "Will Markers",
        "markers": [
            {"id": "c3_effort_stress", "signal": "stress_on_effort", "metric": "stress_score", "threshold": ">0.55", "description": "Stress spike when discussing effort/sacrifice"},
            {"id": "c3_pitch_elevation", "signal": "pitch_elevation_cost", "metric": "pitch_delta_hz", "threshold": ">15", "description": "Pitch rises when estimating costs/effort"},
            {"id": "c3_vocal_strain", "signal": "vocal_strain_cost", "metric": "jitter", "threshold": ">0.020", "description": "Voice strain indicators on cost descriptions"},
            {"id": "c3_breath_disruption", "signal": "breath_disruption", "metric": "pause_irregularity", "threshold": ">0.40", "description": "Breath pattern disruption during effort topics"},
        ],
        "detection_rules": [
            {"id": "c3_will_deficit", "requires": ["c3_effort_stress"], "optional": ["c3_pitch_elevation", "c3_vocal_strain", "c3_breath_disruption"], "min_required": 2, "confidence_weight": 0.75},
        ],
    },

    "C4": {
        "name": "Intention Markers",
        "markers": [
            {"id": "c4_vague_language", "signal": "vague_language", "metric": "specificity_score", "threshold": "<0.30", "description": "Generic planning phrases without specifics"},
            {"id": "c4_how_hesitation", "signal": "how_hesitation", "metric": "pause_before_how", "threshold": ">1.0s", "description": "Long pauses before answering 'how' questions"},
            {"id": "c4_what_confidence", "signal": "what_vs_how_gap", "metric": "confidence_delta", "threshold": ">0.25", "description": "Confident on 'what' goals, uncertain on 'how' execution"},
            {"id": "c4_low_specificity", "signal": "low_specificity", "metric": "detail_density", "threshold": "<0.20", "description": "Few concrete details (dates, numbers, names)"},
        ],
        "detection_rules": [
            {"id": "c4_intention_gap", "requires": ["c4_vague_language", "c4_low_specificity"], "optional": ["c4_how_hesitation", "c4_what_confidence"], "min_required": 2, "confidence_weight": 0.7},
        ],
    },

    "C5": {
        "name": "Commitment Markers",
        "markers": [
            {"id": "c5_alternative_engagement", "signal": "engagement_on_alternatives", "metric": "engagement_delta", "threshold": ">0.20", "description": "Engagement increases when discussing alternatives"},
            {"id": "c5_timeline_hedging", "signal": "timeline_hedging", "metric": "hedge_on_timeline", "threshold": ">0.40", "description": "Hedging language on timeline/deadline questions"},
            {"id": "c5_commitment_decay", "signal": "commitment_energy_decay", "metric": "energy_slope", "threshold": "<-0.15", "description": "Energy declines across sequential commitment statements"},
            {"id": "c5_confidence_inconsistency", "signal": "confidence_inconsistency", "metric": "confidence_cv", "threshold": ">0.35", "description": "Confidence varies wildly across commitment topics"},
        ],
        "detection_rules": [
            {"id": "c5_commitment_fragility", "requires": ["c5_commitment_decay"], "optional": ["c5_alternative_engagement", "c5_timeline_hedging", "c5_confidence_inconsistency"], "min_required": 2, "confidence_weight": 0.7},
        ],
    },

    "C6A": {
        "name": "Action Initiation Markers",
        "markers": [
            {"id": "c6a_freeze", "signal": "freeze_response", "metric": "pace_drop_pct", "threshold": ">0.30", "description": "Pace drop >30% at action commitment moments"},
            {"id": "c6a_onset_delay", "signal": "speech_onset_delay", "metric": "response_latency", "threshold": ">2.0s", "description": "Long delay before speaking after action prompt"},
            {"id": "c6a_tremor", "signal": "vocal_tremor", "metric": "jitter", "threshold": ">0.025", "description": "Vocal tremor at commitment moments"},
            {"id": "c6a_breath_hold", "signal": "breath_holding", "metric": "pre_speech_silence", "threshold": ">1.5s", "description": "Breath-holding pattern before action descriptions"},
            {"id": "c6a_sudden_silence", "signal": "sudden_silence", "metric": "silence_onset_speed", "threshold": "<0.1s", "description": "Abrupt silence before action description"},
        ],
        "detection_rules": [
            {"id": "c6a_initiation_failure", "requires": ["c6a_freeze"], "optional": ["c6a_onset_delay", "c6a_tremor", "c6a_breath_hold", "c6a_sudden_silence"], "min_required": 2, "confidence_weight": 0.85},
        ],
    },

    "C6B": {
        "name": "Action Persistence Markers",
        "markers": [
            {"id": "c6b_energy_decay", "signal": "energy_decay", "metric": "intensity_slope", "threshold": "<-0.10", "description": "Progressive energy decrease across session"},
            {"id": "c6b_fatigue", "signal": "fatigue_markers", "metric": "late_segment_energy", "threshold": "<0.70_of_early", "description": "Later segments significantly lower energy than early"},
            {"id": "c6b_frustration", "signal": "rising_frustration", "metric": "negative_score_slope", "threshold": ">0.10", "description": "Rising frustration/irritation prosody over time"},
            {"id": "c6b_shortened", "signal": "shortened_responses", "metric": "response_length_slope", "threshold": "<-0.20", "description": "Responses getting progressively shorter"},
            {"id": "c6b_pitch_fall", "signal": "falling_pitch_contour", "metric": "pitch_slope", "threshold": "<-5_hz_per_min", "description": "Overall pitch contour falling (disengagement)"},
        ],
        "detection_rules": [
            {"id": "c6b_persistence_failure", "requires": ["c6b_energy_decay"], "optional": ["c6b_fatigue", "c6b_frustration", "c6b_shortened", "c6b_pitch_fall"], "min_required": 2, "confidence_weight": 0.75},
        ],
    },
}


# ═══════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def get_gate(gate_id: str) -> Optional[dict]:
    """Get a complete gate definition by ID (e.g., 'C1', 'C6A')."""
    return VCM_GATES.get(gate_id)


def get_entry(entry_id: str) -> Optional[dict]:
    """Get a specific diagnostic entry by ID (e.g., 'C1-3', 'C6A-5').
    Returns (gate_id, entry_data) tuple or None."""
    gate_id = entry_id.split("-")[0]
    if len(gate_id) < 2:
        return None
    # Handle C6A/C6B prefixes
    if entry_id.startswith("C6"):
        gate_id = entry_id[:3]
    gate = VCM_GATES.get(gate_id)
    if gate and entry_id in gate["entries"]:
        return (gate_id, gate["entries"][entry_id])
    return None


def get_vocal_markers(gate_id: str) -> Optional[dict]:
    """Get vocal markers for a specific gate."""
    return VOCAL_MARKERS.get(gate_id)


def get_all_entries() -> list:
    """Get all 60 entries as flat list of (gate_id, entry_id, entry_data)."""
    results = []
    for gate_id, gate in VCM_GATES.items():
        for entry_id, entry in gate["entries"].items():
            results.append((gate_id, entry_id, entry))
    return results


def get_all_gate_ids() -> list:
    """Returns ordered list of gate IDs."""
    return ["C0", "C1", "C2", "C3", "C4", "C5", "C6A", "C6B"]


def match_diagnostic_signals(signals: list, gate_id: str) -> list:
    """Match observed diagnostic signals against a gate's entries.
    Returns list of (entry_id, match_count, total_signals) tuples sorted by match strength."""
    gate = VCM_GATES.get(gate_id)
    if not gate:
        return []

    matches = []
    for entry_id, entry in gate["entries"].items():
        entry_signals = entry.get("diagnostic_signals", [])
        match_count = sum(1 for s in signals if any(es.lower() in s.lower() for es in entry_signals))
        if match_count > 0:
            matches.append((entry_id, match_count, len(entry_signals)))

    return sorted(matches, key=lambda x: x[1] / max(x[2], 1), reverse=True)


# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("VCM Root Cause Database")
    print("=" * 50)
    entries = get_all_entries()
    print(f"Total entries: {len(entries)}")
    for gate_id in get_all_gate_ids():
        gate = get_gate(gate_id)
        count = len(gate["entries"])
        markers = get_vocal_markers(gate_id)
        marker_count = len(markers["markers"]) if markers else 0
        print(f"  {gate_id} — {gate['name']}: {count} entries, {marker_count} vocal markers")
