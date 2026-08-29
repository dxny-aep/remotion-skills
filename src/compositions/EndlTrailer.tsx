import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { SCENE_DURATIONS, SCENE_STARTS } from "../constants/easing";
import { Scene01_One, Scene02_Platform } from "../scenes/ActI_Hook";
import { Scene03_DashboardGold } from "../scenes/ActII_Manage";
import {
  Scene04_SendForm,
  Scene05_SendReview,
  Scene06_SendHero,
} from "../scenes/ActIII_Send";
import {
  Scene07_Deposit,
  Scene08_BalanceGreen,
  Scene09_ReceiveHero,
} from "../scenes/ActIV_Receive";
import {
  Scene10_CardsPurple,
  Scene11_CardPage,
  Scene12_SpendHero,
} from "../scenes/ActV_Spend";
import {
  Scene13_ConvertUI,
  Scene14_ConvertHero,
} from "../scenes/ActVI_Convert";
import {
  Scene15_Transactions,
  Scene16_ManageHero,
  Scene17_Recipients,
} from "../scenes/ActVII_Manage";
import { Scene18_MoveMoney, Scene19_EndlCTA } from "../scenes/ActVIII_Close";

/**
 * Wrapper that sources a scene's local frame from useCurrentFrame and
 * Sequence offset, then passes it down. Keeps each scene self-contained.
 */
const SceneFrame: React.FC<{
  Component: React.FC<{ localFrame: number; duration: number }>;
  duration: number;
}> = ({ Component, duration }) => {
  const frame = useCurrentFrame();
  return <Component localFrame={frame} duration={duration} />;
};

const SCENES: React.FC<{ localFrame: number; duration: number }>[] = [
  Scene01_One,
  Scene02_Platform,
  Scene03_DashboardGold,
  Scene04_SendForm,
  Scene05_SendReview,
  Scene06_SendHero,
  Scene07_Deposit,
  Scene08_BalanceGreen,
  Scene09_ReceiveHero,
  Scene10_CardsPurple,
  Scene11_CardPage,
  Scene12_SpendHero,
  Scene13_ConvertUI,
  Scene14_ConvertHero,
  Scene15_Transactions,
  Scene16_ManageHero,
  Scene17_Recipients,
  Scene18_MoveMoney,
  Scene19_EndlCTA,
];

/**
 * Fonts (DM Sans via Google CDN).
 */
const Fonts: React.FC = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
      * { box-sizing: border-box; }
    `}
  </style>
);

const EndlTrailer: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Global fade-in (first 8 frames) and fade-out (last 14 frames)
  const fadeIn = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames - 1],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const globalOpacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Fonts />
      <AbsoluteFill style={{ opacity: globalOpacity }}>
        {SCENES.map((Component, i) => {
          const start = SCENE_STARTS[i];
          const dur = SCENE_DURATIONS[i];
          return (
            <Sequence
              key={i}
              from={start}
              durationInFrames={dur}
              layout="none"
            >
              <SceneFrame Component={Component} duration={dur} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default EndlTrailer;
