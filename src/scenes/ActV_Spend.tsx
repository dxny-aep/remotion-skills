import React from "react";
import { AbsoluteFill } from "remotion";
import { CameraRig, ParallaxLayer } from "../primitives/Camera";
import { Panel, Btn, StatusPill } from "../ui/Panel";
import { VirtualCard } from "../ui/VirtualCard";
import { CardRow } from "../ui/Row";
import {
  BlurDissolve,
  NumberRoll,
  fadeUp,
  scaleIn,
} from "../primitives/Text";
import { theme } from "../constants/theme";

/* ============ SCENE 10 — Cards Dashboard (Purple) ============ */
export const Scene10_CardsPurple: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.purple;
  const cards = [
    {
      name: "Team Ops Card",
      ending: "1132",
      status: "active" as const,
      statusLabel: "Active",
      progress: 0.2534,
    },
    {
      name: "Engineering",
      ending: "4482",
      status: "active" as const,
      statusLabel: "Active",
      progress: 0.5024,
    },
    {
      name: "Marketing Ads",
      ending: "8298",
      status: "in-progress" as const,
      statusLabel: "In Progress",
      progress: 0.8146,
    },
    {
      name: "Contractor Pay",
      ending: "0021",
      status: "active" as const,
      statusLabel: "Active",
      progress: 0.2534,
    },
    {
      name: "Travel & Ops",
      ending: "3344",
      status: "frozen" as const,
      statusLabel: "Frozen",
      progress: 0.5024,
    },
  ];
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
                "radial-gradient(ellipse at 85% 15%, rgba(255,255,255,0.22), transparent 55%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <Panel frame={localFrame} start={0} width={1500} height={660}>
            <div
              style={{
                padding: "32px 40px",
                fontFamily: theme.typography.fontFamily,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  ...fadeUp(localFrame, 4, 14, 6),
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: theme.colors.ink,
                    }}
                  >
                    Cards
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.colors.inkMuted,
                      marginTop: 4,
                    }}
                  >
                    5 active cards • $34,400 spent this month
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn label="Add Cardholder" variant="secondary" size="sm" />
                  <Btn label="Create Card" variant="primary" size="sm" />
                </div>
              </div>

              {/* Summary tiles */}
              <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
                <div
                  style={{
                    flex: 1,
                    padding: 20,
                    borderRadius: 16,
                    background: "rgba(11,11,15,0.03)",
                    ...fadeUp(localFrame, 8, 14, 8),
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
                    Available Limit
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 30,
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      color: theme.colors.ink,
                    }}
                  >
                    $
                    <NumberRoll
                      from={0}
                      to={5500}
                      frame={localFrame}
                      start={10}
                      duration={30}
                    />
                    <span style={{ opacity: 0.5 }}>.00</span>
                  </div>
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: 20,
                    borderRadius: 16,
                    background: "rgba(11,11,15,0.03)",
                    ...fadeUp(localFrame, 10, 14, 8),
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
                    Spend This Month
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontSize: 30,
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      color: theme.colors.ink,
                    }}
                  >
                    $
                    <NumberRoll
                      from={0}
                      to={1400}
                      frame={localFrame}
                      start={12}
                      duration={30}
                    />
                    <span style={{ opacity: 0.5 }}>.00</span>
                  </div>
                </div>
              </div>

              {/* Card list */}
              <div style={{ marginTop: 24 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: theme.colors.ink,
                    marginBottom: 4,
                    ...fadeUp(localFrame, 14, 14, 6),
                  }}
                >
                  All cards
                </div>
                {cards.map((c, i) => (
                  <CardRow
                    key={c.name}
                    frame={localFrame}
                    start={18 + i * 3}
                    name={c.name}
                    ending={c.ending}
                    status={c.status}
                    statusLabel={c.statusLabel}
                    progress={c.progress}
                    barColor={
                      i % 3 === 0
                        ? theme.colors.primaryBlue
                        : i % 3 === 1
                        ? theme.colors.purple
                        : theme.colors.green
                    }
                  />
                ))}
              </div>
            </div>
          </Panel>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};

