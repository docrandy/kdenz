export function isChrome(): boolean {
  const userAgent = navigator.userAgent;
  // Chrome includes "Chrome" but not "Edg" (Edge also says Chrome)
  // Also exclude Opera which includes Chrome
  const isChromium = userAgent.includes('Chrome') && !userAgent.includes('Edg') && !userAgent.includes('OPR');
  return isChromium;
}

export function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Chrome')) return 'Chrome';
  return 'Unknown';
}
