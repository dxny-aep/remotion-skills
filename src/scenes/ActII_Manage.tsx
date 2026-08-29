import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { CameraRig, ParallaxLayer } from "../primitives/Camera";
import { Panel, Btn, EndlLogo } from "../ui/Panel";
import { Sidebar, DEFAULT_NAV } from "../ui/Sidebar";
import { TxRow } from "../ui/Row";
import { NumberRoll, WordFadeUp, fadeUp } from "../primitives/Text";
import { theme } from "../constants/theme";
import { CUBIC } from "../constants/easing";

/* ============ SCENE 3 — Accounts Dashboard (Gold) ============ */
export const Scene03_DashboardGold: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.gold;
  const navItems = [
    { label: "Dashboard", active: true },
    { label: "Accounts", expanded: true },
    { label: "FX Calculator" },
    { label: "Cards" },
    { label: "Transactions" },
    { label: "Recipients" },
    { label: "Yield" },
  ];

  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "orbit", dx: -30, dy: 20, scale: 1.0 }}
        localFrame={localFrame}
        duration={duration}
      >
        {/* BG soft highlight */}
        <ParallaxLayer factor={0.65}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.12), transparent 55%)",
            }}
          />
        </ParallaxLayer>

        {/* Main panel */}
        <ParallaxLayer factor={1.0}>
          <Panel frame={localFrame} start={0} width={1620} height={960}>
            <div style={{ display: "flex", height: "100%" }}>
              {/* Sidebar */}
              <div
                style={{
                  borderRight: `1px solid ${theme.colors.border}`,
                  flexShrink: 0,
                }}
              >
                <Sidebar
                  frame={localFrame}
                  start={6}
                  items={navItems}
                  width={238}
                />
              </div>

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  padding: "28px 40px",
                  fontFamily: theme.typography.fontFamily,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    ...fadeUp(localFrame, 8, 14, 6),
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: theme.colors.ink,
                    }}
                  >
                    Accounts
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <Btn label="Add Funds" variant="secondary" size="sm" />
                    <Btn label="Send" variant="primary" size="sm" />
                  </div>
                </div>

                {/* Balance */}
                <div style={{ display: "flex", gap: 18, marginTop: 26 }}>
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(11,11,15,0.025)",
                      borderRadius: 18,
                      padding: 22,
                      ...fadeUp(localFrame, 14, 14, 8),
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.colors.inkMuted,
                        fontWeight: 500,
                      }}
                    >
                      Total Balance
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 40,
                        fontWeight: 600,
                        letterSpacing: "-0.035em",
                        color: theme.colors.ink,
                      }}
                    >
                      $
                      <NumberRoll
                        from={0}
                        to={284650}
                        frame={localFrame}
                        start={16}
                        duration={36}
                        format={(n) =>
                          n.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })
                        }
                      />
                      .
                      <span style={{ opacity: 0.55 }}>24</span>
                    </div>
                    <div
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: theme.colors.green,
                        fontWeight: 500,
                      }}
                    >
                      +$4,218.40 this month
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      background: "rgba(11,11,15,0.025)",
                      borderRadius: 18,
                      padding: 22,
                      ...fadeUp(localFrame, 16, 14, 8),
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: theme.colors.inkMuted,
                        fontWeight: 500,
                      }}
                    >
                      Available
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: 40,
                        fontWeight: 600,
                        letterSpacing: "-0.035em",
                        color: theme.colors.ink,
                      }}
                    >
                      $
                      <NumberRoll
                        from={0}
                        to={128340}
                        frame={localFrame}
                        start={18}
                        duration={36}
                      />
                      .
                      <span style={{ opacity: 0.55 }}>00</span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div
                  style={{
                    display: "flex",
                    gap: 18,
                    marginTop: 30,
                    borderBottom: `1px solid ${theme.colors.border}`,
                    paddingBottom: 12,
                    ...fadeUp(localFrame, 22, 14, 6),
                  }}
                >
                  {["Account", "Card"].map((t, i) => (
                    <div
                      key={t}
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: i === 0 ? theme.colors.ink : theme.colors.inkMuted,
                        borderBottom:
                          i === 0 ? `2px solid ${theme.colors.ink}` : "none",
                        paddingBottom: 8,
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>

                {/* Recent Transactions */}
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    ...fadeUp(localFrame, 26, 14, 6),
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: theme.colors.ink,
                    }}
                  >
                    Recent Transactions
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: theme.colors.primaryBlue,
                      fontWeight: 500,
                    }}
                  >
                    See All
                  </div>
                </div>

                <div style={{ marginTop: 4 }}>
                  <TxRow
                    frame={localFrame}
                    start={30}
                    name="Stripe Payout"
                    id="TXN-98271"
                    time="Today, 10:42"
                    amount="$12,340.00"
                    positive
                  />
                  <TxRow
                    frame={localFrame}
                    start={33}
                    name="AWS Services"
                    id="TXN-98268"
                    time="Today, 09:18"
                    amount="-$1,284.50"
                  />
                  <TxRow
                    frame={localFrame}
                    start={36}
                    name="Vercel Pro"
                    id="TXN-98251"
                    time="Yesterday"
                    amount="-$240.00"
                  />
                  <TxRow
                    frame={localFrame}
                    start={39}
                    name="Client Wire — Loop Inc"
                    id="TXN-98224"
                    time="Apr 18"
                    amount="$28,000.00"
                    positive
                  />
                </div>
              </div>
            </div>
          </Panel>
        </ParallaxLayer>

        {/* FG — subtle blue accent on CTA */}
        <ParallaxLayer factor={1.12}>
          <div style={{ position: "absolute", inset: 0 }} />
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};
