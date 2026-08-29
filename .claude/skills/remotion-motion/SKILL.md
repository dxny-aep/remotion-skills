---
name: remotion-motion
description: >
  Agency-quality motion graphic animation using Remotion. Use this skill whenever the user wants to animate UI screens, build SaaS demo videos, create motion graphic trailers, animate dashboards, build product launch videos, or produce any Remotion composition. Triggers on: "animate", "motion graphic", "Remotion", "demo video", "SaaS trailer", "UI animation", "transition", "reel", "stagger", "word animation", "graph animation". Always read this skill before writing any Remotion code — it defines the difference between generic decent animation and exceptional agency-level motion design.
---

# Remotion Motion Design Skill

## Philosophy

The difference between generic animation and professional motion design is not complexity — it is precision. Generic animation is technically correct but visually flat: elements slide in, pause, slide out, all at similar speeds and distances. Professional motion design is choreographed at the frame level. It is spatially intelligent (elements never travel more distance than they need to), perceptually fast (aggressive easing makes short distances feel like high velocity), and emotionally precise (every timing decision serves the narrative arc, not just the function). The goal is never "smooth" — the goal is *intentional*. Study the motion work from Linear, Anthropic model launches, Stripe product demos, and Apple keynote transitions. What makes them exceptional is restraint combined with aggression: very little happens, but what does happen is committed to completely.

---

## 1. Project Setup

```ts
// remotion.config.ts
import { Config } from '@remotion/cli/config';
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
```

```tsx
// Root.tsx
import { Composition } from 'remotion';
import { CardsTrailer } from './compositions/CardsTrailer';

export const RemotionRoot = () => (
  <>
    <Composition
      id="CardsTrailer"
      component={CardsTrailer}
      durationInFrames={180}
      fps={24}              // Always 24fps for cinematic UI motion
      width={1920}
      height={1080}
    />
  </>
);
```

**FPS Rule:** Use 24fps for all UI motion graphic work. 24fps is the cinematic standard — each frame carries more visual weight, and animations feel more deliberate and premium. Use 60fps only for particle systems or continuous physics simulations where sub-frame smoothness is required.

**Font Loading:**
```tsx
import { continueRender, delayRender, staticFile } from 'remotion';

const waitForFont = delayRender();
const font = new FontFace('DM Sans', `url(${staticFile('DMSans.woff2')})`);
font.load().then(() => {
  document.fonts.add(font);
  continueRender(waitForFont);
});
```

---

## 2. Easing Dictionary

Always import from this file. Never use `Easing.linear` for visible motion.

```ts
// src/constants/easing.ts
import { Easing } from 'remotion';

export const Ease = {
  // Standard premium ease — use for most UI element entrances
  smooth: Easing.bezier(0.57, 0.01, 0, 0.99),

  // Exit with fast finish — element leaving frame, slow start, fast exit
  exitFast: Easing.bezier(1, 0, 0.93, 0.46),

  // Enter with fast start — element entering after cut, snaps in then settles
  enterSnap: Easing.bezier(0.03, 0.61, 0, 0.99),

  // Overshoot settle — card arrivals, notification pops, badge counters
  settle: Easing.bezier(0.34, 1.56, 0.64, 1),

  // Aggressive deceleration — use for dramatic hero entrances
  decel: Easing.bezier(0.22, 1, 0.36, 1),

  // NEVER use for visible animation
  linear: Easing.linear,
} as const;
```

---

## 3. Animation Budget Table

Exceeding these budgets makes a video feel slow. If an animation runs long, compress it — do not just extend the composition.

| Element | Max Frames (24fps) | Max Seconds |
|---|---|---|
| Single element fade-in | 12f | 0.5s |
| Word-by-word headline (4 words) | 20f | 0.83s |
| Word-by-word headline (8 words) | 26f | 1.08s |
| Row list stagger (8 rows) | 22f | 0.9s |
| Screen transition (exit + enter) | 20f total | 0.83s |
| Card float-in | 20f | 0.83s |
| Graph line draw | 24f | 1.0s |
| Full scene with hold | 72–96f | 3–4s |
| Full composition (trailer) | 144–216f | 6–9s |

The most common amateur mistake is spending too much frame budget on individual elements, leaving no time for the narrative arc. Budget the full timeline first, then fit elements into it.

---

## 4. Principle: List and Row Stagger

### The Wrong Way
Animating 8 rows top-to-bottom with 0.2s gaps between each. Total: 1.6s just for a list. It reads as "a slow list loading."

