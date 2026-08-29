---
name: remotion-text-animation
description: >
  Professional After Effects-grade text animation system for Remotion. Use this skill whenever any text needs to be animated in a Remotion composition — headlines, sublines, stats, CTAs, UI labels, long sentences, or typed input. Triggers on: "animate text", "text animation", "word by word", "character animation", "typewriter", "scramble text", "blur in", "fade up words", "tracking animation", "text reveal", "line wipe", "kinetic text", "typing effect", "text entrance". This skill must be read before writing any text animation code. It defines the full system: when to use each animation style, how to implement it exactly, and what the professional AE equivalent is. Do not animate text without consulting this skill — the difference between a rigid coded look and a crafted motion design result lives entirely in these details.
---

# Remotion Text Animation Skill

## Philosophy

In After Effects, text animation is not a single tool — it is a system of per-character properties: position, opacity, blur, tracking (letter-spacing), rotation, and scale. Each can be animated independently per character using range selectors and staggered offsets. What makes AE text animation feel professional is that these properties are combined and staggered at sub-frame precision across characters and words simultaneously, not sequentially. The result never reads as "text appearing" — it reads as "text arriving."

The goal in Remotion is identical. Every text animation must feel like it was built in AE. This means:
- Never animate a whole block as one unit
- Always stagger at the character or word level
- Always combine at least two properties (e.g. Y + opacity, blur + scale, tracking + opacity)
- Always use a non-linear easing that peaks either at start or end depending on direction
- Speed is always faster than feels natural — the brain fills in the gap

---

## Decision Map — Which Animation to Use

Before writing any text animation code, identify the text role and choose the correct style. Using the wrong style for the content type is the most common mistake.

| Text Type | Correct Animation Style |
|---|---|
| Hero headline (1–5 words, large) | Word Fade-Up or Scale Punch |
| Subline / supporting copy (1 line) | Word Fade-Up, slightly slower |
| Multi-line body copy | Line-by-line Fade-Up, staggered |
| Stat or number reveal | Tracking Expand or Scale Punch |
| Technical label / UI tag | Blur Dissolve per character |
| Brand name / logo type | Tracking Compress or Line Wipe |
| Long explanatory sentence (10+ words) | Character Typewriter (fast) |
| Terminal / code / prompt input | Character Typewriter with cursor |
| Data decode / crypto / tech accent | Scramble Decode |
| CTA button label | Fade-Up single word, no stagger |
| Transition headline (replaces previous) | Tracking Expand out → new Tracking Compress in |

**Rule:** When in doubt between two styles, choose the one with fewer moving parts. Complexity does not equal quality.

---

## Easing Constants (import from easing.ts)

```ts
import { Easing } from 'remotion';

export const TextEase = {
  // Standard word/line entrance — smooth deceleration
  fadeUp: Easing.bezier(0.57, 0.01, 0, 0.99),

  // Character entrance — fast snap with soft tail
  charSnap: Easing.bezier(0.03, 0.61, 0, 0.99),

  // Overshoot settle — scale punch, stat reveals
  overshoot: Easing.bezier(0.34, 1.56, 0.64, 1),

  // Tracking expand — letters spreading outward
  trackExpand: Easing.bezier(0.25, 0, 0.3, 1),

  // Exit fast — text leaving frame
  exitFast: Easing.bezier(1, 0, 0.93, 0.46),
};
```

---

## Animation 1 — Word Fade-Up

**AE equivalent:** Text Animator with Position (Y) + Opacity, Range Selector with Offset keyframes, Ease High 75%.

**Use for:** Hero headlines, sublines, supporting copy. The workhorse of premium motion design. Every word enters from a Y offset of 10–16px below, fading from 0 to 1. Stagger between words is 1.5–2 frames. The whole headline resolves in under 22 frames.

**What makes it not look coded:** The Y offset is small (not 40px — that is amateur). The easing decelerates sharply. Words overlap in their animations by 30–40% — word 2 starts before word 1 is finished. This overlap is what removes the "typewriter" feel.

