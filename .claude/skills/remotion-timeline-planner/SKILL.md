---
name: remotion-timeline-planner
description: >
  Intelligent timeline planning system for Remotion motion graphic compositions. Use this skill FIRST before writing any composition code — before any animation, before any camera move, before any text. This skill defines how to allocate frame budgets across scenes, how to cut at peak velocity for match cuts, how to handle UI screen entries without killing pacing, and how to build a complete timeline plan as a typed data structure that all other skills execute against. Triggers on: "timeline", "plan the video", "sequence the animation", "scene order", "frame allocation", "pacing", "how long should", "scene budget", "cut point", "peak velocity cut", "when should I cut", "UI screen entry", "stitch the scenes", "composition structure". Always read this skill before opening any other remotion skill. A composition without a timeline plan is a composition that will be rebuilt.
---

# Remotion Timeline Planner Skill

## Philosophy

Professional motion designers in After Effects do not open a composition and start animating. They plan the timeline first — on paper, in a document, in their head — before a single keyframe is placed. They know the total duration, the number of scenes, the frame range of each scene, where every cut lands, and what happens in each scene before they touch the software. The timeline is the architecture. The animations are the furniture.

In Remotion, this discipline is even more important because every animation is code. Without a timeline plan, compositions become a pile of magic numbers — `startFrame={48}` with no explanation of why 48, `durationInFrames={180}` with no justification. When something needs to change, everything breaks. The timeline planner converts scene planning into a typed data structure that every other skill reads from. Change one scene duration and the entire composition reflows correctly.

The second critical role of the timeline planner is **scene intelligence** — reading what type of scene is being built and making a decisive call on how much time it gets, what enters and what does not, and when the cut happens. A senior motion designer does not animate everything on a UI screen. They animate just enough to imply the full interface is alive. The rest is visual presence, not motion.

---

## Step 1 — Define the Narrative Arc Before Any Frames

Before writing a single frame number, answer these four questions:

**1. What is the story structure?**
Every composition — even a 6-second product trailer — follows a narrative arc. Identify which arc applies:

| Arc Type | Structure | Best For |
|---|---|---|
| Problem → Solution | Pain → Endl fixes it | Feature explainers, onboarding |
| Reveal | Build → hero moment → payoff | Trailers, launch videos |
| Feature Stack | Intro → Feature A → Feature B → Feature C → CTA | Product demo reels |
| Before / After | Old way → New way | Competitor positioning |
| Single Idea | Setup → proof → resolution | Social reels, carousels |

**2. How many distinct scenes does the story need?**
A scene is a unit of the narrative that occupies its own visual space. One idea = one scene. Never cram two ideas into one scene. Common scene counts at 24fps:

- 6-second reel: 2–3 scenes
- 15-second trailer: 4–6 scenes
- 30-second product demo: 6–10 scenes
- 60-second walkthrough: 10–14 scenes

**3. What is the total composition duration?**
Lock this before planning scenes. Work backward from the output format:

| Format | Target Duration | Max Frames at 24fps |
|---|---|---|
| Instagram Reel / Story | 6–15s | 144–360f |
| LinkedIn / Twitter clip | 15–30s | 360–720f |
| Product trailer | 30–60s | 720–1440f |
| Demo walkthrough | 60–90s | 1440–2160f |

**4. What is the emotional pacing?**
- **High energy** (launch, marketing): cuts every 2–4 seconds, minimal holds
- **Premium / editorial** (investor, brand): cuts every 4–6 seconds, intentional holds
- **Instructional** (demo, onboarding): cuts every 5–8 seconds, held UI states

---

## Step 2 — Build the Timeline Plan Data Structure

Every composition must have a `TIMELINE` constant defined before the composition component. This is the single source of truth for all frame numbers across the entire file.

