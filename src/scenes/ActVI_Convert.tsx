import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CameraRig, ParallaxLayer } from "../primitives/Camera";
import { Panel, Btn } from "../ui/Panel";
import {
  NumberRoll,
  TrackingReveal,
  fadeUp,
} from "../primitives/Text";
import { theme } from "../constants/theme";
import { CUBIC } from "../constants/easing";

/* ============ SCENE 13 — FX Convert UI (Light) ============ */
export const Scene13_ConvertUI: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.light;
  // Rate line animates 0→1
  const lineT = Math.max(0, Math.min(1, (localFrame - 20) / 28));
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "pushIn", amount: 0.03 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 60% 30%, rgba(255,255,255,0.6), transparent 60%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <Panel frame={localFrame} start={0} width={1320} height={520}>
            <div
              style={{
                padding: "34px 40px",
                fontFamily: theme.typography.fontFamily,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 40,
                height: "100%",
              }}
            >
              {/* Left — Form */}
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: theme.colors.ink,
                    ...fadeUp(localFrame, 4, 14, 6),
                  }}
                >
                  FX Calculator
                </div>

                <div
                  style={{
                    marginTop: 22,
                    padding: 22,
                    borderRadius: 16,
                    border: `1px solid ${theme.colors.border}`,
                    ...fadeUp(localFrame, 8, 14, 10),
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: theme.colors.inkMuted,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    You send
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 600,
                        letterSpacing: "-0.03em",
                        color: theme.colors.ink,
                      }}
                    >
                      <NumberRoll
                        from={0}
                        to={1000}
                        frame={localFrame}
                        start={10}
                        duration={28}
                      />
                    </div>
                    <div
                      style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        background: "rgba(11,11,15,0.05)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: theme.colors.ink,
                      }}
                    >
                      USDT
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 14,
                    padding: 22,
                    borderRadius: 16,
                    background: "rgba(36,95,255,0.04)",
                    border: `1px solid rgba(36,95,255,0.15)`,
                    ...fadeUp(localFrame, 14, 14, 10),
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: theme.colors.inkMuted,
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Recipient gets
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 600,
                        letterSpacing: "-0.03em",
                        color: theme.colors.ink,
                      }}
                    >
                      <NumberRoll
                        from={0}
                        to={862}
                        frame={localFrame}
                        start={16}
                        duration={28}
                      />
                    </div>
                    <div
                      style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        background: "rgba(11,11,15,0.05)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: theme.colors.ink,
                      }}
                    >
                      EUR
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Rate chart + breakdown */}
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: theme.colors.inkMuted,
                    fontWeight: 500,
                    ...fadeUp(localFrame, 6, 14, 6),
                  }}
                >
                  Current Exchange Rate
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    color: theme.colors.ink,
                    marginTop: 4,
                    ...fadeUp(localFrame, 8, 14, 8),
                  }}
                >
                  1 USDT = 0.87 EUR
                </div>

                {/* Chart */}
                <div
                  style={{
                    marginTop: 18,
                    height: 180,
                    borderRadius: 16,
                    background: "rgba(11,11,15,0.02)",
                    padding: 18,
                    position: "relative",
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 500 140"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="fxg" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#245FFF" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#245FFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 110 C 60 90, 120 100, 180 80 C 240 60, 300 75, 360 55 C 420 38, 460 50, 500 30"
                      fill="none"
                      stroke="#245FFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="800"
                      strokeDashoffset={800 - 800 * lineT}
                    />
                    <path
                      d="M 0 110 C 60 90, 120 100, 180 80 C 240 60, 300 75, 360 55 C 420 38, 460 50, 500 30 L 500 140 L 0 140 Z"
                      fill="url(#fxg)"
                      opacity={lineT}
                    />
                  </svg>
                </div>

                {/* Fees */}
                <div style={{ marginTop: 20 }}>
                  {[
                    ["Total Charges", "8.00 USDT"],
                    ["Final Amount Received", "862.00 EUR"],
                  ].map(([l, v], i) => (
                    <div
                      key={l}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom:
                          i === 0 ? `1px solid ${theme.colors.border}` : "none",
                        ...fadeUp(localFrame, 24 + i * 3, 14, 6),
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          color: theme.colors.inkMuted,
                          fontWeight: 500,
                        }}
                      >
                        {l}
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: theme.colors.ink,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};

/* ============ SCENE 14 — "Convert" headline (Light) ============ */
export const Scene14_ConvertHero: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.light;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "drift", dx: 24, dy: 0 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 30% 60%, rgba(36,95,255,0.08), transparent 60%)",
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
                fontSize: 200,
                fontWeight: 700,
                letterSpacing: theme.typography.tracking(200),
                color: p.ink,
                lineHeight: 1,
              }}
            >
              <TrackingReveal
                text="Convert"
                frame={localFrame}
                start={2}
                duration={24}
                sizePx={200}
              />
            </div>
          </div>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};
