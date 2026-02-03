import { useEffect, useRef } from 'react';
import './PlasmaOrb.css';

interface PlasmaOrbProps {
  /** 0-1 audio level from mic (drives brightness + filament speed) */
  audioLevel: number;
  /** 0-1 filler intensity (drives filament density / internal complexity) */
  fillerIntensity: number;
  /** Whether session is active (true = reactive mode, false = idle ambient) */
  isActive: boolean;
  /** Click handler (used for start/stop toggle) */
  onClick: () => void;
  /** Whether the orb is in a loading/starting state */
  isLoading?: boolean;
  /** Whether click is disabled */
  disabled?: boolean;
  /** Optional size override (default ~250px diameter) */
  size?: number;
}

interface Filament {
  angle: number;
  length: number;
  speed: number;
  offset: number;
  opacity: number;
}

export default function PlasmaOrb({
  audioLevel,
  fillerIntensity,
  isActive,
  onClick,
  isLoading = false,
  disabled = false,
  size = 250,
}: PlasmaOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filamentsRef = useRef<Filament[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const timeRef = useRef<number>(0);

  // Initialize filaments
  useEffect(() => {
    const baseFilamentCount = 12;
    const filaments: Filament[] = [];

    for (let i = 0; i < baseFilamentCount; i++) {
      filaments.push({
        angle: (Math.PI * 2 * i) / baseFilamentCount,
        length: 0.4 + Math.random() * 0.3,
        speed: 0.5 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        opacity: 0.3 + Math.random() * 0.4,
      });
    }

    filamentsRef.current = filaments;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const baseRadius = size * 0.35;

    const animate = () => {
      timeRef.current += 0.016; // ~60fps

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Determine animation parameters based on state
      let glowIntensity = 0.3;
      let filamentSpeed = 0.5;
      let breathingScale = 1;

      if (isLoading) {
        // Pulsing animation for loading
        glowIntensity = 0.4 + Math.sin(timeRef.current * 3) * 0.2;
        breathingScale = 1 + Math.sin(timeRef.current * 3) * 0.05;
      } else if (isActive) {
        // Active state - responsive to audio
        if (audioLevel > 0.1) {
          // Speaking - bright and active
          glowIntensity = 0.5 + audioLevel * 0.3;
          filamentSpeed = 1 + audioLevel * 2;
          breathingScale = 1 + audioLevel * 0.1;
        } else {
          // Active but silent - still alive
          glowIntensity = 0.35;
          filamentSpeed = 0.7;
          breathingScale = 1 + Math.sin(timeRef.current * 1.5) * 0.02;
        }
      } else {
        // Idle - gentle ambient animation
        glowIntensity = 0.25 + Math.sin(timeRef.current * 0.8) * 0.05;
        filamentSpeed = 0.3;
        breathingScale = 1 + Math.sin(timeRef.current * 0.7) * 0.02;
      }

      const currentRadius = baseRadius * breathingScale;

      // Draw outer glow layers
      const glowLayers = 3;
      for (let i = glowLayers; i > 0; i--) {
        const glowRadius = currentRadius * (1 + i * 0.15);
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          currentRadius,
          centerX,
          centerY,
          glowRadius
        );

        const alpha = (glowIntensity / glowLayers) * (1 - i / glowLayers);
        gradient.addColorStop(0, `rgba(0, 212, 255, ${alpha})`);
        gradient.addColorStop(1, 'rgba(0, 212, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw core sphere
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        currentRadius
      );
      coreGradient.addColorStop(0, `rgba(0, 212, 255, ${glowIntensity * 0.8})`);
      coreGradient.addColorStop(0.5, `rgba(0, 212, 255, ${glowIntensity * 0.5})`);
      coreGradient.addColorStop(1, `rgba(0, 212, 255, ${glowIntensity * 0.2})`);

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
      ctx.fill();

      // Draw filaments
      const filamentCount = filamentsRef.current.length;
      const densityMultiplier = 1 + fillerIntensity;

      ctx.strokeStyle = `rgba(255, 255, 255, 0.6)`;
      ctx.lineWidth = 1.5;

      for (let i = 0; i < filamentCount * densityMultiplier; i++) {
        const filament = filamentsRef.current[i % filamentCount];
        const time = timeRef.current * filamentSpeed * filament.speed + filament.offset;

        // Calculate filament path with wave
        const startRadius = currentRadius * 0.3;
        const endRadius = currentRadius * filament.length;
        const waveAmplitude = currentRadius * 0.1;

        const baseAngle = filament.angle + time * 0.2;

        ctx.beginPath();
        ctx.globalAlpha = filament.opacity * (0.5 + fillerIntensity * 0.5);

        // Draw curved filament
        for (let r = startRadius; r < endRadius; r += 2) {
          const progress = (r - startRadius) / (endRadius - startRadius);
          const wave = Math.sin(progress * Math.PI * 4 + time) * waveAmplitude * progress;
          const angle = baseAngle + wave / r;

          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (r === startRadius) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      // Draw interference patterns (subtle)
      if (fillerIntensity > 0.3) {
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.2 * fillerIntensity})`;
        ctx.lineWidth = 0.5;

        const patternCount = Math.floor(3 + fillerIntensity * 3);
        for (let i = 0; i < patternCount; i++) {
          const patternRadius = currentRadius * (0.5 + (i / patternCount) * 0.4);
          const offset = timeRef.current * 0.5 + i;

          ctx.beginPath();
          ctx.arc(
            centerX + Math.sin(offset) * 5,
            centerY + Math.cos(offset) * 5,
            patternRadius,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [size, audioLevel, fillerIntensity, isActive, isLoading]);

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div
      className={`plasma-orb-container ${isActive ? 'active' : ''} ${isLoading ? 'loading' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      style={{
        width: size,
        height: size,
      }}
    >
      <canvas
        ref={canvasRef}
        className="plasma-orb-canvas"
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
}
