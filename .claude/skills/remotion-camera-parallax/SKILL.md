---
name: remotion-camera-parallax
description: >
  Subtle camera movement and parallax depth system for Remotion compositions. Use this skill alongside remotion-motion whenever a video needs to feel alive between cuts — not just animated elements, but a living camera that responds intelligently to what is happening on screen. Triggers on: "camera movement", "zoom", "pan", "parallax", "depth", "cinematic", "floating UI", "layered interface", "z-depth", "ambient motion", "breathing animation", "constant motion", "flowing video", "keep it moving", "camera ease", "static", "rigid", "feels AI generated", "too stiff", "no life". This skill MUST be read before adding any camera or parallax behavior to a Remotion composition — it defines the system that separates a decent edit from an experienced agency edit.
---

# Camera Movement and Parallax Skill

## Philosophy

What separates a decent editor from an experienced agency editor is not the quality of individual element animations — it is what happens between them. A composition where only the entering elements move, and everything else sits static, reads as a presentation. A composition where the whole frame has intention — where the camera breathes, where depth is implied even in a flat screen — reads as a film. The camera is never idle. It is either moving toward something, settling from something, or holding with a purpose. Every second of video should have at least one layer of ambient motion, even if it is invisible at a glance. The human eye detects stillness faster than it detects movement. Static frames feel cheap. Constant subtle motion feels crafted.

The camera movement must be **intelligent** — it should respond to the type of animation happening in the scene, not be applied generically. A zoom-out during a text reveal creates breathing room. A slow pan during a list population gives the impression of surveying data. A subtle push-in during a card close-up creates intimacy. Getting this right requires reading the scene, not just the brief.

---

## 1. Core Concept: The Virtual Camera

Remotion has no native camera. The virtual camera is simulated by wrapping the entire scene in a `<AbsoluteFill>` that applies `scale`, `translateX`, `translateY`, and occasionally `rotate` to the whole composition simultaneously. This wrapper is called the **CameraRig**. Every composition must have exactly one CameraRig as the outermost content wrapper.

```tsx
// src/components/CameraRig.tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Ease } from '../constants/easing';

interface CameraMove {
  startFrame: number;
  endFrame: number;
  fromScale: number;
  toScale: number;
  fromX: number; // px, positive = pan right
  toX: number;
  fromY: number; // px, positive = pan down
  toY: number;
  easing?: (t: number) => number;
}

interface CameraRigProps {
  children: React.ReactNode;
  moves: CameraMove[];
  width: number;
  height: number;
}

export const CameraRig: React.FC<CameraRigProps> = ({
  children, moves, width, height,
}) => {
  const frame = useCurrentFrame();

  // Find the active move — last one whose startFrame has passed
  const activeMove = [...moves]
    .reverse()
    .find(m => frame >= m.startFrame) ?? moves[0];

  const progress = interpolate(
    frame,
    [activeMove.startFrame, activeMove.endFrame],
    [0, 1],
    { clamp: true, easing: activeMove.easing ?? Ease.smooth }
  );

  const scale = interpolate(progress, [0, 1], [activeMove.fromScale, activeMove.toScale]);
  const x = interpolate(progress, [0, 1], [activeMove.fromX, activeMove.toX]);
  const y = interpolate(progress, [0, 1], [activeMove.fromY, activeMove.toY]);

  return (
    <AbsoluteFill style={{
      transform: `scale(${scale}) translate(${x}px, ${y}px)`,
      transformOrigin: 'center center',
      willChange: 'transform',
    }}>
      {children}
    </AbsoluteFill>
  );
};
```

**Usage in composition:**
```tsx
<CameraRig
  width={1920}
  height={1080}
  moves={[
    // Scene 1: slow zoom out as card enters
    { startFrame: 0, endFrame: 48, fromScale: 1.06, toScale: 1.0, fromX: 0, toX: 0, fromY: 8, toY: 0, easing: Ease.smooth },
    // Scene 2: gentle pan left as text arrives
    { startFrame: 44, endFrame: 88, fromScale: 1.0, toScale: 1.0, fromX: 0, toX: -12, fromY: 0, toY: 0, easing: Ease.smooth },
    // Scene 3: subtle push in on UI screen
    { startFrame: 84, endFrame: 130, fromScale: 1.0, toScale: 1.02, fromX: -12, toX: -6, fromY: 0, toY: -4, easing: Ease.decel },
  ]}
>
  {/* All scene content here */}
</CameraRig>
```

---

## 2. Camera Movement Type Dictionary

This is the most critical section. The type of camera movement must be matched to the type of scene content. Getting this wrong makes the camera feel unmotivated. Getting it right makes the whole composition feel directed.

