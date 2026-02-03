/**
 * Settings - User demographics and app settings
 * Demographics moved here from ProfilePage for cleaner profile wizard flow
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, saveProfile } from '../features/profile/profileStorage';
import type { UserProfile } from '../features/profile/types';

const TEAM_SIZE_OPTIONS = [
  { value: 'solo', label: 'Solo / Individual contributor' },
  { value: 'small', label: 'Small team (2-5)' },
  { value: 'medium', label: 'Medium team (6-15)' },
  { value: 'large', label: 'Large team (15+)' },
];

export function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const handleChange = (field: keyof UserProfile['demographics'], value: string) => {
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
          </div>
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              saved
                ? 'bg-green-100 text-green-700'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">About You</h2>

          <div className="space-y-4">
            {/* Preferred Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Preferred Name</label>
              <input
                type="text"
                value={profile.demographics.preferredName || ''}
                onChange={(e) => handleChange('preferredName', e.target.value)}
                placeholder="What should we call you?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Pronouns */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Pronouns</label>
              <input
                type="text"
                value={profile.demographics.pronouns || ''}
                onChange={(e) => handleChange('pronouns', e.target.value)}
                placeholder="e.g., she/her, he/him, they/them"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Job Title</label>
              <input
                type="text"
                value={profile.demographics.jobTitle || ''}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="e.g., Product Manager, Engineer"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Industry</label>
              <input
                type="text"
                value={profile.demographics.industry || ''}
                onChange={(e) => handleChange('industry', e.target.value)}
                placeholder="e.g., Tech, Healthcare, Finance"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Team Size */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Team Size</label>
              <select
                value={profile.demographics.teamSize || ''}
                onChange={(e) => handleChange('teamSize', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm bg-white"
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
              <label className="block text-sm text-gray-600 mb-1">Reports To</label>
              <input
                type="text"
                value={profile.demographics.reportsTo || ''}
                onChange={(e) => handleChange('reportsTo', e.target.value)}
                placeholder="e.g., VP of Engineering, CEO"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </section>

        {/* Note about profile */}
        <div className="text-center text-sm text-gray-400">
          Your goals and preferences are managed in your{' '}
          <button
            onClick={() => navigate('/profile')}
            className="text-cyan-600 hover:underline"
          >
            Profile
          </button>
        </div>
      </main>
    </div>
  );
}