### The Right Way
- **Animate bottom to top** — rows at the bottom index start first
- **2–3 frame offset** between each row at 24fps (not 0.2 seconds)
- **Y offset of 12–18px** downward that eases upward simultaneously with fade
- **All rows appear to populate at once** — the wave is subtle, not sequential

Why bottom-to-top? Perceptually, content that rises into place reads as "populating" — like data arriving and settling. Content that falls or appears from top feels like "loading from a source." The first is alive. The second is mechanical.

```tsx
// src/components/StaggeredList.tsx
import { interpolate, useCurrentFrame } from 'remotion';
import { Ease } from '../constants/easing';

interface StaggeredListProps {
  items: React.ReactNode[];
  startFrame?: number;
  staggerFrames?: number;  // default 2
  duration?: number;        // default 14
  yOffset?: number;         // default 14px
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  items,
  startFrame = 0,
  staggerFrames = 2,
  duration = 14,
  yOffset = 14,
}) => {
  const frame = useCurrentFrame();

  return (
    <>
      {items.map((item, i) => {
        // Reverse index: last item in array animates first (bottom-to-top render)
        const reversedIndex = items.length - 1 - i;
        const delay = startFrame + reversedIndex * staggerFrames;
        const localFrame = frame - delay;

        const progress = interpolate(localFrame, [0, duration], [0, 1], {
          clamp: true,
          easing: Ease.smooth,
        });

        return (
          <div
            key={i}
            style={{
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [yOffset, 0])}px)`,
              willChange: 'transform, opacity',
            }}
          >
            {item}
          </div>
        );
      })}
    </>
  );
};
```

**Usage:**
```tsx
<StaggeredList
  items={transactions.map(t => <TransactionRow key={t.id} data={t} />)}
  startFrame={24}
  staggerFrames={2}
  duration={14}
  yOffset={14}
/>
```

---

## 5. Principle: Match Cut Transitions

This is the most misunderstood principle in motion design. The goal is not to animate elements across the full canvas — it is to create the *illusion* of fast movement using minimal actual travel and aggressive easing.

### The Wrong Way
- Text exits: travels completely off the left edge (~960px travel)
- New screen enters: starts from completely off the right edge (~1920px travel)
- Total: 0.6–0.9s of dead travel time

### The Right Way
- Exiting element travels **40–80px** toward exit direction only
- Entering element starts **40–80px** from its final position
- Exit easing: `cubic-bezier(1, 0, 0.93, 0.46)` — very slow start, peaks at maximum velocity right as it hits zero opacity
- Enter easing: `cubic-bezier(0.03, 0.61, 0, 0.99)` — starts at maximum velocity, decelerates to rest
- **Overlap of 3–4 frames** between exit end and enter start — this creates the match cut
- Both exit and enter are at maximum velocity simultaneously. The brain reads it as a single fast movement.

```tsx
// src/components/MatchCutTransition.tsx
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Ease } from '../constants/easing';

type Direction = 'left' | 'right' | 'up' | 'down';

interface MatchCutProps {
  exitComponent: React.ReactNode;
  enterComponent: React.ReactNode;
  transitionFrame: number;   // frame at which transition begins
  exitDuration?: number;     // default 9 frames
  enterDuration?: number;    // default 13 frames
  overlapFrames?: number;    // default 3 frames
  direction?: Direction;     // default 'left'
  travelDistance?: number;   // default 64px
}

const getDirectionVector = (dir: Direction): { x: number; y: number } => ({
  left:  { x: -1, y: 0 },
  right: { x: 1,  y: 0 },
  up:    { x: 0,  y: -1 },
  down:  { x: 0,  y: 1 },
}[dir]);