```ts
// src/constants/timeline.ts

export interface Scene {
  id: string;
  label: string;             // human-readable name
  type: SceneType;           // drives animation decisions
  start: number;             // frame where scene begins
  end: number;               // frame where scene's content fully resolves
  cutPoint: number;          // frame where the CUT happens (n-1 rule, see below)
  hold: number;              // frames to hold after resolution before cutting
  cameraMove: CameraType;    // which camera behavior this scene uses
  contentBudget: number;     // frames available for all element animations
}

export type SceneType =
  | 'hero_card'          // floating card or product visual
  | 'text_statement'     // headline + subline only
  | 'ui_dashboard'       // full dashboard or UI panel reveal
  | 'ui_row_list'        // list of rows (transactions, accounts, etc.)
  | 'stat_callout'       // single number or stat highlight
  | 'split_text_ui'      // text on left, UI on right (most common)
  | 'transition_only'    // pure match cut, no new content
  | 'cta';              // closing call to action frame

export type CameraType =
  | 'zoom_out'
  | 'zoom_in'
  | 'pan_left'
  | 'pan_right'
  | 'drift_only'
  | 'push_in';

export interface TimelinePlan {
  fps: number;
  totalFrames: number;
  scenes: Scene[];
}
```

### Building the Plan — Example: Endl Cards Trailer (30s)

```ts
// src/constants/timeline.ts
import { TimelinePlan } from './types';

export const TIMELINE: TimelinePlan = {
  fps: 24,
  totalFrames: 720,  // 30 seconds

  scenes: [
    {
      id: 'hero_open',
      label: 'Card float-in + brand',
      type: 'hero_card',
      start: 0,
      end: 68,       // card fully settled + text resolved
      cutPoint: 67,  // n-1 rule: cut 1 frame before animation fully stops
      hold: 12,      // 0.5s hold after resolve before cutting
      cameraMove: 'zoom_out',
      contentBudget: 56,  // 56 frames for all animations in this scene
    },
    {
      id: 'statement_1',
      label: 'Business spend. Full control.',
      type: 'text_statement',
      start: 68,
      end: 120,
      cutPoint: 119,
      hold: 24,      // 1s hold — text statements need more reading time
      cameraMove: 'drift_only',
      contentBudget: 28,
    },
    {
      id: 'split_cards_ui',
      label: 'Text left / Dashboard right',
      type: 'split_text_ui',
      start: 120,
      end: 216,
      cutPoint: 215,
      hold: 36,      // 1.5s hold — UI needs reading time
      cameraMove: 'zoom_in',
      contentBudget: 60,
    },
    {
      id: 'stat_fx',
      label: '$0 FX fees stat callout',
      type: 'stat_callout',
      start: 216,
      end: 276,
      cutPoint: 275,
      hold: 20,
      cameraMove: 'push_in',
      contentBudget: 24,
    },
    {
      id: 'ui_transactions',
      label: 'Transaction list reveal',
      type: 'ui_row_list',
      start: 276,
      end: 372,
      cutPoint: 371,
      hold: 36,
      cameraMove: 'pan_left',
      contentBudget: 36,
    },
    {
      id: 'cta_close',
      label: 'Use Endl / CTA',
      type: 'cta',
      start: 372,
      end: 480,
      cutPoint: 479,
      hold: 48,      // 2s — CTA needs the longest hold
      cameraMove: 'push_in',
      contentBudget: 32,
    },
  ],
};
```

---

## Step 3 — The n-1 Cut Rule (Peak Velocity Cuts)

This is the single most important technical principle in timeline planning. It is why match cuts in professional work feel instantaneous while amateur cuts feel like the animation "finishes" before anything new appears.

### How easing curves work at their endpoint

Every easing curve with a smooth deceleration (like `cubic-bezier(0.57, 0.01, 0, 0.99)`) has a property: **velocity is highest not at the midpoint, but near the end of the animation** — specifically, the curve accelerates through most of its range and then decelerates sharply in the final 10–15% of frames. This means:

- Frame 0: object starts moving (slow)
- Frame 7: object is at peak velocity (fastest)
- Frame 9: object is decelerating
- Frame 10: object stops (animation complete)

**If you cut at frame 10 and start the next clip at frame 0, you get a pause.** The object stops, then something new starts. The eye sees the stop.

**If you cut at frame 9 (n-1) and start the next clip at frame 1** (skipping its slow ramp-up), both frames are at or near peak velocity simultaneously. The brain reads it as a single continuous motion at high speed. This is the match cut.

### The n-1 Rule Applied

