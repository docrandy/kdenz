import { ReactNode } from 'react';

interface SessionMetricsProps {
  fillerCount: number;
  fillerRate: number;
  wpm: number;
  isActive: boolean;
  children: ReactNode;
}

export default function SessionMetrics({
  fillerCount,
  fillerRate,
  wpm,
  isActive,
  children,
}: SessionMetricsProps) {
  if (!isActive) {
    return null;
  }

  // Determine pace label for WPM
  const getPaceLabel = (wpm: number): string => {
    if (wpm < 100) return 'Slow';
    if (wpm <= 150) return 'Good';
    if (wpm <= 180) return 'Fast';
    return 'Very Fast';
  };

  return (
    <div className="flex items-center justify-center gap-8 mb-6 animate-fadeIn">
      {/* LEFT: Filler metrics */}
      <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-clinical-border min-w-[120px]">
        <div className="text-4xl font-bold text-clinical-text mb-1">
          {fillerCount}
        </div>
        <div className="text-xs text-clinical-muted mb-2">fillers</div>
        <div className="text-sm font-semibold text-clinical-accent">
          {fillerRate.toFixed(1)}/min
        </div>
      </div>

      {/* CENTER: Children (PlasmaOrb) */}
      {children}

      {/* RIGHT: WPM metrics */}
      <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-clinical-border min-w-[120px]">
        <div className="text-4xl font-bold text-clinical-text mb-1">
          {wpm}
        </div>
        <div className="text-xs text-clinical-muted mb-2">WPM</div>
        <div className="text-sm font-semibold text-clinical-accent">
          {getPaceLabel(wpm)}
        </div>
      </div>
    </div>
  );
}
