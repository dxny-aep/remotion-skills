---
name: remotion-design-qa
description: >
  Senior motion graphic designer's quality assurance brain for Remotion compositions. This skill has override authority over all other skills — it is the final check before any composition is considered complete. Use this skill whenever: reviewing built compositions, checking Figma fidelity, choosing colors when no design reference exists, auditing typography (font size, weight, character spacing), checking layout alignment, deciding parallax Z-depth spacing, or evaluating whether any visual decision meets professional motion design standards. Triggers on: "does this look right", "check the design", "QA", "review", "match the Figma", "color choice", "font looks off", "spacing feels wrong", "is this professional", "senior designer review", "design check", "audit", "too much spacing", "character spacing", "tracking", "alignment", "color pair", "brand color", "feels amateur", "z-depth", "parallax depth", "layer order", "design system". This skill is ALWAYS consulted when building compositions from Figma references. It runs after every other skill and has authority to flag and correct any decision made by remotion-motion, remotion-camera-parallax, remotion-text-animation, or remotion-timeline-planner.
---

# Remotion Design QA Skill

## Authority and Role

This skill is the senior designer in the room. Every other skill is a craftsperson executing their discipline. This skill is the creative director who looks at the assembled result and decides whether it meets the standard. It does not defer to other skills. When this skill flags a violation, that violation is corrected before the composition proceeds.

The standard this skill holds work to: **Linear's product videos. Stripe's launch animations. Brex's motion work. Apple keynote transitions.** Not "looks good for a coded animation." Good enough for a $500/hr motion design studio to ship.

---

## Part 1 — Typography QA

Typography is where the gap between professional and amateur work is most immediately visible. A senior designer can identify poor type settings within 2 seconds of looking at a composition. The following rules are non-negotiable.

### 1.1 — Character Spacing (Tracking) Scale

This is the single most important typographic setting in motion design. Most developers and junior designers ignore it entirely. Every senior designer uses it instinctively.

**The rule:** Larger type requires more negative tracking. Smaller type requires less (or neutral) tracking. Type that ignores this looks unprofessional regardless of how good the animation is.

```
Size      Tracking Range          Notes
────────────────────────────────────────────────────────
8–11px    0 to -0.01em           Body micro / labels — near zero or zero
12–13px   -0.01em to -0.02em     UI labels, captions
14–16px   -0.02em to -0.03em     Body text, nav items
18–24px   -0.03em to -0.04em     Sublines, supporting copy
28–36px   -0.04em to -0.05em     Section headers
40–52px   -0.05em to -0.06em     Display text
56–72px   -0.06em to -0.07em     Hero headlines
80–96px   -0.07em to -0.09em     Large display, statement text
100px+    -0.08em to -0.12em     Giant type / kinetic titles
```

**Why this matters:** At large sizes, default letter spacing was designed for body text and creates visible gaps between characters that read as loose and undesigned. Negative tracking at large sizes pulls characters into proper optical relationship. This is what makes a headline look like it was set by a typographer, not typed into a text field.

**QA check:** For every text element in the composition, verify the `letterSpacing` in the inline style. If a 64px headline has `letterSpacing: 0` or `letterSpacing: 'normal'` — that is a failure. Correct it.

```tsx
// FAIL — 64px headline with no tracking
<h1 style={{ fontSize: 64, fontWeight: 600 }}>Business spend.</h1>

// PASS — 64px headline with correct tracking
<h1 style={{ fontSize: 64, fontWeight: 600, letterSpacing: '-0.05em' }}>Business spend.</h1>
```

### 1.2 — Font Weight Hierarchy

Three tiers maximum per composition. Using more than three weights creates visual noise.

```
Tier 1 — Headlines / Hero text:     600 (SemiBold) or 700 (Bold)
Tier 2 — Body / Supporting copy:    500 (Medium)
Tier 3 — Labels / Captions / Meta:  400 (Regular) or 500 (Medium)
```

**Rule:** Never use 300 (Light) in motion graphics. Light weight at video resolution loses crispness and reads as weak. Never use 800+ (ExtraBold/Black) unless the composition is explicitly aggressive/energetic and client-approved.

**Rule:** Do not mix 600 and 700 in the same text hierarchy unless one is a deliberate accent (e.g., a single word in a sentence punched to 700 for emphasis).

### 1.3 — Line Height

