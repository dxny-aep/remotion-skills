import React from "react";
import { theme } from "../constants/theme";
import { fadeUp } from "../primitives/Text";

export type NavItem = {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  expanded?: boolean;
};

export const Sidebar: React.FC<{
  frame: number;
  start?: number;
  items: NavItem[];
  width?: number;
}> = ({ frame, start = 0, items, width = 248 }) => {
  return (
    <div
      style={{
        width,
        padding: "24px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 10px 22px 10px",
          ...fadeUp(frame, start, 14, 8),
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            background: theme.colors.ink,
            display: "grid",
            placeItems: "center",
          }}
        >
          <div
            style={{
              width: 12,
              height: 8,
              background: theme.colors.white,
              borderRadius: 1,
            }}
          />
        </div>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: theme.colors.ink,
          }}
        >
          endl
        </span>
      </div>
      {items.map((it, i) => {
        const s = start + 4 + i * 3;
        return (
          <div
            key={it.label + i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "11px 12px",
              borderRadius: 12,
              background: it.active ? "rgba(11,11,15,0.05)" : "transparent",
              color: it.active ? theme.colors.ink : theme.colors.inkMuted,
              fontSize: 13.5,
              fontWeight: it.active ? 600 : 500,
              letterSpacing: "-0.005em",
              ...fadeUp(frame, s, 14, 10),
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: it.active ? theme.colors.ink : "rgba(11,11,15,0.18)",
                opacity: it.active ? 1 : 0.6,
                flexShrink: 0,
              }}
            />
            <span style={{ flex: 1 }}>{it.label}</span>
            {it.expanded && (
              <span style={{ fontSize: 10, opacity: 0.5 }}>▾</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const DEFAULT_NAV: NavItem[] = [
  { label: "Dashboard" },
  { label: "Accounts", expanded: true },
  { label: "FX Calculator" },
  { label: "Cards", active: true },
  { label: "Transactions" },
  { label: "Recipients" },
  { label: "Yield" },
];
