# R1: Hume.ai Batch API — Integration Research (2026)

**Filed:** 2026-02-13
**Source:** Perplexity research / Hume.ai public docs
**Status:** Partially answered — some details require Hume dashboard or support contact
**Prompt:** R1 from docs/RESEARCH_PROMPTS.md

---

## Key Finding

Hume.ai's public docs for batch analysis do not currently expose all specifics in a stable, versioned "2026" reference. Pricing tiers, exact breaking changes vs 2025, and some format/size limits are only available behind their dashboard or sales channels.

---

## What Is Reliably Known

### Endpoints, Auth, and Audio Support

- Batch API is exposed via HTTPS POST endpoints accepting audio files + configuration in the request body, responding with JSON
- Authentication uses a bearer-like API key in the request header; keys are provisioned in the Hume dashboard and tied to account quota/pricing plan
- Supported formats and size limits are constrained by plan and not fully enumerated in public docs; typical cases include WAV and MP3
- Per-file and per-job limits are documented in-product, not in public spec

### Response Structure (Prosody/Expression)

- Batch responses are JSON objects containing per-file or per-utterance analyses
- Nested arrays/objects for different "expression" dimensions (emotions, prosody metrics) with associated scores
- Each expression entry typically includes:
  - Identifier (name or type)
  - Numeric score or probability
  - Sometimes timing information to align metrics to audio segments
- Exact field names and nesting may vary by model version and configuration

### Pricing, SDKs, and Breaking Changes

- Pricing tiers, included minutes, and overage costs are **not in public docs** — managed via dashboard and/or sales
- Hume publishes SDKs and example client code (including JS/TS) but no dedicated versioned TypeScript Batch SDK reference
- Breaking changes since 2025 are **not listed in a public changelog**

---

## Practical Guidance for TypeScript Port

Given the lack of a fully detailed public 2026 spec, the safe path for "post-session batch only":

1. **Keep Python POC as reference** for request payload shape and response parsing (reflects working v0 integration)
2. **In TypeScript frontend, send recorded audio blobs to your own backend service** — have that backend call Hume's Batch API using same endpoint, headers, and body schema as Python POC
3. **API key must NOT live in the browser** — always proxy through backend
4. **Contact Hume directly** for:
   - Current Batch API version and endpoint path
   - Official list of supported audio MIME types and per-job limits
   - Migration notes from v0 Python clients to current Batch
   - Current pricing/minute allocations for account and plan

---

## Implications for Architecture

- **Need a backend proxy** — cannot call Hume directly from browser (API key exposure)
- Options: Vercel serverless function, Supabase Edge Function, or standalone API
- The existing Python POC (`kdenz-poc/hume_voice_analyzer.py`) is the most reliable reference for:
  - API URL: `https://api.hume.ai/v0/batch/jobs`
  - Results URL: `https://api.hume.ai/v0/batch/jobs/{job_id}/predictions`
  - Request format: multipart form with audio file + JSON config
  - Response parsing: `predictions[0].results.predictions[0].models.prosody.grouped_predictions`

---

## Action Items

- [ ] Check Hume dashboard for current API version, pricing, and limits
- [ ] Determine if v0 endpoints are still current or deprecated
- [ ] Test whether Hume batch accepts WebM/Opus (MediaRecorder output) or requires WAV conversion
- [ ] Decide on backend proxy approach (Vercel serverless vs Supabase Edge Function)
- [ ] Contact Hume support if dashboard doesn't answer format/migration questions
