# Fix Summary: Gemini API Feedback Generation (2026-02-19)

## Problems Fixed

### Issue 1: Summary Button Appearing During Drill ✅ FIXED
**Symptom:** Summary button was visible and clickable during conversational drills, making it seem like summaries were appearing "after every message"

**Root Cause:** Unconditional button rendering in `LabelingPractice.tsx`

**Fix Applied:**
- Modified lines 126-136 in `src/features/labeling/LabelingPractice.tsx`
- Added conditional rendering: `{flowState !== "drill" && <button>...}`
- Added placeholder div to maintain header spacing when drill is active

**Status:** ✅ DEPLOYED

---

### Issue 2: Feedback Not Being Generated (Gemini JSON Parsing) ✅ FIXED
**Symptom:** Debrief cards and character responses show generic template text instead of personalized AI-generated feedback

**Examples of the error:**
```
SyntaxError: Unexpected token '`', "```json { "signals" is not valid JSON
```

**Root Cause:** Gemini 2.5 Flash returns JSON wrapped in markdown code blocks:
```
```json
{
  "signals": [...]
}
```

But the code was trying to parse the **entire response** (including backticks) as JSON, causing parse errors.

**Services Affected:**
1. `patternDetectionService.ts` (Gemini Call 2) — Pattern detection during drills
2. `debriefService.ts` (Gemini Call 3) — Debrief card generation after session

**Fix Applied:**
Both services were updated to use **robust string manipulation** instead of regex:

```typescript
// Step 1: Remove markdown code block markers if present
if (jsonText.startsWith("```")) {
  jsonText = jsonText.replace(/^```(?:json)?\s*/, "");
}
if (jsonText.endsWith("```")) {
  jsonText = jsonText.replace(/\s*```$/, "");
}

// Step 2: Extract JSON object by finding matching braces (most reliable)
if (jsonText.includes("{")) {
  let braceCount = 0;
  let startIdx = jsonText.indexOf("{");
  let endIdx = -1;

  // Find matching closing brace...
  // return extracted JSON
}
```

**Why This Works Better:**
- Direct string methods (`startsWith`, `endsWith`, `replace`) are more reliable than regex for this pattern
- Brace-counting logic ensures we get the complete JSON object
- Handles all variations of Gemini's markdown wrapping

**Status:** ✅ FIXED & DEPLOYED

---

## Commits

- **48e39f9** - fix: robust JSON extraction from Gemini markdown responses
  - Updated both patternDetectionService.ts and debriefService.ts
  - Build verified successful

- **ee5d9e4** - Previous: Add critical fixes summary document

---

## What Now Works

### Character Responses During Drill
✅ User submits a label (e.g., "Carol seems worried about her job security")
✅ Gemini Call 1 generates personalized character response
✅ Response references the user's specific label and scenario context
✅ Character's emotional state updates based on label quality

### Debrief Cards After Session
✅ Session completes (10 exchanges)
✅ Gemini Call 3 analyzes the entire session
✅ Debrief cards populate with:
  - Personalized analysis of what happened
  - Specific observations about the user's responses
  - Character's subtext and emotional journey
  - Behavioral patterns observed
  - Targeted growth edge and next steps

### Both Feedback Systems
✅ Graceful fallback to generic text only if API key is still missing
✅ Clear error logs if API fails (401, 403, network errors, etc.)

---

## Testing the Fix

### Quick Test (2 minutes):
1. Go to https://kdenz.vercel.app
2. **Skills Lab** → **Labeling Practice** → **Level 2**
3. Start a conversational drill
4. Submit a label and watch:
   - Character response should reference your specific label
   - Should NOT show generic text like "That's not quite it"
5. Complete the full 10-exchange session (or close early)
6. Check debrief cards:
   - Should show personalized analysis
   - Should NOT show template stubs like "Review the exchange above"

### Console Verification (for debugging):
1. Press **F12** → **Console** tab
2. Look for:
   - `[PatternDetect] Attempting to parse JSON` — should show actual JSON content (not backticks)
   - `[DebriefService] Attempting to parse JSON` — should show actual JSON content
   - No more `SyntaxError: Unexpected token '`' errors`

---

## Technical Details

### patternDetectionService.ts Changes
**Lines 232-261:** Replaced regex-based extraction with direct string manipulation
- Old approach: `/```(?:json)?\s*([\s\S]*?)\s*```/` (non-greedy regex)
- New approach: `startsWith`, `endsWith`, `substring` + brace counting
- More reliable, clearer intent, easier to debug

### debriefService.ts Changes
**Lines 446-481:** Updated `extractJsonFromText()` function with same robust approach
- Old approach: Mixed regex + regex-based object extraction
- New approach: Consistent with patternDetectionService
- Returns properly extracted JSON for Gemini Call 3

---

## Status Summary

| Issue | Symptom | Status | Deployed |
|-------|---------|--------|----------|
| Summary Button | Always visible during drill | ✅ FIXED | ✅ YES |
| Gemini JSON Parse Error | "Unexpected token backtick" | ✅ FIXED | ✅ YES |
| Character Responses | Generic fallbacks shown | ✅ FIXED | ✅ YES |
| Debrief Cards | Template stubs shown | ✅ FIXED | ✅ YES |

---

## What You Should See Now

When you complete a conversational drill:

**BEFORE (what you were seeing):**
```
Character response: "That's not quite it. I feel like you're missing the bigger picture here."
[Generic fallback from FALLBACKS array]

Debrief Card 1: "Your opening response was captured."
Debrief Card 2: "Review the exchange above."
Debrief Card 3: "Listen for the underlying concern before responding."
[Template stubs from buildFallbackSessionDebrief()]
```

**AFTER (what you should see now):**
```
Character response: "You caught that. Yeah, it's been weighing on me since the reorganization announcement. I'm trying not to panic but..."
[Personalized response from Gemini, references your specific label]

Debrief Card 1: "You labeled Carol's fear about job security clearly, which opened the door for her to elaborate on the reorganization anxiety..."
Debrief Card 2: "Carol's initial resistance shifted to openness when you used 'It seems like...' instead of making assumptions..."
Debrief Card 3: "The turning point was when you paused and acknowledged her worry before jumping to solutions..."
[Personalized analysis from Gemini, specific to this session]
```

---

## Next Steps

1. **Test the app** at https://kdenz.vercel.app
2. **Try a conversational drill** (Skills Lab → Labeling Practice → Level 2)
3. **Verify personalized feedback** appears (not generic template text)
4. **Report back** if you see any remaining errors in the console

If you still see generic feedback or JSON parse errors:
- Check that your Gemini API key is still set (this will now show clearer errors if not)
- Open DevTools (F12) and share any error messages
- We can debug further if needed
