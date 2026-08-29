import React from "react";
import { AbsoluteFill } from "remotion";
import { CameraRig, ParallaxLayer } from "../primitives/Camera";
import { Panel, Btn } from "../ui/Panel";
import { VirtualCard } from "../ui/VirtualCard";
import {
  BlurDissolve,
  NumberRoll,
  CharTypewriter,
  fadeUp,
  scaleIn,
} from "../primitives/Text";
import { theme } from "../constants/theme";

/* ============ SCENE 7 — Deposit Instructions (Green) ============ */
export const Scene07_Deposit: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.green;
  const details = [
    ["Account name", "Loop Me In Inc."],
    ["Account number", "8829 7451 2093 0001"],
    ["Routing (ACH)", "084008426"],
    ["SWIFT/BIC", "ENDLUS33XXX"],
    ["Bank", "Endl Financial"],
  ];
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "pushIn", amount: 0.035 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.18), transparent 60%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <Panel frame={localFrame} start={0} width={900} height={520}>
            <div
              style={{
                padding: 44,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: theme.colors.ink,
                  ...fadeUp(localFrame, 6, 14, 8),
                }}
              >
                Add Funds
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: theme.colors.inkMuted,
                  marginTop: 8,
                  ...fadeUp(localFrame, 8, 14, 6),
                }}
              >
                Wire transfer to this account to receive funds instantly.
              </div>

              <div
                style={{
                  marginTop: 30,
                  padding: 28,
                  borderRadius: 18,
                  border: `1px solid ${theme.colors.border}`,
                  background: "rgba(11,11,15,0.02)",
                }}
              >
                {details.map(([l, v], i) => (
                  <div
                    key={l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px 0",
                      borderBottom:
                        i < details.length - 1
                          ? `1px solid ${theme.colors.border}`
                          : "none",
                      ...fadeUp(localFrame, 12 + i * 3, 14, 6),
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
                        fontSize: 14,
                        color: theme.colors.ink,
                        fontWeight: 500,
                        fontFamily:
                          i === 1 || i === 2 || i === 3
                            ? "ui-monospace, SFMono-Regular, monospace"
                            : undefined,
                        letterSpacing: "-0.005em",
                      }}
                    >
                      {i === 1 && localFrame >= 18 ? (
                        <CharTypewriter
                          text={v}
                          frame={localFrame}
                          start={20}
                          cps={48}
                        />
                      ) : (
                        v
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 22,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                  ...fadeUp(localFrame, 40, 14, 6),
                }}
              >
                <Btn label="Copy details" variant="secondary" />
                <Btn label="Share instructions" variant="primary" />
              </div>
            </div>
          </Panel>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};

/* ============ SCENE 8 — Full Green Dashboard (balance + deposits) ============ */
export const Scene08_BalanceGreen: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.green;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "orbit", dx: 22, dy: -12 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.7}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.16), transparent 60%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <Panel frame={localFrame} start={0} width={1500} height={540}>
            <div
              style={{
                padding: "34px 40px",
                fontFamily: theme.typography.fontFamily,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 30,
                height: "100%",
              }}
            >
              {/* Left column — Balance + Deposit */}
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: theme.colors.inkMuted,
                    fontWeight: 500,
                    letterSpacing: "0.01em",
                    textTransform: "uppercase",
                    ...fadeUp(localFrame, 6, 14, 6),
                  }}
                >
                  USD Balance
                </div>
                <div
                  style={{
                    fontSize: 62,
                    fontWeight: 600,
                    letterSpacing: "-0.04em",
                    color: theme.colors.ink,
                    marginTop: 8,
                    ...fadeUp(localFrame, 8, 14, 10),
                  }}
                >
                  $
                  <NumberRoll
                    from={0}
                    to={40136}
                    frame={localFrame}
                    start={10}
                    duration={40}
                  />
                  <span style={{ opacity: 0.5, fontSize: 42 }}>.30</span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: theme.colors.green,
                    fontWeight: 500,
                    marginTop: 6,
                    ...fadeUp(localFrame, 16, 14, 6),
                  }}
                >
                  +$2,418.40 received this week
                </div>

                <div
                  style={{
                    marginTop: 30,
                    padding: 22,
                    borderRadius: 16,
                    background: "rgba(11,11,15,0.03)",
                    ...fadeUp(localFrame, 20, 16, 10),
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
                    Deposit instructions
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 13,
                      color: theme.colors.inkMuted,
                      letterSpacing: "-0.005em",
                      lineHeight: 1.9,
                    }}
                  >
                    <div>Acct • 8829 7451 2093 0001</div>
                    <div>SWIFT • ENDLUS33XXX</div>
                    <div>Bank • Endl Financial</div>
                  </div>
                </div>
              </div>

              {/* Right column — Recent Transactions */}
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: theme.colors.ink,
                    letterSpacing: "-0.01em",
                    ...fadeUp(localFrame, 10, 14, 6),
                  }}
                >
                  Recent Transactions
                </div>
                {[
                  ["Stripe Payout", "TXN-98271", "+$12,340.00", "Today"],
                  ["Client Wire — Loop", "TXN-98244", "+$8,200.00", "Today"],
                  ["Shopify Settlement", "TXN-98211", "+$4,420.00", "Yest."],
                  ["Linear Subscription", "TXN-98198", "-$49.00", "Yest."],
                  ["Figma Team", "TXN-98180", "-$180.00", "Apr 19"],
                ].map(([n, id, amt, t], i) => {
                  const pos = typeof amt === "string" && amt.startsWith("+");
                  return (
                    <div
                      key={id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "13px 0",
                        borderBottom:
                          i < 4 ? `1px solid ${theme.colors.border}` : "none",
                        ...fadeUp(localFrame, 14 + i * 3, 14, 8),
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13.5,
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
                          {id} • {t}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: pos ? theme.colors.green : theme.colors.ink,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {amt}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};

/* ============ SCENE 9 — "Receive" + Virtual Card (Green) ============ */
export const Scene09_ReceiveHero: React.FC<{
  localFrame: number;
  duration: number;
}> = ({ localFrame, duration }) => {
  const p = theme.scenePalette.green;
  return (
    <AbsoluteFill style={{ background: p.bg }}>
      <CameraRig
        move={{ kind: "pushIn", amount: 0.04 }}
        localFrame={localFrame}
        duration={duration}
      >
        <ParallaxLayer factor={0.68}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 75% 30%, rgba(255,255,255,0.22), transparent 55%)",
            }}
          />
        </ParallaxLayer>

        <ParallaxLayer factor={1.0}>
          <div
            style={{
              position: "absolute",
              left: 140,
              top: 0,
              bottom: 0,
              width: 720,
              display: "flex",
              alignItems: "center",
              fontFamily: theme.typography.fontFamily,
            }}
          >
            <div
              style={{
                fontSize: 220,
                fontWeight: 700,
                letterSpacing: theme.typography.tracking(220),
                color: p.ink,
                lineHeight: 0.92,
              }}
            >
              <BlurDissolve
                text="Receive"
                frame={localFrame}
                start={4}
                duration={24}
              />
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 500,
                  marginTop: 28,
                  opacity: 0.85,
                  lineHeight: 1.5,
                  maxWidth: 440,
                  letterSpacing: "-0.01em",
                  ...fadeUp(localFrame, 30, 16, 10),
                }}
              >
                USD, EUR, GBP. One account, local details in every currency your
                customers pay from.
              </div>
            </div>
          </div>
        </ParallaxLayer>

        {/* Card + wallet adds */}
        <ParallaxLayer factor={1.15}>
          <div
            style={{
              position: "absolute",
              right: 140,
              top: "50%",
              transform: "translateY(-50%)",
              width: 540,
              ...scaleIn(localFrame, 16, 26, 0.9),
            }}
          >
            <VirtualCard
              width={540}
              height={338}
              gradient="linear-gradient(135deg, #0f4a32 0%, #1E8E56 60%, #0a3322 100%)"
              ownerName="Loop Me In Inc."
              last4="8988"
              expiry="09/28"
            />
            <div
              style={{
                marginTop: 22,
                display: "flex",
                gap: 12,
                fontFamily: theme.typography.fontFamily,
              }}
            >
              {["Apple Wallet", "Google Wallet"].map((label, i) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    padding: "14px 18px",
                    borderRadius: 14,
                    background: theme.colors.white,
                    color: theme.colors.ink,
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    ...fadeUp(localFrame, 34 + i * 3, 14, 8),
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 5,
                      background: theme.colors.ink,
                    }}
                  />
                  Add to {label}
                </div>
              ))}
            </div>
          </div>
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};
