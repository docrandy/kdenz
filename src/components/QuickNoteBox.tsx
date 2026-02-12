/**
 * QuickNoteBox - Small floating note box for capturing thoughts during practice
 * Positioned on right side, ~75% down the page
 * Auto-saves with AI-suggested categorization
 */

import { useState, useRef, useEffect } from "react";
import { addMiscNote } from "../features/profile/profileStorage";
import type { ProfileCategory } from "../features/profile/types";

interface QuickNoteBoxProps {
  /** Context about what the user is practicing (for AI categorization) */
  practiceContext?: string;
}

export function QuickNoteBox({ practiceContext }: QuickNoteBoxProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when expanded
  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  // Auto-hide success message
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setIsExpanded(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleSave = async () => {
    if (!note.trim()) return;

    setIsSaving(true);

    // Try to categorize with AI (Haiku)
    let suggestedCategory: ProfileCategory | undefined;

    try {
      suggestedCategory = await categorizeWithAI(note, practiceContext);
    } catch (error) {
      console.log("AI categorization unavailable, saving to miscellaneous");
    }

    // Save the note
    addMiscNote(note.trim(), suggestedCategory);

    // Show success and reset
    setNote("");
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Save on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    // Close on Escape
    if (e.key === "Escape") {
      setIsExpanded(false);
    }
  };

  // Collapsed state - just a small button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed right-4 bottom-1/4 z-30 bg-background-surface border-2 border-background-elevated rounded-xl px-3 py-2 shadow-lg hover:shadow-xl hover:border-accent transition-all group"
        title="Add a note about yourself"
      >
        <div className="flex items-center gap-2">
          <span className="text-body-lg">📝</span>
          <span className="text-body-sm text-text-muted group-hover:text-accent hidden sm:inline">
            About me
          </span>
        </div>
      </button>
    );
  }

  // Success state
  if (showSuccess) {
    return (
      <div className="fixed right-4 bottom-1/4 z-30 bg-status-success/10 border-2 border-status-success/30 rounded-xl p-4 shadow-lg w-64">
        <div className="flex items-center gap-2 text-status-success">
          <span className="text-body-lg">✓</span>
          <span className="font-medium">Saved to profile!</span>
        </div>
      </div>
    );
  }

  // Expanded state - note input
  return (
    <div className="fixed right-4 bottom-1/4 z-30 bg-background-surface border-2 border-accent/20 rounded-xl shadow-xl w-72">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-background-elevated">
        <span className="text-body-sm font-medium text-text">Quick note</span>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-text-subtle hover:text-text-muted text-body-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Input */}
      <div className="p-3">
        <textarea
          ref={textareaRef}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Jot down any thought, preference, or insight..."
          rows={3}
          className="w-full resize-none border border-background-elevated rounded-lg p-2 text-body-sm bg-background-elevated text-text focus:ring-2 focus:ring-accent focus:border-transparent"
          disabled={isSaving}
        />

        <div className="flex items-center justify-between mt-2">
          <span className="text-caption text-text-subtle">
            ⌘/Ctrl + Enter to save
          </span>
          <button
            onClick={handleSave}
            disabled={!note.trim() || isSaving}
            className="px-3 py-1.5 btn-primary text-body-sm disabled:bg-background-elevated disabled:text-text-subtle disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Hint */}
      <div className="px-3 pb-3">
        <p className="text-caption text-text-subtle">
          Notes are saved to your profile. AI will suggest a category.
        </p>
      </div>
    </div>
  );
}

/**
 * Categorize a note using AI (Claude Haiku for low cost)
 * Falls back gracefully if API unavailable
 */
async function categorizeWithAI(
  note: string,
  practiceContext?: string,
): Promise<ProfileCategory | undefined> {
  // Check if Gemini API key is available (we'll use that for now)
  const apiKey = localStorage.getItem("voicelab_gemini_api_key");
  if (!apiKey) {
    return undefined;
  }

  try {
    const prompt = `You are categorizing a user's note into one of these profile categories:
- basics: Name, pronouns, identity
- workContext: Job, industry, work environment
- communicationGoals: What they're working on, upcoming conversations
- selfAssessment: Challenges, triggers, strengths
- relationshipContext: Family, personal relationships
- preferences: How they like feedback, learning style
- history: Past experiences
- miscellaneous: Doesn't fit elsewhere

User note: "${note}"
${practiceContext ? `Context: They wrote this while practicing ${practiceContext}.` : ""}

Respond with ONLY the category name (one word, exactly as listed above). If unsure, respond with "miscellaneous".`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            maxOutputTokens: 20,
            temperature: 0,
          },
        }),
      },
    );

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text
      ?.trim()
      .toLowerCase();

    // Validate it's a real category
    const validCategories: ProfileCategory[] = [
      "basics",
      "workContext",
      "communicationGoals",
      "selfAssessment",
      "relationshipContext",
      "preferences",
      "history",
      "miscellaneous",
    ];

    if (validCategories.includes(result as ProfileCategory)) {
      return result as ProfileCategory;
    }

    return "miscellaneous";
  } catch {
    return undefined;
  }
}

export default QuickNoteBox;
