import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import PracticeSession from './components/PracticeSession'
import BrowserWarning from './components/BrowserWarning'
import ErrorBoundary from './components/ErrorBoundary'
import FeedbackButton from './components/FeedbackButton'
import WelcomeScreen from './components/WelcomeScreen'
import DiagnosticOnboarding from './components/DiagnosticOnboarding'
import Privacy from './pages/Privacy'
import { LabelingPractice } from './features/labeling'
import { isChrome, getBrowserName } from './utils/browserDetection'
import { hasDiagnosticResults } from './lib/diagnosticQuestions'

const WELCOME_SEEN_KEY = 'voicelab_welcome_seen'
const DIAGNOSTIC_SKIPPED_KEY = 'voicelab_diagnostic_skipped'

// Wrapper for LabelingPractice with navigation
function LabelingPracticeRoute() {
  const navigate = useNavigate()
  return <LabelingPractice onBack={() => navigate('/')} />
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

    return <PracticeSession />
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-clinical-bg text-clinical-text">
        <Routes>
          <Route path="/" element={renderHome()} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/practice/labeling" element={<LabelingPracticeRoute />} />
        </Routes>
        <FeedbackButton />
      </div>
    </ErrorBoundary>
  )
}

export default App
