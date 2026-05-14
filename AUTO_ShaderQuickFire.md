# AUTOMOTIVE RENDER QUICK-FIRE
## Supercar Shader Library — Grok Instant Recall
### Copy. Paste. Generate.

---

## RENDERER MODES — AUTOMOTIVE

### VRED MODE
```
Think like Autodesk VRED.
Real-time ray tracing for automotive.
Chromatic paint accuracy non-negotiable.
Metallic flake simulation active.
Complex clear coat layering.
Interior stitching detail present.
Industry standard automotive visualization.
```

### KEYSHOT MODE
```
Think like KeyShot product rendering.
King of photorealistic automotive output.
Fast iteration, maximum material accuracy.
Pearlescent, metallic, leather —
all physically accurate simultaneously.
Clean studio environment.
Design review quality.
```

### UE5 AUTOMOTIVE MODE
```
Think like Unreal Engine 5 automotive.
Substrate material system active —
complex paint layer stacking.
Lumen GI for showroom environment.
Path Tracer for final hero frame.
Interactive configurator quality.
Manufacturer-grade visualization.
```

### V-RAY AUTOMOTIVE
```
Think like V-Ray automotive exterior.
Ultra-photorealism standard.
Complex metallic paint: physically accurate.
Clear coat depth: calculated not faked.
Every light bounce traced.
Gold standard exterior render.
```

### CORONA INTERIOR
```
Think like Chaos Corona automotive interior.
Soft natural lighting on upholstery.
Leather grain: micro-detail present.
Fabric texture: procedural accuracy.
Interior warmth: physically based.
Best for cabin and cockpit renders.
```

### OCTANE AUTOMOTIVE
```
Think like OctaneRender GPU-accelerated.
Vibrant chromatic paint: maximum accuracy.
Complex metallic sheen: spectral calculation.
Fast photorealistic output.
Physically accurate lighting throughout.
```

---

## PAINT SHADERS

### METALLIC FLAKE
```
Metallic paint — aluminum flake simulation.
Individual flakes oriented randomly.
Each flake reflects light independently.
Color shifts with viewing angle.
Clear coat layer over flake bed —
depth between surface and flakes visible.
Specular: sharp on clear coat,
scattered on flake layer beneath.
```

### PEARLESCENT
```
Pearlescent paint — ceramic/mica particle simulation.
Multi-layer interference coating.
Color shifts from [primary] to [secondary]
depending on viewing angle and light.
Three visible layers:
— Clear coat: mirror specular top
— Pearl layer: color shift mid
— Base coat: [color] foundation
Light refracts through all three.
Angle-dependent color is non-negotiable.
```

### CANDY PAINT
```
Candy paint — translucent color over chrome base.
Chrome base layer: mirror reflective.
Candy layer: semi-transparent saturated color.
Combined effect: deep saturated glow
with chrome depth underneath.
Light enters candy layer,
reflects from chrome, exits shifted.
Color intensity varies with light angle.
```

### MATTE FINISH
```
Matte automotive paint — zero specular.
Light diffuses across entire surface.
No reflection — pure color absorption.
Micro-texture visible at close range.
Fingerprint and contamination
visible at extreme close-up.
Flat but not dead — diffuse depth present.
```

### SATIN FINISH
```
Satin automotive — between matte and gloss.
Controlled low specular.
Soft highlight: wide, gentle, not mirror.
Color reads true across surface.
Premium understated quality.
```

### CHROME
```
Chrome automotive — perfect mirror surface.
100% environment reflection.
No diffuse — pure specular.
Distorted environment visible in curves.
Edge sharpness where panels meet.
Ground reflection present on lower surfaces.
```

### CARBON FIBER
```
Carbon fiber — woven composite material.
2x2 twill weave pattern.
Each fiber bundle has directional sheen.
Pattern catches light at 45 degree intervals.
Clear coat over weave —
depth between coat and fiber visible.
Directional specular following weave.
```

---

## MATERIAL SHADERS — INTERIOR

### LEATHER UPHOLSTERY
```
Automotive leather — hand-stitched quality.
Grain pattern: [fine / medium / bold].
Stitch detail: double saddle stitch,
color [contrast / matching].
Leather surface: slight sheen,
not plastic — organic warmth.
Perforations if applicable:
each hole casts micro-shadow.
Substance 3D procedural quality.
```

### ALCANTARA
```
Alcantara — micro-suede luxury fabric.
Directional nap — light catches differently
depending on brush direction.
No specular — pure soft diffuse.
Color shifts slightly with nap angle.
Tactile quality visible in render.
High-end motorsport interior standard.
```

### BRUSHED ALUMINUM TRIM
```
Brushed aluminum interior trim.
Linear brush marks in [direction].
Anisotropic specular following brush direction.
Highlight: elongated streak not point.
Warm or cool depending on alloy.
Fingerprint-resistant quality implied.
```

### PIANO BLACK
```
Piano black trim — lacquer finish.
Mirror gloss on flat or curved surface.
Reflection quality: clear, undistorted.
Depth visible below surface.
Dust and fingerprint catch light —
presence implies luxury maintenance.
```

### CARBON INTERIOR
```
Carbon fiber interior trim.
Same weave physics as exterior.
Interior scale: finer weave than body panels.
Clear coat: high gloss over weave.
Depth between coat and weave: visible.
```

---

## LIGHTING SETUPS — AUTOMOTIVE