```tsx
// src/components/text/WordFadeUp.tsx
import { interpolate, useCurrentFrame } from 'remotion';
import { TextEase } from '../../constants/easing';

interface WordFadeUpProps {
  text: string;
  startFrame?: number;
  wordDelay?: number;       // frames between word starts, default 2
  wordDuration?: number;    // frames per word, default 11
  yOffset?: number;         // px, default 12
  style?: React.CSSProperties;
  characterMode?: boolean;  // true = per-character instead of per-word
  charDelay?: number;       // frames between chars if characterMode, default 1
}

export const WordFadeUp: React.FC<WordFadeUpProps> = ({
  text,
  startFrame = 0,
  wordDelay = 2,
  wordDuration = 11,
  yOffset = 12,
  style,
  characterMode = false,
  charDelay = 1,
}) => {
  const frame = useCurrentFrame();
  const units = characterMode ? text.split('') : text.split(' ');
  const delay = characterMode ? charDelay : wordDelay;

  return (
    <span style={{ display: 'flex', flexWrap: 'wrap', gap: characterMode ? 0 : 8, ...style }}>
      {units.map((unit, i) => {
        const unitStart = startFrame + i * delay;
        const progress = interpolate(frame - unitStart, [0, wordDuration], [0, 1], {
          clamp: true,
          easing: TextEase.fadeUp,
        });

        return (
          <span
            key={i}
            style={{
              opacity: progress,
              transform: `translateY(${interpolate(progress, [0, 1], [yOffset, 0])}px)`,
              display: 'inline-block',
              whiteSpace: unit === ' ' ? 'pre' : 'normal',
              willChange: 'transform, opacity',
            }}
          >
            {unit === '' ? '\u00A0' : unit}
          </span>
        );
      })}
    </span>
  );
};
```

**Usage:**
```tsx
// Hero headline
<WordFadeUp
  text="Business spend. Full control."
  startFrame={12}
  wordDelay={2}
  yOffset={12}
  style={{ fontSize: 64, fontWeight: 600, color: '#fff', letterSpacing: '-0.03em' }}
/>

// Subline — slightly slower, smaller offset
<WordFadeUp
  text="Corporate cards with real-time limits and unified visibility."
  startFrame={20}
  wordDelay={1.5}
  wordDuration={10}
  yOffset={8}
  style={{ fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}
/>
```

---

## Animation 2 — Blur Dissolve (Directional)

**AE equivalent:** Text Animator with Blur + Opacity + Position, per-character, Range Selector sweep. The blur collapses to sharp as the character arrives — gives the impression the character travelled at speed and decelerated into focus.

**Use for:** Technical labels, UI tags, secondary data, brand names on dark backgrounds, crypto/stablecoin labels. More precise and editorial than fade-up. Feels expensive.

**What makes it not look coded:** The blur direction matches the arrival direction. Characters arriving from below have vertical blur. Characters arriving horizontally have horizontal blur. The blur resolves 30% before full opacity — blur snaps to sharp before the character fully appears.

```tsx
// src/components/text/BlurDissolve.tsx
import { interpolate, useCurrentFrame } from 'remotion';
import { TextEase } from '../../constants/easing';

interface BlurDissolveProps {
  text: string;
  startFrame?: number;
  charDelay?: number;      // frames between characters, default 1.5
  charDuration?: number;   // default 12
  blurPeak?: number;       // max blur in px, default 6
  direction?: 'up' | 'horizontal' | 'none';
  yOffset?: number;        // only used with 'up' direction, default 8
  style?: React.CSSProperties;
}

export const BlurDissolve: React.FC<BlurDissolveProps> = ({
  text,
  startFrame = 0,
  charDelay = 1.5,
  charDuration = 12,
  blurPeak = 6,
  direction = 'up',
  yOffset = 8,
  style,
}) => {
  const frame = useCurrentFrame();
  const chars = text.split('');

  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', ...style }}>
      {chars.map((char, i) => {
        const charStart = startFrame + i * charDelay;
        const progress = interpolate(frame - charStart, [0, charDuration], [0, 1], {
          clamp: true,
          easing: TextEase.charSnap,
        });

        // Blur resolves faster than opacity — snaps sharp before fully visible
        const blurProgress = interpolate(frame - charStart, [0, charDuration * 0.7], [0, 1], {
          clamp: true,
          easing: TextEase.charSnap,
        });

        const blur = interpolate(blurProgress, [0, 1], [blurPeak, 0]);
        const blurFilter = direction === 'horizontal'
          ? `blur(${blur}px)`  // uniform blur for horizontal
          : `blur(${blur * 0.3}px)`;  // softer for vertical

        const y = direction === 'up'
          ? interpolate(progress, [0, 1], [yOffset, 0])
          : 0;

        return (
          <span
            key={i}
            style={{
              opacity: progress,
              transform: `translateY(${y}px)`,
              filter: blurFilter,
              display: 'inline-block',
              whiteSpace: char === ' ' ? 'pre' : 'normal',
              willChange: 'transform, opacity, filter',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </span>
  );
};
```

