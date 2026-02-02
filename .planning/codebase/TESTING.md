# Testing Patterns

**Analysis Date:** 2026-02-02

## Test Framework

**Runner:**
- Vitest 4.0.18 with jsdom environment
- Config: No `vitest.config.ts` found (using default config from Vite)
- Build tool: Vite 5.4.11 with React plugin

**Assertion Library:**
- Testing Library: `@testing-library/react` 16.3.2
- DOM matchers: `@testing-library/jest-dom` 6.9.1

**Run Commands:**
```bash
npm test              # Run all tests once
npm run test -- --watch  # Watch mode (implied, not explicitly configured)
npm run test -- --coverage  # Coverage report (not configured in package.json)
```

## Test File Organization

**Status:** No test files detected in codebase

**Location (when added):**
- Co-located approach recommended: place `*.test.tsx` or `*.spec.tsx` adjacent to source files
- Example: `src/components/FillerGauge.tsx` → `src/components/FillerGauge.test.tsx`
- Or separate `__tests__` directory: `src/components/__tests__/FillerGauge.test.tsx`

**Naming Convention:**
- `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` suffix
- Match the source filename: `FillerGauge.tsx` → `FillerGauge.test.tsx`

## Test Structure

**File organization pattern (recommended for this codebase):**

```typescript
// Import statements
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import ComponentToTest from './ComponentToTest'

// Test suite
describe('ComponentToTest', () => {
  // Setup/teardown can go here
  beforeEach(() => {
    // Common setup
  })

  afterEach(() => {
    // Common cleanup
  })

  describe('Feature Group', () => {
    test('should handle specific case', () => {
      // Arrange
      const props = { /* ... */ }

      // Act
      render(<ComponentToTest {...props} />)
      const element = screen.getByRole('button')

      // Assert
      expect(element).toBeInTheDocument()
    })
  })
})
```

**Patterns observed in codebase (for manual testing):**
- Manual testing with console.error logging in ErrorBoundary
- Development feedback boxes (`DevFeedbackBoxes.tsx`) for testing on-screen
- localStorage inspection for state persistence testing

## Mocking

**Framework:** Vitest's built-in mocking (no explicit mocking library configured)

**Patterns to use (recommended):**

```typescript
// Mock external modules
vi.mock('../services/sessionStorage', () => ({
  getAllSessions: vi.fn(() => []),
  saveSession: vi.fn(() => ({ id: '123', /* ... */ })),
}))

// Mock React Router
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}))

// Mock Web APIs
const mockAudioContext = {
  createAnalyser: vi.fn(() => ({
    fftSize: 1024,
    getFloatTimeDomainData: vi.fn(),
    getByteFrequencyData: vi.fn(),
  })),
}
```

**What to Mock:**
- External API calls (Gemini API via `geminiService.ts`)
- Browser APIs that aren't available in test environment (AudioContext, Web Speech API, localStorage)
- Navigation and routing hooks (useNavigate, useLocation)
- Feature module imports in isolation tests
- Timer functions (setTimeout, requestAnimationFrame) for deterministic tests

**What NOT to Mock:**
- Pure utility functions (`countFillerWords`, `isChrome`, `getDateString`)
- State management (React useState/useRef behavior)
- Tailwind styles (styling is not tested, only layout)
- Internal component state changes (unless testing isolation)

## Fixtures and Factories

**Test Data (recommended approach):**

```typescript
// In src/services/__tests__/fixtures/sessionData.ts
export const mockSessionSummary = {
  id: 'session-1',
  timestamp: Date.now(),
  date: '2026-02-02',
  durationSeconds: 60,
  wordCount: 150,
  wpm: 150,
  fillerCount: 3,
  fillerRate: 3,
}

export const createMockSession = (overrides = {}) => ({
  ...mockSessionSummary,
  ...overrides,
})

// In test file
test('should calculate weekly aggregates', () => {
  const sessions = [
    createMockSession({ date: '2026-02-02' }),
    createMockSession({ date: '2026-02-02', fillerCount: 5 }),
  ]
  // ... test with sessions
})
```

**Location (when created):**
- Centralized: `src/__tests__/fixtures/` or `src/__tests__/factories/`
- Or co-located with feature: `src/services/__tests__/fixtures/`

**Pattern:**
- Use factory functions for flexibility: `createMockSession(overrides)`
- Use constants for shared data: `mockSessionSummary`
- Keep fixtures simple and minimal (only required fields)

## Coverage

**Requirements:** Not enforced currently