```ts
// src/utils/timeline.ts

/**
 * Calculate the cut point for a scene.
 * cutPoint = one frame before the animation fully resolves.
 * This keeps the exit element at peak velocity at the moment of cut.
 */
export const getCutPoint = (sceneEnd: number): number => sceneEnd - 1;

/**
 * Calculate where the entering element's animation should start
 * relative to the scene start, skipping its slow ramp-up.
 * enterOffset = number of frames into the enter animation to begin from.
 * Typical value: 1–2 frames (skip the near-zero velocity start)
 */
export const getEnterOffset = (enterAnimationDuration: number): number => {
  // Skip the first ~15% of the enter animation — this is the slow ramp
  return Math.floor(enterAnimationDuration * 0.12);
};
```

### Applying This in Remotion

In Remotion, `<Sequence from={n}>` controls when components render. The n-1 rule maps to how you trim `<Sequence>` durations and offset `startFrame` values inside the entering component.

```tsx
// Exiting scene — text statement
// Animation completes at frame 28. Cut at frame 27 (n-1).
<Sequence from={TIMELINE.scenes[1].start} durationInFrames={27}>
  <TextStatement />
</Sequence>

// Entering scene — UI panel
// Skip the first 2 frames of enter animation (skip slow ramp-up)
// Scene starts at frame 68. Enter animation internally starts from frame 2 (not 0).
<Sequence from={TIMELINE.scenes[2].start}>
  <UIDashboard enterOffset={2} />
</Sequence>
```

Inside `UIDashboard`, the `enterOffset` prop shifts all internal `startFrame` values:

```tsx
const UIDashboard: React.FC<{ enterOffset?: number }> = ({ enterOffset = 0 }) => (
  <>
    <PanelFadeUp startFrame={0 + enterOffset} />
    <RowList startFrame={8 + enterOffset} />
  </>
);
```

### Scene-Level Cut Timing Reference

| Exit animation duration | Cut at frame | Enter starts at internal frame |
|---|---|---|
| 8f | 7 | 1 |
| 10f | 9 | 1–2 |
| 14f | 13 | 2 |
| 18f | 17 | 2–3 |
| 24f | 23 | 3 |

---

## Step 4 — Content Budget Allocation Per Scene Type

Each scene type has a strictly defined content budget — the maximum number of frames available for all element animations within that scene. Exceeding the budget kills pacing. The budget is not a suggestion.

### `hero_card` — Budget: 48–60f

```
Frame 0–20:   Card float-in (20f)
Frame 8–20:   Shimmer gloss pass (12f, overlaps card settle)
Frame 20–38:  Headline word-fade-up (18f)
Frame 28–42:  Subline word-fade-up (14f, overlaps headline end)
Frame 42–56:  Hold before cut
```

**Rule:** Card and headline overlap by 8 frames. Subline starts while headline is mid-animation. Nothing waits for anything else to finish. All elements are layered in time, not sequential.

### `text_statement` — Budget: 22–32f

```
Frame 0–20:   Headline word-fade-up (20f, 2f stagger)
Frame 8–22:   Subline word-fade-up (14f, starts at frame 8)
Frame 22–46:  Hold (24f = 1 second reading time minimum)
```

**Rule:** Text statements must hold long enough to be read. The hold is not wasted time — it is intentional breathing room. Minimum 1 full second (24f) of hold on any text statement.

### `ui_dashboard` — Budget: 48–64f (CRITICAL — see UI Entry Intelligence below)

```
Frame 0–14:   Panel slide-up or fade-in (14f)
Frame 6–20:   Header label blur-dissolve (overlaps panel)
Frame 10–28:  Primary stat or balance number-roll (18f)
Frame 18–36:  Secondary UI elements implied-fade (fast, 10f)
Frame 28–48:  Graph draw (20f)
Frame 48–84:  Hold
```

### `ui_row_list` — Budget: 28–36f

```
Frame 0–14:   Panel appears (fast fade, 10f)
Frame 4–26:   Row stagger bottom-to-top (22f for 8 rows at 2f stagger)
Frame 26–62:  Hold
```

**Rule:** The panel appears first, then the rows populate inside it. The panel entrance must be fast — it is not the content, it is the container.

### `split_text_ui` — Budget: 52–68f

```
Frame 0–6:    Left text block begins entering
Frame 0–14:   Right UI panel enters (match cut timing — both enter near-simultaneously)
Frame 6–26:   Text animates word-by-word (20f)
Frame 10–28:  UI panel content appears (rows, stats — implied only)
Frame 28–64:  Hold
```

**Rule:** Text and UI enter simultaneously, not sequentially. The visual split is established within the first 14 frames. Everything else is detail filling in.

### `stat_callout` — Budget: 18–28f