export const MatchCutTransition: React.FC<MatchCutProps> = ({
  exitComponent,
  enterComponent,
  transitionFrame,
  exitDuration = 9,
  enterDuration = 13,
  overlapFrames = 3,
  direction = 'left',
  travelDistance = 64,
}) => {
  const frame = useCurrentFrame();
  const vec = getDirectionVector(direction);
  const enterStart = transitionFrame + exitDuration - overlapFrames;

  // EXIT
  const exitProgress = interpolate(
    frame,
    [transitionFrame, transitionFrame + exitDuration],
    [0, 1],
    { clamp: true, easing: Ease.exitFast }
  );
  const exitX = vec.x * travelDistance * exitProgress;
  const exitY = vec.y * travelDistance * exitProgress;
  const exitOpacity = interpolate(exitProgress, [0.4, 1], [1, 0], { clamp: true });

  // ENTER
  const enterProgress = interpolate(
    frame,
    [enterStart, enterStart + enterDuration],
    [0, 1],
    { clamp: true, easing: Ease.enterSnap }
  );
  const enterX = vec.x * -travelDistance * (1 - enterProgress);
  const enterY = vec.y * -travelDistance * (1 - enterProgress);
  const enterOpacity = interpolate(enterProgress, [0, 0.3], [0, 1], { clamp: true });

  return (
    <AbsoluteFill>
      {/* Exit layer */}
      {frame < transitionFrame + exitDuration && (
        <AbsoluteFill style={{
          transform: `translate(${exitX}px, ${exitY}px)`,
          opacity: exitOpacity,
          willChange: 'transform, opacity',
        }}>
          {exitComponent}
        </AbsoluteFill>
      )}

      {/* Enter layer */}
      {frame >= enterStart && (
        <AbsoluteFill style={{
          transform: `translate(${enterX}px, ${enterY}px)`,
          opacity: enterOpacity,
          willChange: 'transform, opacity',
        }}>
          {enterComponent}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
```

**Usage:**
```tsx
<MatchCutTransition
  exitComponent={<TextBlock />}
  enterComponent={<UIScreen />}
  transitionFrame={48}
  direction="left"
  travelDistance={60}
/>
```

---

## 6. Principle: Word-by-Word Text Animation

Never animate a full text block as a single unit. Every headline must animate word by word. Sublines animate line by line or word by word depending on length.

Rules:
- Split string on spaces into individual word spans
- Each word: `opacity: 0 → 1`, `translateY: 10px → 0`
- Delay between words: **1.5–2 frames** at 24fps
- Duration per word: **10–12 frames**
- Full 4-word headline visible within **18–22 frames**
- Full 8-word headline visible within **26 frames** maximum

```tsx
// src/components/WordByWord.tsx
import { interpolate, useCurrentFrame } from 'remotion';
import { Ease } from '../constants/easing';

interface WordByWordProps {
  text: string;
  startFrame?: number;
  wordDelay?: number;    // frames between words, default 2
  wordDuration?: number; // frames per word animation, default 11
  yOffset?: number;      // default 10px
  style?: React.CSSProperties;
}

export const WordByWord: React.FC<WordByWordProps> = ({
  text,
  startFrame = 0,
  wordDelay = 2,
  wordDuration = 11,
  yOffset = 10,
  style,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');

  return (
    <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap', ...style }}>
      {words.map((word, i) => {
        const delay = startFrame + i * wordDelay;
        const progress = interpolate(frame - delay, [0, wordDuration], [0, 1], {
          clamp: true,
          easing: Ease.smooth,
        });

        return (
          <span
            key={i}
            style={{
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [yOffset, 0])}px)`,
              display: 'inline-block',
              willChange: 'transform, opacity',
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};
```

**For multi-line headlines, use line-by-line with word-by-word inside each line:**
```tsx
<div>
  <WordByWord text="Business spend." startFrame={12} />
  <WordByWord text="Full control." startFrame={18} />  {/* 6-frame line delay */}
</div>
```

---

## 7. Principle: Graph and Line Draw Animation

Graph lines must draw themselves using `stroke-dashoffset`. The line should feel confident and smooth — not mechanical. Accompany the draw with a soft glow at the draw head.

```tsx
// src/components/AnimatedGraph.tsx
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { Ease } from '../constants/easing';

interface AnimatedGraphProps {
  pathD: string;              // SVG path d attribute
  pathLength: number;         // pre-measured path length in px
  startFrame?: number;
  duration?: number;          // default 22 frames
  strokeColor?: string;
  strokeWidth?: number;
  glowColor?: string;
  fillColor?: string;         // area fill beneath line
  width: number;
  height: number;
}

export const AnimatedGraph: React.FC<AnimatedGraphProps> = ({
  pathD,
  pathLength,
  startFrame = 0,
  duration = 22,
  strokeColor = '#245FFF',
  strokeWidth = 2,
  glowColor = '#245FFF',
  fillColor = 'rgba(36, 95, 255, 0.08)',
  width,
  height,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
    clamp: true,
    easing: Ease.smooth,
  });

  const dashOffset = interpolate(progress, [0, 1], [pathLength, 0]);

  // Area fill fades in at 40% of draw progress
  const fillOpacity = interpolate(progress, [0.4, 1], [0, 1], { clamp: true });

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <defs>
        {/* Glow filter for draw head */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Clip path for area fill */}
        <clipPath id="graph-clip">
          <path d={pathD} />
        </clipPath>
      </defs>

      {/* Area fill */}
      <path
        d={pathD}
        fill={fillColor}
        opacity={fillOpacity}
        style={{ transition: 'none' }}
      />

      {/* Main line draw */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${glowColor}40)` }}
      />
    </svg>
  );
};
```

**Getting pathLength:** Measure it once on mount using a ref:
```tsx
const pathRef = useRef<SVGPathElement>(null);
const [len, setLen] = useState(0);
useEffect(() => {
  if (pathRef.current) setLen(pathRef.current.getTotalLength());
}, []);
```

---

## 8. Principle: Depth and Parallax

Professional motion creates spatial depth. Multiple elements on screen must not move at the same speed.

Rules:
- Background elements animate at **60% the speed** of foreground elements
- Floating cards use CSS `perspective: 1000px` on parent
- `rotateX` and `rotateY` on cards: **maximum 8–12 degrees**
- Shadow depth animates with Y position — as element rises, shadow spreads and softens
- Use `will-change: transform` and `backface-visibility: hidden` for GPU acceleration

```tsx
// Floating card with 3D tilt and parallax shadow
const CardFloat: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();

  const riseProgress = interpolate(frame - startFrame, [0, 20], [0, 1], {
    clamp: true,
    easing: Ease.smooth,
  });

  const yPos = interpolate(riseProgress, [0, 1], [40, 0]);

  // Subtle ambient float after arrival
  const floatProgress = interpolate(
    frame - (startFrame + 20),
    [0, 48, 96],
    [0, 1, 0],
    { clamp: true, easing: Ease.linear }
  );
  const ambientY = interpolate(floatProgress, [0, 1], [0, -6]);

  // 3D tilt
  const rotateX = interpolate(riseProgress, [0, 1], [12, 3]);
  const rotateY = interpolate(riseProgress, [0, 1], [-8, -4]);

  // Shadow: soft and spread when card is high, tight when low
  const shadowBlur = interpolate(riseProgress, [0, 1], [8, 40]);
  const shadowOpacity = interpolate(riseProgress, [0, 1], [0.1, 0.35]);

  return (
    <div style={{ perspective: 1000 }}>
      <div style={{
        transform: `translateY(${yPos + ambientY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        boxShadow: `0 ${shadowBlur}px ${shadowBlur * 2}px rgba(0,0,0,${shadowOpacity})`,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}>
        {/* Card SVG here */}
      </div>
    </div>
  );
};
```

---

## 9. Shimmer / Gloss Pass

For card surfaces, animate a gloss sweep using a moving linear gradient overlay.

```tsx
const GlossPass: React.FC<{ startFrame: number; width: number; height: number }> = ({
  startFrame, width, height,
}) => {
  const frame = useCurrentFrame();

  const glossProgress = interpolate(frame - startFrame, [0, 18], [0, 1], {
    clamp: true,
    easing: Ease.smooth,
  });

  // Move gradient from -30% to 130% horizontally
  const glossX = interpolate(glossProgress, [0, 1], [-30, 130]);
  const glossOpacity = interpolate(
    glossProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0, 0.12, 0.15, 0.12, 0]
  );

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(105deg, transparent ${glossX - 15}%, rgba(255,255,255,${glossOpacity}) ${glossX}%, transparent ${glossX + 15}%)`,
      borderRadius: 'inherit',
      pointerEvents: 'none',
    }} />
  );
};
```

---

## 10. Full Composition Example

This combines all principles into a complete sequence matching the Endl cards trailer.

```tsx
// src/compositions/CardsTrailer.tsx
import {
  AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate,
} from 'remotion';
import { Ease } from '../constants/easing';
import { WordByWord } from '../components/WordByWord';
import { StaggeredList } from '../components/StaggeredList';
import { MatchCutTransition } from '../components/MatchCutTransition';
import { AnimatedGraph } from '../components/AnimatedGraph';
import { CardFloat } from '../components/CardFloat';
import { UIScreen } from '../components/UIScreen';

export const CardsTrailer: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Scene timing (all in frames at 24fps)
  const CARD_ENTER = 0;
  const SHIMMER_START = 22;
  const TEXT_START = 28;
  const UI_ENTER = 44;
  const HOLD_START = 88;
  const FADE_OUT_START = 112;
  const TOTAL = 144;

  // Global fade out
  const fadeOut = interpolate(frame, [FADE_OUT_START, FADE_OUT_START + 12], [1, 0], {
    clamp: true,
    easing: Ease.exitFast,
  });

  return (
    <AbsoluteFill style={{
      background: '#0A0A0F',
      fontFamily: 'DM Sans',
      opacity: fadeOut,
    }}>

      {/* Card hero — floats in at start */}
      <Sequence from={CARD_ENTER}>
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <CardFloat startFrame={0} shimmerStart={SHIMMER_START - CARD_ENTER} />
        </AbsoluteFill>
      </Sequence>

      {/* Text pairing — word by word */}
      <Sequence from={TEXT_START}>
        <AbsoluteFill style={{
          left: 120, top: 'auto', bottom: 280,
          flexDirection: 'column', gap: 12,
          width: 560,
        }}>
          <WordByWord
            text="Business spend. Full control."
            startFrame={0}
            wordDelay={2}
            style={{ fontSize: 52, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.03em' }}
          />
          <WordByWord
            text="Corporate cards with real-time limits, team controls, and unified visibility."
            startFrame={10}
            wordDelay={1.5}
            wordDuration={10}
            style={{ fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '-0.02em' }}
          />
        </AbsoluteFill>
      </Sequence>

      {/* UI Screen — slides up with staggered rows */}
      <Sequence from={UI_ENTER}>
        <AbsoluteFill style={{ left: 600, top: 100 }}>
          <UIScreen>
            <StaggeredList
              items={transactionRows}
              startFrame={8}
              staggerFrames={2}
              duration={14}
              yOffset={14}
            />
            <AnimatedGraph
              pathD="M 0 80 C 60 70, 120 30, 200 40 S 340 10, 400 20"
              pathLength={420}
              startFrame={16}
              duration={22}
              strokeColor="#245FFF"
              width={420}
              height={100}
            />
          </UIScreen>
        </AbsoluteFill>
      </Sequence>

    </AbsoluteFill>
  );
};
```

---

## 11. Common Mistakes — What NOT to Do

1. **Animating rows top-to-bottom with long delays.** This makes lists feel like loading bars. Always bottom-to-top, 2-frame stagger maximum.

2. **Moving elements off canvas for transitions.** Traveling 960px at 24fps to exit a frame wastes 15+ frames of dead motion. Travel 60px instead.

3. **Using symmetric easing for exits and entrances.** Exit easing peaks at the end (`exitFast`). Enter easing peaks at the start (`enterSnap`). Using the same curve for both removes the match cut feel.

4. **Using `Easing.linear` for visible motion.** Linear motion has no personality. The human eye reads it as mechanical and cheap. Never use it.

5. **Animating full text blocks as single units.** A 6-word headline that fades in as one block wastes the narrative potential of every word. Word-by-word is always the correct choice.

6. **Using `spring` everywhere.** Remotion's `spring` adds natural bounce, which is great for card arrivals and notification pops. It is wrong for UI panels, text, and graph draws, which should feel precise and controlled.

7. **Over-long total composition duration.** If a 5-second composition could tell the same story in 3.5 seconds, the 5-second version is wrong. Cut aggressively. Audiences drop engagement after 3 seconds of non-movement.

8. **Forgetting `will-change: transform`** on animated elements. Without GPU layer promotion, complex animations will stutter during render. Always add `will-change: transform, opacity` to any element with motion.

9. **Not overlapping exit and enter.** A gap between exit end and enter start creates dead air. Always overlap by 3–4 frames so peak velocities of both layers coincide.

10. **Using identical animation duration for elements of different visual weight.** A small icon should animate in 8 frames. A full UI panel should animate in 14 frames. Match duration to element complexity — heavier elements move more slowly and feel more massive.

---

## 12. Remotion Advanced API Reference

**`interpolateColors`** — for smooth brand color transitions:
```tsx
import { interpolateColors } from 'remotion';
const color = interpolateColors(progress, [0, 1], ['#245FFF', '#885BF0']);
```

**`measureSpring`** — calculate spring endpoint before composing stagger:
```tsx
import { measureSpring, spring } from 'remotion';
const finalValue = measureSpring({ fps: 24, config: { damping: 14 } });
```

**`<Freeze>`** — hold a frame during transition overlap:
```tsx
import { Freeze } from 'remotion';
<Freeze frame={48}><UIScreen /></Freeze>
```

**`<OffthreadVideo>`** — embed screen recordings frame-accurately:
```tsx
import { OffthreadVideo, staticFile } from 'remotion';
<OffthreadVideo src={staticFile('dashboard-recording.mp4')} startFrom={24} endAt={120} />
```

**`delayRender` / `continueRender`** — block render until assets are loaded:
```tsx
const handle = delayRender('Loading SVG card asset');
fetch(staticFile('endl-card.svg')).then(() => continueRender(handle));
```
