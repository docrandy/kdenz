/**
 * Labeling Practice Scenarios
 * Based on Chris Voss research - each scenario has surface emotion vs underlying driver
 * Labels 1-8 + Mis-Labels (Labels 9-10 Proof of Life EXCLUDED)
 */

import type { LabelingScenario, LabelTypeTag } from "./types";

export const LABELING_SCENARIOS: LabelingScenario[] = [
  // ===== SALARY NEGOTIATION (Affect-Shift) =====
  {
    id: "salary-001",
    context: "You asked your manager for a 15% raise. They pause and respond:",
    statement: "I don't know if we can make that work right now.",
    surfaceEmotion: "hesitant, uncertain",
    underlyingDriver:
      "worried about setting a precedent or facing leadership pressure",
    expertLabel:
      "It sounds like you're concerned this could set a precedent that's hard to manage.",
    category: "salary-negotiation",
    difficulty: "beginner",
    labelType: "affect-shift",
  },
  {
    id: "salary-002",
    context:
      "During your compensation discussion, your manager looks at the number and says:",
    statement: "That's quite a bit more than we budgeted for this role.",
    surfaceEmotion: "surprised, concerned",
    underlyingDriver: "worried about justifying this to leadership or HR",
    expertLabel:
      "It seems like you're worried about how to justify this number above you.",
    category: "salary-negotiation",
    difficulty: "beginner",
    labelType: "affect-shift",
  },
  {
    id: "salary-003",
    context: "After presenting your case for a promotion, your manager says:",
    statement: "Let me think about it and get back to you.",
    surfaceEmotion: "uncertain, stalling",
    underlyingDriver:
      "needs to maintain control, doesn't want to commit without checking options",
    expertLabel:
      "It sounds like you want to make sure you're making the right call here.",
    category: "salary-negotiation",
    difficulty: "intermediate",
    labelType: "affect-shift",
  },
  {
    id: "salary-004",
    context:
      "You mention a competing offer during negotiation. Your manager's tone shifts:",
    statement: "Well, if you think that's a better opportunity...",
    surfaceEmotion: "defensive, dismissive",
    underlyingDriver:
      "feels threatened, worried about losing leverage or respect",
    expertLabel:
      "It seems like this feels like I'm putting you in an uncomfortable position.",
    category: "salary-negotiation",
    difficulty: "advanced",
    labelType: "affect-shift",
  },

  // ===== SAYING NO (Affect-Shift) =====
  {
    id: "sayno-001",
    context:
      "A colleague approaches you about a project with a tight deadline:",
    statement:
      "I really need you on this project. You're the only one who can do it.",
    surfaceEmotion: "desperate, pressuring",
    underlyingDriver: "worried about their own deadline and reputation",
    expertLabel:
      "It sounds like you're under a lot of pressure to deliver this.",
    category: "saying-no",
    difficulty: "beginner",
    labelType: "affect-shift",
  },
  {
    id: "sayno-002",
    context:
      "A friend asks to borrow money again. When you hesitate, they say:",
    statement:
      "But you've always helped me before. I thought I could count on you.",
    surfaceEmotion: "disappointed, guilt-tripping",
    underlyingDriver: "fears losing reliable support, feels vulnerable",
    expertLabel:
      "It seems like you're worried about what it means if I say no this time.",
    category: "saying-no",
    difficulty: "intermediate",
    labelType: "affect-shift",
  },
  {
    id: "sayno-003",
    context:
      "Your boss asks you to work the weekend again. You mention you have plans:",
    statement: "This is really important. The team is counting on you.",
    surfaceEmotion: "pressuring, urgent",
    underlyingDriver: "worried about project failure reflecting on them",
    expertLabel:
      "It sounds like there's a lot riding on this for you personally.",
    category: "saying-no",
    difficulty: "intermediate",
    labelType: "affect-shift",
  },
  {
    id: "sayno-004",
    context: "A client asks for additional work outside the agreed scope:",
    statement:
      "I thought this would be included. We\'ve been working together for years.",
    surfaceEmotion: "entitled, disappointed",
    underlyingDriver:
      "worried about budget, hopes relationship grants exceptions",
    expertLabel:
      "It seems like you're concerned about staying within budget on this.",
    category: "saying-no",
    difficulty: "advanced",
    labelType: "affect-shift",
  },

  // ===== DIFFICULT CONVERSATIONS (Affect-Shift) =====
  {
    id: "difficult-001",
    context:
      "Your partner comes home and seems withdrawn. When you ask how they are:",
    statement: "I had a rough day today.",
    surfaceEmotion: "tired, stressed",
    underlyingDriver:
      "needs acknowledgment, wants to feel heard without fixing",
    expertLabel:
      "It sounds like you need to just decompress without me trying to fix anything.",
    category: "difficult-conversation",
    difficulty: "beginner",
    labelType: "affect-shift",
  },
  {
    id: "difficult-002",
    context:
      "You ask a team member for their opinion on a decision. They shrug and say:",
    statement: "Whatever you think is best.",
    surfaceEmotion: "passive, agreeable",
    underlyingDriver: "feels their input doesn't matter, has checked out",
    expertLabel:
      "It seems like you feel like your opinion won't really change anything.",
    category: "difficult-conversation",
    difficulty: "intermediate",
    labelType: "affect-shift",
  },
  {
    id: "difficult-003",
    context:
      "You need to give critical feedback to a direct report. They respond:",
    statement:
      "I thought I was doing a good job. No one told me there was a problem.",
    surfaceEmotion: "defensive, surprised",
    underlyingDriver: "feels blindsided, worried about job security",
    expertLabel:
      "It sounds like this feels like it's coming out of nowhere and that's unsettling.",
    category: "difficult-conversation",
    difficulty: "intermediate",
    labelType: "affect-shift",
  },
  {
    id: "difficult-004",
    context: "A friend cancels on important plans at the last minute:",
    statement: "Something came up. I\'m sure you understand.",
    surfaceEmotion: "dismissive, casual",
    underlyingDriver: "overwhelmed, avoiding conflict about real reason",
    expertLabel:
      "It seems like there's something going on that made this harder than just rescheduling.",
    category: "difficult-conversation",
    difficulty: "advanced",
    labelType: "affect-shift",
  },

  // ===== WORKPLACE (Affect-Shift) =====
  {
    id: "workplace-001",
    context: "In a meeting, a colleague interrupts your presentation to say:",
    statement: "Actually, we tried that before and it didn't work.",
    surfaceEmotion: "dismissive, superior",
    underlyingDriver:
      "feels their experience is being ignored, wants recognition",
    expertLabel:
      "It sounds like you have valuable experience with this that hasn't been acknowledged.",
    category: "workplace",
    difficulty: "intermediate",
    labelType: "affect-shift",
  },
  {
    id: "workplace-002",
    context: "You propose a new process. A senior colleague responds:",
    statement:
      "That's interesting, but I'm not sure leadership will go for it.",
    surfaceEmotion: "skeptical, cautious",
    underlyingDriver: "worried about being associated with a failed initiative",
    expertLabel:
      "It seems like you're concerned about the risk if this doesn't land well.",
    category: "workplace",
    difficulty: "advanced",
    labelType: "affect-shift",
  },

  // ===== BEHAVIOR PROBE LABELS (Labels 4-5) =====
  {
    id: "behavior-001",
    context:
      "Your colleague was supposed to present the quarterly results but handed it off to a junior team member at the last minute. When you ask about it:",
    statement:
      "I thought it would be a good development opportunity for Sarah.",
    surfaceEmotion: "deflective, rationalizing",
    underlyingDriver:
      "avoiding a presentation they felt unprepared for or anxious about",
    expertLabel:
      "It seems like you have a reason for stepping back from presenting this quarter.",
    category: "workplace",
    difficulty: "beginner",
    labelType: "behavior-probe",
    deliveryGuidance:
      'Genuinely curious tone. Do NOT sound accusatory. Inner voice: "I want to understand their thinking, not judge it."',
    silenceExpectation:
      "They will likely pause 3-5 seconds, then explain the real reason they handed it off. Wait for it.",
    counterpartResponse:
      "...Yeah. Honestly, the numbers aren't great this quarter and I didn't want to be the one delivering bad news to the executive team.",
  },
  {
    id: "behavior-002",
    context:
      "During salary negotiation, your manager suddenly brings up a recent project that had issues, even though it was resolved weeks ago:",
    statement:
      "And of course there was that situation with the Henderson account.",
    surfaceEmotion: "strategic, deflecting",
    underlyingDriver: "creating leverage to justify not granting the raise",
    expertLabel:
      "It seems like you have a reason for bringing up Henderson right now.",
    category: "salary-negotiation",
    difficulty: "intermediate",
    labelType: "behavior-probe",
    deliveryGuidance:
      "Calm, observational. Not defensive about Henderson. FM-DJ voice. Downward inflection.",
    silenceExpectation:
      "Expect 4-6 seconds of silence. Manager may backtrack or explain their reasoning for bringing up old issues.",
    counterpartResponse:
      "...I suppose I'm trying to say that raises need to reflect the full picture, not just the wins.",
  },
  {
    id: "behavior-003",
    context:
      "Your partner has been checking their phone every few minutes during a serious conversation about finances:",
    statement: "Sorry, what were you saying? I was just checking something.",
    surfaceEmotion: "distracted, dismissive",
    underlyingDriver: "avoiding the discomfort of the financial conversation",
    expertLabel:
      "It seems like you have a reason for stepping away from this conversation.",
    category: "difficult-conversation",
    difficulty: "beginner",
    labelType: "behavior-probe",
    deliveryGuidance:
      'Warm but direct. Not accusatory ("You\'re not paying attention!"). Genuinely curious about what is pulling them away.',
    silenceExpectation:
      "They may feel caught. 3-5 seconds pause. Then either acknowledge the avoidance or explain what is pulling their attention.",
    counterpartResponse:
      "...You're right. I keep checking because I'm anxious about the credit card bill that came in today, and I don't want to deal with it.",
  },
  {
    id: "behavior-004",
    context:
      "A team member sends an email CC'ing your boss about a minor process issue that could have been resolved in a quick conversation:",
    statement:
      "I just wanted to make sure everyone was on the same page about the process.",
    surfaceEmotion: "professional, justified",
    underlyingDriver:
      "creating a paper trail because they feel unheard or want to escalate",
    expertLabel:
      "It seems like you have a reason for looping in leadership on this.",
    category: "workplace",
    difficulty: "intermediate",
    labelType: "behavior-probe",
    deliveryGuidance:
      "Neutral and curious. Not defensive about being CC'd. FM-DJ voice. The goal is to understand their reasoning, not to criticize their choice.",
    silenceExpectation:
      "4-7 seconds. They may justify initially, then reveal the real frustration beneath the escalation.",
    counterpartResponse:
      "...Honestly, I've brought this up three times in our one-on-ones and nothing changed. I felt like I needed it documented.",
  },
  {
    id: "behavior-005",
    context:
      "In a negotiation, the other party suddenly asks for a break right after you presented your key proposal:",
    statement: "Can we take five minutes? I need to make a quick call.",
    surfaceEmotion: "casual, procedural",
    underlyingDriver:
      "needs to consult with someone else or process something unexpected in your proposal",
    expertLabel:
      "It seems like you have a reason for pausing right at this point.",
    category: "salary-negotiation",
    difficulty: "advanced",
    labelType: "behavior-probe",
    deliveryGuidance:
      "Light, curious. Not blocking the break -- just observing the timing. Upward-curious inflection acceptable here.",
    silenceExpectation:
      "3-5 seconds. They may acknowledge the timing or explain why they need the break.",
    counterpartResponse:
      "...Fair enough. Your proposal had some elements I wasn't expecting, and I want to make sure I'm responding thoughtfully, not reactively.",
  },
  {
    id: "behavior-006",
    context:
      "A friend who agreed to help you move suddenly says they can only come for an hour instead of the full day:",
    statement:
      "Something came up in the afternoon, but I can help in the morning for a bit.",
    surfaceEmotion: "apologetic, hedging",
    underlyingDriver:
      "overcommitted and doesn't want to admit they took on too much, or dreading the physical work",
    expertLabel:
      "It seems like you have a reason for scaling back from what we originally planned.",
    category: "difficult-conversation",
    difficulty: "intermediate",
    labelType: "behavior-probe",
    deliveryGuidance:
      "Warm, not guilt-tripping. Genuinely curious. This is a low-stakes relationship context -- tone matters more than technique.",
    silenceExpectation:
      "3-4 seconds. Friends respond faster than professional counterparts. They may admit the real reason.",
    counterpartResponse:
      "...Yeah, honestly I double-booked myself and I feel bad about it. I should have told you sooner.",
  },

  // ===== OPENING LABELS (Label 7) =====
  {
    id: "opening-001",
    context:
      'Your manager messages you to schedule a 1-on-1 "to discuss a few things." You arrive and they start with:',
    statement: "Hey, how's it going? How was your weekend?",
    surfaceEmotion: "pleasant, routine",
    underlyingDriver:
      "has an agenda they want to get to but is testing your readiness to listen",
    expertLabel: "It sounds like you have a place you want to start.",
    category: "workplace",
    difficulty: "beginner",
    labelType: "opening",
    deliveryGuidance:
      'Warm and encouraging. NOT FM-DJ cold. Smile in your voice. Inner script: "I\'m genuinely ready to hear what they have to say."',
    silenceExpectation:
      "2-4 seconds. Most people are relieved and jump right into their topic.",
    counterpartResponse:
      "...Actually, yeah. I wanted to talk to you about the project timeline. I've been thinking about it all weekend.",
  },
  {
    id: "opening-002",
    context:
      "You join a video call for a negotiation. The other party opens with small talk:",
    statement:
      "Thanks for making time for this. Beautiful weather today, isn't it?",
    surfaceEmotion: "polite, warming up",
    underlyingDriver:
      "getting a read on your disposition before diving into their position",
    expertLabel: "It sounds like you've been thinking about where to start.",
    category: "salary-negotiation",
    difficulty: "intermediate",
    labelType: "opening",
    deliveryGuidance:
      "Warm but professional. Not dismissive of their pleasantry. Pace slightly faster than FM-DJ (130-150 WPM) to match the energy of an opening.",
    silenceExpectation:
      "3-5 seconds. They may circle back to chitchat or jump straight into the negotiation topic.",
    counterpartResponse:
      "Yeah, I have actually. Let me share what I've been thinking about the compensation structure.",
  },
  {
    id: "opening-003",
    context:
      "A colleague stops by your desk and hovers for a moment before saying:",
    statement: "Hey, do you have a minute? No big deal, just wanted to chat.",
    surfaceEmotion: "casual, minimizing",
    underlyingDriver:
      "has something important to discuss but is testing whether it is safe to bring it up",
    expertLabel:
      "It seems like there's something on your mind you want to get to.",
    category: "difficult-conversation",
    difficulty: "beginner",
    labelType: "opening",
    deliveryGuidance:
      'Warm, inviting. Give them permission to skip the "no big deal" minimizing. Full attention -- stop what you are doing.',
    silenceExpectation:
      "2-3 seconds. They may take a breath and then open up about the real topic.",
    counterpartResponse:
      "...Okay, yeah. It IS kind of a big deal actually. I've been having a hard time with how the new project assignments were handled.",
  },
  {
    id: "opening-004",
    context:
      "You sit down for a difficult conversation with a direct report about their performance. They arrive tense and say:",
    statement: "So... what did you want to talk about?",
    surfaceEmotion: "anxious, bracing",
    underlyingDriver:
      "already knows the topic and has been dreading it; wants to know how bad it is",
    expertLabel:
      "It sounds like you already have a sense of what this is about.",
    category: "workplace",
    difficulty: "intermediate",
    labelType: "opening",
    deliveryGuidance:
      "Warm, not ominous. They are bracing for bad news -- your tone should signal safety, not threat. Gentle pace.",
    silenceExpectation:
      "3-5 seconds. They may name the concern themselves, which gives you their framing to work with.",
    counterpartResponse:
      "...Yeah. I figured this was about my Q1 numbers. I know they weren't where they needed to be.",
  },

  // ===== VALUE LABELS (Label 8) =====
  {
    id: "value-001",
    context:
      "You present your consulting fee to a potential client. They respond:",
    statement: "That's more than we were expecting to spend on this.",
    surfaceEmotion: "concerned, hesitant",
    underlyingDriver:
      "uncertain whether the outcome justifies the investment; needs to justify to decision-makers",
    expertLabel:
      "It seems like the value isn't clear enough yet to justify the investment.",
    category: "salary-negotiation",
    difficulty: "intermediate",
    labelType: "value",
    deliveryGuidance:
      "Downward inflection. Neutral observation. Not defensive about your price. FM-DJ voice.",
    silenceExpectation:
      "4-6 seconds. They will likely correct with what WOULD make it worth the price.",
    counterpartResponse:
      "Well, it's not that there's no value. I just need to see how this connects to the revenue targets I promised the board.",
  },
  {
    id: "value-002",
    context: "During a raise discussion, your manager says:",
    statement:
      "The budget for raises this cycle is really tight across the board.",
    surfaceEmotion: "constrained, apologetic",
    underlyingDriver:
      "needs a compelling value case to fight for your raise with leadership",
    expertLabel:
      "It sounds like the value of approving this hasn't been easy to make the case for.",
    category: "salary-negotiation",
    difficulty: "intermediate",
    labelType: "value",
    deliveryGuidance:
      "Downward inflection. Empathetic -- acknowledge their constraint. FM-DJ voice.",
    silenceExpectation:
      "4-7 seconds. Manager may reveal what kind of evidence or justification they need.",
    counterpartResponse:
      "...That's kind of it, yeah. If I had clear metrics showing your impact on the Q4 results, I'd have something to bring upstairs.",
  },
  {
    id: "value-003",
    context: "You are negotiating a contract renewal. The client says:",
    statement:
      "We've gotten similar proposals from other providers at lower rates.",
    surfaceEmotion: "leveraging, testing",
    underlyingDriver:
      "using competition to extract a concession; may or may not have real alternatives",
    expertLabel:
      "It seems like the value we've provided hasn't differentiated enough from the alternatives.",
    category: "workplace",
    difficulty: "advanced",
    labelType: "value",
    deliveryGuidance:
      "Downward inflection. Do NOT react to the competitive threat. Stay observational. FM-DJ voice at 110-120 WPM.",
    silenceExpectation:
      "5-8 seconds. Long pause. They may reveal whether the alternatives are real or a negotiation tactic.",
    counterpartResponse:
      "...Honestly, the other proposals don't include the reporting and analytics you provide. But the board is putting pressure on costs.",
  },
  {
    id: "value-004",
    context:
      "A friend is considering your recommendation for a financial advisor and says:",
    statement:
      "I don't know... it seems like a lot to pay someone to manage money I could manage myself.",
    surfaceEmotion: "skeptical, self-reliant",
    underlyingDriver:
      "uncertain whether professional management will produce meaningfully better outcomes than DIY",
    expertLabel:
      "It sounds like the value of professional management hasn't been clear enough yet.",
    category: "difficult-conversation",
    difficulty: "beginner",
    labelType: "value",
    deliveryGuidance:
      "Downward inflection but warm. This is a friend, not a negotiation. Less FM-DJ, more genuine concern.",
    silenceExpectation:
      "3-5 seconds. Friend may articulate what specifically would make it worth the cost.",
    counterpartResponse:
      "I guess I'm really not sure if they'd actually beat what I'm doing on my own. Show me the track record difference and maybe I'd consider it.",
  },

  // ===== IMPASSE LABELS (Label 6) =====
  {
    id: "impasse-001",
    context:
      "After 45 minutes of negotiating a project scope with a client, you have tried multiple approaches. They keep coming back to the same objection:",
    statement:
      "Look, I understand what you're saying, but we just can't go beyond the original scope. That's final.",
    surfaceEmotion: "firm, resolved",
    underlyingDriver:
      "may have a constraint they have not shared; or genuinely at their limit",
    expertLabel:
      "It sounds like there is nothing I can say to get you to change your mind.",
    category: "workplace",
    difficulty: "advanced",
    labelType: "impasse",
    deliveryGuidance:
      'MUST be downward inflection. Calm acceptance. FM-DJ voice at 110-120 WPM. No frustration, no guilt-tripping. Inner voice: "I accept whatever they decide."',
    silenceExpectation:
      "5-10 seconds. This is the longest silence in any label exercise. They either find a way back to the table or confirm the impasse.",
    counterpartResponse:
      "...Well, I didn't say there's nothing you can say. If you could phase the additional work into Q3 instead of Q2, that might be something we could look at.",
  },
  {
    id: "impasse-002",
    context:
      "You have been negotiating a raise for 30 minutes. Your manager has acknowledged your contributions but keeps returning to budget constraints:",
    statement:
      "I really do value your work, but the answer on the raise has to be no right now.",
    surfaceEmotion: "sympathetic but firm",
    underlyingDriver:
      "may have flexibility on non-salary compensation, or may need help finding budget room",
    expertLabel:
      "It sounds like there is nothing I can say to change where things stand.",
    category: "salary-negotiation",
    difficulty: "advanced",
    labelType: "impasse",
    deliveryGuidance:
      "Calm downward inflection. No pleading. Dignified acceptance. FM-DJ voice.",
    silenceExpectation:
      "5-8 seconds. Manager may reveal alternative forms of compensation or a future timeline.",
    counterpartResponse:
      "...It's not that I don't want to do something. What if we looked at an additional week of PTO and a mid-year review with a commitment to revisit the number then?",
  },
  {
    id: "impasse-003",
    context:
      "You and your partner have been discussing where to spend the holidays for 20 minutes. Neither side is budging:",
    statement:
      "We go to your family every year. I'm not doing it again this time.",
    surfaceEmotion: "frustrated, resolved",
    underlyingDriver:
      "feeling that their family and preferences are consistently deprioritized",
    expertLabel:
      "It sounds like there is nothing I can say that would make my family's house feel right this year.",
    category: "difficult-conversation",
    difficulty: "intermediate",
    labelType: "impasse",
    deliveryGuidance:
      "Downward inflection. Warm but accepting. This is a relationship, not a transaction -- dignity and respect matter more than winning.",
    silenceExpectation:
      "4-7 seconds. Partner may soften and reveal what would make a compromise work.",
    counterpartResponse:
      "...It's not that I never want to go. I just need us to alternate, and I need you to acknowledge that my family matters too.",
  },
  {
    id: "impasse-004",
    context:
      "After extensive back-and-forth, a vendor refuses to extend payment terms beyond 30 days:",
    statement: "Our policy is net-30. There's no flexibility on payment terms.",
    surfaceEmotion: "bureaucratic, firm",
    underlyingDriver:
      "may have authority to make exceptions but needs a reason to escalate; or policy truly is fixed",
    expertLabel:
      "It sounds like there is nothing I can say to make extended terms work.",
    category: "workplace",
    difficulty: "advanced",
    labelType: "impasse",
    deliveryGuidance:
      "Downward inflection. Business-calm. FM-DJ voice. No frustration with their process. Accept the policy as stated.",
    silenceExpectation:
      "5-10 seconds. They may reveal an escalation path or alternative arrangement.",
    counterpartResponse:
      "...Well, I can't change the payment terms. But if you prepay for the full year, I could apply a volume discount that effectively gives you the same cash flow benefit.",
  },

  // ===== MIS-LABEL PRACTICE (Advanced) =====
  {
    id: "mislabel-001",
    context:
      "A colleague has been unusually quiet in team meetings for the past two weeks. You suspect they are frustrated about being passed over for a project lead role, but you are not sure. In a 1-on-1:",
    statement: "Everything's fine. I'm just focused on my current work.",
    surfaceEmotion: "dismissive, deflecting",
    underlyingDriver:
      "feeling overlooked for the project lead role and questioning their value to the team",
    expertLabel:
      "It seems like the workload has been heavier than usual lately.",
    category: "workplace",
    difficulty: "advanced",
    labelType: "mis-label",
    deliveryGuidance:
      "Curious upward inflection. This Mis-Label deliberately targets workload (wrong) to invite correction about the real issue (being passed over). Must sound genuinely uncertain.",
    silenceExpectation:
      "4-7 seconds. They will feel the urge to correct. The correction reveals the actual concern.",
    counterpartResponse:
      "It's not really the workload. I just... I thought I was in the running for the Apex project lead, and then it went to Marcus without anyone even talking to me about it.",
  },
  {
    id: "mislabel-002",
    context:
      "During a salary negotiation, your manager seems distracted and keeps checking the clock. You suspect they have another meeting, but the real issue might be something else:",
    statement: "Let's try to wrap this up. I have a lot on my plate today.",
    surfaceEmotion: "rushed, dismissive",
    underlyingDriver:
      "uncomfortable with the negotiation and wants it to end; may feel they do not have authority to say yes",
    expertLabel:
      "It seems like the timing isn't great for this conversation today.",
    category: "salary-negotiation",
    difficulty: "advanced",
    labelType: "mis-label",
    deliveryGuidance:
      "Curious upward inflection. Mis-Label targets timing (wrong) to invite correction about the real blocker (authority/comfort with the ask). Deferential, not challenging.",
    silenceExpectation:
      "4-6 seconds. Manager may reveal the actual constraint.",
    counterpartResponse:
      "No, the timing is fine. I just... I honestly don't know what I'm authorized to offer you, and I don't want to make a promise I can't keep.",
  },
  {
    id: "mislabel-003",
    context:
      "Your friend has declined the last three invitations to hang out. You suspect something deeper is going on. When you call them:",
    statement: "I've just been super busy. You know how it is.",
    surfaceEmotion: "casual, excusing",
    underlyingDriver:
      "going through something personal (depression, relationship issues, financial stress) and withdrawing",
    expertLabel: "It sounds like work has really been taking over lately.",
    category: "difficult-conversation",
    difficulty: "intermediate",
    labelType: "mis-label",
    deliveryGuidance:
      "Warm, not clinical. Mis-Label targets work (plausible but wrong) to invite correction about the personal issue. Genuinely caring tone.",
    silenceExpectation:
      "3-5 seconds. Friends respond faster. They may admit the real reason.",
    counterpartResponse:
      "...It's not really work. Things have been rough at home. Sarah and I are going through some stuff, and I haven't felt like being around people.",
  },
  {
    id: "mislabel-004",
    context:
      "In a project meeting, a stakeholder keeps requesting changes to a feature that was already approved. You suspect it is not about the feature itself:",
    statement:
      "I just think we need to rethink the user flow on this page. It doesn't feel right.",
    surfaceEmotion: "critical, unsatisfied",
    underlyingDriver:
      "was not consulted during the original approval and feels their input was bypassed",
    expertLabel:
      "It seems like the design direction doesn't match what you had in mind.",
    category: "workplace",
    difficulty: "advanced",
    labelType: "mis-label",
    deliveryGuidance:
      "Downward inflection with slight curiosity. Mis-Label targets design preference (wrong) to invite correction about process exclusion (real issue). Professional, not patronizing.",
    silenceExpectation:
      "4-7 seconds. Stakeholder may reveal the process issue.",
    counterpartResponse:
      "It's not really about the design. I just feel like this whole thing was decided before I even had a chance to weigh in. My team uses this feature daily and nobody asked us.",
  },
];

