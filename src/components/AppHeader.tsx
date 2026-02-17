/**
 * AppHeader - Shared navigation header
 * Consistent across all Phase 15 screens
 *
 * Features:
 * - Hamburger menu (☰) or back arrow (<) on left
 * - "VoiceLab" title centered (Cormorant Garamond)
 * - Circular profile avatar on right
 * - Sticky at top with bottom border
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../features/profile";

export interface AppHeaderProps {
  /** Show back arrow instead of hamburger when inside a sub-flow */
  showBack?: boolean;
  /** Callback when back arrow is clicked */
  onBack?: () => void;
  /** Optional custom title (defaults to "VoiceLab") */
  title?: string;
  /** Hide entire header (for immersive recording screen) */
  hideHeader?: boolean;
}

export function AppHeader({
  showBack = false,
  onBack,
  title = "VoiceLab",
  hideHeader = false,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  if (hideHeader) {
    return null;
  }

  const profile = getProfile();
  const profileInitial =
    profile?.demographics?.preferredName?.[0]?.toUpperCase() || "?";

  return (
    <header className="bg-background-surface border-b border-background-elevated sticky top-0 z-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left: Back arrow or Hamburger */}
        <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
          {showBack ? (
            <button
              onClick={onBack || (() => navigate(-1))}
              className="p-2 hover:bg-background-elevated rounded-lg transition-colors active:bg-background-elevated"
              aria-label="Go back"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-text-muted"
              >
                <path
                  d="M12.5 15L7.5 10L12.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-background-elevated rounded-lg transition-colors active:bg-background-elevated"
              aria-label="Menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-text-muted rounded" />
                <span className="w-full h-0.5 bg-text-muted rounded" />
                <span className="w-full h-0.5 bg-text-muted rounded" />
              </div>
            </button>
          )}
        </div>

        {/* Center: Title */}
        <h1 className="text-h3 font-display font-bold text-text-heading tracking-wide">
          {title}
        </h1>

        {/* Right: Profile Avatar */}
        <button
          onClick={() => navigate("/profile")}
          className="w-9 h-9 bg-gradient-to-br from-accent/80 to-accent rounded-full flex items-center justify-center text-text-inverse text-body font-bold flex-shrink-0 hover:opacity-90 transition-opacity active:opacity-80"
          aria-label="View profile"
        >
          {profileInitial}
        </button>
      </div>

      {/* Dropdown Menu (when hamburger is active) */}
      {menuOpen && !showBack && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menu */}
          <div className="absolute left-4 sm:left-6 top-[60px] w-48 bg-background-surface rounded-xl shadow-lg border border-background-elevated z-40 py-2">
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/profile");
              }}
              className="w-full px-4 py-3 text-left hover:bg-background-elevated active:bg-background-elevated flex items-center gap-3 text-body text-text-body"
            >
              <span>👤</span>
              <span>Profile</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/voice-profile");
              }}
              className="w-full px-4 py-3 text-left hover:bg-background-elevated active:bg-background-elevated flex items-center gap-3 text-body text-text-body"
            >
              <span>🎙️</span>
              <span>Voice Profile</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/breathing");
              }}
              className="w-full px-4 py-3 text-left hover:bg-background-elevated active:bg-background-elevated flex items-center gap-3 text-body text-text-body"
            >
              <span>🧘</span>
              <span>Breathing</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/settings");
              }}
              className="w-full px-4 py-3 text-left hover:bg-background-elevated active:bg-background-elevated flex items-center gap-3 text-body text-text-body"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/privacy");
              }}
              className="w-full px-4 py-3 text-left hover:bg-background-elevated active:bg-background-elevated flex items-center gap-3 text-body text-text-body"
            >
              <span>🔒</span>
              <span>Privacy</span>
            </button>
          </div>
        </>
      )}
    </header>
  );
}
