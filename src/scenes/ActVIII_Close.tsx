import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CameraRig, ParallaxLayer } from "../primitives/Camera";
import {
  TrackingReveal,
  ScalePunch,
  fadeUp,
} from "../primitives/Text";
import { theme } from "../constants/theme";
import { CUBIC, OUT_EXPO } from "../constants/easing";

/* ============ SCENE 18 — "and move money…" (Gold) ============ */
export const Scene18_MoveMoney: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.gold;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "drift", dx: 0, dy: -24 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.72}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.15), transparent 60%)",
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
                fontSize: 132,
                fontWeight: 700,
                letterSpacing: theme.typography.tracking(132),
                color: p.ink,
                lineHeight: 1,
                textAlign: "center",
              }}
            >
              <TrackingReveal
                text="and move money…"
                frame={localFrame}
                start={2}
                duration={28}
                sizePx={132}
              />
            </div>
          </div>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};

/* ============ SCENE 19 — Endl + Product Hunt CTA (Blue) ============ */
export const Scene19_EndlCTA: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.blue;

  // logo scale punch
  const logoT = Math.max(0, Math.min(1, localFrame / 18));
  const logoScale = interpolate(logoT, [0, 1], [0.88, 1.0], {
    easing: OUT_EXPO,
  });
  const logoOpacity = interpolate(logoT, [0, 1], [0, 1]);

  // shimmer sweep on word "Endl"
  const shimmerX = interpolate(localFrame, [24, 56], [-120, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // PH card slide up
  const phT = Math.max(0, Math.min(1, (localFrame - 36) / 24));
  const phY = interpolate(phT, [0, 1], [60, 0], { easing: CUBIC });
  const phOpacity = interpolate(phT, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "breathe", amplitude: 0.01, speed: 0.08 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(255,255,255,0.18), transparent 55%)",
            }}
          />
        </ParallaxLayer>

        {/* Endl word */}
        <ParallaxLayer factor={1.0}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: theme.typography.fontFamily,
              gap: 60,
            }}
          >
            {/* Wordmark with mark */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                opacity: logoOpacity,
                transform: `scale(${logoScale})`,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 30,
                  background: theme.colors.white,
                  display: "grid",
                  placeItems: "center",
                  boxShadow: "0 20px 60px rgba(10,10,15,0.25)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 36,
                    background: theme.colors.primaryBlue,
                    borderRadius: 4,
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  fontSize: 220,
                  fontWeight: 700,
                  letterSpacing: theme.typography.tracking(220),
                  color: theme.colors.white,
                  lineHeight: 0.9,
                  overflow: "hidden",
                }}
              >
                endl
                {/* shimmer */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: `${shimmerX}px`,
                    width: 80,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                    mixBlendMode: "overlay",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* PH Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "18px 26px",
                borderRadius: 22,
                background: theme.colors.white,
                color: theme.colors.ink,
                boxShadow: "0 20px 60px rgba(10,10,15,0.3)",
                transform: `translateY(${phY}px)`,
                opacity: phOpacity,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "#DA552F",
                  color: theme.colors.white,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                P
              </div>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: theme.colors.inkMuted,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Now live on
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: theme.colors.ink,
                    marginTop: 2,
                  }}
                >
                  Product Hunt
                </div>
              </div>
            </div>
          </div>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};