```
Display / Headlines (40px+):    line-height: 1.0 to 1.1
Sublines / Supporting (18–32px): line-height: 1.2 to 1.35
Body copy (14–16px):             line-height: 1.4 to 1.6
UI labels / Tags (10–13px):      line-height: 1.2 to 1.4
```

**QA check:** Any headline with `line-height: 1.5` or default is wrong. Headlines should be tight. The visual gap between lines of a two-line headline should feel intentional, not accidental.

### 1.4 — Font Rendering in Remotion

Always add these properties to text containers to ensure crisp rendering at all scales:

```tsx
{
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  textRendering: 'optimizeLegibility',
}
```

Without these, DM Sans and similar geometric sans-serifs will render with visible hinting artifacts in video output.

---

## Part 2 — Layout and Alignment QA

### 2.1 — Spatial System

All spacing values must come from a consistent spatial scale. Random pixel values (`padding: 13px`, `gap: 22px`) are a junior mistake. Use multiples of 4 (preferred) or 8.

```
4px   — micro spacing (icon to label, tag inner padding)
8px   — small spacing (between inline elements, badge padding)
12px  — compact spacing (nav items, tight lists)
16px  — standard spacing (card padding unit, section gaps)
24px  — medium spacing (component gaps, panel padding)
32px  — large spacing (section separation)
48px  — XL spacing (major layout sections)
64px  — 2XL (full bleed section margins)
```

**QA check:** Read every `padding`, `gap`, `margin`, and positional value in the composition. Any value not on this scale is flagged. Exception: sub-pixel refinements (0.5px border) and percentage-based values.

### 2.2 — Alignment Grid

Every element must align to either:
- The horizontal center axis of the composition (1920/2 = 960px)
- The vertical center axis (1080/2 = 540px)
- A consistent left/right margin (minimum 80px from edge for 1920px canvas)
- A consistent baseline grid derived from the chosen line-height

**Red flags:**
- Elements that are "almost" centered but off by 3–7px (this reads as misalignment, not intentional offset)
- Text that starts at an arbitrary left position with no grid relationship to other elements
- Two panels that appear aligned but differ by 1–2px

### 2.3 — Optical Centering vs. Mathematical Centering

Mathematical center (`50% / translateX(-50%)`) is not always visually center. For elements with visual weight imbalances (e.g., a logo with more detail on one side, a card with a prominent chip), optical centering adds 2–8px correction.

**When to optically adjust:**
- Icons with asymmetric visual weight — shift 2–4px toward the heavier side
- Text with ascenders — shift 1–2px downward (ascenders make text feel higher than its mathematical center)
- Cards with a prominent element on one side — shift 4–8px toward that element

---

## Part 3 — Figma Fidelity QA

When a Figma reference exists, this skill runs a structured comparison. The goal is not pixel-perfect reproduction (video rendering has different constraints than browser rendering) but **visual equivalence** — a viewer familiar with the Figma design should immediately recognize the motion graphic as the same product.

### 3.1 — Fidelity Checklist (run in this order)

**1. Background color** — Does the scene background match the Figma frame's background? Check for common drift: `#0A0A0F` becoming `#000000`, `#f9f9f9` becoming `#ffffff`, warm grays becoming cool grays.

**2. Primary brand color** — Is `#245FFF` (or client primary) used exactly, not approximated? `#2460FF` is not `#245FFF`. Pull hex values directly from Figma assets.

**3. Border radius** — Does every card, panel, button, tag match Figma's radius values exactly? This is the most commonly drifted property. A 16px card with `borderRadius: 12` looks wrong even if nothing else does.

**4. Font family** — Is DM Sans loading and rendering? Check fallback: `'DM Sans', sans-serif` not `sans-serif` alone. In Remotion Studio, check that the font is visually loading before approving.

**5. Font size at each hierarchy level** — Compare every text element's font size to Figma. Common drift: body 16px becoming 14px, headline 48px becoming 40px.

**6. Component spacing** — Does the gap between elements match Figma? Check `gap`, `padding`, and positional offsets against the Figma spec.

**7. Icon/asset rendering** — Are Figma asset URLs rendering? Check for broken image fallbacks. Asset URLs from Figma MCP expire in 7 days — flag any composition using assets older than 5 days.

**8. Color in context** — Colors that look right in isolation may look wrong in composition. Check: does the white panel against the gold background read the same contrast as in Figma? Does the blue on white have the same weight?

