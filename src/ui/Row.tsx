import React from "react";
import { theme } from "../constants/theme";
import { fadeUp } from "../primitives/Text";
import { StatusPill } from "./Panel";

/* Transaction Row */
export const TxRow: React.FC<{
  frame: number;
  start: number;
  name: string;
  id: string;
  time: string;
  amount: string;
  currency?: string;
  positive?: boolean;
}> = ({ frame, start, name, id, time, amount, currency, positive }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: `1px solid ${theme.colors.border}`,
        fontFamily: theme.typography.fontFamily,
        ...fadeUp(frame, start, 12, 8),
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: "rgba(11,11,15,0.05)",
          flexShrink: 0,
        }}
      />
      <div style={{ marginLeft: 14, flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: theme.colors.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: theme.colors.inkFaint,
            marginTop: 2,
            letterSpacing: "0em",
          }}
        >
          {id}
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          color: theme.colors.inkMuted,
          marginRight: 24,
        }}
      >
        {time}
      </div>
      <div style={{ textAlign: "right", minWidth: 120 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: positive ? theme.colors.green : theme.colors.ink,
          }}
        >
          {positive ? "+" : ""}
          {amount}
        </div>
        {currency && (
          <div
            style={{
              fontSize: 11,
              color: theme.colors.inkFaint,
              marginTop: 2,
            }}
          >
            {currency}
          </div>
        )}
      </div>
    </div>
  );
};

/* Recipient Row */
export const RecipientRow: React.FC<{
  frame: number;
  start: number;
  name: string;
  id: string;
  currency: string;
  status?: "active";
}> = ({ frame, start, name, id, currency, status }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 0",
        borderBottom: `1px solid ${theme.colors.border}`,
        fontFamily: theme.typography.fontFamily,
        ...fadeUp(frame, start, 12, 8),
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: "rgba(11,11,15,0.06)",
          display: "grid",
          placeItems: "center",
          fontSize: 12,
          fontWeight: 600,
          color: theme.colors.inkMuted,
          flexShrink: 0,
        }}
      >
        {name
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join("")}
      </div>
      <div style={{ marginLeft: 14, flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14.5,
            fontWeight: 500,
            color: theme.colors.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: theme.colors.inkFaint,
            marginTop: 2,
          }}
        >
          {id}
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          color: theme.colors.inkMuted,
          marginRight: 20,
        }}
      >
        {currency}
      </div>
      {status && <StatusPill status="active">Active</StatusPill>}
    </div>
  );
};

/* Card Row — for Cards dashboard */
export const CardRow: React.FC<{
  frame: number;
  start: number;
  name: string;
  ending: string;
  status: "active" | "in-progress" | "frozen";
  statusLabel: string;
  progress: number;
  barColor?: string;
}> = ({ frame, start, name, ending, status, statusLabel, progress, barColor }) => {
  const t = Math.max(0, Math.min(1, (frame - start - 6) / 34));
  const barFill = (1 - Math.pow(1 - t, 3)) * progress;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "16px 0",
        borderBottom: `1px solid ${theme.colors.border}`,
        fontFamily: theme.typography.fontFamily,
        ...fadeUp(frame, start, 12, 8),
      }}
    >
      <div
        style={{
          width: 44,
          height: 30,
          borderRadius: 6,
          background: "linear-gradient(135deg, #245FFF 0%, #885BF0 100%)",
          flexShrink: 0,
        }}
      />
      <div style={{ marginLeft: 14, flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: theme.colors.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: theme.colors.inkFaint,
            marginTop: 2,
          }}
        >
          ending {ending}
        </div>
      </div>
      <div style={{ marginRight: 24 }}>
        <StatusPill status={status}>{statusLabel}</StatusPill>
      </div>
      <div
        style={{
          width: 180,
          height: 6,
          borderRadius: 999,
          background: "rgba(11,11,15,0.06)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${barFill * 100}%`,
            background: barColor ?? theme.colors.primaryBlue,
            borderRadius: 999,
          }}
        />
      </div>
      <div
        style={{
          marginLeft: 16,
          fontSize: 12,
          fontWeight: 500,
          color: theme.colors.ink,
          letterSpacing: "-0.005em",
          minWidth: 48,
          textAlign: "right",
        }}
      >
        {(progress * 100).toFixed(0)}%
      </div>
    </div>
  );
};