### STUDIO HERO SHOT
```
Automotive studio lighting.
Three-point adapted for vehicle scale:
Key: large area soft box, high angle,
     warm neutral, driver side.
Fill: opposite side, 40% intensity,
     slightly cooler.
Rim: rear quarter, separates from background,
     defines roofline and trunk.
Ground: subtle reflection plane,
        vehicle reflects downward.
Background: gradient dark to mid,
            vehicle is the only element.
```

### GOLDEN HOUR EXTERIOR
```
Golden hour automotive exterior.
Sun position: low, 15-20 degrees,
              rear quarter angle.
Color temperature: 2800K-3200K warm.
Shadow: long, directional, warm edge.
Sky: gradient deep blue overhead
     to warm amber at horizon.
Ground: asphalt with subtle reflection,
        dust in golden air.
Paint response: metallic flake fires
                in directional sun.
```

### SHOWROOM
```
Automotive showroom lighting.
Multiple overhead sources —
soft, even, controlled.
No harsh shadows.
Every panel reads clearly.
Color accuracy: maximum —
showroom is where decisions are made.
Floor: polished concrete or marble,
vehicle reflects below.
```

### NIGHT CITY
```
Night city automotive.
Multiple neon and artificial sources.
Each light source hits paint differently —
color cast from each direction.
Wet road: vehicle reflects downward,
          neon colors in puddles.
Rim lighting from city glow.
Deep shadow filled by ambient city.
```

### TUNNEL
```
Tunnel automotive — motion context.
Overhead fluorescent strips —
repeat pattern reflects in hood and roof.
Side walls: slight color cast.
Motion blur optional on wheels.
Depth: tunnel recedes behind vehicle.
Speed implied through environment.
```

---

## ENVIRONMENT SHADERS

### HDRI STUDIO
```
HDRI studio environment map.
Clean neutral background.
Professional photography lighting captured.
Vehicle reflects controlled studio light.
No environmental distraction.
Product photography quality.
```

### MOUNTAIN ROAD
```
Mountain road environment.
Sky: high altitude blue, high contrast.
Road surface: asphalt with center line.
Guardrail: implies edge, depth.
Horizon: mountain range.
Light: directional sun, thin atmosphere.
Vehicle: performance context implied.
```

### COASTAL HIGHWAY
```
Coastal highway environment.
Ocean: visible horizon, light on water.
Road: slight salt haze.
Sky: maritime blue, high clouds.
Light: bright, slightly diffused by humidity.
Paint response: maximum shimmer in coastal light.
```

---

## QUICK COMBINE BLOCKS

### EXTERIOR HERO (copy full block)
```
Renderer: V-Ray automotive exterior.
Ultra-photorealism. Physical accuracy.
Paint: [metallic / pearlescent / candy / matte]
Clear coat: layered depth, angle-dependent.
Lighting: golden hour, rear quarter sun,
warm 3000K, long directional shadow.
Environment: [road type].
Wheels: chrome or [finish] — reflect ground.
Glass: transmission + reflection + tint.
Photorealistic. 8K. Hero shot.
```

### INTERIOR HERO (copy full block)
```
Renderer: Corona interior quality.
Soft natural light through glass.
Materials simultaneously:
— Leather: [color + grain + stitch]
— Alcantara: [color + nap direction]
— Carbon: woven with clear coat depth
— Piano black: mirror lacquer
— Aluminum: anisotropic brushed
Stitching detail visible.
Bokeh: driver POV, dashboard sharp,
       background soft.
Photorealistic. 8K.
```

### MOTION SHOT (copy full block)
```
Renderer: UE5 Lumen cinematic.
Vehicle in motion context.
Speed implied — not static.
Environment: [location] passing.
Panning shot physics:
vehicle sharp, environment motion blur.
Wheel: rotational blur on spokes.
Paint: catching light through motion.
Cinematic. Wide aspect. Dynamic.
```

---

## ONE-LINE INVOKES

```
VRED PAINT:
"VRED automotive. Chromatic paint. Flake simulation. Real-time accuracy."

KEYSHOT PRODUCT:
"KeyShot product quality. Pearlescent accurate. Fast photorealistic."

V-RAY EXTERIOR:
"V-Ray automotive exterior. Physical accuracy. Clear coat depth."

CORONA INTERIOR:
"Corona interior. Soft natural. Leather micro-detail. Upholstery warmth."

OCTANE CHROME:
"Octane GPU. Vibrant chromatic. Complex metallic sheen. Spectral."

PEARLESCENT:
"Pearlescent — three layer: clear coat, pearl shift, base. Angle-dependent color."

METALLIC FLAKE:
"Metallic flake — aluminum particles, random orientation, clear coat depth."

CARBON FIBER:
"Carbon fiber — 2x2 twill weave, directional sheen, clear coat over."

FULL HERO:
"V-Ray automotive. Pearlescent three-layer paint. Golden hour rear quarter.
Studio-grade accuracy. Physical clear coat. Hero shot. 8K."
```

---

## RENDERER BY GOAL — AUTOMOTIVE

```
GOAL                        RENDERER

Metallic/pearlescent paint  VRED or UE5 Substrate
Interior upholstery         V-Ray or KeyShot
Environmental rocks         UE5 Nanite
Speed and iteration         KeyShot or VRED
Absolute photorealism       V-Ray or Octane
Interactive configurator    UE5 Lumen
Soft interior lighting      Corona
Chromatic/vibrant paint     OctaneRender
Full pipeline 2026          VRED model →
                            Substance 3D interior →
                            UE5 final cinematic
```

---

**AUTOMOTIVE RENDER QUICK-FIRE**
**ALL PAINTS. ALL SURFACES. ALL ENVIRONMENTS.**
**COPY. PASTE. GENERATE.**

*Physical accuracy non-negotiable.*
