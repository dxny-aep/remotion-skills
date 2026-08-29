import { Easing } from "remotion";

// Primary ease — long tail, like Figma reels
export const CUBIC = Easing.bezier(0.57, 0.01, 0, 0.99);
// Snappy out — for punches & reveals
export const OUT_EXPO = Easing.bezier(0.16, 1, 0.3, 1);
// In-out — for camera moves
export const IN_OUT_CUBIC = Easing.bezier(0.65, 0, 0.35, 1);
// Smooth out — for drifts
export const OUT_QUINT = Easing.bezier(0.22, 1, 0.36, 1);

export const easingConfig = {
  easing: CUBIC,
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Scene durations at 24fps — matches the approved TIMELINE
export const SCENE_DURATIONS = [
  36, // 1: One
  42, // 2: platform to...
  84, // 3: Dashboard gold
  60, // 4: Send form blue
  60, // 5: Review blue
  72, // 6: "Send" + UI
  60, // 7: Deposit green
  72, // 8: Balance green
  84, // 9: "Receive" + Card
  72, // 10: Cards purple
  60, // 11: Card page
  72, // 12: "Spend" + FX
  72, // 13: Convert UI
  36, // 14: Convert headline
  72, // 15: Transactions
  84, // 16: "Manage" + ledger
  72, // 17: Recipients gold
  48, // 18: "and move money..."
  84, // 19: Endl CTA
] as const;

export const SCENE_STARTS = SCENE_DURATIONS.reduce<number[]>((acc, d, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + SCENE_DURATIONS[i - 1]);
  return acc;
}, []);

export const TOTAL_FRAMES = SCENE_DURATIONS.reduce((a, b) => a + b, 0);
