import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import PracticeSession from './components/PracticeSession'
import BrowserWarning from './components/BrowserWarning'
import ErrorBoundary from './components/ErrorBoundary'
import FeedbackButton from './components/FeedbackButton'
import WelcomeScreen from './components/WelcomeScreen'
import DiagnosticOnboarding from './components/DiagnosticOnboarding'
import ConsentModal from './components/ConsentModal'
import Privacy from './pages/Privacy'
import Dashboard from './pages/Dashboard'
import PreSessionScreen from './pages/PreSessionScreen'
import PostSessionResults from './pages/PostSessionResults'
import { SessionDetail } from './pages/SessionDetail'
import { Settings } from './pages/Settings'
import { ProfilePage } from './features/profile'
import { isChrome, getBrowserName } from './utils/browserDetection'
import DevFeedbackBoxes from './components/DevFeedbackBoxes'
import { hasDiagnosticResults } from './lib/diagnosticQuestions'
import BaselineSession from './pages/BaselineSession'
import BaselineResults from './pages/BaselineResults'

const CONSENT_ACCEPTED_KEY = 'voicelab_consent_accepted'
const WELCOME_SEEN_KEY = 'voicelab_welcome_seen'
const DIAGNOSTIC_SKIPPED_KEY = 'voicelab_diagnostic_skipped'

// Wrapper for ProfilePage with navigation
function ProfileRoute() {
  const navigate = useNavigate()
  return <ProfilePage onBack={() => navigate('/')} />
}

// Wrapper for Free Practice with navigation - Filler mode
function FreePracticeFillerRoute() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Back button header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
      <PracticeSession focusMode="filler" />
    </div>
  )
}

// Wrapper for Free Practice with navigation - Pace mode
function FreePracticePaceRoute() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Back button header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
      <PracticeSession focusMode="pace" />
    </div>
  )
}

// Wrapper for Baseline Practice with filler mode
function BaselinePracticeRoute() {
  return <PracticeSession focusMode="filler" />
}

function App() {
  const [browserWarningDismissed, setBrowserWarningDismissed] = useState(false)
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const chromeDetected = isChrome()

  // Check onboarding state
  useEffect(() => {
    try {
      // Check consent first
      const consent = localStorage.getItem(CONSENT_ACCEPTED_KEY)
      if (!consent) {
        setConsentAccepted(false)
        return // Don't check other onboarding until consent is given
      }
      setConsentAccepted(true)

      // Then check welcome and diagnostic
      const welcomeSeen = localStorage.getItem(WELCOME_SEEN_KEY)
      const diagnosticSkipped = localStorage.getItem(DIAGNOSTIC_SKIPPED_KEY)
      const hasDiagnostics = hasDiagnosticResults()

      if (!welcomeSeen) {
        setShowWelcome(true)
      } else if (!hasDiagnostics && !diagnosticSkipped) {
        setShowDiagnostic(true)
      }
    } catch {
      setConsentAccepted(false)
      setShowWelcome(false)
      setShowDiagnostic(false)
    }
  }, [])

  const handleConsentAccept = () => {
    try {
      localStorage.setItem(CONSENT_ACCEPTED_KEY, 'true')
    } catch {
      // Storage not available
    }
    setConsentAccepted(true)
    // Check if welcome should be shown
    try {
      const welcomeSeen = localStorage.getItem(WELCOME_SEEN_KEY)
      if (!welcomeSeen) {
        setShowWelcome(true)
      }
    } catch {
      // Continue without welcome
    }
  }

  const handleWelcomeComplete = () => {
    try {
      localStorage.setItem(WELCOME_SEEN_KEY, 'true')
    } catch {
      // Storage not available
    }
    setShowWelcome(false)
    // Show diagnostic after welcome if not completed
    if (!hasDiagnosticResults()) {
      setShowDiagnostic(true)
    }
  }

  const handleDiagnosticComplete = () => {
    setShowDiagnostic(false)
  }

  const handleDiagnosticSkip = () => {
    try {
      localStorage.setItem(DIAGNOSTIC_SKIPPED_KEY, 'true')
    } catch {
      // Storage not available
    }
    setShowDiagnostic(false)
  }

  // Determine what to show on home route
  const renderHome = () => {
    if (!chromeDetected && !browserWarningDismissed) {
      return (
        <BrowserWarning
          browserName={getBrowserName()}
          onDismiss={() => setBrowserWarningDismissed(true)}
        />
      )
    }

    if (showWelcome) {
      return <WelcomeScreen onStart={handleWelcomeComplete} />
    }

    if (showDiagnostic) {
      return (
        <DiagnosticOnboarding
          onComplete={handleDiagnosticComplete}
          onSkip={handleDiagnosticSkip}
        />
      )
    }

    return <Dashboard />
  }

  // Top-level consent gate - blocks ALL routes until consent is given
  if (!consentAccepted) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-clinical-bg text-clinical-text">
          <ConsentModal onAccept={handleConsentAccept} />
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-clinical-bg text-clinical-text">
        <Routes>
          <Route path="/" element={renderHome()} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/baseline" element={<BaselineSession />} />
          <Route path="/practice/baseline" element={<BaselinePracticeRoute />} />
          <Route path="/baseline/results" element={<BaselineResults />} />
          <Route path="/practice/:mode/setup" element={<PreSessionScreen />} />
          <Route path="/practice/filler" element={<FreePracticeFillerRoute />} />
          <Route path="/practice/pace" element={<FreePracticePaceRoute />} />
          <Route path="/practice/results" element={<PostSessionResults />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/session/:sessionId" element={<SessionDetail />} />
        </Routes>
        <FeedbackButton />
        <DevFeedbackBoxesWrapper />
      </div>
    </ErrorBoundary>
  )
}

// Wrapper to get current location for DevFeedbackBoxes
function DevFeedbackBoxesWrapper() {
  const location = useLocation()
  const pageName = location.pathname === '/' ? 'Dashboard' : location.pathname.replace(/\//g, ' ').trim()
  return <DevFeedbackBoxes currentPage={pageName} />
}

export default App
