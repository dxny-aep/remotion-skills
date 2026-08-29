import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CameraRig, ParallaxLayer } from "../primitives/Camera";
import { Panel, Btn } from "../ui/Panel";
import {
  BlurDissolve,
  NumberRoll,
  fadeUp,
  scaleIn,
} from "../primitives/Text";
import { theme } from "../constants/theme";
import { CUBIC } from "../constants/easing";

/* ============ SCENE 4 — You Send / Recipient Gets (Blue) ============ */
export const Scene04_SendForm: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.blue;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "pushIn", amount: 0.04 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.72}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.18), transparent 55%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <Panel frame={localFrame} start={0} width={820} height={720}>
            <div
              style={{
                padding: 44,
                fontFamily: theme.typography.fontFamily,
                height: "100%",
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: theme.colors.ink,
                  ...fadeUp(localFrame, 8, 14, 6),
                }}
              >
                Send money
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: theme.colors.inkMuted,
                  marginTop: 6,
                  ...fadeUp(localFrame, 10, 14, 6),
                }}
              >
                Step 1 — Amount
              </div>

              {/* You Send */}
              <div
                style={{
                  marginTop: 36,
                  padding: 24,
                  borderRadius: 18,
                  border: `1px solid ${theme.colors.border}`,
                  ...fadeUp(localFrame, 14, 16, 12),
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: theme.colors.inkMuted,
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    textTransform: "uppercase",
                  }}
                >
                  You send
                </div>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontSize: 44,
                      fontWeight: 600,
                      letterSpacing: "-0.035em",
                      color: theme.colors.ink,
                    }}
                  >
                    <NumberRoll
                      from={0}
                      to={1000}
                      frame={localFrame}
                      start={16}
                      duration={28}
                      format={(n) =>
                        n.toLocaleString("en-US", { maximumFractionDigits: 0 })
                      }
                    />
                    <span style={{ opacity: 0.4 }}>.00</span>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: 999,
                      background: "rgba(11,11,15,0.05)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: theme.colors.ink,
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#22C55E",
                      }}
                    />
                    USDT
                  </div>
                </div>
              </div>

              {/* divider arrow */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 12,
                  ...fadeUp(localFrame, 22, 14, 4),
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: theme.colors.ink,
                    color: theme.colors.white,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 16,
                  }}
                >
                  ↓
                </div>
              </div>

              {/* Recipient Gets */}
              <div
                style={{
                  marginTop: 12,
                  padding: 24,
                  borderRadius: 18,
                  border: `1px solid ${theme.colors.border}`,
                  background: "rgba(36,95,255,0.04)",
                  ...fadeUp(localFrame, 26, 16, 12),
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: theme.colors.inkMuted,
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    textTransform: "uppercase",
                  }}
                >
                  Recipient gets
                </div>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      fontSize: 44,
                      fontWeight: 600,
                      letterSpacing: "-0.035em",
                      color: theme.colors.ink,
                    }}
                  >
                    <NumberRoll
                      from={0}
                      to={862}
                      frame={localFrame}
                      start={28}
                      duration={28}
                      format={(n) =>
                        n.toLocaleString("en-US", { maximumFractionDigits: 0 })
                      }
                    />
                    <span style={{ opacity: 0.4 }}>.00</span>
                  </div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 14px",
                      borderRadius: 999,
                      background: "rgba(11,11,15,0.05)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: theme.colors.ink,
                    }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: "#3B82F6",
                      }}
                    />
                    EUR
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  justifyContent: "flex-end",
                  ...fadeUp(localFrame, 40, 14, 8),
                }}
              >
                <Btn label="Continue →" variant="primary" />
              </div>
            </div>
          </Panel>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};