/* ============ SCENE 11 — Individual Card Page (Purple) ============ */
export const Scene11_CardPage: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.purple;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "pushIn", amount: 0.045 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.72}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 15% 70%, rgba(255,255,255,0.18), transparent 55%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <Panel frame={localFrame} start={0} width={1260} height={780}>
            <div
              style={{
                padding: 40,
                fontFamily: theme.typography.fontFamily,
                display: "grid",
                gridTemplateColumns: "560px 1fr",
                gap: 40,
                height: "100%",
              }}
            >
              {/* Left — Card + balances */}
              <div>
                <div style={{ ...scaleIn(localFrame, 4, 22, 0.92) }}>
                  <VirtualCard
                    width={520}
                    height={326}
                    gradient="linear-gradient(135deg, #3a1e6f 0%, #885BF0 60%, #1f0c44 100%)"
                    ownerName="Davies Wales"
                    last4="8988"
                    expiry="09/28"
                  />
                </div>
                <div style={{ display: "flex", gap: 14, marginTop: 20 }}>
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 14,
                      background: "rgba(11,11,15,0.03)",
                      ...fadeUp(localFrame, 12, 14, 8),
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10.5,
                        color: theme.colors.inkMuted,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Dollar
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        letterSpacing: "-0.025em",
                        color: theme.colors.ink,
                        marginTop: 4,
                      }}
                    >
                      $
                      <NumberRoll
                        from={0}
                        to={12340}
                        frame={localFrame}
                        start={14}
                        duration={28}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                      borderRadius: 14,
                      background: "rgba(11,11,15,0.03)",
                      ...fadeUp(localFrame, 14, 14, 8),
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10.5,
                        color: theme.colors.inkMuted,
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Euro
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 600,
                        letterSpacing: "-0.025em",
                        color: theme.colors.ink,
                        marginTop: 4,
                      }}
                    >
                      €
                      <NumberRoll
                        from={0}
                        to={8900}
                        frame={localFrame}
                        start={16}
                        duration={28}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Available Balance + Actions */}
              <div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: theme.colors.inkMuted,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    ...fadeUp(localFrame, 10, 14, 6),
                  }}
                >
                  Available Balance
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 56,
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    color: theme.colors.ink,
                    ...fadeUp(localFrame, 12, 14, 10),
                  }}
                >
                  ≈ $
                  <NumberRoll
                    from={0}
                    to={40136}
                    frame={localFrame}
                    start={12}
                    duration={36}
                  />
                  <span style={{ opacity: 0.45, fontSize: 36 }}>.30</span>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 12,
                      background: theme.colors.ink,
                      color: theme.colors.white,
                      fontSize: 13,
                      fontWeight: 500,
                      ...fadeUp(localFrame, 18, 14, 8),
                    }}
                  >
                    Freeze
                  </div>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 12,
                      background: theme.colors.primaryBlue,
                      color: theme.colors.white,
                      fontSize: 13,
                      fontWeight: 500,
                      ...fadeUp(localFrame, 20, 14, 8),
                    }}
                  >
                    Top up
                  </div>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 12,
                      background: "rgba(11,11,15,0.05)",
                      color: theme.colors.ink,
                      fontSize: 13,
                      fontWeight: 500,
                      ...fadeUp(localFrame, 22, 14, 8),
                    }}
                  >
                    Limits
                  </div>
                </div>

                <div style={{ marginTop: 36 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: theme.colors.ink,
                      marginBottom: 10,
                      ...fadeUp(localFrame, 24, 14, 6),
                    }}
                  >
                    Latest
                  </div>
                  {[
                    ["Figma Pro", "-$45.00", "Today"],
                    ["Notion Team", "-$96.00", "Today"],
                    ["OpenAI API", "-$200.00", "Yest."],
                  ].map(([n, a, t], i) => (
                    <div
                      key={n}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 0",
                        borderBottom:
                          i < 2 ? `1px solid ${theme.colors.border}` : "none",
                        ...fadeUp(localFrame, 26 + i * 3, 14, 6),
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: theme.colors.ink,
                            letterSpacing: "-0.005em",
                          }}
                        >
                          {n}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: theme.colors.inkFaint,
                            marginTop: 2,
                          }}
                        >
                          {t}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: theme.colors.ink,
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {a}
                      </div>
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

/* ============ SCENE 12 — "Spend" headline + UI (Purple) ============ */
export const Scene12_SpendHero: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.purple;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "drift", dx: -18, dy: 6 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.68}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 80% 40%, rgba(255,255,255,0.2), transparent 55%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <div
            style={{
              position: "absolute",
              right: 140,
              top: 0,
              bottom: 0,
              width: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
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
                textAlign: "right",
              }}
            >
              <BlurDissolve
                text="Spend"
                frame={localFrame}
                start={4}
                duration={22}
              />
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  marginTop: 28,
                  opacity: 0.85,
                  lineHeight: 1.5,
                  textAlign: "right",
                  letterSpacing: "-0.01em",
                  ...fadeUp(localFrame, 28, 16, 10),
                }}
              >
                Virtual cards for every team.
                <br />
                Limits, freezes, approvals — all in one click.
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Mini card preview on LEFT */}
        <ParallaxLayer factor={1.15}>
          <div
            style={{
              position: "absolute",
              left: 160,
              top: "50%",
              transform: "translateY(-50%)",
              ...scaleIn(localFrame, 14, 24, 0.92),
            }}
          >
            <VirtualCard
              width={460}
              height={288}
              gradient="linear-gradient(135deg, #3a1e6f 0%, #885BF0 60%, #1f0c44 100%)"
            />
            <div
              style={{
                marginTop: 22,
                display: "flex",
                gap: 10,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  color: theme.colors.white,
                  fontSize: 12,
                  fontWeight: 500,
                  ...fadeUp(localFrame, 30, 14, 6),
                }}
              >
                Set limit
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  color: theme.colors.white,
                  fontSize: 12,
                  fontWeight: 500,
                  ...fadeUp(localFrame, 32, 14, 6),
                }}
              >
                Freeze
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  color: theme.colors.white,
                  fontSize: 12,
                  fontWeight: 500,
                  ...fadeUp(localFrame, 34, 14, 6),
                }}
              >
                Share
              </div>
            </div>
          </div>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};