### TYPE A — Zoom Out (Reveal)
**When to use:** An element is entering the frame or being introduced for the first time. A card, a UI panel, a headline. The camera starts slightly zoomed in and pulls back to reveal the full composition. This creates the feeling that the camera was already watching before we arrived.

```ts
// Scale: 1.06 → 1.0 over 40–48 frames
// Y: slight downward offset returns to 0 (camera appears to lift slightly)
{ fromScale: 1.06, toScale: 1.0, fromX: 0, toX: 0, fromY: 6, toY: 0 }
```

**Scale range:** 1.04–1.08 → 1.0. Never exceed 1.12 — it looks like a video game camera, not a professional edit.

### TYPE B — Zoom In (Focus / Intimacy)
**When to use:** A specific detail is being highlighted. A stat, a balance number, a card chip, a CTA. The camera leans in. Used during a "hold" beat, not during an element entrance.

```ts
// Scale: 1.0 → 1.03 over 36–60 frames
{ fromScale: 1.0, toScale: 1.03, fromX: 0, toX: targetOffsetX, fromY: 0, toY: targetOffsetY }
```

**Scale range:** 1.0 → 1.02–1.04. Moving toward a specific element requires a simultaneous X/Y offset to keep that element centered under the zoom.

### TYPE C — Pan (Survey / Data)
**When to use:** A list is populating, a dashboard is loading, multiple data points are appearing. The camera moves laterally across the frame, implying the eye is scanning content. Best for list stagger animations and multi-column layouts.

```ts
// Pan left while list populates: fromX: 0, toX: -16 over 30 frames
{ fromScale: 1.0, toScale: 1.0, fromX: 0, toX: -16, fromY: 0, toY: 0 }
```

**Pan range:** 10–20px max. More than 20px on a 1920px canvas becomes visually distracting.

### TYPE D — Drift (Ambient / Hold)
**When to use:** The composition is in a hold state — no major element is entering or exiting. The camera drifts almost imperceptibly to prevent the frame from going static. This is the ambient motion that keeps a video alive between cuts.

```ts
// Perpetual slow drift using a sine wave
const DRIFT_PERIOD = 120; // frames for one full oscillation at 24fps = 5 seconds
const driftX = Math.sin((frame / DRIFT_PERIOD) * Math.PI * 2) * 4;
const driftY = Math.cos((frame / DRIFT_PERIOD) * Math.PI * 1.4) * 2;
```

**Drift range:** X ±3–6px, Y ±2–4px. The Y drift period should be a non-integer multiple of the X period (e.g., 1.4x) so the motion never perfectly repeats and always feels organic.

### TYPE E — Tilt / Dutch (Tension / Intro)
**When to use:** Opening frames of a trailer. Used sparingly — once per composition maximum. A very slight rotation (±0.3–0.6 degrees) combined with a zoom-out creates cinematic energy on the first scene.

```ts
// Tilt corrects from slight rotation to 0
{ fromRotate: 0.4, toRotate: 0, fromScale: 1.08, toScale: 1.0 }
```

**Rotation range:** ±0.3–0.8 degrees absolute maximum. More than 1 degree looks like an error.

---

## 3. Scene-to-Camera Mapping Rules

This is the decision framework. Before writing any CameraRig moves, identify the scene type and apply the matching camera logic.

| Scene Type | Primary Camera Move | Secondary Ambient |
|---|---|---|
| Element entrance (card, panel) | Zoom Out (A) | Drift (D) after settle |
| Text reveal (headline) | Zoom Out subtle (A) + Pan (C) | Drift (D) |
| List population | Pan (C) during stagger | Push In (B) at end |
| Detail / stat highlight | Zoom In (B) | None — stillness = focus |
| Full dashboard reveal | Zoom Out (A) wide | Drift (D) |
| Screen transition | Hold → Zoom Out post-cut (A) | Pan (C) into new scene |
| CTA / closing frame | Push In very slow (B) | Drift (D) |
| Opening title card | Tilt correct + Zoom Out (E+A) | Drift (D) |

**Critical rule:** Camera moves should START 2–4 frames BEFORE the element animation begins. The camera anticipates the content. It does not react to it. Reaction looks amateur. Anticipation looks directed.

---

## 4. Ambient Drift System

Every composition needs a persistent ambient drift layer that runs throughout the entire duration, underneath all deliberate camera moves. This is what keeps the video from ever going static.

