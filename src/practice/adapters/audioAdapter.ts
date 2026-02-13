import { useAudioCapture } from "../../core/audio";

export function useAudioAdapter() {
  return useAudioCapture();
}

export type AudioAdapter = ReturnType<typeof useAudioAdapter>;
