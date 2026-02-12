/**
 * Settings - User demographics and app settings
 * Demographics moved here from ProfilePage for cleaner profile wizard flow
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProfile, saveProfile } from "../features/profile/profileStorage";
import type { UserProfile } from "../features/profile/types";
import {
  hasDiagnosticResults,
  getDiagnosticSummary,
  clearDiagnosticResults,
} from "../lib/diagnosticQuestions";

const TEAM_SIZE_OPTIONS = [
  { value: "solo", label: "Solo / Individual contributor" },
  { value: "small", label: "Small team (2-5)" },
  { value: "medium", label: "Medium team (6-15)" },
  { value: "large", label: "Large team (15+)" },
];

export function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [diagnosticSummary, setDiagnosticSummary] = useState<
    { question: string; answer: string }[]
  >([]);
  const hasDiagnostic = hasDiagnosticResults();

  useEffect(() => {
    setProfile(getProfile());
    setDiagnosticSummary(getDiagnosticSummary());
  }, []);

  const handleChange = (
    field: keyof UserProfile["demographics"],
    value: string,
  ) => {
    if (!profile) return;
    setProfile({
      ...profile,
      demographics: {
        ...profile.demographics,
        [field]: value,
      },
    });
    setSaved(false);
  };

  const handleSave = () => {
    if (!profile) return;
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleRetakeDiagnostic = () => {
    clearDiagnosticResults();
    // Also clear the skipped flag so diagnostic shows again
    try {
      localStorage.removeItem("voicelab_diagnostic_skipped");
    } catch {
      // Storage not available
    }
    // Navigate to home - diagnostic will show automatically
    navigate("/");
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-subtle">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background-surface border-b border-background-elevated z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 -ml-2 text-text-muted hover:text-text"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <h1 className="text-body-lg font-semibold text-text">Settings</h1>
          </div>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
              saved ? "bg-status-success/10 text-status-success" : "btn-primary"
            }`}
          >
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <section className="mb-8">
          <h2 className="text-body-sm font-semibold text-text mb-4">About You</h2>

          <div className="space-y-4">
            {/* Preferred Name */}
            <div>
              <label className="block text-body-sm text-text-muted mb-1">
                Preferred Name
              </label>
              <input
                type="text"
                value={profile.demographics.preferredName || ""}
                onChange={(e) => handleChange("preferredName", e.target.value)}
                placeholder="What should we call you?"
                className="input"
              />
            </div>

            {/* Pronouns */}
            <div>
              <label className="block text-body-sm text-text-muted mb-1">
                Pronouns
              </label>
              <input
                type="text"
                value={profile.demographics.pronouns || ""}
                onChange={(e) => handleChange("pronouns", e.target.value)}
                placeholder="e.g., she/her, he/him, they/them"
                className="input"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-body-sm text-text-muted mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={profile.demographics.jobTitle || ""}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
                placeholder="e.g., Product Manager, Engineer"
                className="input"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-body-sm text-text-muted mb-1">
                Industry
              </label>
              <input
                type="text"
                value={profile.demographics.industry || ""}
                onChange={(e) => handleChange("industry", e.target.value)}
                placeholder="e.g., Tech, Healthcare, Finance"
                className="input"
              />
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-body-sm text-text-muted mb-1">
                Team Size
              </label>
              <select
                value={profile.demographics.teamSize || ""}
                onChange={(e) => handleChange("teamSize", e.target.value)}
                className="input"
              >
                <option value="">Select team size</option>
                {TEAM_SIZE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reports To */}
            <div>
              <label className="block text-body-sm text-text-muted mb-1">
                Reports To
              </label>
              <input
                type="text"
                value={profile.demographics.reportsTo || ""}
                onChange={(e) => handleChange("reportsTo", e.target.value)}
                placeholder="e.g., VP of Engineering, CEO"
                className="input"
              />
            </div>
          </div>
        </section>

        {/* Speaking Goals */}
        <section className="mb-8">
          <h2 className="text-body-sm font-semibold text-text mb-4">
            Speaking Goals
          </h2>

          {hasDiagnostic ? (
            <div className="space-y-3">
              {diagnosticSummary.map((item, i) => (
                <div key={i} className="p-3 bg-background-elevated rounded-lg">
                  <p className="text-caption text-text-muted mb-1">
                    {item.question}
                  </p>
                  <p className="text-body-sm text-text">{item.answer}</p>
                </div>
              ))}
              <button
                onClick={handleRetakeDiagnostic}
                className="w-full mt-4 py-3 text-body-sm text-accent hover:text-accent/80 transition-colors"
              >
                Retake Diagnostic →
              </button>
            </div>
          ) : (
            <div className="text-center py-6 bg-background-elevated rounded-lg">
              <p className="text-body-sm text-text-muted mb-3">
                No diagnostic completed yet
              </p>
              <button onClick={handleRetakeDiagnostic} className="btn-primary">
                Take Diagnostic
              </button>
            </div>
          )}
        </section>

        {/* Privacy & Data */}
        <section className="mb-8">
          <h2 className="text-body-sm font-semibold text-text mb-4">
            Privacy & Data
          </h2>
          <Link
            to="/privacy"
            className="flex items-center justify-between p-3 bg-background-elevated rounded-lg hover:bg-background-surface transition-colors"
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div>
                <p className="text-body-sm font-medium text-text">
                  Privacy & Your Data
                </p>
                <p className="text-caption text-text-muted">
                  How we handle your information
                </p>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-text-subtle"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </section>

        {/* Note about profile */}
        <div className="text-center text-body-sm text-text-subtle">
          Your goals and preferences are managed in your{" "}
          <button
            onClick={() => navigate("/profile")}
            className="text-accent hover:underline"
          >
            Profile
          </button>
        </div>
      </main>
    </div>
  );
}
