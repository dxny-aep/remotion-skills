import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CUBIC, IN_OUT_CUBIC, OUT_QUINT } from "../constants/easing";

/**
 * AmbientDrift — per camera-parallax skill.
 * Lissajous micro-movement. Non-harmonic sine frequencies mean the motion
 * never exactly repeats within a reasonable window → reads as "alive".
 * Max offset ±4px, ±0.15° rotation. Subtle enough to not distract, present
 * enough to kill the "AI slideshow" feel.
 */
export const useAmbientDrift = (frame: number) => {
  const x =
    Math.sin(frame * 0.023) * 2.1 +
    Math.cos(frame * 0.041) * 1.3 +
    Math.sin(frame * 0.013) * 0.7;
  const y =
    Math.cos(frame * 0.029) * 2.4 +
    Math.sin(frame * 0.047) * 1.1 +
    Math.cos(frame * 0.011) * 0.6;
  const rot =
    Math.sin(frame * 0.017) * 0.09 + Math.cos(frame * 0.033) * 0.05;
  return { x, y, rot };
};

export type CameraMove =
  | { kind: "hold" }
  | { kind: "pushIn"; from?: number; to?: number; amount?: number }
  | { kind: "pullOut"; from?: number; to?: number; amount?: number }
  | { kind: "drift"; dx?: number; dy?: number }
  | { kind: "orbit"; dx?: number; dy?: number; scale?: number }
  | { kind: "breathe"; amplitude?: number; speed?: number };

interface CameraRigProps {
  move: CameraMove;
  localFrame: number;
  duration: number;
  children: React.ReactNode;
  ambient?: boolean;
}

/**
 * CameraRig — wraps a scene and applies a scene-level camera move on top of
 * global ambient drift. Every scene should use this — even "hold" scenes,
 * because ambient alone is what makes the trailer feel hand-operated.
 */
export const CameraRig: React.FC<CameraRigProps> = ({
  move,
  localFrame,
  duration,
  children,
  ambient = true,
}) => {
  const globalFrame = useCurrentFrame();
  const drift = useAmbientDrift(globalFrame);

  const t = Math.max(0, Math.min(1, localFrame / Math.max(1, duration - 1)));

  let tx = 0;
  let ty = 0;
  let scale = 1;
  let rot = 0;

  switch (move.kind) {
    case "pushIn": {
      const amt = move.amount ?? 0.035; // 3.5% zoom
      scale = interpolate(t, [0, 1], [1, 1 + amt], { easing: IN_OUT_CUBIC });
      break;
    }
    case "pullOut": {
      const amt = move.amount ?? 0.035;
      scale = interpolate(t, [0, 1], [1 + amt, 1], { easing: IN_OUT_CUBIC });
      break;
    }
    case "drift": {
      tx = interpolate(t, [0, 1], [0, move.dx ?? 30], { easing: OUT_QUINT });
      ty = interpolate(t, [0, 1], [0, move.dy ?? -12], { easing: OUT_QUINT });
      break;
    }
    case "orbit": {
      tx = interpolate(t, [0, 1], [move.dx ?? -25, 0], { easing: CUBIC });
      ty = interpolate(t, [0, 1], [move.dy ?? 15, 0], { easing: CUBIC });
      scale = interpolate(t, [0, 1], [1.02, move.scale ?? 1.0], {
        easing: CUBIC,
      });
      break;
    }
    case "breathe": {
      const amp = move.amplitude ?? 0.012;
      const spd = move.speed ?? 0.06;
      scale = 1 + Math.sin(localFrame * spd) * amp;
      break;
    }
    case "hold":
    default:
      break;
  }

  if (ambient) {
    tx += drift.x;
    ty += drift.y;
    rot += drift.rot;
  }

  return (
    <AbsoluteFill
      style={{
        transform: `translate3d(${tx}px, ${ty}px, 0) scale(${scale}) rotate(${rot}deg)`,
        transformOrigin: "center center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * ParallaxLayer — depth factor changes how much ambient drift affects this
 * layer. factor<1 = recedes (background), factor>1 = advances (foreground).
 * Creates depth without any 3D math. Use 3 layers per UI scene:
 *   BG panel/gradient: 0.6-0.75
 *   Main card/content: 1.0
 *   FG chrome (buttons, badges, cursors): 1.12-1.20
 */
export const ParallaxLayer: React.FC<{
  factor?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ factor = 1, children, style }) => {
  const frame = useCurrentFrame();
  const d = useAmbientDrift(frame);
  const f = factor - 1; // 0 at factor=1 (no extra offset)
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate3d(${d.x * f}px, ${d.y * f}px, 0)`,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
