/**
 * Time Authority (TF-01)
 *
 * Single monotonic clock for all session timestamps.
 * All timing in the application MUST use this authority.
 *
 * Uses performance.now() for high-resolution monotonic time.
 * Session start time establishes the epoch for all relative timestamps.
 */

/**
 * Session time context - all timestamps relative to session start
 */
export interface SessionTimeContext {
  /** Session start time (performance.now()) */
  sessionStart: number;
  /** Get current time relative to session start (ms) */
  now: () => number;
  /** Get absolute timestamp (ms since epoch) */
  absoluteNow: () => number;
  /** Convert session-relative time to absolute */
  toAbsolute: (sessionTime: number) => number;
  /** Convert absolute time to session-relative */
  toRelative: (absoluteTime: number) => number;
}

/**
 * Global time authority singleton
 * Ensures all components use the same time source
 */
class TimeAuthority {
  private sessionStart: number | null = null;
  private absoluteSessionStart: number | null = null;

  /**
   * Start a new timing session
   * Call this when recording begins
   */
  startSession(): SessionTimeContext {
    this.sessionStart = performance.now();
    this.absoluteSessionStart = Date.now();

    const sessionStart = this.sessionStart;
    const absoluteSessionStart = this.absoluteSessionStart;

    return {
      sessionStart,
      now: () => performance.now() - sessionStart,
      absoluteNow: () => Date.now(),
      toAbsolute: (sessionTime: number) => absoluteSessionStart + sessionTime,
      toRelative: (absoluteTime: number) => absoluteTime - absoluteSessionStart,
    };
  }

  /**
   * Get current session context
   * Returns null if no session is active
   */
  getSession(): SessionTimeContext | null {
    if (this.sessionStart === null || this.absoluteSessionStart === null) {
      return null;
    }

    const sessionStart = this.sessionStart;
    const absoluteSessionStart = this.absoluteSessionStart;

    return {
      sessionStart,
      now: () => performance.now() - sessionStart,
      absoluteNow: () => Date.now(),
      toAbsolute: (sessionTime: number) => absoluteSessionStart + sessionTime,
      toRelative: (absoluteTime: number) => absoluteTime - absoluteSessionStart,
    };
  }

  /**
   * End current session
   */
  endSession(): void {
    this.sessionStart = null;
    this.absoluteSessionStart = null;
  }

  /**
   * Check if a session is active
   */
  isSessionActive(): boolean {
    return this.sessionStart !== null;
  }

  /**
   * Get monotonic time (independent of session)
   * Use for internal timing that doesn't need session context
   */
  monotonic(): number {
    return performance.now();
  }
}

// Export singleton instance
export const timeAuthority = new TimeAuthority();

/**
 * Timestamp with metadata
 */
export interface TimestampedEvent<T> {
  /** Event data */
  data: T;
  /** Session-relative timestamp (ms) */
  sessionTime: number;
  /** Absolute timestamp (ms since epoch) */
  absoluteTime: number;
}

/**
 * Create a timestamped event using the time authority
 */
export function timestampEvent<T>(data: T, session: SessionTimeContext): TimestampedEvent<T> {
  return {
    data,
    sessionTime: session.now(),
    absoluteTime: session.absoluteNow(),
  };
}
