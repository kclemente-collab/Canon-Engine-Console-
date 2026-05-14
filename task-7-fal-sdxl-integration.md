# Task 7 — FAL.ai SDXL Integration + Motion-Ready Provider Abstraction

## What & Why

The Render Elite Engine currently returns a placeholder image URL. This task replaces that
placeholder with real image generation via FAL.ai using SDXL as the primary model. The
implementation uses a provider abstraction layer so the backend can swap between FAL.ai,
Replicate, placeholder, and future motion providers (AnimateDiff, Flux video) without
touching the core pipeline logic.

This is the task that makes Render Elite real.

---

## Done Looks Like

- Pressing "Run Render Elite" in the editor returns an actual generated image
- All 3 Feral Gloss variations generate real images via FAL.ai SDXL
- The alternates strip shows 3 real image thumbnails with scores
- API key is stored in Replit Secrets, never in code
- Switching providers requires changing one environment variable, not code
- The provider interface is designed so AnimateDiff can be added as a motion provider later
- If no API key is set, the system falls back to placeholder gracefully with a clear console warning

---

## Out of Scope

- AnimateDiff / motion generation itself (separate task)
- LoRA or ControlNet integration
- Training custom models
- On-device generation via Core ML
- Per-user provider selection in the UI
- Changing the scoring or variation logic from Task 6

---

## Provider Abstraction Design

Create `artifacts/api-server/src/lib/providers/` as a new directory.

### Base interface — `base.ts`

```ts
export interface GenerationRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;       // default 1024
  height?: number;      // default 1024
  steps?: number;       // default 30
  guidance_scale?: number; // default 7.5
  seed?: number;
}

export interface GenerationResult {
  image_url: string;
  seed_used: number;
  provider: string;
  model: string;
  latency_ms: number;
}

export interface ImageProvider {
  name: string;
  generate(request: GenerationRequest): Promise<GenerationResult>;
  // Motion upgrade hook — implement in AnimateDiff provider later
  supportsMotion: boolean;
}
```

### Providers to implement

| File | Provider | Model | When used |
|------|----------|-------|-----------|
| `fal.ts` | FAL.ai | SDXL | `PROVIDER=fal` (default) |
| `replicate.ts` | Replicate | SDXL | `PROVIDER=replicate` |
| `placeholder.ts` | Placeholder | None | No API key set |

### Provider factory — `index.ts`

```ts
// Reads PROVIDER env var, returns correct implementation
// Falls back to placeholder if API key missing
export function getProvider(): ImageProvider
```

---

## FAL.ai Implementation Details

**Model:** `fal-ai/fast-sdxl`
**FAL.ai API endpoint:** `https://fal.run/fal-ai/fast-sdxl`

```ts
// Request shape
{
  prompt: string,
  negative_prompt: string,
  image_size: { width: 1024, height: 1024 },
  num_inference_steps: 30,
  guidance_scale: 7.5,
  num_images: 1,
  seed: number  // pass through for reproducibility
}

// Response shape — extract from:
data.images[0].url  // the generated image URL
data.seed           // seed used
```

**Auth header:**
```
Authorization: Key ${process.env.FAL_API_KEY}
```

**Negative prompt default** (append to all generations):
```
"blurry, low quality, watermark, signature, text overlay, 
deformed, ugly, bad anatomy, worst quality"
```

---

## Replit Secrets Required

Add these in Replit's Secrets tab (not in code):

| Secret key | Value | Required |
|------------|-------|----------|
| `FAL_API_KEY` | Your FAL.ai API key | Yes for real generation |
| `PROVIDER` | `fal` | Optional, defaults to `fal` |

---

## Integration Into Render Elite Pipeline

In `artifacts/api-server/src/routes/render-elite.ts`:

Replace the current placeholder generation block with:

```ts
import { getProvider } from '../lib/providers/index.js';

// Inside the variation generation loop:
const provider = getProvider();
const results = await Promise.all(
  variations.map(v => provider.generate({
    prompt: v.prompt,
    negative_prompt: DEFAULT_NEGATIVE_PROMPT,
    width: 1024,
    height: 1024,
    steps: 30,
    guidance_scale: 7.5,
  }))
);

// Map results back to variations
variations[i].image_url = results[i].image_url;
variations[i].seed = results[i].seed_used;
variations[i].latency_ms = results[i].latency_ms;
```

**Important:** Run all 3 variations in parallel via `Promise.all` — do not run sequentially. This keeps total generation time to ~15–40s instead of 3x that.

---

## Response Schema Extension

Add to the render response:

```ts
generation_meta: z.object({
  provider: z.string(),
  model: z.string(),
  total_latency_ms: z.number(),
  seeds: z.array(z.number()),  // one per variation, for reproducibility
})
```

---

## Replicate Implementation (secondary)

**Model:** `stability-ai/sdxl`
**Endpoint:** `https://api.replicate.com/v1/predictions`

Only implement if FAL.ai is unavailable. Match the same `ImageProvider` interface.
Store key as `REPLICATE_API_KEY` in Replit Secrets.

---

## Placeholder Implementation

When no valid API key is present:

```ts
// Return immediately with:
{
  image_url: "https://placehold.co/1024x1024/0a0a0a/c8a96e?text=No+API+Key",
  seed_used: 0,
  provider: "placeholder",
  model: "none",
  latency_ms: 0
}
```

Log a clear warning:
```
[RENDER ELITE] No FAL_API_KEY found. Using placeholder. 
Set FAL_API_KEY in Replit Secrets to enable real generation.
```

---

## Motion Upgrade Path (Do Not Implement Now — Design For It)

The provider interface's `supportsMotion: boolean` flag is intentional.

When Task 8 (AnimateDiff motion layer) is built:

1. Create `artifacts/api-server/src/lib/providers/animatediff.ts`
2. Implement the same `ImageProvider` interface
3. Add `supportsMotion: true`
4. The factory returns it when `PROVIDER=animatediff`
5. Zero changes required to render-elite.ts or the scoring pipeline

The motion provider will accept the same `GenerationRequest` and return
a `GenerationResult` with a video URL instead of an image URL. The editor
handles the difference at display time.

---

## Editor UI Changes (minimal)

In `artifacts/render-elite-editor/src/App.tsx`:

- Add a loading state during generation — show a pulsing gold border on the canvas area
- Display `generation_meta.provider` and `generation_meta.total_latency_ms` in the status bar
- If `image_url` contains `.mp4` or `.webm` — render as `<video>` instead of `<img>` (motion-ready)

---

## Relevant Files

```
artifacts/api-server/src/lib/providers/          ← NEW directory
artifacts/api-server/src/lib/providers/base.ts   ← NEW interface
artifacts/api-server/src/lib/providers/fal.ts    ← NEW FAL.ai implementation
artifacts/api-server/src/lib/providers/replicate.ts ← NEW Replicate implementation  
artifacts/api-server/src/lib/providers/placeholder.ts ← NEW placeholder
artifacts/api-server/src/lib/providers/index.ts  ← NEW factory
artifacts/api-server/src/routes/render-elite.ts  ← replace placeholder with provider call
lib/api-spec/openapi.yaml                        ← add generation_meta to response schema
artifacts/render-elite-editor/src/App.tsx        ← loading state + meta display + video-ready
```

---

## Definition of Done Checklist

- [ ] `FAL_API_KEY` in Replit Secrets triggers real generation
- [ ] All 3 variations generate in parallel via Promise.all
- [ ] Real images appear in the alternates strip
- [ ] `generation_meta` returned in every response
- [ ] Missing API key falls back to placeholder with console warning
- [ ] Switching `PROVIDER` env var changes provider without code changes
- [ ] `supportsMotion` flag exists on the interface (false for fal/replicate/placeholder)
- [ ] Editor shows loading state during generation
- [ ] Editor renders `<video>` if URL is a video file (motion-ready)
- [ ] No API keys anywhere in code — Replit Secrets only
- [ ] Provider abstraction lives in its own directory, not inlined in route handler
