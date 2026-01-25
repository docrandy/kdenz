/**
 * Browser Detection and Gate
 *
 * Chrome-only for beta due to Safari Web Speech API issues:
 * - 90% accuracy drop on Safari
 * - Critical bugs in Safari's implementation
 */

export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';

export interface BrowserInfo {
  type: BrowserType;
  isChrome: boolean;
  isSupported: boolean;
  version: string | null;
  userAgent: string;
}

/**
 * Detect browser type from user agent
 */
export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;

  let type: BrowserType = 'unknown';
  let version: string | null = null;

  // Order matters: check more specific browsers first
  // Edge (Chromium-based) contains "Edg/" in UA
  if (ua.includes('Edg/')) {
    type = 'edge';
    const match = ua.match(/Edg\/(\d+)/);
    version = match ? match[1] : null;
  }
  // Opera contains "OPR/" in UA
  else if (ua.includes('OPR/') || ua.includes('Opera/')) {
    type = 'opera';
    const match = ua.match(/(?:OPR|Opera)\/(\d+)/);
    version = match ? match[1] : null;
  }
  // Chrome contains "Chrome/" but not "Edg/" or "OPR/"
  else if (ua.includes('Chrome/') && !ua.includes('Edg/') && !ua.includes('OPR/')) {
    type = 'chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : null;
  }
  // Safari contains "Safari/" but not "Chrome/"
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    type = 'safari';
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : null;
  }
  // Firefox contains "Firefox/"
  else if (ua.includes('Firefox/')) {
    type = 'firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : null;
  }

  const isChrome = type === 'chrome';
  // Only Chrome is supported for beta
  const isSupported = isChrome;

  return {
    type,
    isChrome,
    isSupported,
    version,
    userAgent: ua,
  };
}

/**
 * Check if browser supports required Web APIs
 */
export function checkBrowserCapabilities(): {
  hasGetUserMedia: boolean;
  hasAudioContext: boolean;
  hasWebSpeech: boolean;
  allSupported: boolean;
} {
  const hasGetUserMedia = !!(navigator.mediaDevices?.getUserMedia);
  const hasAudioContext = !!(window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
  const hasWebSpeech = !!((window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);

  return {
    hasGetUserMedia,
    hasAudioContext,
    hasWebSpeech,
    allSupported: hasGetUserMedia && hasAudioContext,
  };
}