```
Frame 0–8:    Scale punch entrance (8f)
Frame 4–22:   Number roll (18f)
Frame 22–46:  Hold
```

### `cta` — Budget: 24–32f

```
Frame 0–16:   CTA text line-wipe (16f — slowest animation in the composition, deliberate)
Frame 8–24:   CTA subtext blur-dissolve (16f)
Frame 24–72:  Hold (2s — CTA gets the longest hold of any scene type)
```

---

## Step 5 — UI Screen Entry Intelligence

This is the principle that most separates good from bad SaaS motion graphic work. When a UI dashboard enters a scene, amateur motion designers animate every single element: each row fades in, each stat counts up, each graph draws, each label appears — one by one, taking 4–6 seconds of total screen time. This destroys pacing. By the time the UI is fully revealed, the viewer has lost interest.

The professional approach: **animate only the elements that prove the product is alive. Imply the rest.**

### The Three Tiers of UI Element Animation Priority

**Tier 1 — Must Animate (2–3 elements maximum)**
These are the elements that prove the product is functional and fast. They carry the narrative.
- The primary balance or stat (NumberRoll)
- The primary graph or chart (AnimatedGraph)
- The primary data row or card (single row or card entrance)

**Tier 2 — Imply with a Fast Group Fade (the rest of the rows)**
All secondary rows, labels, and data points appear together as a fast group. Single opacity fade, 8–10 frames, slight Y offset. Not staggered individually. They appear as a block — implying that data is there, not performing that data animating.

**Tier 3 — Static (never animate)**
Background panels, borders, shadows, background grid lines, color chips, icon backgrounds. These are present from frame 0. They are the stage. They do not move.

```tsx
// UI Entry Intelligence — how to handle an 8-row dashboard

// ❌ WRONG — animating every row individually (kills pacing, ~80 frames total)
{transactions.map((t, i) => (
  <TransactionRow key={i} startFrame={i * 6} /> // 48 frames just for rows
))}

// ✅ CORRECT — Tier 1 animates, Tier 2 implies, Tier 3 static
const UIScreen: React.FC<{ enterOffset?: number }> = ({ enterOffset = 0 }) => {
  const frame = useCurrentFrame();
  const start = enterOffset;

  // Tier 3: Panel background — static from frame 0
  const panelOpacity = 1;

  // Tier 1: Primary stat — animate individually
  // Tier 1: Graph — animate individually

  // Tier 2: All rows appear together as one unit, fast
  const rowsProgress = interpolate(frame - (start + 10), [0, 10], [0, 1], {
    clamp: true,
    easing: Ease.smooth,
  });

  return (
    <div style={{ background: '#111118', borderRadius: 20, padding: 32 }}>

      {/* Tier 3 — static */}
      <div style={{ opacity: panelOpacity }}>
        <HeaderBar />
      </div>

      {/* Tier 1 — animate individually */}
      <NumberRoll from={0} to={248750} startFrame={start + 4} prefix="$" />
      <AnimatedGraph pathD={GRAPH_PATH} pathLength={420} startFrame={start + 14} />

      {/* Tier 2 — all rows as one implied group */}
      <div style={{
        opacity: rowsProgress,
        transform: `translateY(${interpolate(rowsProgress, [0, 1], [8, 0])}px)`,
      }}>
        {transactions.map((t, i) => (
          <TransactionRow key={i} data={t} /> // no individual animation
        ))}
      </div>

    </div>
  );
};
```

### UI Entry Speed Rules

UI state changes in product videos must run **3× faster than real life.** If a real dashboard loads in 1 second, show it loading in 8–10 frames. Speed signals quality. Viewers subconsciously map animation speed to software performance.

| UI Element | Real-world speed | Video speed | Frame budget |
|---|---|---|---|
| Dashboard load | 1–2s | 10–14f | 10–14f |
| Row list population | 0.8s | 8–10f (as group) | 8–10f |
| Balance update | 0.3s | 18–22f (NumberRoll) | 18–22f |
| Graph render | 1s | 20–24f | 20–24f |
| Status change | instant | 6–8f (blur dissolve) | 6–8f |
| Form input typing | 3s | 18–22f (CharTypewriter) | 18–22f |

---

## Step 6 — Helper Utilities for Timeline Execution

These utilities read from the `TIMELINE` constant and expose clean values throughout the composition.

