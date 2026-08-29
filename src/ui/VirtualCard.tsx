import React from "react";
import { theme } from "../constants/theme";

/**
 * VirtualCard — the signature Endl card object. Used across scenes as the
 * hero element: "Receive" (add to wallet), "Spend" (individual card),
 * "Endl" closing brand.
 */
export const VirtualCard: React.FC<{
  width?: number;
  height?: number;
  gradient?: string;
  ownerName?: string;
  last4?: string;
  expiry?: string;
  label?: string;
  style?: React.CSSProperties;
}> = ({
  width = 460,
  height = 288,
  gradient,
  ownerName = "Davies Wales",
  last4 = "8988",
  expiry = "09/28",
  label = "endl",
  style,
}) => {
  const grad =
    gradient ??
    "linear-gradient(135deg, #1a1a22 0%, #2a2a38 55%, #0f0f14 100%)";
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 24,
        background: grad,
        padding: "26px 28px",
        color: theme.colors.white,
        fontFamily: theme.typography.fontFamily,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(10,10,15,0.35), 0 4px 12px rgba(10,10,15,0.15)",
        ...style,
      }}
    >
      {/* sheen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 80% -20%, rgba(255,255,255,0.18), transparent 55%)",
          pointerEvents: "none",
        }}
      />
      {/* top-right mark */}
      <div
        style={{
          position: "absolute",
          top: 26,
          right: 28,
          fontSize: 18,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          opacity: 0.9,
        }}
      >
        {label}
      </div>
      {/* chip */}
      <div
        style={{
          width: 42,
          height: 32,
          borderRadius: 6,
          background:
            "linear-gradient(135deg, #c9a46a 0%, #9a7a44 60%, #6f5a2f 100%)",
          marginTop: 44,
        }}
      />
      {/* number */}
      <div
        style={{
          marginTop: 56,
          fontSize: 20,
          fontWeight: 500,
          letterSpacing: "0.08em",
          opacity: 0.92,
        }}
      >
        •••• •••• •••• {last4}
      </div>
      {/* footer */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 28,
          right: 28,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              opacity: 0.55,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 4,
            }}
          >
            Cardholder
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            {ownerName}
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 9,
              opacity: 0.55,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: 4,
            }}
          >
            Expires
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.005em",
            }}
          >
            {expiry}
          </div>
        </div>
      </div>
    </div>
  );
};
