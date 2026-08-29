import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CameraRig, ParallaxLayer } from "../primitives/Camera";
import {
  ScalePunch,
  TrackingReveal,
  WordFadeUp,
} from "../primitives/Text";
import { theme } from "../constants/theme";
import { CUBIC } from "../constants/easing";

/* ================= SCENE 1 — "One" ================= */
export const Scene01_One: React.FC<{ localFrame: number; duration: number }> = ({
  localFrame,
  duration,
}) => {
  const p = theme.scenePalette.white;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "pushIn", amount: 0.02 }}
        localFrame={localFrame}
        duration={duration}
      >
        {/* soft vignette */}
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(11,11,15,0.06) 100%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              fontFamily: theme.typography.fontFamily,
            }}
          >
            <div
              style={{
                fontSize: 220,
                fontWeight: 700,
                letterSpacing: theme.typography.tracking(220),
                color: p.ink,
                lineHeight: 1,
              }}
            >
              <ScalePunch text="One" frame={localFrame} start={2} duration={20} />
            </div>
          </div>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};

/* ================= SCENE 2 — "platform to..." ================= */
export const Scene02_Platform: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.gold;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "drift", dx: -22, dy: 0 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 20% 40%, rgba(255,255,255,0.14), transparent 60%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              fontFamily: theme.typography.fontFamily,
            }}
          >
            <div
              style={{
                fontSize: 148,
                fontWeight: 700,
                letterSpacing: theme.typography.tracking(148),
                color: p.ink,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              <WordFadeUp
                text="platform to…"
                frame={localFrame}
                start={2}
                perWordStagger={6}
                perWordDuration={18}
              />
            </div>
          </div>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};
