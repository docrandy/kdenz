import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DurationSelector from '../components/DurationSelector';
import { getLastDuration, saveLastDuration } from '../services/durationConfig';

export default function PreSessionScreen() {
  const { mode } = useParams<{ mode: 'filler' | 'pace' }>();
  const navigate = useNavigate();

  const [selectedDuration, setSelectedDuration] = useState(() => getLastDuration());

  const handleStartSession = () => {
    // Save duration preference
    saveLastDuration(selectedDuration);

    // Navigate to session with duration in route state
    navigate(`/practice/${mode}`, {
      state: { durationSeconds: selectedDuration }
    });
  };

  const getModeTitle = () => {
    if (mode === 'filler') return 'Filler Words';
    if (mode === 'pace') return 'Speech Pace';
    return 'Practice Session';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-safe">
      {/* Header with back button */}
      <div className="border-b sticky top-0 z-10 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 active:text-black flex items-center gap-2 text-sm sm:text-base min-h-[44px]"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {getModeTitle()}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Choose your session length
            </p>
          </div>

          {/* Duration selector */}
          <DurationSelector
            selected={selectedDuration}
            onChange={setSelectedDuration}
          />

          {/* Start button */}
          <button
            onClick={handleStartSession}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-900 active:bg-gray-800 transition-colors min-h-[56px]"
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
}