```ts
// src/utils/timeline.ts

import { TimelinePlan, Scene } from '../constants/types';

/** Get a scene by ID */
export const getScene = (plan: TimelinePlan, id: string): Scene => {
  const scene = plan.scenes.find(s => s.id === id);
  if (!scene) throw new Error(`Scene "${id}" not found in timeline plan`);
  return scene;
};

/** Duration of a scene's active content (start to cutPoint) */
export const getSceneDuration = (scene: Scene): number =>
  scene.cutPoint - scene.start;

/** Check if current frame is within a scene's active range */
export const isSceneActive = (frame: number, scene: Scene): boolean =>
  frame >= scene.start && frame <= scene.cutPoint;

/** Get local frame within a scene (0 = scene start) */
export const getLocalFrame = (frame: number, scene: Scene): number =>
  frame - scene.start;

/** Get enter offset for an entering scene based on its enter animation duration */
export const getEnterOffset = (enterDuration: number): number =>
  Math.floor(enterDuration * 0.12);

/** Frame budget remaining after accounting for hold */
export const getContentBudget = (scene: Scene): number =>
  scene.contentBudget;

/** Total composition duration check */
export const validateTimeline = (plan: TimelinePlan): void => {
  const lastScene = plan.scenes[plan.scenes.length - 1];
  if (lastScene.end > plan.totalFrames) {
    throw new Error(
      `Timeline overflow: last scene ends at ${lastScene.end} but composition is ${plan.totalFrames} frames`
    );
  }
  plan.scenes.forEach((scene, i) => {
    if (scene.contentBudget > getSceneDuration(scene) - scene.hold) {
      console.warn(
        `Scene "${scene.id}" content budget (${scene.contentBudget}f) may exceed available time`
      );
    }
  });
};
```

---

## Step 7 — Complete Composition Architecture Using Timeline Plan

```tsx
// src/compositions/CardsTrailer.tsx
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { TIMELINE } from '../constants/timeline';
import { getScene, getEnterOffset, validateTimeline } from '../utils/timeline';
import { useCameraState } from '../hooks/useCameraState';
import { buildCameraMovesFromTimeline } from '../utils/camera';

// Validate on module load — catches planning errors before render
validateTimeline(TIMELINE);

export const CardsTrailer: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera moves derived from timeline plan — not hardcoded
  const cameraMoves = buildCameraMovesFromTimeline(TIMELINE);
  const { scale, x, y } = useCameraState(cameraMoves);

  const s = {
    hero: getScene(TIMELINE, 'hero_open'),
    statement: getScene(TIMELINE, 'statement_1'),
    splitUI: getScene(TIMELINE, 'split_cards_ui'),
    stat: getScene(TIMELINE, 'stat_fx'),
    rows: getScene(TIMELINE, 'ui_transactions'),
    cta: getScene(TIMELINE, 'cta_close'),
  };

  return (
    <AbsoluteFill style={{
      background: '#0A0A0F',
      transform: `scale(${scale}) translate(${x}px, ${y}px)`,
      transformOrigin: 'center center',
    }}>

      {/* Scene 1: Hero card */}
      <Sequence from={s.hero.start} durationInFrames={getSceneDuration(s.hero)}>
        <HeroCard budget={s.hero.contentBudget} />
      </Sequence>

      {/* Scene 2: Text statement */}
      <Sequence from={s.statement.start} durationInFrames={getSceneDuration(s.statement)}>
        <TextStatement budget={s.statement.contentBudget} />
      </Sequence>

      {/* Scene 3: Split text / UI — enter offset applied */}
      <Sequence from={s.splitUI.start} durationInFrames={getSceneDuration(s.splitUI)}>
        <SplitTextUI
          budget={s.splitUI.contentBudget}
          enterOffset={getEnterOffset(14)} // 14f = panel enter animation duration
        />
      </Sequence>

      {/* Scene 4: Stat callout */}
      <Sequence from={s.stat.start} durationInFrames={getSceneDuration(s.stat)}>
        <StatCallout budget={s.stat.contentBudget} />
      </Sequence>

      {/* Scene 5: Transaction rows */}
      <Sequence from={s.rows.start} durationInFrames={getSceneDuration(s.rows)}>
        <UIRowList budget={s.rows.contentBudget} />
      </Sequence>

      {/* Scene 6: CTA */}
      <Sequence from={s.cta.start} durationInFrames={getSceneDuration(s.cta)}>
        <CTAFrame budget={s.cta.contentBudget} />
      </Sequence>

    </AbsoluteFill>
  );
};
```

