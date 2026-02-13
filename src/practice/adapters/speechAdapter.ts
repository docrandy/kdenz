import { useWebSpeech } from "../../core/audio";

export function useSpeechAdapter() {
  return useWebSpeech();
}

export type SpeechAdapter = ReturnType<typeof useSpeechAdapter>;