**Usage:**
```tsx
// UI label — fast blur per character
<BlurDissolve
  text="USD Balance"
  startFrame={18}
  charDelay={1}
  charDuration={10}
  blurPeak={8}
  direction="up"
  style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
/>

// Brand name — horizontal blur, all chars near-simultaneously
<BlurDissolve
  text="endl"
  startFrame={0}
  charDelay={2}
  charDuration={14}
  blurPeak={12}
  direction="horizontal"
  style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-0.04em' }}
/>
```

---

## Animation 3 — Tracking Expand / Compress

**AE equivalent:** Text Animator with Tracking Amount. Tracking starts compressed (negative) or expanded (positive) and animates to normal spacing. Often combined with opacity.

**Use for:** Brand names revealing themselves, stat numbers expanding into place, section titles landing with authority. Tracking animations feel designed — they reference print and typography, not just motion.

**Two modes:**
- **Expand in:** Tracking starts at -60% (compressed, letters touching), expands to 0. Used for entrances. Feels like the word is breathing out.
- **Compress in:** Tracking starts at +200% (letters far apart), compresses to 0. Used for dramatic arrivals. Feels like scattered letters assembling.

```tsx
// src/components/text/TrackingReveal.tsx
import { interpolate, useCurrentFrame } from 'remotion';
import { TextEase } from '../../constants/easing';

interface TrackingRevealProps {
  text: string;
  startFrame?: number;
  duration?: number;          // default 18 frames
  mode?: 'expand' | 'compress';
  // expand: letters start tight, breathe out to normal
  // compress: letters start scattered, pull together
  trackingFrom?: number;      // em units. expand default: -0.08, compress default: 0.4
  style?: React.CSSProperties;
}

export const TrackingReveal: React.FC<TrackingRevealProps> = ({
  text,
  startFrame = 0,
  duration = 18,
  mode = 'expand',
  trackingFrom,
  style,
}) => {
  const frame = useCurrentFrame();

  const defaultFrom = mode === 'expand' ? -0.08 : 0.35;
  const from = trackingFrom ?? defaultFrom;

  const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
    clamp: true,
    easing: mode === 'expand' ? TextEase.fadeUp : TextEase.charSnap,
  });

  const letterSpacing = interpolate(progress, [0, 1], [from, 0]);
  const opacity = interpolate(progress, [0, 0.4], [0, 1], { clamp: true });

  return (
    <span style={{
      display: 'inline-block',
      letterSpacing: `${letterSpacing}em`,
      opacity,
      willChange: 'letter-spacing, opacity',
      ...style,
    }}>
      {text}
    </span>
  );
};
```

**Usage:**
```tsx
// Brand name — expand in (breathe out)
<TrackingReveal
  text="endl"
  startFrame={0}
  duration={20}
  mode="expand"
  style={{ fontSize: 52, fontWeight: 600, color: '#245FFF', letterSpacing: '-0.04em' }}
/>

// Stat number — compress in (assemble)
<TrackingReveal
  text="$2.4M"
  startFrame={24}
  duration={16}
  mode="compress"
  style={{ fontSize: 72, fontWeight: 600, color: '#fff' }}
/>
```