### 3.2 — Common Figma-to-Remotion Drift Issues

```
Figma value              Common drift in code        Correct action
──────────────────────────────────────────────────────────────────
border-radius: 62px      borderRadius: 16           Exact match: 62
color: #18181b           color: '#000' or '#111'    Exact match: #18181b
padding: 32px 24px       padding: 24                Exact match: '32px 24px'
font-size: 48px          fontSize: 40 or 44         Exact match: 48
letter-spacing: -0.96px  letterSpacing: 0           Fix: '-0.96px' or '-0.02em'
opacity: 0.55            opacity: 0.5               Exact match: 0.55
gap: 11.357px            gap: 11                    Acceptable: 11.357 or 11
```

### 3.3 — Using Screenshot Comparison

When Figma MCP `get_screenshot` is available, use it to perform visual comparison:

1. Get the Figma screenshot of the target node
2. Take a screenshot of the Remotion composition at the equivalent frame
3. Overlay mentally (or describe side-by-side) and identify differences
4. Flag every difference above the threshold of "visible at normal viewing distance"

**Acceptable differences** (do not flag):
- Sub-pixel rendering differences in border-radius
- Font hinting differences between browser and Figma renderer
- Animation state differences (Figma shows static, Remotion shows a frame mid-animation)

**Flag and correct:**
- Wrong background or surface color
- Wrong component size or proportion
- Missing elements (nav items, card rows, labels)
- Wrong border radius (>2px difference)
- Wrong font weight rendering

---

## Part 4 — Color System QA

### 4.1 — When a Figma Reference Exists

Pull colors exclusively from the Figma file. Do not interpret, approximate, or "improve" brand colors. Use the exact hex values returned by `get_design_context`. If a color is referenced as a CSS variable in the Figma output (e.g., `var(--primary, #245FFF)`), use the fallback hex value directly in inline styles.

### 4.2 — When No Figma Reference Exists (Creative Direction)

When building compositions without a Figma reference, use the following color decision framework for modern SaaS motion graphics.

**Step 1 — Identify the brand tier**

| Tier | Description | Background approach |
|---|---|---|
| Enterprise / Fintech | Trust, precision, premium | Deep near-black (`#08080F`–`#0D0D1A`) |
| Growth SaaS | Energy, momentum, modern | Dark with subtle blue tint (`#0A0F1E`) |
| Consumer / Lifestyle | Warmth, accessibility | Warm dark (`#0F0A0A`) or light (`#F8F7F4`) |
| Developer / Technical | Clarity, precision | Pure near-black (`#0A0A0A`) or off-white |

**Step 2 — Choose the primary accent**

The accent color is the single most important color decision. It must:
- Have a minimum contrast ratio of 4.5:1 against the background
- Feel intentional at motion-graphic scale (saturated mid-tones work best)
- Not compete with text (text is white or near-white, accent is color)

```
Color family    Best hex for dark bg    Use case
─────────────────────────────────────────────────────────
Electric Blue   #245FFF                 Fintech, SaaS, trust
Cobalt          #1A4AE8                 More subdued financial
Violet          #885BF0                 Tech, creative, modern
Emerald         #1E8E56                 Growth, sustainability, wealth
Gold/Amber      #C38F42                 Premium, luxury, physical
Coral           #E84040                 Energy, urgency, consumer
Cyan            #00B8D9                 Data, technical, developer
```

**Step 3 — Build the full palette from the accent**

Once the primary accent is chosen, derive the full palette:

```tsx
// Example: Primary Blue #245FFF
const palette = {
  background:     '#0A0A0F',           // near-black, slight blue tint
  surface:        '#111118',           // 1 step lighter than background
  surfaceHover:   '#16161F',           // hover state
  border:         'rgba(255,255,255,0.06)', // subtle white border
  primary:        '#245FFF',           // brand accent
  primaryLight:   '#EDF5FF',           // accent at 5% opacity bg
  primaryGlow:    'rgba(36,95,255,0.15)', // glow effects
  textPrimary:    '#FFFFFF',           // headlines, key data
  textSecondary:  'rgba(255,255,255,0.55)', // body, supporting
  textTertiary:   'rgba(255,255,255,0.30)', // labels, meta
  success:        '#1E8E56',           // positive states
  successLight:   '#E6FCF1',
  warning:        '#E5A520',           // caution states
  warningLight:   '#FCF5E6',
  danger:         '#DC2626',           // error states
};
```

