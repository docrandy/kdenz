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
    characterName: "Rachel",
    characterRole: "your manager",
    setting: "Rachel's corner office, end of day on a Friday",
    backstory:
      "You've been on her team for two years and have consistently exceeded your targets.",
    context:
      "You're sitting across from Rachel in her corner office. You just made your case for a 15% raise, laying out your contributions over the past year. She pauses, fidgets with her pen, and says:",
    statement: "I don't know if we can make that work right now.",
    surfaceEmotion: "hesitant, uncertain",
    underlyingDriver:
      "worried about setting a precedent or facing leadership pressure",
    expertLabel:
      "It sounds like you're concerned this could set a precedent that's hard to manage.",
    category: "salary-negotiation",
    difficulty: "beginner",
    labelType: "affect-shift",
    level: 1,
    counterpartResponse:
      "...You're not wrong. If I give you 15%, everyone on the team will expect the same, and I don't have the budget for that. But let me think about what we can do.",
  },
  {
    id: "salary-002",
    characterName: "David",
    characterRole: "your department head",
    setting: "Conference room B, scheduled 1-on-1",
    backstory:
      "David controls the budget and has final say on compensation in your department.",
    context:
      "You're across the table from David in Conference room B. You've just handed him your compensation proposal. He looks at the number, leans back, and says:",
    statement: "That's quite a bit more than we budgeted for this role.",
    surfaceEmotion: "surprised, concerned",
    underlyingDriver: "worried about justifying this to leadership or HR",
    expertLabel:
      "It seems like you're worried about how to justify this number above you.",
    category: "salary-negotiation",
    difficulty: "beginner",
    labelType: "affect-shift",
    level: 1,
    counterpartResponse:
      "...That's part of it. HR sets bands for every role and if I go outside the band I have to get VP approval. That's not impossible, but it's a process.",
  },
  {
    id: "salary-003",
    characterName: "Priya",
    characterRole: "your manager",
    setting: "Priya's standing desk area, mid-afternoon",
    backstory:
      "You've worked under Priya for 18 months and recently completed a high-visibility project.",
    context:
      "You've just finished walking Priya through your case for a promotion. She listened carefully, took a few notes, then sets down her pen and says:",
    statement: "Let me think about it and get back to you.",
    surfaceEmotion: "uncertain, stalling",
    underlyingDriver:
      "needs to maintain control, doesn't want to commit without checking options",
    expertLabel:
      "It sounds like you want to make sure you're making the right call here.",
    category: "salary-negotiation",
    difficulty: "intermediate",
    labelType: "affect-shift",
    level: 2,
    counterpartResponse:
      "...Yeah, I don't want to say yes and then have leadership push back. I need to make sure I can actually deliver on whatever I tell you.",
  },
  {
    id: "salary-004",
    characterName: "James",
    characterRole: "your senior manager",
    setting: "James's office, during a formal review conversation",
    backstory:
      "You've just mentioned you have a competing offer from another company.",
    context:
      "The conversation was going well until you mentioned the competing offer. James's expression shifts — something closes off. After a brief silence he says:",
    statement: "Well, if you think that's a better opportunity...",
    surfaceEmotion: "defensive, dismissive",
    underlyingDriver:
      "feels threatened, worried about losing leverage or respect",
    expertLabel:
      "It seems like this feels like I'm putting you in an uncomfortable position.",
    category: "salary-negotiation",
    difficulty: "advanced",
    labelType: "affect-shift",
    level: 3,
    counterpartResponse:
      "...It's not that. I just don't love being negotiated against. It feels like leverage, and I'd rather we figure this out because you want to be here.",
  },

  // ===== SAYING NO (Affect-Shift) =====
  {
    id: "sayno-001",
    characterName: "Marcus",
    characterRole: "your coworker",
    setting: "Open office area near your desk, mid-morning",
    backstory:
      "Marcus is a peer on your team. He's technically capable but often overcommits.",
    context:
      "Marcus has come over to your desk looking visibly stressed. He leans in, speaking just above a whisper so others don't hear, and says:",
    statement:
      "I really need you on this project. You're the only one who can do it.",
    surfaceEmotion: "desperate, pressuring",
    underlyingDriver: "worried about their own deadline and reputation",
    expertLabel:
      "It sounds like you're under a lot of pressure to deliver this.",
    category: "saying-no",
    difficulty: "beginner",
    labelType: "affect-shift",
    level: 1,
    counterpartResponse:
      "...Yeah, honestly the deadline is Thursday and I've been losing sleep over it. I just thought if anyone could help, it'd be you.",
  },
  {
    id: "sayno-002",
    characterName: "Nadia",
    characterRole: "your close friend",
    setting: "Phone call, Sunday evening",
    backstory:
      "Nadia has borrowed money twice before and paid you back late both times.",
    context:
      "Nadia calls on Sunday evening. You can tell from her voice she's been building up to this. When you hesitate after she asks, she says:",
    statement:
      "But you've always helped me before. I thought I could count on you.",
    surfaceEmotion: "disappointed, guilt-tripping",
    underlyingDriver: "fears losing reliable support, feels vulnerable",
    expertLabel:
      "It seems like you're worried about what it means if I say no this time.",
    category: "saying-no",
    difficulty: "intermediate",
    labelType: "affect-shift",
    level: 2,
    counterpartResponse:
      "...I guess I'm scared that if you say no, it means things have changed between us. And I hate that this is what I'm calling you about.",
  },
  {
    id: "sayno-003",
    characterName: "Tom",
    characterRole: "your boss",
    setting: "Tom's office doorway, Thursday afternoon",
    backstory:
      "Tom has asked you to work weekends three times this quarter already.",
    context:
      "Tom catches you in the hallway as you're heading out. You mention you have plans this weekend. He nods, but then says:",
    statement: "This is really important. The team is counting on you.",
    surfaceEmotion: "pressuring, urgent",
    underlyingDriver: "worried about project failure reflecting on them",
    expertLabel:
      "It sounds like there's a lot riding on this for you personally.",
    category: "saying-no",
    difficulty: "intermediate",
    labelType: "affect-shift",
    level: 2,
    counterpartResponse:
      "...Yeah, honestly it is. If this launch slips, it's going to reflect on the whole team, and I'm the one who committed to the timeline upstairs.",
  },
  {
    id: "sayno-004",
    characterName: "Linda",
    characterRole: "a long-term client",
    setting: "Video call, end of a project review",
    backstory:
      "You've worked with Linda's company for four years. She's used to the relationship granting flexibility.",
    context:
      "The project review is wrapping up when Linda pivots to something new. She's asking for additional work outside the agreed scope. When you point this out, she says:",
    statement:
      "I thought this would be included. We've been working together for years.",
    surfaceEmotion: "entitled, disappointed",
    underlyingDriver:
      "worried about budget, hopes relationship grants exceptions",
    expertLabel:
      "It seems like you're concerned about staying within budget on this.",
    category: "saying-no",
    difficulty: "advanced",
    labelType: "affect-shift",
    level: 3,
    counterpartResponse:
      "...Part of it is budget, honestly. I told my director this would be covered under the current contract, and now I'll have to go back and ask for more.",
  },

  // ===== DIFFICULT CONVERSATIONS (Affect-Shift) =====
  {
    id: "difficult-001",
    characterName: "Alex",
    characterRole: "your partner",
    setting: "Kitchen at home, evening after a long week",
    backstory:
      "Alex has been stressed about work for weeks and tends to shut down rather than talk.",
    context:
      "Alex walks in the door and something's clearly off. They drop their bag, pour a glass of water, and stare at the counter. You ask how they are and they say:",
    statement: "I had a rough day today.",
    surfaceEmotion: "tired, stressed",
    underlyingDriver:
      "needs acknowledgment, wants to feel heard without fixing",
    expertLabel:
      "It sounds like you need to just decompress without me trying to fix anything.",
    category: "difficult-conversation",
    difficulty: "beginner",
    labelType: "affect-shift",
    level: 1,
    counterpartResponse:
      "...Yeah. I don't need solutions right now. I just need a minute to not be 'on.' Can we just sit for a bit?",
  },
  {
    id: "difficult-002",
    characterName: "Jordan",
    characterRole: "your team member",
    setting: "Your office, end of a strategy meeting",
    backstory: "Jordan has been increasingly disengaged over the past month.",
    context:
      "After the meeting wraps, you hold Jordan back and ask for their honest take on the new direction. They glance away for a moment, then say:",
    statement: "Whatever you think is best.",
    surfaceEmotion: "passive, agreeable",
    underlyingDriver: "feels their input doesn't matter, has checked out",
    expertLabel:
      "It seems like you feel like your opinion won't really change anything.",
    category: "difficult-conversation",
    difficulty: "intermediate",
    labelType: "affect-shift",
    level: 2,
    counterpartResponse:
      "...Honestly? A little. I gave a lot of feedback on the last initiative and it didn't seem to go anywhere. So I've kind of stopped trying.",
  },
  {
    id: "difficult-003",
    characterName: "Chris",
    characterRole: "your direct report",
    setting: "Private conference room, scheduled one-on-one",
    backstory:
      "Chris has been missing deadlines and you're delivering feedback for the first time.",
    context:
      "You've just finished walking Chris through the specific performance concerns. It's clearly the first time they're hearing this formally. After a pause, they look up and say:",
    statement:
      "I thought I was doing a good job. No one told me there was a problem.",
    surfaceEmotion: "defensive, surprised",
    underlyingDriver: "feels blindsided, worried about job security",
    expertLabel:
      "It sounds like this feels like it's coming out of nowhere and that's unsettling.",
    category: "difficult-conversation",
    difficulty: "intermediate",
    labelType: "affect-shift",
    level: 2,
    counterpartResponse:
      "...Yeah, I mean... if there was a problem I wish someone had said something earlier. Now I don't know where I stand.",
  },
  {
    id: "difficult-004",
    characterName: "Sam",
    characterRole: "your close friend",
    setting: "Text exchange, then a brief phone call",
    backstory:
      "Sam cancelled on your birthday dinner at the last minute with almost no explanation.",
    context:
      "You follow up to understand what happened. Sam sounds distracted and a little flat when they finally pick up the phone and say:",
    statement: "Something came up. I'm sure you understand.",
    surfaceEmotion: "dismissive, casual",
    underlyingDriver: "overwhelmed, avoiding conflict about real reason",
    expertLabel:
      "It seems like there's something going on that made this harder than just rescheduling.",
    category: "difficult-conversation",
    difficulty: "advanced",
    labelType: "affect-shift",
    level: 3,
    counterpartResponse:
      "...You're right, I'm sorry. It wasn't nothing. I've been dealing with something and I didn't want to get into it at a birthday dinner and make it about me.",
  },

  // ===== WORKPLACE (Affect-Shift) =====
  {
    id: "workplace-001",
    characterName: "Diane",
    characterRole: "your colleague in a cross-functional meeting",
    setting: "Large conference room, all-hands project review",
    backstory:
      "Diane has been with the company eight years and tried a similar approach in 2021.",
    context:
      "You're mid-presentation when Diane speaks up from across the table. Several people look over. She says:",
    statement: "Actually, we tried that before and it didn't work.",
    surfaceEmotion: "dismissive, superior",
    underlyingDriver:
      "feels their experience is being ignored, wants recognition",
    expertLabel:
      "It sounds like you have valuable experience with this that hasn't been acknowledged.",
    category: "workplace",
    difficulty: "intermediate",
    labelType: "affect-shift",
    level: 2,
    counterpartResponse:
      "...We do. And we got burned pretty badly. If you're going to try this again, I'd want to make sure someone talks to the people who ran it the first time.",
  },
  {
    id: "workplace-002",
    characterName: "Victor",
    characterRole: "a senior colleague",
    setting: "Small team meeting, after your proposal presentation",
    backstory:
      "Victor has been at the company for 12 years and is risk-averse after a failed initiative two years ago.",
    context:
      "You've just finished presenting your process improvement proposal. Most of the room seems intrigued. Victor waits until the others speak, then says:",
    statement:
      "That's interesting, but I'm not sure leadership will go for it.",
    surfaceEmotion: "skeptical, cautious",
    underlyingDriver: "worried about being associated with a failed initiative",
    expertLabel:
      "It seems like you're concerned about the risk if this doesn't land well.",
    category: "workplace",
    difficulty: "advanced",
    labelType: "affect-shift",
    level: 3,
    counterpartResponse:
      "...Yeah, I've been here when things like this went sideways. And the people who championed them didn't come out of it looking great. I don't want that for either of us.",
  },

  // ===== BEHAVIOR PROBE LABELS (Labels 4-5) =====
  {
    id: "behavior-001",
    characterName: "Kevin",
    characterRole: "your colleague",
    setting: "Break room after the quarterly all-hands",
    backstory:
      "Kevin was scheduled to present the quarterly results but handed it to a junior team member at the last minute.",
    context:
      "You catch Kevin refilling his coffee in the break room after the all-hands. You keep it casual, but you want to understand what happened. When you ask about it:",
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
    level: 1,
    deliveryGuidance:
      'Genuinely curious tone. Do NOT sound accusatory. Inner voice: "I want to understand their thinking, not judge it."',
    silenceExpectation:
      "They will likely pause 3-5 seconds, then explain the real reason they handed it off. Wait for it.",
    counterpartResponse:
      "...Yeah. Honestly, the numbers aren't great this quarter and I didn't want to be the one delivering bad news to the executive team.",
  },
  {
    id: "behavior-002",
    characterName: "Priya",
    characterRole: "your manager",
    setting: "Conference room, mid-raise discussion",
    backstory:
      "Your manager suddenly brought up a project issue from weeks ago that had already been resolved.",
    context:
      "The salary conversation was going well until Priya shifted gears. Out of nowhere she brings up a resolved issue from two months ago:",
    statement:
      "And of course there was that situation with the Henderson account.",
    surfaceEmotion: "strategic, deflecting",
    underlyingDriver: "creating leverage to justify not granting the raise",
    expertLabel:
      "It seems like you have a reason for bringing up Henderson right now.",
    category: "salary-negotiation",
    difficulty: "intermediate",
    labelType: "behavior-probe",
    level: 2,
    deliveryGuidance:
      "Calm, observational. Not defensive about Henderson. FM-DJ voice. Downward inflection.",
    silenceExpectation:
      "Expect 4-6 seconds of silence. Manager may backtrack or explain their reasoning for bringing up old issues.",
    counterpartResponse:
      "...I suppose I'm trying to say that raises need to reflect the full picture, not just the wins.",
  },
  {
    id: "behavior-003",
    characterName: "Alex",
    characterRole: "your partner",
    setting: "Living room couch, during a serious financial conversation",
    backstory:
      "You've been trying to have this conversation about money for weeks and Alex keeps deflecting.",
    context:
      "You're finally sitting down to talk through your finances. Alex has been checking their phone every few minutes. You pause the conversation and look at them. They glance up and say:",
    statement: "Sorry, what were you saying? I was just checking something.",
    surfaceEmotion: "distracted, dismissive",
    underlyingDriver: "avoiding the discomfort of the financial conversation",
    expertLabel:
      "It seems like you have a reason for stepping away from this conversation.",
    category: "difficult-conversation",
    difficulty: "beginner",
    labelType: "behavior-probe",
    level: 1,
    deliveryGuidance:
      'Warm but direct. Not accusatory ("You\'re not paying attention!"). Genuinely curious about what is pulling them away.',
    silenceExpectation:
      "They may feel caught. 3-5 seconds pause. Then either acknowledge the avoidance or explain what is pulling their attention.",
    counterpartResponse:
      "...You're right. I keep checking because I'm anxious about the credit card bill that came in today, and I don't want to deal with it.",
  },
  {
    id: "behavior-004",
    characterName: "Tanya",
    characterRole: "a team member",
    setting: "Your inbox, followed by a hallway conversation",
    backstory:
      "Tanya sent an email CC'ing your boss about a minor process issue that could have been handled in a quick chat.",
    context:
      "You ask Tanya if you can talk through the email she sent. She agrees, but her posture is a little guarded. When you ask about looping in leadership, she says:",
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
    level: 2,
    deliveryGuidance:
      "Neutral and curious. Not defensive about being CC'd. FM-DJ voice. The goal is to understand their reasoning, not to criticize their choice.",
    silenceExpectation:
      "4-7 seconds. They may justify initially, then reveal the real frustration beneath the escalation.",
    counterpartResponse:
      "...Honestly, I've brought this up three times in our one-on-ones and nothing changed. I felt like I needed it documented.",
  },
  {
    id: "behavior-005",
    characterName: "Gerald",
    characterRole: "the opposing party in a negotiation",
    setting: "Boardroom, mid-negotiation after your key proposal",
    backstory:
      "You've just presented your main proposal and the other side has gone quiet.",
    context:
      "You finish laying out your proposal. Gerald listens, then glances at his colleague and back to you. He clicks his pen once and says:",
    statement: "Can we take five minutes? I need to make a quick call.",
    surfaceEmotion: "casual, procedural",
    underlyingDriver:
      "needs to consult with someone else or process something unexpected in your proposal",
    expertLabel:
      "It seems like you have a reason for pausing right at this point.",
    category: "salary-negotiation",
    difficulty: "advanced",
    labelType: "behavior-probe",
    level: 3,
    deliveryGuidance:
      "Light, curious. Not blocking the break -- just observing the timing. Upward-curious inflection acceptable here.",
    silenceExpectation:
      "3-5 seconds. They may acknowledge the timing or explain why they need the break.",
    counterpartResponse:
      "...Fair enough. Your proposal had some elements I wasn't expecting, and I want to make sure I'm responding thoughtfully, not reactively.",
  },
  {
    id: "behavior-006",
    characterName: "Derek",
    characterRole: "your friend",
    setting: "Text thread, two days before your move",
    backstory:
      "Derek agreed weeks ago to help you move all day Saturday. He's now backing out to one hour.",
    context:
      "Derek texts you two days before the move. You call him to understand. He sounds a little guilty when he picks up and says:",
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
    level: 2,
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
    characterName: "Michelle",
    characterRole: "your manager",
    setting:
      "Michelle's office, standing 1-on-1 that she scheduled this morning",
    backstory:
      "Michelle messaged you this morning to schedule time to 'discuss a few things.' You don't know the agenda.",
    context:
      "You walk into Michelle's office. She's been at her desk, but sets her laptop aside when you sit down. She smiles and says:",
    statement: "Hey, how's it going? How was your weekend?",
    surfaceEmotion: "pleasant, routine",
    underlyingDriver:
      "has an agenda they want to get to but is testing your readiness to listen",
    expertLabel: "It sounds like you have a place you want to start.",
    category: "workplace",
    difficulty: "beginner",
    labelType: "opening",
    level: 1,
    deliveryGuidance:
      'Warm and encouraging. NOT FM-DJ cold. Smile in your voice. Inner script: "I\'m genuinely ready to hear what they have to say."',
    silenceExpectation:
      "2-4 seconds. Most people are relieved and jump right into their topic.",
    counterpartResponse:
      "...Actually, yeah. I wanted to talk to you about the project timeline. I've been thinking about it all weekend.",
  },
  {
    id: "opening-002",
    characterName: "Robert",
    characterRole: "a potential client",
    setting: "Video call, scheduled compensation negotiation",
    backstory:
      "This is the first formal negotiation call after weeks of email back-and-forth.",
    context:
      "The video call starts and Robert appears on screen. He adjusts his camera, smiles warmly, and opens with:",
    statement:
      "Thanks for making time for this. Beautiful weather today, isn't it?",
    surfaceEmotion: "polite, warming up",
    underlyingDriver:
      "getting a read on your disposition before diving into their position",
    expertLabel: "It sounds like you've been thinking about where to start.",
    category: "salary-negotiation",
    difficulty: "intermediate",
    labelType: "opening",
    level: 2,
    deliveryGuidance:
      "Warm but professional. Not dismissive of their pleasantry. Pace slightly faster than FM-DJ (130-150 WPM) to match the energy of an opening.",
    silenceExpectation:
      "3-5 seconds. They may circle back to chitchat or jump straight into the negotiation topic.",
    counterpartResponse:
      "Yeah, I have actually. Let me share what I've been thinking about the compensation structure.",
  },
  {
    id: "opening-003",
    characterName: "Elena",
    characterRole: "your colleague",
    setting: "Near your workstation, late morning",
    backstory:
      "Elena and you work on different teams but have a solid working relationship.",
    context:
      "Elena appears at the edge of your workspace. She hovers for a moment, glances around, then says:",
    statement: "Hey, do you have a minute? No big deal, just wanted to chat.",
    surfaceEmotion: "casual, minimizing",
    underlyingDriver:
      "has something important to discuss but is testing whether it is safe to bring it up",
    expertLabel:
      "It seems like there's something on your mind you want to get to.",
    category: "difficult-conversation",
    difficulty: "beginner",
    labelType: "opening",
    level: 1,
    deliveryGuidance:
      'Warm, inviting. Give them permission to skip the "no big deal" minimizing. Full attention -- stop what you are doing.',
    silenceExpectation:
      "2-3 seconds. They may take a breath and then open up about the real topic.",
    counterpartResponse:
      "...Okay, yeah. It IS kind of a big deal actually. I've been having a hard time with how the new project assignments were handled.",
  },
  {
    id: "opening-004",
    characterName: "Tyler",
    characterRole: "your direct report",
    setting: "Small meeting room, scheduled performance conversation",
    backstory:
      "Tyler's Q1 numbers have been below target. You asked him to come in to discuss performance.",
    context:
      "Tyler walks in and sits down across from you. He's already tense — shoulders tight, jaw set. He looks at you and says:",
    statement: "So... what did you want to talk about?",
    surfaceEmotion: "anxious, bracing",
    underlyingDriver:
      "already knows the topic and has been dreading it; wants to know how bad it is",
    expertLabel:
      "It sounds like you already have a sense of what this is about.",
    category: "workplace",
    difficulty: "intermediate",
    labelType: "opening",
    level: 2,
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
    characterName: "Carla",
    characterRole: "a potential client",
    setting: "Carla's office, end of a proposal walkthrough",
    backstory:
      "You've just presented your consulting engagement proposal including scope and fees.",
    context:
      "Carla listens to your full proposal, then closes the folder and says:",
    statement: "That's more than we were expecting to spend on this.",
    surfaceEmotion: "concerned, hesitant",
    underlyingDriver:
      "uncertain whether the outcome justifies the investment; needs to justify to decision-makers",
    expertLabel:
      "It seems like the value isn't clear enough yet to justify the investment.",
    category: "salary-negotiation",
    difficulty: "intermediate",
    labelType: "value",
    level: 2,
    deliveryGuidance:
      "Downward inflection. Neutral observation. Not defensive about your price. FM-DJ voice.",
    silenceExpectation:
      "4-6 seconds. They will likely correct with what WOULD make it worth the price.",
    counterpartResponse:
      "Well, it's not that there's no value. I just need to see how this connects to the revenue targets I promised the board.",
  },
  {
    id: "value-002",
    characterName: "Marcus",
    characterRole: "your manager",
    setting: "Conference room, annual review conversation",
    backstory:
      "You've made your case for a raise and your manager has acknowledged your contributions.",
    context:
      "Marcus leans back and says it plainly — he's clearly not opposed to you getting more, but he's stuck:",
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
    level: 2,
    deliveryGuidance:
      "Downward inflection. Empathetic -- acknowledge their constraint. FM-DJ voice.",
    silenceExpectation:
      "4-7 seconds. Manager may reveal what kind of evidence or justification they need.",
    counterpartResponse:
      "...That's kind of it, yeah. If I had clear metrics showing your impact on the Q4 results, I'd have something to bring upstairs.",
  },
  {
    id: "value-003",
    characterName: "Sandra",
    characterRole: "a long-term client",
    setting: "Sandra's conference room, annual contract renewal meeting",
    backstory:
      "You've worked with Sandra's company for three years. She's using competitive bids as leverage.",
    context:
      "The contract renewal meeting has been going well until Sandra pulls out a folder and slides a page toward you:",
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
    level: 3,
    deliveryGuidance:
      "Downward inflection. Do NOT react to the competitive threat. Stay observational. FM-DJ voice at 110-120 WPM.",
    silenceExpectation:
      "5-8 seconds. Long pause. They may reveal whether the alternatives are real or a negotiation tactic.",
    counterpartResponse:
      "...Honestly, the other proposals don't include the reporting and analytics you provide. But the board is putting pressure on costs.",
  },
  {
    id: "value-004",
    characterName: "Ben",
    characterRole: "your friend",
    setting: "Coffee shop, catching up over the weekend",
    backstory:
      "You recommended your financial advisor to Ben and he's on the fence about booking a consultation.",
    context:
      "You've been making the case for your financial advisor for a few minutes. Ben stirs his coffee and looks skeptical:",
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
    level: 1,
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
    characterName: "Nathan",
    characterRole: "a client",
    setting: "Client's conference room, after 45 minutes of scope negotiation",
    backstory:
      "You and Nathan have been trying to find middle ground on project scope for almost an hour with no progress.",
    context:
      "Nathan has heard every variation of your proposal. He's heard all your reasoning. He pushes back from the table slightly and says it with finality:",
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
    level: 3,
    deliveryGuidance:
      'MUST be downward inflection. Calm acceptance. FM-DJ voice at 110-120 WPM. No frustration, no guilt-tripping. Inner voice: "I accept whatever they decide."',
    silenceExpectation:
      "5-10 seconds. This is the longest silence in any label exercise. They either find a way back to the table or confirm the impasse.",
    counterpartResponse:
      "...Well, I didn't say there's nothing you can say. If you could phase the additional work into Q3 instead of Q2, that might be something we could look at.",
  },
  {
    id: "impasse-002",
    characterName: "Rachel",
    characterRole: "your manager",
    setting: "Rachel's office, 30 minutes into a raise negotiation",
    backstory:
      "Rachel has acknowledged your contributions but keeps returning to budget constraints.",
    context:
      "Rachel has listened to everything. She appreciates your case — she's said so. But she keeps coming back to the same wall. After another pause, she says:",
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
    level: 3,
    deliveryGuidance:
      "Calm downward inflection. No pleading. Dignified acceptance. FM-DJ voice.",
    silenceExpectation:
      "5-8 seconds. Manager may reveal alternative forms of compensation or a future timeline.",
    counterpartResponse:
      "...It's not that I don't want to do something. What if we looked at an additional week of PTO and a mid-year review with a commitment to revisit the number then?",
  },
  {
    id: "impasse-003",
    characterName: "Jamie",
    characterRole: "your partner",
    setting: "Living room, Sunday evening holiday planning conversation",
    backstory:
      "You've gone to your family for the holidays every year. Jamie wants to alternate.",
    context:
      "You've been going in circles for 20 minutes. Jamie has been patient, but you can hear the frustration now. They turn to face you directly:",
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
    level: 2,
    deliveryGuidance:
      "Downward inflection. Warm but accepting. This is a relationship, not a transaction -- dignity and respect matter more than winning.",
    silenceExpectation:
      "4-7 seconds. Partner may soften and reveal what would make a compromise work.",
    counterpartResponse:
      "...It's not that I never want to go. I just need us to alternate, and I need you to acknowledge that my family matters too.",
  },
  {
    id: "impasse-004",
    characterName: "Helen",
    characterRole: "a vendor representative",
    setting: "Phone call, vendor contract renewal discussion",
    backstory:
      "You've been trying to negotiate extended payment terms for a new contract.",
    context:
      "Helen has been polite throughout the call, but she keeps coming back to the same answer. After your latest attempt she says clearly:",
    statement: "Our policy is net-30. There's no flexibility on payment terms.",
    surfaceEmotion: "bureaucratic, firm",
    underlyingDriver:
      "may have authority to make exceptions but needs a reason to escalate; or policy truly is fixed",
    expertLabel:
      "It sounds like there is nothing I can say to make extended terms work.",
    category: "workplace",
    difficulty: "advanced",
    labelType: "impasse",
    level: 3,
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
    characterName: "Reena",
    characterRole: "your colleague",
    setting: "Private 1-on-1 room, weekly check-in",
    backstory:
      "Reena has been quiet in meetings for two weeks. You suspect she's upset about being passed over for a project lead role.",
    context:
      "Reena has been unusually quiet in team meetings for two weeks. You suspect she's upset about being passed over for a project lead role but aren't sure. In your 1-on-1, you ask how things are going:",
    statement: "Everything's fine. I'm just focused on my current work.",
    surfaceEmotion: "dismissive, deflecting",
    underlyingDriver:
      "feeling overlooked for the project lead role and questioning their value to the team",
    expertLabel:
      "It seems like the workload has been heavier than usual lately.",
    category: "workplace",
    difficulty: "advanced",
    labelType: "mis-label",
    level: 3,
    deliveryGuidance:
      "Curious upward inflection. This Mis-Label deliberately targets workload (wrong) to invite correction about the real issue (being passed over). Must sound genuinely uncertain.",
    silenceExpectation:
      "4-7 seconds. They will feel the urge to correct. The correction reveals the actual concern.",
    counterpartResponse:
      "It's not really the workload. I just... I thought I was in the running for the Apex project lead, and then it went to Marcus without anyone even talking to me about it.",
  },
  {
    id: "mislabel-002",
    characterName: "David",
    characterRole: "your manager",
    setting: "Conference room, salary negotiation meeting",
    backstory:
      "Your manager seems distracted and keeps checking the clock during your raise conversation.",
    context:
      "You're mid-negotiation and something feels off. David is distracted — keeps checking his watch, glancing at the door. You suspect he has another meeting, but the real issue might be something else. He says:",
    statement: "Let's try to wrap this up. I have a lot on my plate today.",
    surfaceEmotion: "rushed, dismissive",
    underlyingDriver:
      "uncomfortable with the negotiation and wants it to end; may feel they do not have authority to say yes",
    expertLabel:
      "It seems like the timing isn't great for this conversation today.",
    category: "salary-negotiation",
    difficulty: "advanced",
    labelType: "mis-label",
    level: 3,
    deliveryGuidance:
      "Curious upward inflection. Mis-Label targets timing (wrong) to invite correction about the real blocker (authority/comfort with the ask). Deferential, not challenging.",
    silenceExpectation:
      "4-6 seconds. Manager may reveal the actual constraint.",
    counterpartResponse:
      "No, the timing is fine. I just... I honestly don't know what I'm authorized to offer you, and I don't want to make a promise I can't keep.",
  },
  {
    id: "mislabel-003",
    characterName: "Jess",
    characterRole: "your close friend",
    setting: "Phone call, mid-week evening",
    backstory:
      "Jess has declined the last three invitations to hang out. You're calling to check in.",
    context:
      "Jess picks up after a few rings. Her voice is flat, a little quieter than usual. When you ask how she's been she says:",
    statement: "I've just been super busy. You know how it is.",
    surfaceEmotion: "casual, excusing",
    underlyingDriver:
      "going through something personal (depression, relationship issues, financial stress) and withdrawing",
    expertLabel: "It sounds like work has really been taking over lately.",
    category: "difficult-conversation",
    difficulty: "intermediate",
    labelType: "mis-label",
    level: 2,
    deliveryGuidance:
      "Warm, not clinical. Mis-Label targets work (plausible but wrong) to invite correction about the personal issue. Genuinely caring tone.",
    silenceExpectation:
      "3-5 seconds. Friends respond faster. They may admit the real reason.",
    counterpartResponse:
      "...It's not really work. Things have been rough at home. Sarah and I are going through some stuff, and I haven't felt like being around people.",
  },
  {
    id: "mislabel-004",
    characterName: "Greg",
    characterRole: "a project stakeholder",
    setting: "Project meeting room, feature review session",
    backstory:
      "Greg keeps requesting changes to a feature that was already approved. He wasn't in the original sign-off meeting.",
    context:
      "Greg has pushed back on this feature three times now. You're in another review and he raises his concern again. You have a sense this isn't really about the design:",
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
    level: 3,
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

// Helper to get scenarios by drill level (1 = beginner flashcard, 2 = intermediate, 3 = advanced)
export function getScenariosByLevel(level: 1 | 2 | 3): LabelingScenario[] {
  return LABELING_SCENARIOS.filter((s) => s.level === level);
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
