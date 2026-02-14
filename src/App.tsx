import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import PracticeSession from "./components/PracticeSession";
import BrowserWarning from "./components/BrowserWarning";
import ErrorBoundary from "./components/ErrorBoundary";
import FeedbackButton from "./components/FeedbackButton";
import WelcomeScreen from "./components/WelcomeScreen";
import InlineProfileSetup from "./components/InlineProfileSetup";
import DiagnosticOnboarding from "./components/DiagnosticOnboarding";
import ConsentModal from "./components/ConsentModal";
import Privacy from "./pages/Privacy";
import Dashboard from "./pages/Dashboard";
import PreSessionScreen from "./pages/PreSessionScreen";
import PostSessionResults from "./pages/PostSessionResults";
import EvaluationPage from "./pages/EvaluationPage";
import { SessionDetail } from "./pages/SessionDetail";
import Settings from "./pages/Settings";
import { ProfilePage } from "./features/profile";
import { isChrome, getBrowserName } from "./utils/browserDetection";
import DevFeedbackBoxes from "./components/DevFeedbackBoxes";
import { hasDiagnosticResults } from "./lib/diagnosticQuestions";
import { getProfile } from "./features/profile/profileStorage";
import BaselineSession from "./pages/BaselineSession";
import BaselineResults from "./pages/BaselineResults";
import ScenarioLibrary from "./pages/ScenarioLibrary";
import ScenarioDetail from "./pages/ScenarioDetail";
import TechniqueFeedback from "./pages/TechniqueFeedback";
import { AppHeader } from "./components/AppHeader";
import { SlideTransition } from "./components/SlideTransition";

const CONSENT_ACCEPTED_KEY = "voicelab_consent_accepted";
const WELCOME_SEEN_KEY = "voicelab_welcome_seen";
const PROFILE_SETUP_SEEN_KEY = "voicelab_profile_setup_seen";
const DIAGNOSTIC_SKIPPED_KEY = "voicelab_diagnostic_skipped";

// ScreenLayout wrapper - AppHeader + children (for Phase 15 redesigned screens)
interface ScreenLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  hideHeader?: boolean;
}

export function ScreenLayout({
  children,
  showBack,
  onBack,
  hideHeader,
}: ScreenLayoutProps) {
  return (
    <SlideTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <AppHeader
          showBack={showBack}
          onBack={onBack}
          hideHeader={hideHeader}
        />
        <main className="flex-1">{children}</main>
      </div>
    </SlideTransition>
  );
}

// Wrapper for ProfilePage with navigation
function ProfileRoute() {
  const navigate = useNavigate();
  return <ProfilePage onBack={() => navigate("/")} />;
}

// Wrapper for Free Practice with navigation - Filler mode
function FreePracticeFillerRoute() {
  return <PracticeSession focusMode="filler" />;
}

// Wrapper for Free Practice with navigation - Pace mode
function FreePracticePaceRoute() {
  return <PracticeSession focusMode="pace" />;
}

// Wrapper for Technique Practice with navigation back to library
function TechniquePracticeRoute() {
  return <PracticeSession focusMode="filler" />;
}

// Wrapper for Baseline Practice with filler mode
function BaselinePracticeRoute() {
  return <PracticeSession focusMode="filler" />;
}