```tsx
// src/components/AmbientDrift.tsx
import { AbsoluteFill, useCurrentFrame } from 'remotion';

interface AmbientDriftProps {
  children: React.ReactNode;
  intensity?: number; // 1.0 = default, 0.5 = subtle, 2.0 = prominent
  periodFrames?: number; // default 144 (6 seconds at 24fps)
}

export const AmbientDrift: React.FC<AmbientDriftProps> = ({
  children,
  intensity = 1.0,
  periodFrames = 144,
}) => {
  const frame = useCurrentFrame();

  // Non-repeating Lissajous drift — X and Y have irrational period ratio
  const driftX = Math.sin((frame / periodFrames) * Math.PI * 2) * 4 * intensity;
  const driftY = Math.cos((frame / (periodFrames * 1.37)) * Math.PI * 2) * 2.5 * intensity;

  // Extremely subtle rotation drift
  const driftRotate = Math.sin((frame / (periodFrames * 0.7)) * Math.PI * 2) * 0.08 * intensity;

  return (
    <AbsoluteFill style={{
      transform: `translate(${driftX}px, ${driftY}px) rotate(${driftRotate}deg)`,
      willChange: 'transform',
    }}>
      {children}
    </AbsoluteFill>
  );
};
```

**Nesting order in composition:**
```tsx
// Correct nesting order — outermost to innermost
<CameraRig moves={deliberateMoves}>         // deliberate camera cuts
  <AmbientDrift intensity={0.8}>            // constant ambient motion
    <ParallaxScene layers={depthLayers} />  // parallax depth
  </AmbientDrift>
</CameraRig>
```

---

## 5. Parallax Depth System

Parallax applies when there are **two or more visual elements at different perceived depths** in the same frame. This covers:
- A floating card in front of a UI panel
- Multiple UI components forming a layered interface
- A headline in front of a background texture
- An icon over a dashboard

The rule is simple: **elements closer to the camera move more than elements further away** in response to the same camera movement. The difference is subtle but makes the composition feel three-dimensional.

### Depth Layer System

```ts
// src/constants/depth.ts
export const DepthLayer = {
  BACKGROUND: 0, // furthest — moves least
  SURFACE: 1,    // background panels, textures
  UI_PANEL: 2,   // dashboard panels, cards back-layer
  UI_CARD: 3,    // primary UI component
  FOREGROUND: 4, // floating elements, cards in front
  OVERLAY: 5,    // text, labels, CTAs — moves most
} as const;

// Parallax multiplier per layer
export const PARALLAX_FACTOR: Record<number, number> = {
  0: 0.0,  // background: no parallax movement
  1: 0.2,  // surface: 20% of base movement
  2: 0.4,  // UI panel: 40%
  3: 0.65, // UI card: 65%
  4: 0.85, // foreground: 85%
  5: 1.0,  // overlay text: full movement
};
```

### ParallaxLayer Component

```tsx
// src/components/ParallaxLayer.tsx
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { DepthLayer, PARALLAX_FACTOR } from '../constants/depth';

interface ParallaxLayerProps {
  children: React.ReactNode;
  depth: number;
  cameraX: number;
  cameraY: number;
  cameraScale: number;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children, depth, cameraX, cameraY, cameraScale,
}) => {
  const factor = PARALLAX_FACTOR[depth] ?? 1.0;

  const parallaxX = -cameraX * (factor - 0.5) * 0.3;
  const parallaxY = -cameraY * (factor - 0.5) * 0.3;

  // Subtle scale difference per layer — foreground is slightly larger
  const depthScale = 1.0 + (depth * 0.008);

  return (
    <AbsoluteFill style={{
      transform: `translate(${parallaxX}px, ${parallaxY}px) scale(${depthScale})`,
      transformOrigin: 'center center',
      willChange: 'transform',
      zIndex: depth,
    }}>
      {children}
    </AbsoluteFill>
  );
};
```

---

## 6. Shared Camera State Hook

```tsx
// src/hooks/useCameraState.ts
import { interpolate, useCurrentFrame } from 'remotion';
import { Ease } from '../constants/easing';

interface CameraMove {
  startFrame: number;
  endFrame: number;
  fromScale: number; toScale: number;
  fromX: number; toX: number;
  fromY: number; toY: number;
  easing?: (t: number) => number;
}

export const useCameraState = (moves: CameraMove[]) => {
  const frame = useCurrentFrame();
  const activeMove = [...moves].reverse().find(m => frame >= m.startFrame) ?? moves[0];
  const progress = interpolate(
    frame,
    [activeMove.startFrame, activeMove.endFrame],
    [0, 1],
    { clamp: true, easing: activeMove.easing ?? Ease.smooth }
  );
  return {
    scale: interpolate(progress, [0, 1], [activeMove.fromScale, activeMove.toScale]),
    x: interpolate(progress, [0, 1], [activeMove.fromX, activeMove.toX]),
    y: interpolate(progress, [0, 1], [activeMove.fromY, activeMove.toY]),
    progress,
  };
};
```

---

## 7. Z-Depth Visual Separation

When three or more UI components form a single interface, apply slight Z-axis visual separation.

1. **Scale difference** — closer elements are 1–2% larger
2. **Blur on far elements** — very subtle `blur(0.4px)` on the furthest panel
3. **Opacity difference** — background panels at 92–95% opacity
4. **Shadow depth** — closer elements cast stronger, more diffused shadows

