import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import PracticeSession from './components/PracticeSession'
import BrowserWarning from './components/BrowserWarning'
import ErrorBoundary from './components/ErrorBoundary'
import FeedbackButton from './components/FeedbackButton'
import WelcomeScreen from './components/WelcomeScreen'
import DiagnosticOnboarding from './components/DiagnosticOnboarding'
import Privacy from './pages/Privacy'
import Dashboard from './pages/Dashboard'
import { LabelingPractice } from './features/labeling'
import { AccusationAuditPractice } from './features/accusation-audit'
import { ProfilePage } from './features/profile'
import { isChrome, getBrowserName } from './utils/browserDetection'
import DevFeedbackBoxes from './components/DevFeedbackBoxes'
import { hasDiagnosticResults } from './lib/diagnosticQuestions'

const WELCOME_SEEN_KEY = 'voicelab_welcome_seen'
const DIAGNOSTIC_SKIPPED_KEY = 'voicelab_diagnostic_skipped'

// Wrapper for LabelingPractice with navigation
function LabelingPracticeRoute() {
  const navigate = useNavigate()
  return <LabelingPractice onBack={() => navigate('/')} />
}

// Wrapper for AccusationAuditPractice with navigation
function AccusationAuditRoute() {
  const navigate = useNavigate()
  return <AccusationAuditPractice onBack={() => navigate('/')} />
}

// Wrapper for ProfilePage with navigation
function ProfileRoute() {
  const navigate = useNavigate()
  return <ProfilePage onBack={() => navigate('/')} />
}

// Wrapper for Free Practice with navigation
function FreePracticeRoute() {
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
      <PracticeSession />
    </div>
  )
}

function App() {
  const [browserWarningDismissed, setBrowserWarningDismissed] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [showDiagnostic, setShowDiagnostic] = useState(false)
  const chromeDetected = isChrome()

  // Check onboarding state
  useEffect(() => {
    try {
      const welcomeSeen = localStorage.getItem(WELCOME_SEEN_KEY)
      const diagnosticSkipped = localStorage.getItem(DIAGNOSTIC_SKIPPED_KEY)
      const hasDiagnostics = hasDiagnosticResults()

      if (!welcomeSeen) {
        setShowWelcome(true)
      } else if (!hasDiagnostics && !diagnosticSkipped) {
        setShowDiagnostic(true)
      }
    } catch {
      setShowWelcome(false)
      setShowDiagnostic(false)
    }
  }, [])

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

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-clinical-bg text-clinical-text">
        <Routes>
          <Route path="/" element={renderHome()} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/practice" element={<FreePracticeRoute />} />
          <Route path="/practice/labeling" element={<LabelingPracticeRoute />} />
          <Route path="/practice/accusation-audit" element={<AccusationAuditRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
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
