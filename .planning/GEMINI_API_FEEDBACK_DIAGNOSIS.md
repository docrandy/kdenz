# Gemini API Feedback Generation Issue

## Problem Statement
User reports: "the feedback is not being generated as you can see"

When this happens, the app shows **generic fallback responses** instead of personalized AI-generated character feedback because the Gemini API integration is not working.

---

## Two Separate Issues Fixed This Session

### Issue 1: Summary Button (FIXED ✅)
- **Problem**: Summary button was always visible and clickable during drills, making it appear as if summaries were appearing "after every message"
- **Root Cause**: `LabelingPractice.tsx` had unconditional Summary button rendering
- **Fix**: Hide Summary button when `flowState === "drill"`, show placeholder div instead for layout stability
- **Status**: Build verified, fix deployed in conditional rendering at lines 126-135

### Issue 2: Gemini API Feedback Not Generating (NEEDS INVESTIGATION)
- **Problem**: Character responses are not personalized (showing only generic fallbacks)
- **Root Cause**: Gemini API key not set, invalid, or API calls failing silently
- **Location**: `src/services/characterResponseService.ts` (Gemini Call 1)
- **Status**: Requires user diagnosis to determine exact cause

---

## How Character Feedback Works

### Flow (ConversationalDrill.tsx)
1. User submits a label (text or audio)
2. Label is analyzed: `analyzeLabel()` → returns syntax + depth scores
3. Quality determined: "underlying" / "surface" / "miss"
4. Character response generated: `generateCharacterResponse()` (line 553)
   - If API key present AND API call succeeds → Personalized Gemini response
   - If API key missing OR API call fails → Random fallback response (generic)
5. Character message appears in chat

### What Triggers Generic Fallbacks
See `characterResponseService.ts` lines 24-43:

```typescript
const FALLBACKS_UNDERLYING: string[] = [
  "Yeah... you get it. That's exactly what's been eating at me. I didn't think anyone would actually notice.",
  // ... more generic responses
];
```

When these appear instead of personalized responses, the feedback feels generic and non-specific.

---

## Root Cause Analysis

### Where the API Key is Used
1. **Storage**: `localStorage["gemini_api_key"]`
2. **Retrieved**: `getStoredApiKey()` called in `ConversationalDrill.tsx` line 559
3. **Used**: Passed to `generateCharacterResponse()` line 559
4. **Sent**: To Gemini API at `characterResponseService.ts` line 12-13

### Why Feedback Might Not Generate

#### Scenario A: API Key Missing
- User never entered API key in settings
- Or user cleared it by accident
- **Result**: Line 88 in `characterResponseService.ts` catches this → fallback responses

#### Scenario B: Invalid API Key
- User entered wrong/expired key
- Gemini API rejects it with 401 or 403 error
- **Result**: API call fails → catch block at line ?? → fallback responses

#### Scenario C: API Call Timeout/Network Error
- Network interruption during API call
- Gemini API service temporarily down
- **Result**: Promise rejects → catch block silently swallows error → fallback responses

#### Scenario D: CORS or Fetch Error
- Browser blocks CORS request
- Fetch API throws error before reaching Gemini
- **Result**: Promise rejects → silently swallowed → fallback responses

---

## User Diagnosis Steps

### Step 1: Check if API Key is Set
1. Open the app (https://kdenz.vercel.app)
2. Go to **Voice Practice** → **Filler Words** (or any practice)
3. Look for API key setup UI
4. If you don't see your API key field, enter one
5. Test a conversation

### Step 2: Check Browser Console for Errors
1. Press **F12** to open DevTools
2. Go to **Console** tab
3. Start a conversational drill
4. Submit a label and watch the console
5. Look for:
   - `[Gemini]` logs (should show success)
   - Errors like `401`, `403`, `Network Error`, `CORS`, etc.
   - TypeError or SyntaxError messages

### Step 3: Monitor API Calls
1. Open **Network** tab in DevTools
2. Filter by "generativelanguage.googleapis.com"
3. Submit a label in the drill
4. Watch for API calls:
   - **200**: API worked → feedback should be personalized
   - **401/403**: Invalid key → feedback will be generic
   - **No request**: API key wasn't sent → missing key

### Step 4: Verify Generic vs Personalized Feedback
After submitting a label in a drill:
- **Generic (fallback)**: "Yeah... you get it." / "That's not quite it." / "Hmm. I'm not sure..."
- **Personalized (AI-generated)**: Responses that reference specific words from your label or scenario context

---

## Expected Behavior After Fix

### With Working API Key
1. Submit a label: "Carol seems frustrated because she's worried about her job security"
2. Character responds with something like: "You caught that. Yeah, it's been weighing on me since the reorganization announcement. I'm trying not to panic but..."
   - ✅ References your specific label (job security, reorganization)
   - ✅ Personalized to Carol's scenario
   - ✅ Continuity with conversation history

### With Missing/Invalid API Key
1. Submit same label
2. Character responds: "That's... not what I meant at all. I feel like you're missing the bigger picture here."
   - ❌ Generic response
   - ❌ Doesn't reference your label
   - ❌ Could be said in any scenario
   - ❌ Feels like feedback isn't "working"

---

## Files Involved

- **ConversationalDrill.tsx** (line 553): Calls character response generation
- **characterResponseService.ts** (lines 71-90): Main Gemini Call 1 logic
  - Line 78: `apiKey: string | null` parameter
  - Line 88: Checks if API key exists
  - Line 100+: Builds Gemini prompt and calls API
- **geminiService.ts**: `getStoredApiKey()` retrieves from localStorage

---

## What You Should Report Back

When you've run the diagnostics above, please share:

1. **API Key Status**
   - Do you have a Gemini API key set in the app?
   - Can you see it in the settings/input field?

2. **Console Logs**
   - Any errors starting with `[Gemini]` or generic error messages?
   - Copy/paste the full error if present

3. **Network Tab Results**
   - Are requests going to generativelanguage.googleapis.com?
   - What HTTP status codes are returned (200, 401, 403, etc.)?

4. **Behavior Observation**
   - Are character responses generic or personalized?
   - Do they reference specific things you said, or feel generic?

5. **Exact Sequence**
   - What was your label (the emotion you labeled)?
   - What did the character respond with?
   - Screenshot if possible

---

## Recommended Next Steps

### If API Key is Missing
→ Obtain a Gemini API key from https://aistudio.google.com/app/apikey
→ Enter it in the app settings/input field
→ Test a conversation again

### If API Key is Invalid
→ Double-check the key (copy/paste from Google AI Studio)
→ Ensure no extra spaces or hidden characters
→ Try regenerating a new key in Google AI Studio
→ Enter the new key and test again

### If API Calls are Failing
→ Check your internet connection
→ Check if Gemini API service is operational (status: https://status.cloud.google.com)
→ Try again in 5-10 minutes if service is degraded
→ Check browser console for CORS errors (may need to adjust API settings)

---

## Implementation Notes

The fix for Issue #1 (Summary button) is complete and deployed.

Issue #2 (Gemini API feedback) requires:
1. User to run diagnostics above
2. Share results
3. Claude to debug based on specific error or behavior

Once the root cause is identified, the fix will be either:
- User-side: Correcting API key
- Code-side: Fixing API call logic (if there's a bug)
- Config-side: Adjusting CORS or API permissions
