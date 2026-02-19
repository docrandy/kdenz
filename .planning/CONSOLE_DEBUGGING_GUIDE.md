# Console Debugging Guide - Gemini API Issue

## How to Access Browser Console

1. Open the app at https://kdenz.vercel.app
2. Press `F12` on keyboard (or `Cmd+Option+I` on Mac)
3. Click the "Console" tab
4. You'll see a command prompt ready for input

---

## Step-by-Step Testing

### Step 1: Verify API Key is Saved
After you add your API key in Settings and click "Save Key", run this:

```javascript
// Check if API key is stored
let storedKey = localStorage.getItem('voicelab_gemini_key');
console.log('Stored API Key:', storedKey);
console.log('Key Length:', storedKey ? storedKey.length : 'null (not saved)');
console.log('Key Format Valid:', storedKey && /^[A-Za-z0-9_-]+$/.test(storedKey) ? '✓ Yes' : '✗ Invalid format');
```

**Expected Output**:
```
Stored API Key: "aIzaSyDxxxxxxxxxxxxxxxxxxxxx" (or similar)
Key Length: 39
Key Format Valid: ✓ Yes
```

**If You See**:
- `null` → Key isn't being saved. Click "Save Key" button again and check for errors
- `Key Format Valid: ✗ Invalid format` → Your key contains characters that don't match the pattern. See note below.

---

### Step 2: Generate a Summary and Watch Logs

1. Complete a voice practice session
2. Go to "Coaching Summary" section
3. Click "Generate Summary" button
4. **Watch the console** - you should see logs like:

```
[Gemini] API key found, attempting to generate summary
[Gemini] Prompt built, sending to API
[Gemini] Response received, status: 200
[Gemini] Response JSON parsed
[Gemini] Successfully generated AI summary
```

**If You See**:
- `[Gemini] No API key found` → Key isn't being retrieved. Check Step 1.
- `[Gemini] Response received, status: 400` → Bad request. Check API key format in Step 1.
- `[Gemini] Response received, status: 401` → Authentication failed. Check if your API key is valid.
- `[Gemini] Response received, status: 403` → Permission denied. Check if your API key has correct permissions.
- `[Gemini] Response received, status: 429` → Rate limited. Try again later.
- `[Gemini] API returned error object` → Gemini returned an error. Check the message logged.

---

### Step 3: If Status is 400, 401, or 403 - Check Error Details

After running Step 2, if you see an error status, run this to see the actual error message:

```javascript
// Get the last API error from the session
// (This works after you've already tried to generate a summary)
// The error will have been logged by geminiService.ts

// Alternative: Test the API directly with YOUR actual key:
const apiKey = localStorage.getItem('voicelab_gemini_key');

if (!apiKey) {
  console.log('❌ No API key found in localStorage');
} else {
  console.log('Testing API with key:', apiKey.substring(0, 10) + '...');

  fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: 'Say hello in one sentence.' }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 50
      }
    })
  })
  .then(response => {
    console.log('Response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Response data:', data);
    if (data.error) {
      console.error('ERROR:', data.error.message);
    } else if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.log('✓ API Works! Response:', data.candidates[0].content.parts[0].text);
    }
  })
  .catch(error => {
    console.error('Network error:', error);
  });
}
```

**What This Shows**:
- If API key is invalid → `error.message` will say "API key not valid"
- If API key doesn't have permissions → `error.message` will say "Permission denied"
- If API is rate limited → `error.message` will say "Resource has been exhausted"
- If API works → You'll see the actual response text from Gemini (e.g., "Hello!")

---

### Step 4: Check for Invalid Characters in API Key

Some API keys might have characters the current validation doesn't accept:

```javascript
const key = localStorage.getItem('voicelab_gemini_key');

if (!key) {
  console.log('No key stored');
} else {
  console.log('API Key:', key);
  console.log('Length:', key.length);

  // Check each character
  const allowedPattern = /^[A-Za-z0-9_-]+$/;
  const hasValidChars = allowedPattern.test(key);

  if (!hasValidChars) {
    console.log('⚠️  Key contains invalid characters for current validation');
    console.log('Invalid characters found:');

    for (let i = 0; i < key.length; i++) {
      const char = key[i];
      if (!/^[A-Za-z0-9_-]$/.test(char)) {
        console.log(`  Position ${i}: "${char}" (should only be A-Z, a-z, 0-9, _, or -)`);
      }
    }
  } else {
    console.log('✓ All characters are valid');
  }
}
```

**Common Invalid Characters**:
- `.` (period) - often used in API keys
- `=` (equals) - sometimes used for padding
- `/` (slash) - sometimes used
- `+` (plus) - sometimes used

If your key has these, we need to update the validation regex.

---

### Step 5: Full Diagnostic Report

Run this to get a complete report you can share:

```javascript
console.log('=== KDENZ Gemini API Diagnostic Report ===\n');

// 1. Check localStorage
const key = localStorage.getItem('voicelab_gemini_key');
console.log('1. API Key Storage:');
console.log('   Stored:', key ? '✓ Yes' : '✗ No');
console.log('   Length:', key ? key.length : 'N/A');

// 2. Check format
if (key) {
  const isValid = /^[A-Za-z0-9_-]+$/.test(key);
  console.log('   Format Valid:', isValid ? '✓ Yes' : '✗ No');

  if (!isValid) {
    let invalidChars = [];
    for (let i = 0; i < key.length; i++) {
      if (!/^[A-Za-z0-9_-]$/.test(key[i])) {
        invalidChars.push(key[i]);
      }
    }
    console.log('   Invalid chars:', Array.from(new Set(invalidChars)).join(', '));
  }
}

// 3. Test API endpoint
console.log('\n2. Testing API Endpoint:');
if (!key) {
  console.log('   Cannot test - no API key');
} else {
  fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + key, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'test' }] }],
      generationConfig: { maxOutputTokens: 10 }
    })
  })
  .then(r => r.json())
  .then(d => {
    if (d.error) {
      console.log('   Status: Error');
      console.log('   Error:', d.error.message);
    } else if (d.candidates) {
      console.log('   Status: ✓ Success');
      console.log('   Response length:', d.candidates[0]?.content?.parts?.[0]?.text?.length || 0, 'chars');
    }
  })
  .catch(e => console.log('   Network error:', e.message));
}

console.log('\n=== End Report ===');
```

---

## What to Share With Us

After running the above tests, please share:

1. **Screenshots or copy-paste of console output** from Step 2-3
2. **The error message** (if any) from Step 3
3. **Whether your key has invalid characters** (from Step 4)
4. **The full diagnostic report** (from Step 5)

This will help us identify exactly why the API isn't working.

---

## Common Issues & Fixes

### Issue: "Key is not valid"
**Cause**: API key contains characters outside `a-z A-Z 0-9 _ -`
**Fix**: Get a new API key from https://aistudio.google.com/apikey

### Issue: "Resource has been exhausted"
**Cause**: Gemini API rate limit exceeded or free tier quota used
**Fix**: Wait a bit or upgrade Gemini API plan

### Issue: "API key not valid"
**Cause**: API key format is correct but key isn't active
**Fix**: Regenerate key from https://aistudio.google.com/apikey

### Issue: "Permission denied"
**Cause**: API key doesn't have "Generate Content" permission
**Fix**: Check API key settings at https://aistudio.google.com

### Issue: Still getting local summary after fixes
**Cause**: Caching issue
**Fix**: Hard refresh browser (`Ctrl+Shift+R` or `Cmd+Shift+R` on Mac)

---

## If You Need Help

1. **Run all the console tests above**
2. **Collect the output**
3. **Share with us** along with:
   - What you see in the console
   - What status code appears (200, 400, 401, 403, 429, etc.)
   - Whether the emotion examples are personalized or generic
   - Any error messages

We'll then know exactly how to fix it!