**Target (recommended):**
- 80%+ coverage for business logic (services, utilities, hooks)
- 60%+ coverage for components (complex logic only, skip presentation)
- Full coverage for critical paths (filler detection, session storage, API integration)

**View Coverage:**
```bash
npm test -- --coverage
# Outputs to console and creates coverage/ directory with HTML reports
```

## Test Types

**Unit Tests:**
- Scope: Individual functions, utilities, simple components
- Approach:
  - Test pure functions (`countFillerWords`, `isChrome`, `generateId`)
  - Test hook logic (state updates, side effects)
  - Test service functions (data transformation, storage operations)

  Example for `fillerReconciler.ts`:
  ```typescript
  describe('reconcileFillers', () => {
    test('should find fillers in transcript', () => {
      const transcript = 'like um hello'
      const wordTimings = [
        { word: 'like', timestamp: 0, index: 0 },
        { word: 'um', timestamp: 200, index: 1 },
      ]
      const result = reconcileFillers(transcript, [], wordTimings)
      expect(result).toHaveLength(2)
    })
  })
  ```

**Integration Tests:**
- Scope: Multiple components working together, service integration
- Approach:
  - Test component with hooks (AudioCapture + FillerDetector)
  - Test session storage with UI updates
  - Test navigation flow between pages

  Example:
  ```typescript
  describe('PracticeSession Integration', () => {
    test('should save session when stopping', async () => {
      const { getByRole } = render(<PracticeSession />)
      const startButton = getByRole('button', { name: /start/i })
      fireEvent.click(startButton)
      // ... simulate speech ...
      const stopButton = getByRole('button', { name: /stop/i })
      fireEvent.click(stopButton)
      expect(saveSession).toHaveBeenCalled()
    })
  })
  ```

**E2E Tests:**
- Framework: Not configured (Vitest does not include E2E by default)
- Recommendation: Add Playwright or Cypress if E2E testing needed
- Current approach: Manual testing with dev feedback boxes in app

## Common Patterns

**Async Testing:**

```typescript
// With waitFor for async state updates
test('should load profile', async () => {
  render(<Dashboard />)

  await waitFor(() => {
    expect(screen.getByText(/profile/i)).toBeInTheDocument()
  })
})

// With userEvent for realistic interactions
import { userEvent } from '@testing-library/user-event'

test('should handle button click', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(<button onClick={handleClick}>Click me</button>)

  await user.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalled()
})
```

**Error Testing:**

```typescript
test('should catch and display errors', () => {
  const error = new Error('Audio access denied')
  render(<MicPermissionError />)

  expect(screen.getByText(/permission/i)).toBeInTheDocument()
})

test('should recover from error with retry', () => {
  render(<ErrorBoundary><ThrowingComponent /></ErrorBoundary>)

  const retryButton = screen.getByRole('button', { name: /try again/i })
  fireEvent.click(retryButton)

  expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
})
```

**Hook Testing:**

```typescript
import { renderHook, act } from '@testing-library/react'

test('useWebSpeech should start/stop listening', () => {
  const { result } = renderHook(() => useWebSpeech())

  expect(result.current.isListening).toBe(false)

  act(() => {
    result.current.start()
  })

  expect(result.current.isListening).toBe(true)
})
```

**localStorage Mocking:**

```typescript
// Setup before tests
beforeEach(() => {
  const store: Record<string, string> = {}

  const mockLocalStorage = {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
  }

  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  })
})
```

**Web Speech API Mocking:**

```typescript
beforeEach(() => {
  global.webkitSpeechRecognition = vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    abort: vi.fn(),
    onresult: null,
    onerror: null,
    onend: null,
    onstart: null,
    continuous: false,
    interimResults: false,
    lang: 'en-US',
  }))
})
```

## Test Organization Strategy

**Priority for testing (recommended):**

1. **Critical Path (must test):**
   - `fillerReconciler.ts` - core filler detection logic
   - `sessionStorage.ts` - data persistence
   - `FillerDetector.ts` - acoustic pattern matching
   - `useWebSpeech.ts` - transcript capture

2. **High Value (should test):**
   - `PracticeSession.tsx` - main interaction component
   - Services (Gemini API integration, profile storage)
   - Feature modules (accusation-audit, labeling)

3. **Nice to Have (optional):**
   - Utility functions (browser detection, formatting)
   - Presentation components (FillerGauge, scorecard displays)

**Test file count estimate:**
- Core services: 5-6 test files
- Components: 8-10 test files
- Hooks: 4-5 test files
- Utilities: 2-3 test files
- Total: ~20-25 test files for MVP coverage

---

*Testing analysis: 2026-02-02*
