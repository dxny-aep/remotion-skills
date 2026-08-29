export const theme = {
  colors: {
    // Brand
    primaryBlue: "#245FFF",
    purple: "#885BF0",
    green: "#1E8E56",
    gold: "#C38F42",
    goldSoft: "#d8b171",
    // Neutrals
    background: "#0A0A0F",
    surface: "#111118",
    border: "rgba(15,15,20,0.08)",
    borderStrong: "rgba(15,15,20,0.12)",
    white: "#FFFFFF",
    offWhite: "#F6F6F4",
    light: "#EEEDE8",
    // Text (on white panel)
    ink: "#0B0B0F",
    inkMuted: "rgba(11,11,15,0.55)",
    inkFaint: "rgba(11,11,15,0.32)",
    // Text on dark
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(255,255,255,0.72)",
    textTertiary: "rgba(255,255,255,0.40)",
  },
  typography: {
    fontFamily: "'DM Sans', sans-serif",
    weights: {
      headlineMax: 700,
      headline: 600,
      label: 500,
      body: 400,
    },
    // Tracking scale keyed to font-size (px)
    tracking: (sizePx: number): string => {
      if (sizePx >= 120) return "-0.055em"; // display: "One", "Send", "Endl"
      if (sizePx >= 80) return "-0.045em";
      if (sizePx >= 56) return "-0.035em";
      if (sizePx >= 36) return "-0.025em";
      if (sizePx >= 24) return "-0.015em";
      if (sizePx >= 16) return "-0.005em";
      return "0em";
    },
  },
  composition: {
    width: 1920,
    height: 1080,
    fps: 24, // cinematic, per motion skill
    durationInFrames: 1242,
  },
  // Scene palette by act — tells the story in color
  scenePalette: {
    white: { bg: "#F6F6F4", ink: "#0B0B0F", accent: "#245FFF" },
    gold: { bg: "#d8b171", ink: "#0B0B0F", accent: "#C38F42" },
    blue: { bg: "#245FFF", ink: "#FFFFFF", accent: "#FFFFFF" },
    green: { bg: "#1E8E56", ink: "#FFFFFF", accent: "#FFFFFF" },
    purple: { bg: "#885BF0", ink: "#FFFFFF", accent: "#FFFFFF" },
    light: { bg: "#EEEDE8", ink: "#0B0B0F", accent: "#245FFF" },
  },
} as const;

export type Theme = typeof theme;
export type PaletteName = keyof typeof theme.scenePalette;
