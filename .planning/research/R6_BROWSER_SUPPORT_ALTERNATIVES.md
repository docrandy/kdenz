# R6: Browser Support — Cross-Browser Speech Recognition Alternatives

**Filed:** 2026-02-13
**Source:** Web search + Can I Use + MDN
**Decision:** Stay Chrome-only for now; Deepgram is best paid alternative for later

---

## Web Speech API Current Support (2026)

- **Cross-browser compatibility score:** ~50/100
- **Chrome:** Full support (primary target)
- **Edge:** Full support (shares Chromium engine)
- **Firefox:** Disabled since v102 (2022) — removed behind flag
- **Safari:** Never properly enabled outside limited iOS contexts; 90% accuracy drop confirmed in our research

**Bottom line:** Web Speech API is effectively Chrome/Edge only.

---

## Alternatives Evaluated

### Paid Cloud STT Services

| Service | Price/min | Accuracy | Real-time | Cross-browser | Notes |
|---------|----------|----------|-----------|---------------|-------|
| Deepgram | ~$0.015 | 95%+ | Yes (WebSocket) | Yes | Best developer experience, fastest |
| AssemblyAI | ~$0.015 | 95%+ | Yes (WebSocket) | Yes | Strong NLP features |
| Gladia | ~$0.01 | 93%+ | Yes | Yes | Cheapest, EU-based |
| Google Cloud STT | ~$0.024 | 95%+ | Yes (gRPC) | Via backend only | Enterprise pricing |
| Azure Speech | ~$0.016 | 95%+ | Yes | Via SDK | Microsoft ecosystem |

### Free/Self-Hosted Options

| Service | Cost | Accuracy | Browser | Notes |
|---------|------|----------|---------|-------|
| Vosk (WASM) | Free | 80-90% | Any | 40MB+ WASM download, limited models |
| Whisper (backend) | Compute | 95%+ | Any (via API) | Requires GPU backend, not real-time |
| Web Speech API | Free | 90%+ Chrome | Chrome/Edge only | Current approach |

---

## Cost Impact for KDENZ

At 12 sessions/month, ~5 min average per session = ~60 min/month/user

| Service | Monthly cost/user | At 50 users | At 500 users |
|---------|------------------|-------------|-------------|
| Web Speech API | $0 | $0 | $0 |
| Deepgram | $0.90 | $45 | $450 |
| Gladia | $0.60 | $30 | $300 |

Combined with Hume.ai batch costs (~$1.24-2.72/user/month), total API cost per user would be ~$2-4/month at $49/month subscription = 4-8% COGS. Still healthy.

---

## Recommendation

1. **Now:** Stay Chrome-only. Web Speech API is free and works.
2. **When expanding:** Deepgram is the best option — WebSocket API works from browser, excellent accuracy, reasonable pricing, good TypeScript SDK.
3. **Architecture prep:** Abstract the speech recognition interface behind a provider pattern so swapping from Web Speech API to Deepgram is a config change, not a rewrite.

---

## Sources

- [Can I Use: Speech Recognition API](https://caniuse.com/speech-recognition)
- [MDN: Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Cross Browser Compatibility Score](https://www.testmu.ai/web-technologies/speech-recognition/)
- [Web Speech API Alternatives](https://speechly.medium.com/web-speech-api-alternatives-for-voice-user-interfaces-speechly-65cb8b71d21e)
- [Top Speech Recognition API Options](https://anotherwrapper.com/blog/speech-recognition-api-free)