---

## Step 8 — Scene Budget Red Flags

Before finalizing any timeline plan, check each scene against these red flags. Any yes = revise.

| Red Flag | Why It Kills Pacing |
|---|---|
| Any single element animation > 28f | One element consumes the whole scene budget |
| Hold < 18f on a text statement | Too fast to read — viewer is lost |
| Hold < 36f on a UI dashboard | Too fast to register the interface |
| Hold > 72f on any non-CTA scene | Pacing dies — viewer disengages |
| UI row list stagger > 4f per row | Individual rows feel like a loading screen |
| More than 3 Tier 1 animations in a UI scene | Too much competing motion — nothing lands |
| Scene content budget > 70% of scene duration | No room for hold — everything rushes |
| Two consecutive `text_statement` scenes | Dialogue without visual relief — use a UI cut between them |
| CTA hold < 48f | CTA doesn't register — viewers can't act |
| Total composition > scene count × 96f average | Too slow — compress holds or cut scenes |

---

## Step 9 — Timeline Planning Output Format

When asked to plan a timeline, always output in this format before any code:

```
TIMELINE PLAN — [Composition Name]
Format: [platform] | Duration: [Xs / Xf at 24fps] | Arc: [arc type]

Scene 01 | hero_card      | f000–f068 | budget: 56f | hold: 12f | camera: zoom_out
  → Card float-in (20f) + shimmer (12f) + headline (18f) overlapped
  → Cut at f067 (n-1)

Scene 02 | text_statement | f068–f120 | budget: 28f | hold: 24f | camera: drift_only
  → "Business spend. Full control." word-fade-up (20f) + subline (14f) overlapped
  → Cut at f119

Scene 03 | split_text_ui  | f120–f216 | budget: 60f | hold: 36f | camera: zoom_in
  → Text left (20f) / UI panel right (14f) simultaneous entry
  → Tier 1: balance (20f) + graph (22f) | Tier 2: rows as group (10f)
  → Enter offset: 2f | Cut at f215

[...continue for all scenes]

VALIDATION:
✓ Total: 480f (20s) — within 720f target
✓ Average scene hold: 28f — above 18f minimum
✓ No scene budget violations
✓ All cut points are n-1
```

This output is produced before any Remotion code is written. The user approves the plan. Then the code executes it.

---

## Step 10 — Common Timeline Mistakes

1. **No timeline plan exists.** Jumping directly into animation code with hardcoded frame numbers. When anything changes, everything breaks. Always build the `TIMELINE` constant first.

2. **Scenes are sequential with no overlap.** Scene 1 fully completes, then scene 2 begins. This creates dead air at every transition. Use `<Sequence>` with cut points, not end points.

3. **Cut at the wrong frame.** Cutting at the final frame of an animation means the entering scene starts from velocity zero. Cut at n-1. The exiting element should still be moving at the moment of cut.

4. **Animating all UI rows individually.** 8 rows × 6 frames each = 48 frames just for rows. This is 2 full seconds of the same motion. Use Tier 2 group fade — all rows appear in 10 frames as one unit.

5. **No hold time budgeted.** Every scene needs a hold. The hold is not waste — it is the moment the viewer absorbs the message. Cut hold from a scene and the viewer never processes what they saw.

6. **CTA hold too short.** The CTA is the only frame where the viewer is expected to take action. If it holds for less than 2 seconds, no one reads it. CTA hold minimum: 48f (2s at 24fps).

7. **Text statements back to back.** Two consecutive text-only scenes without a UI or visual cut between them feels like a slide deck. Always insert a visual scene (UI or card) between text statements.

8. **Content budget equals scene duration.** No room for hold. Every frame is animation. By the time the animation finishes, the scene cuts. The viewer never lands anywhere.

9. **Enter offset not applied.** The entering scene's elements start from their slow ramp-up velocity. The match cut breaks because the entering element is near-zero velocity while the exiting element was at peak. Always apply `getEnterOffset()`.

10. **Timeline not validated before render.** Scenes run over their frame range, overlapping or running past composition end. Run `validateTimeline(TIMELINE)` on module load — it catches these before wasting render time.
