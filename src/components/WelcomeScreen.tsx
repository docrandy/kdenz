/**
 * Welcome Screen Component
 * Full-viewport immersive hero with animated SessionOrb centerpiece
 */

import { SessionOrb } from "./SessionOrb";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background px-6 py-12 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background-surface/30 pointer-events-none" />

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto text-center">
        {/* SessionOrb centerpiece with gentle pulse animation */}
        <div className="mb-12 orb-pulse-animation">
          <SessionOrb
            audioLevel={0}
            isRecording={false}
            onClick={onStart}
            disabled={false}
            size={200}
          />
        </div>

        {/* Hero headline - aspirational premium tone */}
        <h1 className="font-display text-display text-text-heading mb-4 leading-tight">
          Master Every Conversation
        </h1>

        {/* Subheadline */}
        <p className="text-body-lg text-text-body mb-12 max-w-xl">
          Practice difficult conversations with AI coaching. Build confidence
          through real-time feedback.
        </p>

        {/* 3-step technique-focused intro */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 text-left max-w-3xl">
          {/* Step 1 */}
          <div className="flex-1 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-body font-bold text-accent">1</span>
            </div>
            <div>
              <h3 className="text-body font-medium text-text-heading mb-1">
                Choose a technique
              </h3>
              <p className="text-body-sm text-text-body">
                Select from negotiation, feedback, or conflict resolution
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex-1 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-body font-bold text-accent">2</span>
            </div>
            <div>
              <h3 className="text-body font-medium text-text-heading mb-1">
                Practice with AI
              </h3>
              <p className="text-body-sm text-text-body">
                Real conversations with instant voice analytics
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex-1 flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-body font-bold text-accent">3</span>
            </div>
            <div>
              <h3 className="text-body font-medium text-text-heading mb-1">
                Get personalized coaching
              </h3>
              <p className="text-body-sm text-text-body">
                Tailored feedback to accelerate your growth
              </p>
            </div>
          </div>
        </div>

        {/* Primary CTA button */}
        <button
          onClick={onStart}
          className="btn-primary px-8 py-4 text-body-lg font-medium rounded-lg transition-all hover:scale-105 active:scale-95 w-full md:w-auto md:min-w-[280px]"
        >
          Begin Your Practice
        </button>

        {/* Beta badge */}
        <p className="text-caption text-text-subtle mt-8">
          Beta v2.0 — Your feedback shapes the future
        </p>
      </div>

      {/* CSS for gentle pulse animation */}
      <style>{`
        @keyframes gentle-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.03);
            opacity: 0.95;
          }
        }

        .orb-pulse-animation {
          animation: gentle-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