**Step 4 — Text color pairing rules**

```
Background              Text color                   Never use
────────────────────────────────────────────────────────────────────
Dark (#0A0A0F)          Primary: #FFFFFF             Pure black text
                        Secondary: rgba(255,255,255,0.55)
                        Tertiary: rgba(255,255,255,0.30)
                        Accent: brand primary color

Light (#F9F9F9)         Primary: #18181b             Pure white text on light
                        Secondary: #52525b
                        Tertiary: #a1a1aa
                        Accent: brand primary color

Mid-tone (50% surface)  Primary: #FFFFFF (dark bg) or #18181b (light bg)
                        Depends on background luminance
```

**Rule:** Never put colored text (brand accent) on a colored background of similar saturation. The only acceptable colored text on a dark background is the brand accent on `surface` or near-black. Colored text on colored backgrounds creates vibration.

### 4.3 — Color Contrast in Motion

Motion introduces a QA dimension that static design does not have: **color must read correctly at multiple opacity states during animation.** Check:

- Does the text remain readable at 50% opacity during its fade-in?
- Does the primary accent color remain identifiable at the smallest size it appears?
- Do gradients in camera rig backgrounds create unintended color casts on foreground elements?
- At the lightest frame of a fade-out, do elements remain distinguishable from background?

---

## Part 5 — Parallax Z-Depth Spacing

When a composition has parallax layers (using `remotion-camera-parallax`), this skill decides the correct Z-depth separation between objects. The goal: the viewer should perceive genuine depth without the parallax becoming distracting or unrealistic.

### 5.1 — Z-Depth Decision Table

```
Scenario                          Recommended separation
──────────────────────────────────────────────────────────────────
Card floating over dashboard      Card: FOREGROUND (4), Panel: UI_PANEL (2)
                                  → 2 depth layers apart = clear separation

Text headline over UI             Text: OVERLAY (5), UI: UI_PANEL (2)
                                  → 3 layers apart = text clearly foreground

Logo over background gradient     Logo: UI_CARD (3), BG: SURFACE (1)
                                  → 2 layers apart = subtle depth

Multiple UI panels                Front: UI_CARD (3), Back: UI_PANEL (2)
                                  → 1 layer apart = same interface, cohesive

Floating icon over card           Icon: FOREGROUND (4), Card: UI_CARD (3)
                                  → 1 layer apart = close spatial relationship
```

**Rule:** Elements from the same UI component (e.g., card front face and card glow) must be the same depth layer. Elements from different spatial planes must be at least 2 layers apart.

### 5.2 — Visual Z-Separation (scale + blur + opacity)

Beyond the parallax motion offset, visual separation must reinforce depth perception:

```
Depth relationship        Scale diff    Blur on far    Opacity diff
──────────────────────────────────────────────────────────────────────
1 layer apart             0.8%          none           2%
2 layers apart            1.5%          0.3px          4%
3 layers apart            2.5%          0.5px          6%
4+ layers apart           3.5%          0.8px          8%
```

Maximum scale difference between any two elements: 3.5%. More than this breaks the illusion that elements are in the same scene.

### 5.3 — Parallax Intensity by Scene Type

Not all scenes should use maximum parallax intensity. The parallax must serve the narrative.

```
Scene type          Intensity    Reasoning
──────────────────────────────────────────────────────────────────────
Hero card reveal    0.8–1.0      Card is the subject — parallax emphasizes it
Text statement      0.3–0.5      Text is the subject — parallax should not distract
UI dashboard        0.5–0.7      Interface should feel grounded, not floating
Stat callout        0.2–0.4      Focus on number — camera nearly still
CTA close           0.2–0.3      Viewer should read, not be dazzled
```

---

## Part 6 — Motion Design Standards Audit

### 6.1 — The Premium Motion Design Checklist

Run this check against every composition before marking it complete.

**Visual polish:**
- [ ] All text has correct negative tracking per size (Part 1.1)
- [ ] Font weights follow the three-tier hierarchy (Part 1.2)
- [ ] `WebkitFontSmoothing: antialiased` applied to all text containers
- [ ] All spacing values are multiples of 4 (Part 2.1)
- [ ] No element is within 80px of a canvas edge without intentional design reason
- [ ] Background is not pure `#000000` or pure `#FFFFFF` (always off-black/off-white)

