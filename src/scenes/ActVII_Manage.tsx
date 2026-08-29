import React from "react";
import { AbsoluteFill } from "remotion";
import { CameraRig, ParallaxLayer } from "../primitives/Camera";
import { Panel } from "../ui/Panel";
import { TxRow, RecipientRow } from "../ui/Row";
import {
  BlurDissolve,
  CharTypewriter,
  fadeUp,
  scaleIn,
} from "../primitives/Text";
import { theme } from "../constants/theme";

/* ============ SCENE 15 — Transactions list (Light) ============ */
export const Scene15_Transactions: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.light;
  const txs = [
    ["Stripe Payout", "TXN-98271", "Today, 10:42", "$12,340.00", "USD", true],
    ["Client Wire — Loop Inc.", "TXN-98244", "Today, 09:12", "$8,200.00", "USD", true],
    ["AWS Services", "TXN-98268", "Today, 06:01", "-$1,284.50", "USD", false],
    ["Shopify Settlement", "TXN-98211", "Yesterday", "$4,420.00", "USD", true],
    ["Linear", "TXN-98198", "Yesterday", "-$49.00", "USD", false],
    ["Figma Team", "TXN-98180", "Apr 19", "-$180.00", "USD", false],
    ["Vercel Pro", "TXN-98144", "Apr 18", "-$240.00", "USD", false],
  ] as const;

  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "orbit", dx: 18, dy: -14 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.7), transparent 60%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <Panel frame={localFrame} start={0} width={1440} height={720}>
            <div
              style={{
                padding: "30px 40px",
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
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: theme.colors.ink,
                  }}
                >
                  Transactions
                </div>
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: `1px solid ${theme.colors.border}`,
                    fontSize: 13,
                    color: theme.colors.inkMuted,
                    minWidth: 280,
                    ...fadeUp(localFrame, 8, 14, 6),
                  }}
                >
                  <CharTypewriter
                    text="Search by keywords"
                    frame={localFrame}
                    start={10}
                    cps={20}
                  />
                </div>
              </div>

              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  marginTop: 22,
                  borderBottom: `1px solid ${theme.colors.border}`,
                  ...fadeUp(localFrame, 10, 14, 6),
                }}
              >
                {["Account", "Card"].map((t, i) => (
                  <div
                    key={t}
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      paddingBottom: 12,
                      color: i === 0 ? theme.colors.ink : theme.colors.inkMuted,
                      borderBottom:
                        i === 0 ? `2px solid ${theme.colors.ink}` : "none",
                    }}
                  >
                    {t}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 4 }}>
                {txs.map((t, i) => (
                  <TxRow
                    key={t[1]}
                    frame={localFrame}
                    start={10 + i * 1.6}
                    name={t[0]}
                    id={t[1]}
                    time={t[2]}
                    amount={t[3]}
                    currency={t[4]}
                    positive={Boolean(t[5])}
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

/* ============ SCENE 16 — "Manage" + Ledger (Light) ============ */
export const Scene16_ManageHero: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.light;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "pullOut", amount: 0.035 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 80% 70%, rgba(36,95,255,0.06), transparent 60%)",
            }}
          />
        </ParallaxLayer>

        {/* Headline */}
        <ParallaxLayer factor={1.0}>
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 0,
              bottom: 0,
              width: 740,
              display: "flex",
              alignItems: "center",
              fontFamily: theme.typography.fontFamily,
            }}
          >
            <div
              style={{
                fontSize: 228,
                fontWeight: 700,
                letterSpacing: theme.typography.tracking(228),
                color: p.ink,
                lineHeight: 0.92,
              }}
            >
              <BlurDissolve
                text="Manage"
                frame={localFrame}
                start={4}
                duration={22}
              />
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  marginTop: 26,
                  opacity: 0.7,
                  lineHeight: 1.5,
                  maxWidth: 480,
                  letterSpacing: "-0.01em",
                  ...fadeUp(localFrame, 28, 16, 10),
                }}
              >
                Ledger, receipts, approvals. Every dollar, every card, every
                click — accounted for.
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Ledger preview */}
        <ParallaxLayer factor={1.15}>
          <div
            style={{
              position: "absolute",
              right: 90,
              top: 160,
              width: 680,
              height: 580,
              borderRadius: 28,
              background: theme.colors.white,
              boxShadow:
                "0 40px 90px rgba(10,10,15,0.18), 0 4px 12px rgba(10,10,15,0.08)",
              padding: 30,
              fontFamily: theme.typography.fontFamily,
              overflow: "hidden",
              ...scaleIn(localFrame, 14, 24, 0.94),
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: theme.colors.ink,
                letterSpacing: "-0.01em",
              }}
            >
              Ledger
            </div>
            <div
              style={{
                fontSize: 11,
                color: theme.colors.inkFaint,
                marginTop: 4,
              }}
            >
              Reconciled automatically
            </div>

            <div style={{ marginTop: 16 }}>
              {[
                ["Stripe Payout", "$12,340.00", "Reconciled"],
                ["AWS Services", "-$1,284.50", "Reconciled"],
                ["Team Meals", "-$318.20", "Pending"],
                ["Figma Team", "-$180.00", "Reconciled"],
                ["Notion", "-$96.00", "Reconciled"],
                ["Loop Wire", "$8,200.00", "Reconciled"],
              ].map(([n, a, s], i) => (
                <div
                  key={n}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "13px 0",
                    borderBottom:
                      i < 5 ? `1px solid ${theme.colors.border}` : "none",
                    ...fadeUp(localFrame, 20 + i * 3, 14, 6),
                  }}
                >
                  <div style={{ flex: 1 }}>
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
                        fontSize: 10.5,
                        color: s === "Pending" ? "#C38F42" : theme.colors.green,
                        marginTop: 2,
                        fontWeight: 500,
                      }}
                    >
                      ● {s}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: theme.colors.ink,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};

/* ============ SCENE 17 — Recipients (Gold) ============ */
export const Scene17_Recipients: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.gold;
  const list = [
    { name: "Acme Financial Corporation", id: "#982364510", currency: "$USD" },
    { name: "Johnathan A. Doe", id: "#927451783", currency: "€EUR" },
    { name: "Jane Smith", id: "#845612347", currency: "$CAD" },
    { name: "Globex International Ltd.", id: "#874520693", currency: "£GBP" },
    { name: "Initech Technologies", id: "#763284159", currency: "$USD" },
    { name: "Umbrella Holdings", id: "#752149083", currency: "€EUR" },
  ];
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "drift", dx: -12, dy: 10 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 70% 40%, rgba(255,255,255,0.18), transparent 55%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <Panel frame={localFrame} start={0} width={1320} height={620}>
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
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: theme.colors.ink,
                  }}
                >
                  Recipients
                </div>
                <div
                  style={{
                    padding: "10px 16px",
                    borderRadius: 12,
                    border: `1px solid ${theme.colors.border}`,
                    fontSize: 13,
                    color: theme.colors.inkMuted,
                    minWidth: 260,
                    ...fadeUp(localFrame, 8, 14, 6),
                  }}
                >
                  <CharTypewriter
                    text="Search by keywords"
                    frame={localFrame}
                    start={10}
                    cps={18}
                  />
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                {list.map((r, i) => (
                  <RecipientRow
                    key={r.id}
                    frame={localFrame}
                    start={14 + i * 3}
                    name={r.name}
                    id={r.id}
                    currency={r.currency}
                    status="active"
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
