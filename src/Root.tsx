import React from "react";
import { Composition } from "remotion";
import EndlTrailer from "./compositions/EndlTrailer";
import { theme } from "./constants/theme";
import { TOTAL_FRAMES } from "./constants/easing";

const Root: React.FC = () => {
  const { width, height, fps } = theme.composition;

  return (
    <>
      <Composition
        id="EndlTrailer"
        component={EndlTrailer}
        durationInFrames={TOTAL_FRAMES}
        fps={fps}
        width={width}
        height={height}
      />
    </>
  );
};

export default Root;