**Animation quality:**
- [ ] No visible "pause" between animations (exit and enter overlap at peak velocity)
- [ ] No element uses `Easing.linear` for visible motion
- [ ] Text is never animated as a full block (always word or character level)
- [ ] UI dashboards use Tier 1/2/3 system — not all rows individually animated
- [ ] Every animated element has `willChange: 'transform, opacity'`
- [ ] Composition never has a completely static frame (ambient drift active)

**Figma fidelity (when reference exists):**
- [ ] All background and surface colors match exactly
- [ ] All border-radius values match within 2px
- [ ] All font sizes match exactly
- [ ] All Figma asset URLs are valid (not expired)
- [ ] Component layout matches Figma proportions

**Camera and depth:**
- [ ] Camera anticipates content by 2–4 frames (never reacts)
- [ ] Zoom scale never exceeds 1.08
- [ ] Pan range never exceeds ±20px
- [ ] Parallax layers are correctly separated (minimum 2 depth levels between spatial planes)
- [ ] Z-depth visual separation applied (scale diff + blur + opacity per table in Part 5.2)

### 6.2 — The Senior Designer Eye Test

After the checklist, apply this subjective test. Open the composition and ask each question:

**1. "Does anything feel slow?"**
If yes: find the animation running longest and cut its duration by 25%. Then re-evaluate.

**2. "Does anything feel mechanical?"**
If yes: it is likely using symmetric easing, or a single animated property. Add a second property (Y offset to an opacity fade, blur to a Y translate). Asymmetric combinations remove the mechanical feeling.

**3. "Does the text feel designed or typed?"**
If typed: apply negative tracking. Ensure font weight is correct tier. Ensure line-height is tight on headlines.

**4. "Does the composition feel alive between cuts?"**
If no: AmbientDrift is missing or intensity is too low. Increase to 0.8–1.0.

**5. "Does depth feel real?"**
If flat: parallax factor differences between layers are too similar. Increase spread between FOREGROUND and UI_PANEL factors.

**6. "Would a client recognize this as their brand?"**
If uncertain: pull exact hex values from Figma. Check border radius. Check logo placement and sizing. These three things carry brand identity in motion.

### 6.3 — Automatic Failure Conditions

Any of these conditions means the composition fails QA and must be corrected before proceeding:

```
AUTOMATIC FAILURES
──────────────────────────────────────────────────────────────────
1. Pure black (#000000) or pure white (#ffffff) background
2. Any headline above 40px with letterSpacing: 0 or 'normal'
3. Any element using Easing.linear for visible motion
4. Figma brand color approximated rather than exact hex match
5. Font rendering without WebkitFontSmoothing: 'antialiased'
6. All UI rows individually stagger-animated (more than 4 individual rows)
7. Camera starts moving after content enters (reaction, not anticipation)
8. Composition contains a completely static frame longer than 2f
9. Text animated as a single block fade (no word or char splitting)
10. Z-depth layers all at the same parallax factor
```

---

## Part 7 — QA Reporting Format

When this skill audits a composition, output findings in this format before making any corrections:

```
DESIGN QA REPORT — [Composition Name]
Reviewed against: [Figma reference / no reference]
Standard: Senior motion design (Linear / Stripe / Brex tier)

AUTOMATIC FAILURES (correct immediately):
  ✗ [element]: [violation] → [correction]

TYPOGRAPHY:
  ✗ [element] (XXpx): letterSpacing: 0 → should be -0.Xem
  ✗ [element]: fontWeight 400 in headline tier → correct to 600
  ✓ Font family: DM Sans loading correctly

LAYOUT:
  ✗ [element]: padding 13px → correct to 12px (4px grid)
  ✓ Alignment: elements centered correctly

FIGMA FIDELITY:
  ✗ Panel borderRadius: 16 → Figma specifies 62
  ✓ Background color: #d8b171 matches

COLOR:
  ✓ Primary: #245FFF exact match
  ✗ Text secondary: rgba(255,255,255,0.5) → should be 0.55

CAMERA / DEPTH:
  ✗ All parallax layers at factor 1.0 → differentiate per depth table
  ✓ Ambient drift active

ANIMATION:
  ✗ Balance label ($5,500.00): static → NumberRoll from 0
  ✓ Panel entry: correct timing and easing

TOTAL: X failures, Y warnings
Proceeding to correct all failures now.
```

Always output the report first. Then make all corrections. Never silently correct without reporting.
