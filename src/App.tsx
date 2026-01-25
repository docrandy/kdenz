import { useState } from 'react'
import './App.css'
import PracticeSession from './components/PracticeSession'
import BrowserWarning from './components/BrowserWarning'
import { isChrome, getBrowserName } from './utils/browserDetection'

function App() {
  const [browserWarningDismissed, setBrowserWarningDismissed] = useState(false)
  const chromeDetected = isChrome()

  return (
    <div className="min-h-screen bg-clinical-bg text-clinical-text">
      {!chromeDetected && !browserWarningDismissed && (
        <BrowserWarning
          browserName={getBrowserName()}
          onDismiss={() => setBrowserWarningDismissed(true)}
        />
      )}
      <PracticeSession />
    </div>
  )
}

export default App
