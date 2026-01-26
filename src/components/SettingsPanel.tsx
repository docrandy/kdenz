import { useState } from 'react';
import { AppSettings, getSettings, saveSettings, resetSettings, DEFAULT_SETTINGS } from '../services/settingsStorage';

interface SettingsPanelProps {
  onSettingsChange?: (settings: AppSettings) => void;
}

export default function SettingsPanel({ onSettingsChange }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(getSettings);

  const handleChange = (key: keyof AppSettings, value: number) => {
    const updated = saveSettings({ [key]: value });
    setSettings(updated);
    onSettingsChange?.(updated);
  };

  const handleReset = () => {
    const defaults = resetSettings();
    setSettings(defaults);
    onSettingsChange?.(defaults);
  };

  return (
    <div className="bg-white border border-clinical-border rounded-lg overflow-hidden">
      {/* Header - always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-clinical-text">Settings</span>
        <svg
          className={`w-4 h-4 text-clinical-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="px-4 pb-4 border-t border-clinical-border">
          {/* Filler Rate Thresholds */}
          <div className="mt-4">
            <p className="text-xs font-medium text-clinical-muted mb-2 uppercase tracking-wide">
              Filler Rate Thresholds
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-clinical-text flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  Good (≤)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={settings.fillerRateGood}
                  onChange={(e) => handleChange('fillerRateGood', parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm border border-clinical-border rounded text-right"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-clinical-text flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  Warning (≤)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={settings.fillerRateWarning}
                  onChange={(e) => handleChange('fillerRateWarning', parseFloat(e.target.value) || 0)}
                  className="w-16 px-2 py-1 text-sm border border-clinical-border rounded text-right"
                />
              </div>
              <p className="text-xs text-clinical-muted">
                Above {settings.fillerRateWarning} = needs work (red)
              </p>
            </div>
          </div>

          {/* Timer Thresholds */}
          <div className="mt-4">
            <p className="text-xs font-medium text-clinical-muted mb-2 uppercase tracking-wide">
              Timer Warnings (seconds)
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-clinical-text">Warning at</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.timerWarning}
                    onChange={(e) => handleChange('timerWarning', parseInt(e.target.value) || 10)}
                    className="w-16 px-2 py-1 text-sm border border-clinical-border rounded text-right"
                  />
                  <span className="text-xs text-clinical-muted">s</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-clinical-text">Critical at</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={settings.timerCritical}
                    onChange={(e) => handleChange('timerCritical', parseInt(e.target.value) || 5)}
                    className="w-16 px-2 py-1 text-sm border border-clinical-border rounded text-right"
                  />
                  <span className="text-xs text-clinical-muted">s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Default Duration */}
          <div className="mt-4">
            <p className="text-xs font-medium text-clinical-muted mb-2 uppercase tracking-wide">
              Default Duration
            </p>
            <div className="flex items-center justify-between">
              <label className="text-sm text-clinical-text">Session length</label>
              <select
                value={settings.defaultDuration}
                onChange={(e) => handleChange('defaultDuration', parseInt(e.target.value))}
                className="px-2 py-1 text-sm border border-clinical-border rounded"
              >
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
                <option value={120}>2 minutes</option>
              </select>
            </div>
          </div>

          {/* Reset button */}
          <div className="mt-4 pt-3 border-t border-clinical-border">
            <button
              onClick={handleReset}
              className="text-xs text-clinical-muted hover:text-clinical-text transition-colors"
            >
              Reset to defaults
            </button>
            <span className="text-xs text-clinical-muted ml-2">
              (Good: {DEFAULT_SETTINGS.fillerRateGood}, Warning: {DEFAULT_SETTINGS.fillerRateWarning})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