function App() {
  const [browserWarningDismissed, setBrowserWarningDismissed] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const chromeDetected = isChrome();

  // Check onboarding state
  useEffect(() => {
    try {
      // Check consent first
      const consent = localStorage.getItem(CONSENT_ACCEPTED_KEY);
      if (!consent) {
        setConsentAccepted(false);
        return; // Don't check other onboarding until consent is given
      }
      setConsentAccepted(true);

      // Then check welcome, profile setup, and diagnostic
      const welcomeSeen = localStorage.getItem(WELCOME_SEEN_KEY);
      const profileSetupSeen = localStorage.getItem(PROFILE_SETUP_SEEN_KEY);
      const diagnosticSkipped = localStorage.getItem(DIAGNOSTIC_SKIPPED_KEY);
      const hasDiagnostics = hasDiagnosticResults();

      if (!welcomeSeen) {
        setShowWelcome(true);
      } else if (!profileSetupSeen) {
        // Check if profile has a name - if not, show profile setup
        const profile = getProfile();
        if (!profile.demographics.preferredName) {
          setShowProfileSetup(true);
        }
      } else if (!hasDiagnostics && !diagnosticSkipped) {
        setShowDiagnostic(true);
      }
    } catch {
      setConsentAccepted(false);
      setShowWelcome(false);
      setShowProfileSetup(false);
      setShowDiagnostic(false);
    }
  }, []);

  const handleConsentAccept = () => {
    try {
      localStorage.setItem(CONSENT_ACCEPTED_KEY, "true");
    } catch {
      // Storage not available
    }
    setConsentAccepted(true);
    // Check if welcome should be shown
    try {
      const welcomeSeen = localStorage.getItem(WELCOME_SEEN_KEY);
      if (!welcomeSeen) {
        setShowWelcome(true);
      }
    } catch {
      // Continue without welcome
    }
  };

  const handleWelcomeComplete = () => {
    try {
      localStorage.setItem(WELCOME_SEEN_KEY, "true");
    } catch {
      // Storage not available
    }
    setShowWelcome(false);
    // Check if profile setup needed
    const profile = getProfile();
    if (!profile.demographics.preferredName) {
      setShowProfileSetup(true);
    } else if (!hasDiagnosticResults()) {
      setShowDiagnostic(true);
    }
  };

  const handleProfileSetupComplete = () => {
    try {
      localStorage.setItem(PROFILE_SETUP_SEEN_KEY, "true");
    } catch {
      // Storage not available
    }
    setShowProfileSetup(false);
    // Show diagnostic after profile setup if not completed
    if (!hasDiagnosticResults()) {
      setShowDiagnostic(true);
    }
  };

  const handleProfileSetupSkip = () => {
    try {
      localStorage.setItem(PROFILE_SETUP_SEEN_KEY, "true");
    } catch {
      // Storage not available
    }
    setShowProfileSetup(false);
    // Continue to diagnostic check
    if (!hasDiagnosticResults()) {
      setShowDiagnostic(true);
    }
  };

  const handleDiagnosticComplete = () => {
    setShowDiagnostic(false);
  };

  const handleDiagnosticSkip = () => {
    try {
      localStorage.setItem(DIAGNOSTIC_SKIPPED_KEY, "true");
    } catch {
      // Storage not available
    }
    setShowDiagnostic(false);
  };

  // Determine what to show on home route
  const renderHome = () => {
    if (!chromeDetected && !browserWarningDismissed) {
      return (
        <BrowserWarning
          browserName={getBrowserName()}
          onDismiss={() => setBrowserWarningDismissed(true)}
        />
      );
    }

    if (showWelcome) {
      return <WelcomeScreen onStart={handleWelcomeComplete} />;
    }

    if (showProfileSetup) {
      return (
        <InlineProfileSetup
          onComplete={handleProfileSetupComplete}
          onSkip={handleProfileSetupSkip}
        />
      );
    }

    if (showDiagnostic) {
      return (
        <DiagnosticOnboarding
          onComplete={handleDiagnosticComplete}
          onSkip={handleDiagnosticSkip}
        />
      );
    }

    return <Dashboard />;
  };

  // Top-level consent gate - blocks ALL routes until consent is given
  if (!consentAccepted) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background text-text">
          <ConsentModal onAccept={handleConsentAccept} />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-text">
        <Routes>
          <Route path="/" element={renderHome()} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/baseline" element={<BaselineSession />} />
          <Route
            path="/practice/baseline"
            element={<BaselinePracticeRoute />}
          />
          <Route path="/baseline/results" element={<BaselineResults />} />
          <Route path="/practice/:mode/setup" element={<PreSessionScreen />} />
          <Route
            path="/practice/filler"
            element={<FreePracticeFillerRoute />}
          />
          <Route path="/practice/pace" element={<FreePracticePaceRoute />} />
          <Route path="/practice/results" element={<PostSessionResults />} />
          <Route path="/practice/evaluation" element={<EvaluationPage />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/session/:sessionId" element={<SessionDetail />} />
          <Route path="/library" element={<ScenarioLibrary />} />
          <Route path="/technique/:techniqueId" element={<ScenarioDetail />} />
          <Route
            path="/practice/technique"
            element={<TechniquePracticeRoute />}
          />
          <Route
            path="/practice/technique-results"
            element={<TechniqueFeedback />}
          />
        </Routes>
        <FeedbackButton />
        <DevFeedbackBoxesWrapper />
      </div>
    </ErrorBoundary>
  );
}

// Wrapper to get current location for DevFeedbackBoxes
function DevFeedbackBoxesWrapper() {
  const location = useLocation();
  const pageName =
    location.pathname === "/"
      ? "Dashboard"
      : location.pathname.replace(/\//g, " ").trim();
  return <DevFeedbackBoxes currentPage={pageName} />;
}

export default App;
