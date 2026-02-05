import { useNavigate } from 'react-router-dom';

export default function BaselineSession() {
  const navigate = useNavigate();

  const handleBeginBaseline = () => {
    // Navigate to practice session with baseline configuration
    navigate('/practice/baseline', {
      state: {
        durationSeconds: 180,
        isBaseline: true,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Let's establish your baseline
          </h1>
        </div>

        {/* Main instructional copy */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <p className="text-lg text-gray-700 leading-relaxed">
            For the next 3 minutes, we'll measure your typical pace, pauses, and filler
            word usage. Just speak naturally — there are no wrong answers.
          </p>

          <p className="text-base text-gray-600">
            From your next session onward, we'll show your progress relative to this
            baseline — not comparisons to other people.
          </p>
        </div>

        {/* What to expect */}
        <div className="bg-clinical-accent bg-opacity-10 rounded-lg p-4 border border-clinical-accent border-opacity-20">
          <p className="text-sm text-gray-700">
            We'll give you a few topics to talk about. New prompts will appear as you go — just speak naturally.
          </p>
        </div>

        {/* Begin button */}
        <button
          onClick={handleBeginBaseline}
          className="w-full px-6 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
        >
          Begin Baseline
        </button>
      </div>
    </div>
  );
}
