/**
 * ProfilePage - User profile with decision tree goal selection
 *
 * Layout (based on research - PROFILE_PAGE_REDESIGN_RESEARCH.md):
 * 1. Demographics (TOP) - intake form style
 * 2. Long-term Goals (2-level decision tree)
 * 3. Focus Areas (2-level decision tree)
 * 4. Self-Assessment (toggle between options/text)
 * 5. Preferences (open text for AI interpretation)
 */

import { useState } from 'react';
import type { UserProfile } from './types';
import { GOAL_OPTIONS, FOCUS_OPTIONS } from './types';
import { getProfile, saveProfile } from './profileStorage';
import { DecisionTreeSelect } from './components/DecisionTreeSelect';
import { ToggleInput } from './components/ToggleInput';

interface ProfilePageProps {
  onBack: () => void;
}

// Challenge options for self-assessment
const CHALLENGE_OPTIONS = [
  'Filler words (um, like)',
  'Speaking too fast',
  'Speaking too slow',
  'Avoiding conflict',
  'Being too passive',
  'Being too aggressive',
  'Losing train of thought',
  'Not listening well',
];

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile>(getProfile);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Generic field updater
  const updateField = <K extends keyof UserProfile>(
    category: K,
    updates: Partial<UserProfile[K]>
  ) => {
    setProfile((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] as object),
        ...updates,
      },
    }));
    setHasChanges(true);
    setSaveStatus('idle');
  };

  // Direct field updater for nested fields
  const updateDemographic = (field: keyof UserProfile['demographics'], value: string) => {
    updateField('demographics', { [field]: value } as Partial<UserProfile['demographics']>);
  };

  // Save all changes
  const handleSave = () => {
    setSaveStatus('saving');
    saveProfile(profile);
    setTimeout(() => {
      setSaveStatus('saved');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="font-semibold text-gray-900">Your Profile</h1>
          <div className="w-12" />
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Section 1: Demographics (Intake Form Style) */}
        <Section title="About You" icon="👤">
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Preferred Name"
              value={profile.demographics.preferredName || ''}
              placeholder="What should we call you?"
              onChange={(v) => updateDemographic('preferredName', v)}
            />
            <TextField
              label="Pronouns"
              value={profile.demographics.pronouns || ''}
              placeholder="e.g., she/her"
              onChange={(v) => updateDemographic('pronouns', v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Job Title"
              value={profile.demographics.jobTitle || ''}
              placeholder="e.g., Product Manager"
              onChange={(v) => updateDemographic('jobTitle', v)}
            />
            <TextField
              label="Industry"
              value={profile.demographics.industry || ''}
              placeholder="e.g., Tech, Healthcare"
              onChange={(v) => updateDemographic('industry', v)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Team Size"
              value={profile.demographics.teamSize || ''}
              options={[
                { value: '', label: 'Select...' },
                { value: 'solo', label: 'Solo / Freelance' },
                { value: 'small', label: 'Small (2-10)' },
                { value: 'medium', label: 'Medium (10-50)' },
                { value: 'large', label: 'Large (50+)' },
              ]}
              onChange={(v) => updateDemographic('teamSize', v)}
            />
            <TextField
              label="Reports To"
              value={profile.demographics.reportsTo || ''}
              placeholder="e.g., CEO, Manager"
              onChange={(v) => updateDemographic('reportsTo', v)}
            />
          </div>
        </Section>

        {/* Section 2: Long-term Goals (Decision Tree) */}
        <Section title="Long-term Goals" icon="🎯" subtitle="Where do you want to be?">
          <DecisionTreeSelect
            label="What's your primary goal?"
            value={profile.longTermGoals}
            options={GOAL_OPTIONS}
            onChange={(v) => setProfile((prev) => {
              setHasChanges(true);
              setSaveStatus('idle');
              return { ...prev, longTermGoals: v };
            })}
          />
        </Section>

        {/* Section 3: Focus Areas (Separate Decision Tree) */}
        <Section title="Focus Areas" icon="🔍" subtitle="What do you want to work on now?">
          <DecisionTreeSelect
            label="Current focus"
            value={profile.focusAreas}
            options={FOCUS_OPTIONS}
            onChange={(v) => setProfile((prev) => {
              setHasChanges(true);
              setSaveStatus('idle');
              return { ...prev, focusAreas: v };
            })}
          />
        </Section>

        {/* Section 4: Self-Assessment (Toggle Options/Text) */}
        <Section title="Self-Assessment" icon="📋">
          <ToggleInput
            label="Biggest Challenges"
            selectedOptions={profile.selfAssessment.biggestChallenges || []}
            textValue={profile.selfAssessment.biggestChallengesText || ''}
            useTextInput={profile.selfAssessment.useTextInput || false}
            options={CHALLENGE_OPTIONS}
            onOptionsChange={(v) => updateField('selfAssessment', { biggestChallenges: v })}
            onTextChange={(v) => updateField('selfAssessment', { biggestChallengesText: v })}
            onToggle={(v) => updateField('selfAssessment', { useTextInput: v })}
          />
        </Section>

        {/* Section 5: Preferences (Open Text) */}
        <Section title="Preferences" icon="⚙️" subtitle="How should we work with you?">
          <div className="space-y-4">
            <SelectField
              label="Feedback Style"
              value={profile.preferences.feedbackStyle || 'balanced'}
              options={[
                { value: 'direct', label: 'Direct - Tell me straight' },
                { value: 'balanced', label: 'Balanced - Honest but kind' },
                { value: 'gentle', label: 'Gentle - Ease me in' },
              ]}
              onChange={(v) => updateField('preferences', { feedbackStyle: v as UserProfile['preferences']['feedbackStyle'] })}
            />
            <SelectField
              label="Learning Pace"
              value={profile.preferences.pacePreference || 'moderate'}
              options={[
                { value: 'take-it-slow', label: 'Take it slow' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'fast-paced', label: 'Fast-paced' },
              ]}
              onChange={(v) => updateField('preferences', { pacePreference: v as UserProfile['preferences']['pacePreference'] })}
            />
            <TextAreaField
              label="Anything else we should know?"
              value={profile.preferences.openPreferences || ''}
              placeholder="e.g., I prefer morning practice, I learn best with examples, I get nervous in group settings..."
              onChange={(v) => updateField('preferences', { openPreferences: v })}
            />
          </div>
        </Section>

        {/* Section 6: Quick Notes (if any) */}
        {profile.miscellaneous.length > 0 && (
          <Section title="Quick Notes" icon="📝" subtitle="Notes captured during practice sessions">
            <div className="space-y-2">
              {profile.miscellaneous.map((note) => (
                <div key={note.id} className="bg-gray-100 rounded-lg p-3">
                  <p className="text-gray-900 text-sm">{note.content}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-20">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saveStatus === 'saving'}
            className={`w-full py-4 font-semibold rounded-xl transition-colors ${
              saveStatus === 'saved'
                ? 'bg-green-500 text-white'
                : hasChanges
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Shared Components =====

function Section({
  title,
  icon,
  subtitle,
  children,
}: {
  title: string;
  icon: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