/* ============ SCENE 5 — Review & Pay (Blue) ============ */
export const Scene05_SendReview: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.blue;
  const rows = [
    { l: "You send", v: "1,000.00 USDT" },
    { l: "Exchange rate", v: "1 USDT = 0.87 EUR" },
    { l: "Total fees", v: "8.00 USDT" },
    { l: "Total to send", v: "1,008.00 USDT" },
    { l: "Recipient gets", v: "862.00 EUR", highlight: true },
  ];
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "drift", dx: 14, dy: -8 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.72}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.14), transparent 55%)",
            }}
          />
        </ParallaxLayer>
        <ParallaxLayer factor={1.0}>
          <Panel frame={localFrame} start={0} width={780} height={660}>
            <div
              style={{
                padding: 44,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: theme.colors.inkMuted,
                  ...fadeUp(localFrame, 6, 14, 6),
                }}
              >
                Step 2 — Review & Pay
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  color: theme.colors.ink,
                  ...fadeUp(localFrame, 8, 14, 8),
                }}
              >
                Summary
              </div>
              <div style={{ marginTop: 26 }}>
                {rows.map((r, i) => (
                  <div
                    key={r.l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "16px 0",
                      borderBottom:
                        i < rows.length - 1
                          ? `1px solid ${theme.colors.border}`
                          : "none",
                      ...fadeUp(localFrame, 14 + i * 3, 14, 8),
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        color: theme.colors.inkMuted,
                        fontWeight: 500,
                      }}
                    >
                      {r.l}
                    </div>
                    <div
                      style={{
                        fontSize: r.highlight ? 18 : 14,
                        fontWeight: r.highlight ? 600 : 500,
                        letterSpacing: "-0.015em",
                        color: r.highlight
                          ? theme.colors.primaryBlue
                          : theme.colors.ink,
                      }}
                    >
                      {r.v}
                    </div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 34,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  ...fadeUp(localFrame, 40, 14, 8),
                }}
              >
                <Btn label="Back" variant="ghost" />
                <Btn label="Confirm & Pay" variant="primary" />
              </div>
            </div>
          </Panel>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};

/* ============ SCENE 6 — "Send" headline + UI (Blue) ============ */
export const Scene06_SendHero: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.blue;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "pullOut", amount: 0.03 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.2), transparent 60%)",
            }}
          />
        </ParallaxLayer>

        {/* "Send" big headline on LEFT */}
        <ParallaxLayer factor={1.0}>
          <div
            style={{
              position: "absolute",
              left: 140,
              top: 0,
              bottom: 0,
              width: 760,
              display: "flex",
              alignItems: "center",
              fontFamily: theme.typography.fontFamily,
            }}
          >
            <div
              style={{
                fontSize: 240,
                fontWeight: 700,
                letterSpacing: theme.typography.tracking(240),
                color: p.ink,
                lineHeight: 0.92,
              }}
            >
              <BlurDissolve
                text="Send"
                frame={localFrame}
                start={4}
                duration={22}
              />
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  marginTop: 28,
                  opacity: 0.82,
                  lineHeight: 1.5,
                  maxWidth: 460,
                  ...fadeUp(localFrame, 28, 16, 10),
                }}
              >
                Money across borders in under 10 seconds. 40+ currencies, one
                transfer.
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Mini UI preview on RIGHT */}
        <ParallaxLayer factor={1.15}>
          <div
            style={{
              position: "absolute",
              right: 90,
              top: 120,
              width: 640,
              height: 840,
              borderRadius: 32,
              background: theme.colors.white,
              boxShadow:
                "0 40px 100px rgba(10,10,15,0.35), 0 4px 12px rgba(10,10,15,0.15)",
              padding: 32,
              fontFamily: theme.typography.fontFamily,
              ...scaleIn(localFrame, 16, 24, 0.94),
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: theme.colors.ink,
                letterSpacing: "-0.01em",
              }}
            >
              Sent successfully
            </div>
            <div
              style={{
                marginTop: 18,
                padding: 24,
                borderRadius: 16,
                background: "rgba(30,142,86,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: theme.colors.green,
                  display: "grid",
                  placeItems: "center",
                  color: theme.colors.white,
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: theme.colors.ink,
                  }}
                >
                  862.00 EUR
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: theme.colors.inkMuted,
                  }}
                >
                  To Acme Financial Corp
                </div>
              </div>
            </div>
            <div style={{ marginTop: 30 }}>
              {[
                ["Reference", "ENDL-74821"],
                ["Arrives", "Now"],
                ["From", "Loop Me In Inc."],
              ].map(([l, v], i) => (
                <div
                  key={l}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "14px 0",
                    borderBottom:
                      i < 2 ? `1px solid ${theme.colors.border}` : "none",
                    ...fadeUp(localFrame, 30 + i * 3, 14, 6),
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: theme.colors.inkMuted,
                      fontWeight: 500,
                    }}
                  >
                    {l}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: theme.colors.ink,
                      fontWeight: 500,
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};