```
Scale rules for Z-separation:
- 3 panels: back 0.982, mid 0.991, front 1.0
- 2 panels: back 0.990, front 1.0
- Never exceed 2% scale difference
```

---

## 8. Camera Transition Between Scenes

Camera cut happens 2–4 frames BEFORE content transition. Creates "snap and recover" that mirrors the match cut.

```tsx
const cameraMoves: CameraMove[] = [
  // Scene 1
  { startFrame: 0, endFrame: 48, fromScale: 1.06, toScale: 1.0, fromX: 0, toX: 0, fromY: 8, toY: 0, easing: Ease.smooth },
  // Transition snap — 2 frames before content cut at 48
  { startFrame: 46, endFrame: 54, fromScale: 1.0, toScale: 1.02, fromX: 0, toX: 20, fromY: 0, toY: 4, easing: Ease.exitFast },
  // Scene 2 settle
  { startFrame: 54, endFrame: 96, fromScale: 1.02, toScale: 1.0, fromX: 20, toX: 0, fromY: 4, toY: 0, easing: Ease.enterSnap },
];
```

---

## 9. Full Composition Architecture

```tsx
export const CardsTrailer: React.FC = () => {
  const { scale, x, y } = useCameraState(CAMERA_MOVES);
  const frame = useCurrentFrame();

  const DRIFT_PERIOD = 144;
  const driftX = Math.sin((frame / DRIFT_PERIOD) * Math.PI * 2) * 4;
  const driftY = Math.cos((frame / (DRIFT_PERIOD * 1.37)) * Math.PI * 2) * 2.5;
  const totalX = x + driftX;
  const totalY = y + driftY;

  return (
    <AbsoluteFill style={{
      transform: `scale(${scale}) translate(${x}px, ${y}px)`,
      transformOrigin: 'center center',
      willChange: 'transform',
      background: '#0A0A0F',
    }}>
      <AbsoluteFill style={{
        transform: `translate(${driftX}px, ${driftY}px)`,
        willChange: 'transform',
      }}>
        <ParallaxLayer depth={DepthLayer.BACKGROUND} cameraX={totalX} cameraY={totalY} cameraScale={scale}>
          <BackgroundGradient />
        </ParallaxLayer>
        <ParallaxLayer depth={DepthLayer.UI_PANEL} cameraX={totalX} cameraY={totalY} cameraScale={scale}>
          <Sequence from={44}><UIScreen /></Sequence>
        </ParallaxLayer>
        <ParallaxLayer depth={DepthLayer.FOREGROUND} cameraX={totalX} cameraY={totalY} cameraScale={scale}>
          <Sequence from={0}><CardFloat startFrame={0} /></Sequence>
        </ParallaxLayer>
        <ParallaxLayer depth={DepthLayer.OVERLAY} cameraX={totalX} cameraY={totalY} cameraScale={scale}>
          <Sequence from={28}>
            <WordByWord text="Business spend. Full control." startFrame={0} />
          </Sequence>
        </ParallaxLayer>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

---

## 10. Decision Checklist — Before Writing Any Camera Moves

1. **What is happening in each scene?** Identify scene type using the Scene-to-Camera Mapping table (Section 3).
2. **Does the camera anticipate or react?** It must anticipate — camera move starts 2–4 frames before content animation.
3. **How many depth layers does the scene have?** 1 layer = no parallax needed. 2+ layers = parallax must be applied.
4. **Is the composition ever static?** If yes, add AmbientDrift. No frame should ever be completely still.
5. **Are scale values within safe range?** Zoom: 1.0–1.08 max. Pan: ±20px max. Rotation: ±0.8° max.
6. **Do camera moves align with content transitions?** Camera cut should happen 2 frames before content transition, not simultaneously.
7. **Is there a `will-change: transform`** on every animated wrapper? If not, add it.

---

## 11. Common Mistakes — Camera and Parallax

1. **Camera reacts instead of anticipating.** Start camera 2–4 frames early.
2. **Zoom scale too aggressive.** Anything above 1.08 reads as video game, not cinema.
3. **Pan distance too large.** Keep pan to ±20px.
4. **Drift is too fast.** Minimum period is 96 frames. Ideal is 120–180 frames.
5. **Parallax applied to single-element scenes.** Need at least two layers at different depths.
6. **All layers at the same parallax factor.** This is identical to no parallax at all.
7. **Camera and drift not combined** when passing into ParallaxLayer — drift values must be added to camera values.
8. **Z-depth scale differences too large.** Never exceed 2% scale difference between panels.
9. **No camera move on the closing frame.** Always add a slow push-in during hold and closing beat.
10. **Missing `transformOrigin: 'center center'`** on the CameraRig wrapper.
