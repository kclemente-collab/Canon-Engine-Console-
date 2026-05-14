# Task 6 — Feral Gloss Controls for Render Elite

## What & Why

Layer the Feral Gloss Engine ideas — N+3 depth control, multi-variation generation, and a
constraint-based "best output" picker — into the existing Render Elite pipeline. Today the engine
produces one prompt and one image. After this task, every render produces three variations under
the hood, scores them against a taste filter, returns the winner to the user, and lets the user
dial intensity / tension / depth from the editor sidebar.

---

## Done Looks Like

- The editor sidebar shows three new sliders next to Concept / Feedback:
  **Intensity (1–5)**, **Tension (1–5)**, and **N+3 Depth (1–5)**, with sensible defaults
  (Intensity: 3, Tension: 2, N+3 Depth: 3).
- Pressing "Run Render Elite" sends the slider values along with image, concept, and feedback.
- The server builds the prompt with the new control modifiers, appends a depth-layer line keyed
  to the N+3 level, generates 3 variations, scores them, and returns the highest-scoring one as
  the main image.
- The response also includes the two runner-up variations and each one's score, so the editor can
  show them in a small alternates strip (3 thumbnails, 80×80px, score badge overlaid bottom-right)
  below the main result. Clicking an alternate promotes it to main result and updates the
  "Why this won" line.
- A short "Why this won" line under the main result lists the 2–3 highest-weighted scoring
  criteria that pushed it ahead.
- Style Memory still works: feedback is recorded, and STYLE BOOST / AVOID lines are appended to
  every variation's prompt.

---

## Out of Scope

- Real image generation. Variations remain placeholder URLs (existing stub). A separate task
  wires in a real image API.
- Persisting per-user slider defaults across sessions.
- Learned / model-based taste filter. Scoring stays heuristic for now.
- Any changes to the Style Memory feature itself.

---

## Steps

### Step 1 — Extend the API Contract

Add three controls to the render request schema:

```ts
intensity: z.number().int().min(1).max(5).default(3),
tension:   z.number().int().min(1).max(5).default(2),
nplus3:    z.number().int().min(1).max(5).default(3),
```

Extend the render response schema with:

```ts
variations: z.array(z.object({
  image_url:  z.string(),
  prompt_used: z.string(),
  score:      z.number(),             // 0.0 – 1.0
})),
winning_criteria: z.array(z.string()), // 2–3 human-readable lines
```

Regenerate typed hooks and Zod schemas from openapi.yaml.

---

### Step 2 — Prompt + Depth + Variation + Scoring Pipeline

#### 2a. Weave controls into the base prompt

Append modifier lines to the existing style-engine prompt output based on slider values:

**Intensity modifier:**
```
1 → "Subdued presence. Minimal surface activation."
2 → "Restrained intensity. Controlled material energy."
3 → "Balanced force. Editorial tension maintained."
4 → "High-charge surface. Aggressive material contrast."
5 → "Maximum feral intensity. Explosive, unstabilized form."
```

**Tension modifier:**
```
1 → "Resolved composition. No competing forces."
2 → "Mild structural tension. Slight directional conflict."
3 → "Active tension. Opposing vectors in equilibrium."
4 → "High compositional stress. Form resists resolution."
5 → "Unresolved rupture. Fracture logic dominant."
```

#### 2b. Append N+3 Depth Layer line

Key the depth-layer line to the nplus3 value using this lookup table:

```
1 → "Single material layer. Flat cinematic lighting. No atmospheric depth."
2 → "Material + cast shadow layer. Shallow depth field. Surface-dominant."
3 → "Material + shadow + atmospheric haze layer. Mid-range depth. Editorial."
4 → "Material + shadow + atmosphere + resonance vector layer. Deep spatial stack."
5 → "Full 5-layer compositional stack: material / shadow / atmosphere /
     resonance vector / echo trace. Maximum depth. Lattice integrity active."
```

#### 2c. Generate three prompt variations

From the assembled base prompt, produce three variations:

| Variation | Label     | Modification applied                                              |
|-----------|-----------|-------------------------------------------------------------------|
| V1        | Clean     | Base prompt only. No additional modifiers.                        |
| V2        | Balanced  | Base + "Refined execution. Aesthetic coherence prioritized."      |
| V3        | Intense   | Base + "Push all parameters 20% beyond stated values. No safety." |