// Helper to get scenarios by category
export function getScenariosByCategory(
  category: LabelingScenario["category"],
): LabelingScenario[] {
  return LABELING_SCENARIOS.filter((s) => s.category === category);
}

// Helper to get scenarios by difficulty
export function getScenariosByDifficulty(
  difficulty: LabelingScenario["difficulty"],
): LabelingScenario[] {
  return LABELING_SCENARIOS.filter((s) => s.difficulty === difficulty);
}

// Helper to get scenarios by label type
export function getScenariosByLabelType(
  labelType: LabelTypeTag,
): LabelingScenario[] {
  return LABELING_SCENARIOS.filter((s) => s.labelType === labelType);
}

// Get a random scenario, optionally filtered
export function getRandomScenario(
  category?: LabelingScenario["category"],
  difficulty?: LabelingScenario["difficulty"],
  labelType?: LabelTypeTag,
): LabelingScenario {
  let pool = LABELING_SCENARIOS;

  if (category) {
    pool = pool.filter((s) => s.category === category);
  }
  if (difficulty) {
    pool = pool.filter((s) => s.difficulty === difficulty);
  }
  if (labelType) {
    pool = pool.filter((s) => s.labelType === labelType);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// Get scenario by ID
export function getScenarioById(id: string): LabelingScenario | undefined {
  return LABELING_SCENARIOS.find((s) => s.id === id);
}
