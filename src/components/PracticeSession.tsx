import { useAudioCapture } from '../core/audio';

export default function PracticeSession() {
  const {
    isCapturing,
    audioContext,
    sourceNode,
    audioBlob,
    error,
    start,
    stop,
  } = useAudioCapture();

  const handleToggleSession = async () => {
    if (isCapturing) {
      stop();
    } else {
      await start();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-clinical-bg px-4">
      <div className="w-full max-w-md">
        {/* Card with teal accent border */}
        <div className="bg-white border-2 border-clinical-accent rounded-lg shadow-lg p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-clinical-text mb-2">
            Voice Practice Session
          </h1>

          {/* Subtitle */}
          <p className="text-clinical-muted mb-8">
            {isCapturing ? 'Recording in progress...' : 'Ready to practice'}
          </p>

          {/* Error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Status indicator with accent color */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`w-3 h-3 rounded-full ${
                isCapturing ? 'bg-clinical-accent animate-pulse' : 'bg-clinical-muted'
              }`}
            />
            <span className="text-sm text-clinical-muted">
              {isCapturing ? 'Mic active' : 'Mic ready'}
            </span>
          </div>

          {/* Audio context status (for debugging) */}
          {audioContext && (
            <div className="mb-4 text-xs text-clinical-muted">
              Audio: {audioContext.state} | Sample rate: {audioContext.sampleRate}Hz
            </div>
          )}

          {/* Start/Stop Session button */}
          <button
            onClick={handleToggleSession}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              isCapturing
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-clinical-text text-white hover:bg-gray-800'
            }`}
          >
            {isCapturing ? 'Stop Session' : 'Start Session'}
          </button>

          {/* Audio blob info (for debugging) */}
          {audioBlob && !isCapturing && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Recording saved: {(audioBlob.size / 1024).toFixed(1)} KB
            </div>
          )}

          {/* Decorative accent element */}
          <div className="mt-6 pt-6 border-t border-clinical-border">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-clinical-accent" />
              <div className="w-2 h-2 rounded-full bg-clinical-accent opacity-60" />
              <div className="w-2 h-2 rounded-full bg-clinical-accent opacity-30" />
            </div>
          </div>

          {/* Debug: Source node status */}
          {sourceNode && (
            <div className="mt-2 text-xs text-center text-clinical-muted">
              Source node connected (ready for analysis)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
