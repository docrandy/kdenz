import React, { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  /** AnalyserNode from Web Audio API — provides frequency/time domain data */
  analyserNode: AnalyserNode | null;
  /** Whether visualization is active (recording in progress) */
  isActive: boolean;
  /** Optional width in px (default: 100% of container) */
  width?: number;
  /** Optional height in px (default: 120) */
  height?: number;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  analyserNode,
  isActive,
  width,
  height = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataIndexRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions with devicePixelRatio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = width || canvas.offsetWidth;
    const displayHeight = height;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    ctx.scale(dpr, dpr);

    // Initialize with dark background and center line
    const initializeCanvas = () => {
      ctx.fillStyle = "#1a1f2e"; // Dark navy background
      ctx.fillRect(0, 0, displayWidth, displayHeight);

      // Draw faint center line
      ctx.strokeStyle = "#2a3241";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, displayHeight / 2);
      ctx.lineTo(displayWidth, displayHeight / 2);
      ctx.stroke();
    };

    initializeCanvas();

    // Cleanup function
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [width, height]);

  useEffect(() => {
    if (!isActive || !analyserNode) {
      // Clear canvas and reset when not active
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const displayWidth = width || canvas.offsetWidth;
          const displayHeight = height;

          ctx.fillStyle = "#1a1f2e";
          ctx.fillRect(0, 0, displayWidth, displayHeight);

          // Draw center line
          ctx.strokeStyle = "#2a3241";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, displayHeight / 2);
          ctx.lineTo(displayWidth, displayHeight / 2);
          ctx.stroke();
        }
      }

      dataIndexRef.current = 0;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const displayWidth = width || canvas.offsetWidth;
    const displayHeight = height;

    const bufferLength = analyserNode.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = 3; // Width of each bar
    const barGap = 1; // Gap between bars

    const draw = () => {
      // Get time domain data (audio amplitude)
      analyserNode.getByteTimeDomainData(dataArray);

      // Calculate RMS (root mean square) for amplitude
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const normalized = (dataArray[i] - 128) / 128; // Normalize to -1 to 1
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / bufferLength);

      // Calculate bar height (centered vertically)
      const maxBarHeight = displayHeight / 2 - 10; // Leave some padding
      const barHeight = Math.min(rms * maxBarHeight * 3, maxBarHeight); // Amplify for visibility

      // Current X position
      const x = dataIndexRef.current;

      // If we've reached the end, shift the canvas left
      if (x >= displayWidth - barWidth) {
        const imageData = ctx.getImageData(
          barWidth + barGap,
          0,
          displayWidth - barWidth - barGap,
          displayHeight,
        );
        ctx.fillStyle = "#1a1f2e";
        ctx.fillRect(0, 0, displayWidth, displayHeight);
        ctx.putImageData(imageData, 0, 0);

        // Redraw center line
        ctx.strokeStyle = "#2a3241";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, displayHeight / 2);
        ctx.lineTo(displayWidth, displayHeight / 2);
        ctx.stroke();

        // Draw at the right edge
        const drawX = displayWidth - barWidth - barGap;
        ctx.fillStyle = "#c9a84c"; // Gold accent color
        ctx.fillRect(
          drawX,
          displayHeight / 2 - barHeight,
          barWidth,
          barHeight * 2,
        );
      } else {
        // Draw bar at current position
        ctx.fillStyle = "#c9a84c"; // Gold accent color
        ctx.fillRect(x, displayHeight / 2 - barHeight, barWidth, barHeight * 2);

        // Advance position
        dataIndexRef.current += barWidth + barGap;
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isActive, analyserNode, width, height]);

  return (
    <div className="waveform-visualizer-container rounded-lg overflow-hidden bg-background-surface border border-background-elevated">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
};