Each variation gets the same Style Memory BOOST / AVOID lines appended last.

#### 2d. Score each variation

Create `artifacts/api-server/src/lib/scoring.ts` as a standalone module.
Do not inline scoring logic into render-elite.ts.

Score each variation against these weighted heuristic criteria:

| Criterion                        | Weight | How to evaluate (heuristic)                                      |
|----------------------------------|--------|------------------------------------------------------------------|
| Style memory coherence           | 0.35   | Count BOOST keyword matches in prompt ÷ total BOOST keywords     |
| Tension alignment                | 0.25   | Abs diff between prompt tension language score and slider value  |
| Depth layer integrity            | 0.20   | Confirm depth-layer line is present and matches nplus3 level     |
| Novelty delta                    | 0.10   | Levenshtein distance from previous prompt in style memory log    |
| Structural variation distance    | 0.10   | Levenshtein distance between this variation and V1               |

Final score = weighted sum, normalized 0.0–1.0.

Return the highest-scoring variation as the main result.
Return the other two as `variations[]` in the response, each with their score.

#### 2e. Produce winning_criteria lines

After scoring, identify the 2–3 criteria with the highest individual contribution to the
winner's score. Return them as short human-readable strings, for example:

```
"Strong style memory coherence — 4 of 5 BOOST keywords matched"
"Tension slider (4) aligned with high-stress compositional language"
"Depth layer 3 confirmed: atmospheric haze + shadow stack intact"
```

---

### Step 3 — Controls and Alternates UI

**In the editor sidebar (App.tsx):**

Add three sliders above the "Run Render Elite" button:

```
Intensity   [●────] 1 ──────────── 5    current value shown inline
Tension     [──●──] 1 ──────────── 5
N+3 Depth   [────●] 1 ──────────── 5
```

Labels use the existing sidebar type style (9px, uppercase, tracked).
Slider accent color: #c8a96e (existing gold token).
Defaults: Intensity 3, Tension 2, N+3 Depth 3.

**After a render completes:**

Show the main result image as today, with the "Why this won" line immediately below it:

```
WHY THIS WON
↳ Strong style memory coherence — 4 of 5 BOOST keywords matched
↳ Tension slider (4) aligned with high-stress compositional language
```

Below that, show the alternates strip:

- 3 thumbnails, 80×80px each, horizontal row, gap-4
- Score badge: bottom-right corner, 9px, #c8a96e text on rgba(0,0,0,0.7) pill
- Clicking an alternate:
  1. Promotes it to main result image
  2. Recalculates and updates "Why this won" to reflect the promoted variation's criteria
  3. Moves the previously main result into the alternates strip at its original score

---

## Scoring Criteria Reference (for tests)

When writing unit tests for `scoring.ts`, use these fixture expectations:

- A prompt containing 4 of 5 BOOST keywords should score ≥ 0.30 on style memory coherence alone
- Two identical prompts should score 0.0 on novelty delta
- A prompt missing the depth-layer line entirely should score 0.0 on depth layer integrity

---

## Relevant Files

```
artifacts/api-server/src/routes/render-elite.ts     ← weave controls into prompt builder
artifacts/api-server/src/lib/style-memory.ts        ← no changes; BOOST/AVOID lines sourced here
artifacts/api-server/src/lib/scoring.ts             ← NEW: standalone scoring module
lib/api-spec/openapi.yaml                           ← extend request + response schemas
artifacts/render-elite-editor/src/App.tsx           ← add sliders + alternates strip + why-this-won
artifacts/render-elite-editor/src/main.tsx          ← no expected changes
```

---

## Definition of Done Checklist

- [ ] Three sliders render in sidebar with correct defaults and gold accent
- [ ] Slider values are included in the POST body to /render-elite
- [ ] Server returns `variations[]` array with 3 items, each with image_url, prompt_used, score
- [ ] Server returns `winning_criteria[]` with 2–3 strings
- [ ] Main result displays the highest-scoring variation
- [ ] Alternates strip shows 2 runner-ups with score badges
- [ ] Clicking an alternate promotes it and updates "Why this won"
- [ ] Style Memory BOOST/AVOID lines present in all 3 variation prompts
- [ ] scoring.ts is a standalone module, not inlined in render-elite.ts
- [ ] Unit tests pass for scoring fixture expectations above