---

## Animation 4 — Scale Punch with Overshoot

**AE equivalent:** Text Animator with Scale property, Range Selector with Ease High + Ease Low set to 50%. Characters scale from 115–120% down to 100% with overshoot that settles.

**Use for:** Impact words, stats, bold claims, accent words in a sentence ("faster", "one", "zero"). Single words or short phrases only. Never use on body copy.

**What makes it not look coded:** The overshoot. Scale goes to 100% but briefly overshoots to 97% before settling at 100%. This is the `overshoot` easing doing its job. Without it, it just looks like a zoom. With it, it feels physical — like the word has mass.

```tsx
// src/components/text/ScalePunch.tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { TextEase } from '../../constants/easing';

interface ScalePunchProps {
  text: string;
  startFrame?: number;
  wordDelay?: number;      // stagger between words, default 3
  scaleFrom?: number;      // default 1.18
  style?: React.CSSProperties;
}

export const ScalePunch: React.FC<ScalePunchProps> = ({
  text,
  startFrame = 0,
  wordDelay = 3,
  scaleFrom = 1.18,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <span style={{ display: 'flex', flexWrap: 'wrap', gap: 10, ...style }}>
      {words.map((word, i) => {
        const wordStart = startFrame + i * wordDelay;

        // Spring gives natural overshoot settle — mass=1, damping=14
        const scaleSpring = spring({
          frame: frame - wordStart,
          fps,
          config: { mass: 0.8, damping: 12, stiffness: 200 },
          from: scaleFrom,
          to: 1.0,
        });

        const opacity = interpolate(frame - wordStart, [0, 6], [0, 1], {
          clamp: true,
          easing: TextEase.charSnap,
        });

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `scale(${scaleSpring})`,
              transformOrigin: 'center bottom',
              opacity,
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

**Usage:**
```tsx
// Impact statement
<ScalePunch
  text="One stack."
  startFrame={36}
  scaleFrom={1.2}
  style={{ fontSize: 80, fontWeight: 600, color: '#fff', letterSpacing: '-0.04em' }}
/>
```

---

## Animation 5 — Line Wipe Reveal (Mask)

**AE equivalent:** Rectangular mask animating its Top or Left edge to reveal text beneath. The text does not move — only the clip region changes. Extremely editorial. Used in financial brand work, luxury product, and tech editorial content.

**Use for:** Premium brand moments, section headlines in editorial layouts, captions that must feel deliberate and precise. The Endl brand aesthetic — minimal, typographic — fits this perfectly.

**Implementation:** Use CSS `clip-path` with `inset()` animating its edges. The text sits static. The clip region opens either upward or left-to-right.

```tsx
// src/components/text/LineWipe.tsx
import { interpolate, useCurrentFrame } from 'remotion';
import { TextEase } from '../../constants/easing';

interface LineWipeProps {
  text: string;
  startFrame?: number;
  duration?: number;         // default 14 frames
  direction?: 'up' | 'right';
  lineDelay?: number;        // delay between multiple lines, default 4
  lines?: string[];          // use instead of text for multi-line wipe
  style?: React.CSSProperties;
}

