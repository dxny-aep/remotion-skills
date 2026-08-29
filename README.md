# remotion-skills

Remotion motion-graphics workspace for the Endl trailer, plus the five Claude Code
skills that encode the motion-design system used to build it.

## Skills

Live in `.claude/skills/`. Read in this order when building a composition:

| Skill | What it governs |
|---|---|
| `remotion-timeline-planner` | Frame budgets, scene order, peak-velocity cut points. Read **first** — a composition without a timeline plan gets rebuilt. |
| `remotion-motion` | Core animation language: easing, stagger, UI-screen choreography. |
| `remotion-text-animation` | Word/character reveals, typewriter, scramble, tracking animation. |
| `remotion-camera-parallax` | Camera drift, z-depth layering, ambient motion between cuts. |
| `remotion-design-qa` | Final gate. Has override authority over the other four. |

They load automatically in Claude Code from this directory.

## Composition

`EndlTrailer` — eight acts, `src/scenes/ActI_Hook.tsx` through `ActVIII_Close.tsx`,
assembled in `src/compositions/EndlTrailer.tsx`.

```
src/
  Root.tsx          composition registry
  scenes/           one file per act
  ui/               Panel, Row, Sidebar, VirtualCard
  primitives/       Camera, Text
  constants/        theme.ts, easing.ts
```

## Running

```bash
npm install
npm start                    # Remotion Studio
npm run build                # render to out/EndlTrailer.mp4
npm run typecheck
```

`out/EndlTrailer.mp4` is the last committed render.
