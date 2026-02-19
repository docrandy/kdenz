# Debugging: "Summary After Every Message" Issue

## Quick Diagnosis Steps

### Step 1: Confirm It's Happening in ConversationalDrill
1. Open the app at https://kdenz.vercel.app
2. Go to **Skills Lab** → **Labeling Practice**
3. Select **Level 2** (text + audio) conversational drill
4. Pick a scenario and start practicing
5. Submit ONE label and note:
   - What appears after you send the message?
   - Where does it appear (below, modal, sidebar)?
   - Does it have a title or heading?
   - Screenshot it if possible

### Step 2: Open Browser DevTools
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Clear the console (trash icon)
4. Refresh the page
5. Go back to the same scenario
6. Submit one message

### Step 3: Look for These Logs

#### If you see coaching summaries being generated:
```
[Gemini] API key found
[Gemini] Prompt built, sending to API
[Gemini] Response received, status: 200
[Gemini] Successfully generated AI summary
```

#### If you see debrief generation (should NOT happen mid-session):
```
[Debrief] Starting session debrief synthesis
[Debrief] Completed debrief generation
```

#### If you see `generateSessionDebrief` called:
```javascript
// In console, search for:
generateSessionDebrief  // Should ONLY appear at end (exchange 10)
```

---

## Detailed Investigation

### Investigation 1: Confirm Summary is Per-Message (Not Per-Session)

Copy and paste into console:
```javascript
// Start monitoring function calls
const originalConsoleLog = console.log;
let summaryCallCount = 0;
let exchangeCount = 0;

console.log = function(...args) {
  // Track when summaries are generated
  if (args[0]?.includes?.('summary') || args[0]?.includes?.('debrief')) {
    summaryCallCount++;
    originalConsoleLog('[SUMMARY DETECTED #' + summaryCallCount + ']', ...args);
  }
  // Track exchanges
  if (args[0]?.includes?.('exchange')) {
    exchangeCount++;
  }
  // Show all arguments
  originalConsoleLog(...args);
};
```

Then submit 2-3 messages and watch the console. You should see:
- `summaryCallCount` increment with each message (confirming the bug) OR
- `summaryCallCount` stay 0 until session end (correct behavior)

### Investigation 2: Check Which Component is Rendering

Copy and paste into console:
```javascript
// Find all AISummary components in DOM
const aiSummaries = document.querySelectorAll('[class*="coaching"], [class*="summary"], [class*="ai-"]');
console.log('Found', aiSummaries.length, 'potential summary elements:');
aiSummaries.forEach((el, i) => {
  console.log(i + ':', el.className, el.textContent?.substring(0, 50));
});
```

Submit a message, then run this again. If the count increases, a new summary component is being added to the page.

### Investigation 3: Monitor Gemini API Calls

Copy and paste into console BEFORE submitting a message:
```javascript
// Monitor fetch calls to Gemini API
const originalFetch = window.fetch;
let geminiCallCount = 0;

window.fetch = function(...args) {
  const url = args[0];
  if (url?.includes?.('generativelanguage.googleapis.com')) {
    geminiCallCount++;
    console.log('[GEMINI CALL #' + geminiCallCount + ']', url);
    console.trace('Called from:');  // Show call stack
  }
  return originalFetch.apply(this, args);
};
```

Submit a message. You should see:
- `[GEMINI CALL #1]` — Gemini Call 2 (pattern detection, normal per-message)
- Nothing else until the session ends, when you'll see another call (debrief generation)

If you see coaching summaries generating per-message, you'll see additional Gemini calls for those summaries.

---

## What to Report Back

Once you've run these investigations, please share:

1. **What appears after each message?**
   - Text snippet from the summary
   - Location on screen (bottom, modal, sidebar, etc.)
   - Screenshot if possible

2. **Console logs from Investigation 1:**
   - What does `summaryCallCount` show?
   - When does it increment?

3. **Console logs from Investigation 2:**
   - How many summary elements are found?
   - Do they increase with each message?

4. **Console logs from Investigation 3:**
   - How many Gemini calls per message?
   - What URLs are being called?

5. **Exact sequence:**
   - Submit message #1 → What appears?
   - Submit message #2 → What appears?
   - Submit message #3 → Different behavior?

---

## Expected Correct Behavior

During a conversational drill:
- **Per-message**: User message, character response, Panel B updates with pattern signals
- **No summaries** until session completes (exchange 10)
- **At session end**: Debrief cards appear one-by-one

Expected Gemini calls per 10-message session:
- **10x Pattern Detection** (one per exchange) = Gemini Call 2
- **1x Debrief Generation** (at end only) = Gemini Call 3
- **Total: 11 Gemini API calls for a full session**

If you're seeing coaching summaries after EVERY message, there would be 10+ extra API calls (one summary per message), which would be incorrect.

---

## If You Find the Bug

If these investigations confirm summaries ARE being generated per-message:

1. Check console for the function name generating the summary
2. Check the call stack to see what triggered it
3. Screenshot or copy the console output
4. This will help pinpoint which component/service is misbehaving

