import React from "react";
import { interpolate } from "remotion";
import { CUBIC, OUT_EXPO } from "../constants/easing";
import { theme } from "../constants/theme";

/**
 * All text animations receive a LOCAL frame — frame 0 is when the animation
 * should start. Callers align with Sequence / by offsetting at the scene level.
 */

/* -------------------- ScalePunch -------------------- */
/** Quick scale+fade arrival. For headline words like "One", "Endl". */
export const ScalePunch: React.FC<{
  text: string;
  frame: number;
  start?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ text, frame, start = 0, duration = 18, style }) => {
  const t = (frame - start) / duration;
  const opacity = interpolate(t, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(t, [0, 1], [1.08, 1.0], {
    easing: OUT_EXPO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(t, [0, 0.5], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
        filter: `blur(${blur}px)`,
        ...style,
      }}
    >
      {text}
    </span>
  );
};

/* -------------------- BlurDissolve -------------------- */
/** Soft blur → focus. For feature words: Send, Receive, Spend, Manage. */
export const BlurDissolve: React.FC<{
  text: string;
  frame: number;
  start?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({ text, frame, start = 0, duration = 20, style }) => {
  const t = (frame - start) / duration;
  const opacity = interpolate(t, [0, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(t, [0, 1], [20, 0], {
    easing: CUBIC,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(t, [0, 1], [14, 0], {
    easing: CUBIC,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${y}px)`,
        filter: `blur(${blur}px)`,
        ...style,
      }}
    >
      {text}
    </span>
  );
};

/* -------------------- TrackingReveal -------------------- */
/** Letter-spacing opens from tight → natural. For taglines. */
export const TrackingReveal: React.FC<{
  text: string;
  frame: number;
  start?: number;
  duration?: number;
  sizePx?: number;
  style?: React.CSSProperties;
}> = ({ text, frame, start = 0, duration = 24, sizePx = 60, style }) => {
  const t = (frame - start) / duration;
  const opacity = interpolate(t, [0, 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Start with very tight tracking, open to the natural tracking for size
  const openFrom = -0.15; // em
  const openTo = parseFloat(theme.typography.tracking(sizePx));
  const tracking = interpolate(t, [0, 1], [openFrom, openTo], {
    easing: CUBIC,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(t, [0, 0.6], [6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        letterSpacing: `${tracking}em`,
        filter: `blur(${blur}px)`,
        ...style,
      }}
    >
      {text}
    </span>
  );
};

/* -------------------- WordFadeUp -------------------- */
/** Word-by-word fade + rise. For multi-word taglines / labels. */
export const WordFadeUp: React.FC<{
  text: string;
  frame: number;
  start?: number;
  perWordStagger?: number;
  perWordDuration?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  frame,
  start = 0,
  perWordStagger = 3,
  perWordDuration = 14,
  style,
}) => {
  const words = text.split(" ");
  return (
    <span style={{ display: "inline-block", ...style }}>
      {words.map((w, i) => {
        const wStart = start + i * perWordStagger;
        const t = (frame - wStart) / perWordDuration;
        const opacity = interpolate(t, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const y = interpolate(t, [0, 1], [12, 0], {
          easing: CUBIC,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={`${w}-${i}`}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${y}px)`,
              marginRight: i < words.length - 1 ? "0.28em" : 0,
            }}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
};

/* -------------------- CharTypewriter -------------------- */
/** Monospace-style typing reveal. For code-like text: account numbers, IBANs. */
export const CharTypewriter: React.FC<{
  text: string;
  frame: number;
  start?: number;
  cps?: number; // chars per second at 24fps = chars per 24 frames
  style?: React.CSSProperties;
}> = ({ text, frame, start = 0, cps = 40, style }) => {
  const framesPerChar = 24 / cps;
  const charsShown = Math.max(
    0,
    Math.min(text.length, Math.floor((frame - start) / framesPerChar))
  );
  const shown = text.slice(0, charsShown);
  const cursorOn = Math.floor(frame / 6) % 2 === 0 && charsShown < text.length;
  return (
    <span style={style}>
      {shown}
      <span
        style={{
          opacity: cursorOn ? 1 : 0,
          marginLeft: 2,
        }}
      >
        ▍
      </span>
    </span>
  );
};

/* -------------------- NumberRoll -------------------- */
/** Counts from "from" to "to" with formatter. For balances, amounts. */
export const NumberRoll: React.FC<{
  from?: number;
  to: number;
  frame: number;
  start?: number;
  duration?: number;
  format?: (n: number) => string;
  style?: React.CSSProperties;
}> = ({
  from = 0,
  to,
  frame,
  start = 0,
  duration = 28,
  format = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 0 }),
  style,
}) => {
  const t = (frame - start) / duration;
  const v = interpolate(t, [0, 1], [from, to], {
    easing: CUBIC,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <span style={style}>{format(v)}</span>;
};

/* -------------------- Helpers -------------------- */
/** Simple fade+rise for rows. */
export const fadeUp = (
  frame: number,
  start: number,
  duration = 14,
  rise = 12
) => {
  const t = (frame - start) / duration;
  const opacity = interpolate(t, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(t, [0, 1], [rise, 0], {
    easing: CUBIC,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    opacity,
    transform: `translateY(${y}px)`,
  } as React.CSSProperties;
};

/** Scale-in arrival for cards. */
export const scaleIn = (
  frame: number,
  start: number,
  duration = 20,
  fromScale = 0.94
) => {
  const t = (frame - start) / duration;
  const opacity = interpolate(t, [0, 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(t, [0, 1], [fromScale, 1], {
    easing: OUT_EXPO,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return {
    opacity,
    transform: `scale(${scale})`,
    transformOrigin: "center",
  } as React.CSSProperties;
};