export const LineWipe: React.FC<LineWipeProps> = ({
  text,
  startFrame = 0,
  duration = 14,
  direction = 'up',
  lineDelay = 4,
  lines,
  style,
}) => {
  const frame = useCurrentFrame();
  const allLines = lines ?? [text];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, ...style }}>
      {allLines.map((line, i) => {
        const lineStart = startFrame + i * lineDelay;
        const progress = interpolate(frame - lineStart, [0, duration], [0, 1], {
          clamp: true,
          easing: TextEase.fadeUp,
        });

        // clip-path inset: top right bottom left
        // direction 'up': inset top goes from 100% to 0 (reveals upward)
        // direction 'right': inset left goes from 0%, right goes from 100% to 0
        const clipPath = direction === 'up'
          ? `inset(${interpolate(progress, [0, 1], [100, 0])}% 0% 0% 0%)`
          : `inset(0% ${interpolate(progress, [0, 1], [100, 0])}% 0% 0%)`;

        return (
          <div key={i} style={{ overflow: 'hidden', lineHeight: 1.15 }}>
            <div style={{
              clipPath,
              willChange: 'clip-path',
            }}>
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};
```

**Usage:**
```tsx
// Single editorial headline
<LineWipe
  text="Modern operators deserve modern infrastructure."
  startFrame={20}
  duration={16}
  direction="up"
  style={{ fontSize: 36, fontWeight: 600, color: '#fff', letterSpacing: '-0.025em' }}
/>

// Multi-line staggered wipe
<LineWipe
  lines={['Revenue is not', 'the same as usable capital.']}
  startFrame={8}
  duration={14}
  lineDelay={5}
  direction="up"
  style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-0.03em' }}
/>
```

---

## Animation 6 — Character Typewriter (Fast)

**AE equivalent:** Source Text expression or text animator with character offset + range selector sweeping from 0% to 100% offset. Used for long explanatory sentences, terminal input, form fields, prompt text.

**Use for:** Long sentences (10+ words) that would take too long to fade-up word by word. Typed text for UI demo scenes (search bars, input fields, prompts). Terminal or code input. The key distinction from a generic typewriter effect: **it runs very fast** — the entire sentence types in 18–28 frames. It should read as "someone typed this quickly," not "someone typed this slowly for dramatic effect."

**Cursor:** A blinking pipe character `|` that sits after the last typed character and blinks after typing completes.

```tsx
// src/components/text/CharTypewriter.tsx
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

interface CharTypewriterProps {
  text: string;
  startFrame?: number;
  totalDuration?: number;    // total frames to type full text, default 24
  showCursor?: boolean;      // default true
  cursorChar?: string;       // default '|'
  cursorBlinkRate?: number;  // frames per blink cycle, default 14
  style?: React.CSSProperties;
  cursorStyle?: React.CSSProperties;
}

export const CharTypewriter: React.FC<CharTypewriterProps> = ({
  text,
  startFrame = 0,
  totalDuration = 24,
  showCursor = true,
  cursorChar = '|',
  cursorBlinkRate = 14,
  style,
  cursorStyle,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  if (elapsed < 0) return null;

  // How many characters are visible
  const charsVisible = Math.min(
    text.length,
    Math.floor(interpolate(elapsed, [0, totalDuration], [0, text.length], { clamp: true }))
  );

  const isTypingComplete = charsVisible >= text.length;

  // Cursor blinks only after typing is done
  const cursorOpacity = !showCursor
    ? 0
    : isTypingComplete
      ? Math.sin((elapsed / cursorBlinkRate) * Math.PI) > 0 ? 1 : 0
      : 1; // solid during typing

  return (
    <span style={style}>
      {text.slice(0, charsVisible)}
      {showCursor && (
        <span style={{
          opacity: cursorOpacity,
          color: 'inherit',
          fontWeight: 300,
          marginLeft: 1,
          ...cursorStyle,
        }}>
          {cursorChar}
        </span>
      )}
    </span>
  );
};
```

**Usage:**
```tsx
// Fast explanatory sentence
<CharTypewriter
  text="Sending $24,000 to Supplier in Mexico..."
  startFrame={20}
  totalDuration={22}
  showCursor={true}
  style={{ fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Mono, monospace' }}
/>

// Search/input field simulation
<CharTypewriter
  text="New York → Dubai"
  startFrame={36}
  totalDuration={18}
  showCursor={true}
  cursorStyle={{ color: '#245FFF' }}
  style={{ fontSize: 24, fontWeight: 500, color: '#fff' }}
/>
```

---

## Animation 7 — Scramble Decode

**AE equivalent:** Text Animator with Character Offset + Expression Selector using `Math.random()` to cycle through random glyphs before resolving. Standard in tech brand work and used extensively in crypto/data-heavy content.

**Use for:** Technical accent words, hash/address display, stablecoin labels, security or verification UI, any context where "data resolving" is the narrative. Fits Endl's stablecoin surface and any KYC/verification screen.

**Detail:** Characters cycle through glyphs from a pool (numbers, uppercase letters, special chars) before snapping to the correct character. Each character resolves left to right with a 1–2 frame stagger. Resolution is fast — full decode in 18–24 frames total.

```tsx
// src/components/text/ScrambleDecode.tsx
import { useCurrentFrame } from 'remotion';

const GLYPH_POOL = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&';

interface ScrambleDecodeProps {
  text: string;
  startFrame?: number;
  totalDuration?: number;    // frames to fully resolve all chars, default 20
  charDelay?: number;        // stagger between char resolutions, default 1.5
  glyphCycleRate?: number;   // frames per glyph swap during scramble, default 2
  style?: React.CSSProperties;
}

// Seeded pseudo-random to keep glyphs stable per frame (no jitter)
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const ScrambleDecode: React.FC<ScrambleDecodeProps> = ({
  text,
  startFrame = 0,
  totalDuration = 20,
  charDelay = 1.5,
  glyphCycleRate = 2,
  style,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  if (elapsed < 0) return <span style={style}>{'\u00A0'.repeat(text.length)}</span>;

  const rendered = text.split('').map((targetChar, i) => {
    const charResolveFrame = i * charDelay;
    const charElapsed = elapsed - charResolveFrame;

    if (charElapsed >= totalDuration / text.length * (i + 1)) {
      // Resolved — show correct character
      return targetChar;
    } else if (charElapsed > 0 && targetChar !== ' ') {
      // Scrambling — show random glyph from pool
      const seed = Math.floor(charElapsed / glyphCycleRate) + i * 37;
      const glyphIndex = Math.floor(seededRandom(seed) * GLYPH_POOL.length);
      return GLYPH_POOL[glyphIndex];
    } else {
      // Not yet started
      return targetChar === ' ' ? '\u00A0' : '·';
    }
  });

  return (
    <span style={{
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '0.04em',
      ...style,
    }}>
      {rendered.join('')}
    </span>
  );
};
```

**Usage:**
```tsx
// Stablecoin address
<ScrambleDecode
  text="0x4A9f...3Bc2"
  startFrame={12}
  totalDuration={18}
  glyphCycleRate={2}
  style={{ fontSize: 14, fontWeight: 500, color: '#885BF0', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em' }}
/>

// Status label decode
<ScrambleDecode
  text="VERIFIED"
  startFrame={24}
  totalDuration={16}
  charDelay={2}
  style={{ fontSize: 11, fontWeight: 600, color: '#1E8E56', letterSpacing: '0.12em' }}
/>
```

---

## Animation 8 — Counter / Number Roll

**AE equivalent:** Source Text expression with `Math.round(linear(time, inPoint, outPoint, startVal, endVal))`. Used for animating statistics, balances, transaction counts, currency values.

**Use for:** Dashboard balance displays, stat callouts, growth numbers. Combine with ScalePunch entrance for maximum impact.

```tsx
// src/components/text/NumberRoll.tsx
import { interpolate, useCurrentFrame } from 'remotion';
import { TextEase } from '../../constants/easing';

interface NumberRollProps {
  from: number;
  to: number;
  startFrame?: number;
  duration?: number;        // default 20 frames
  prefix?: string;          // e.g. '$', '€'
  suffix?: string;          // e.g. 'K', 'M', '%'
  decimals?: number;        // decimal places, default 0
  separator?: string;       // thousands separator, default ','
  style?: React.CSSProperties;
}

export const NumberRoll: React.FC<NumberRollProps> = ({
  from,
  to,
  startFrame = 0,
  duration = 20,
  prefix = '',
  suffix = '',
  decimals = 0,
  separator = ',',
  style,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame - startFrame, [0, duration], [0, 1], {
    clamp: true,
    easing: TextEase.fadeUp,
  });

  const value = interpolate(progress, [0, 1], [from, to]);
  const rounded = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();

  // Add thousands separator
  const formatted = rounded.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', ...style }}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
```

**Usage:**
```tsx
// Balance counter
<NumberRoll
  from={0}
  to={248750}
  startFrame={20}
  duration={24}
  prefix="$"
  separator=","
  style={{ fontSize: 56, fontWeight: 600, color: '#fff', letterSpacing: '-0.03em' }}
/>
```

---

## Combining Animations — Composition Patterns

### Pattern A: Hero Moment (Card + Stat)
```tsx
// Large scale punch stat over a card visual
<ScalePunch text="$0 FX fees." startFrame={28} style={{ fontSize: 72, fontWeight: 600 }} />
<WordFadeUp text="Pay anyone, anywhere." startFrame={36} wordDelay={2} style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)' }} />
```

### Pattern B: Dashboard UI Labels
```tsx
// UI element labels — blur dissolve feels designed, not coded
<BlurDissolve text="Total Balance" startFrame={18} charDelay={1} style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }} />
<NumberRoll from={0} to={248750} startFrame={22} prefix="$" style={{ fontSize: 36, fontWeight: 600 }} />
```

### Pattern C: Technical / Stablecoin Surface
```tsx
// Verification or crypto context
<ScrambleDecode text="USDC Settlement" startFrame={12} style={{ fontSize: 16, color: '#885BF0', fontFamily: 'DM Mono, monospace' }} />
<CharTypewriter text="Transaction confirmed in 0.8s" startFrame={28} totalDuration={20} style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} />
```

### Pattern D: Editorial / Brand Statement
```tsx
// Stripped back — line wipe for maximum precision
<LineWipe
  lines={['Your revenue is global.', 'Your banking should be too.']}
  startFrame={12}
  duration={14}
  lineDelay={6}
  style={{ fontSize: 48, fontWeight: 600, letterSpacing: '-0.03em' }}
/>
```

---

## Timing Reference at 24fps

| Animation | Recommended Duration | Notes |
|---|---|---|
| WordFadeUp (4 words) | 18–22f total | 2f stagger, 11f per word |
| WordFadeUp (8 words) | 24–28f total | 1.5f stagger, 10f per word |
| BlurDissolve (6 chars) | 16–20f total | 1.5f per char |
| TrackingReveal | 16–20f | Faster for compress, slower for expand |
| ScalePunch (2 words) | 14–18f | Spring settles naturally |
| LineWipe (1 line) | 12–16f | |
| LineWipe (3 lines, staggered) | 22–28f total | 5f line delay |
| CharTypewriter (10 words) | 20–26f | Never slow — it kills pacing |
| ScrambleDecode (8 chars) | 16–22f | |
| NumberRoll (large number) | 18–24f | |

---

## Common Mistakes

1. **Animating full text blocks as one unit.** A 6-word headline that fades in as a single span looks like a PowerPoint transition. Always split to word or character level.

2. **Y offset too large.** Using `translateY(40px)` makes text look like it fell from above. Use 10–14px maximum. The motion should be a nudge, not a fall.

3. **Too much delay between words.** A 0.2 second (5 frame) gap between words reads as sequential. Use 1.5–2 frames so words overlap their animations — this removes the typewriter feel from fade-up.

4. **Typewriter effect that is too slow.** If a 10-word sentence types in more than 30 frames, it will kill the pacing of the scene. Fast typing = intentional. Slow typing = filler.

5. **Scramble with too many random cycles.** If glyph cycling is too frequent (every frame), it creates visual noise. Use 2-frame glyph swap rate minimum.

6. **Scale punch without overshoot.** Scale from 1.2 → 1.0 with a linear ease looks like a zoom. The `spring` config with slight overshoot is what creates weight and physicality.

7. **Line wipe with text that moves.** The text inside a line wipe must be completely static. The clip-path is the only thing that moves. If the text also translates, the effect collapses.

8. **Mixing too many animation styles in one scene.** One scene should use maximum two text animation styles. More than two reads as indecision.

9. **Not combining properties.** Animating only opacity is a generic fade. Animating only Y is a generic slide. Combining opacity + Y, or blur + Y, or tracking + opacity is what makes text animation feel designed.

10. **Using the same animation for all text hierarchies.** A hero headline, a subline, and a UI label should never use the same animation style. Each text role has a correct animation type — use the decision map.
