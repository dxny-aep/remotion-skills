import React from "react";
import { theme } from "../constants/theme";
import { scaleIn } from "../primitives/Text";

/**
 * Panel — the white rounded-rect container every Endl UI sits on top of.
 * Scene background shows through as "air" around it (gold, blue, green, etc).
 */
export const Panel: React.FC<{
  frame: number;
  start?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  children?: React.ReactNode;
  radius?: number;
  style?: React.CSSProperties;
}> = ({
  frame,
  start = 0,
  width = 1266,
  height = 920,
  x,
  y,
  children,
  radius = 56,
  style,
}) => {
  const posX = x ?? (1920 - width) / 2;
  const posY = y ?? (1080 - height) / 2;
  return (
    <div
      style={{
        position: "absolute",
        left: posX,
        top: posY,
        width,
        height,
        background: theme.colors.white,
        borderRadius: radius,
        boxShadow:
          "0 24px 72px rgba(10,10,15,0.18), 0 4px 12px rgba(10,10,15,0.08)",
        overflow: "hidden",
        ...scaleIn(frame, start, 22, 0.96),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* StatusPill */
export const StatusPill: React.FC<{
  status: "active" | "in-progress" | "frozen" | "success";
  children: React.ReactNode;
  size?: "sm" | "md";
}> = ({ status, children, size = "sm" }) => {
  const styles: Record<string, React.CSSProperties> = {
    active: {
      background: "rgba(30,142,86,0.10)",
      color: "#1E8E56",
    },
    "in-progress": {
      background: "rgba(195,143,66,0.10)",
      color: "#C38F42",
    },
    frozen: {
      background: "rgba(36,95,255,0.08)",
      color: "#245FFF",
    },
    success: {
      background: "rgba(30,142,86,0.10)",
      color: "#1E8E56",
    },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: size === "md" ? "6px 12px" : "4px 10px",
        borderRadius: 999,
        fontSize: size === "md" ? 13 : 11,
        fontWeight: 500,
        letterSpacing: "-0.005em",
        ...styles[status],
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "currentColor",
        }}
      />
      {children}
    </span>
  );
};

/* ProgressBar — animated from right */
export const ProgressBar: React.FC<{
  frame: number;
  start: number;
  target: number; // 0..1
  color?: string;
  width?: number;
  duration?: number;
}> = ({ frame, start, target, color = "#245FFF", width = 220, duration = 34 }) => {
  const t = Math.max(0, Math.min(1, (frame - start) / duration));
  const eased = 1 - Math.pow(1 - t, 3);
  const fill = eased * target;
  return (
    <div
      style={{
        width,
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
          width: `${fill * 100}%`,
          background: color,
          borderRadius: 999,
        }}
      />
    </div>
  );
};

/* Button */
export const Btn: React.FC<{
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}> = ({ label, variant = "secondary", size = "md" }) => {
  const base: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    fontSize: size === "sm" ? 13 : 14,
    fontWeight: 500,
    letterSpacing: "-0.005em",
    padding: size === "sm" ? "8px 14px" : "10px 18px",
    borderRadius: 12,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  };
  if (variant === "primary") {
    return (
      <span
        style={{
          ...base,
          background: theme.colors.primaryBlue,
          color: theme.colors.white,
        }}
      >
        {label}
      </span>
    );
  }
  if (variant === "ghost") {
    return (
      <span
        style={{
          ...base,
          color: theme.colors.ink,
          opacity: 0.7,
        }}
      >
        {label}
      </span>
    );
  }
  return (
    <span
      style={{
        ...base,
        background: theme.colors.white,
        color: theme.colors.ink,
        border: `1px solid ${theme.colors.borderStrong}`,
      }}
    >
      {label}
    </span>
  );
};

/* Logo — reused across scenes */
export const EndlLogo: React.FC<{
  size?: number;
  color?: string;
}> = ({ size = 32, color = theme.colors.ink }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        fontFamily: theme.typography.fontFamily,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: "-0.04em",
        color,
        lineHeight: 1,
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: size * 0.95,
          height: size * 0.95,
          borderRadius: size * 0.28,
          background: color,
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            left: "26%",
            top: "32%",
            width: "48%",
            height: "36%",
            borderRadius: 2,
            background: theme.colors.white,
          }}
        />
      </span>
      endl
    </div>
  );
};
