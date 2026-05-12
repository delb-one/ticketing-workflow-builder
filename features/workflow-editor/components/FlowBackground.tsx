"use client";

import { Background, BackgroundVariant, useViewport } from "@xyflow/react";

interface FlowBackgroundProps {
  mouse: {
    x: number;
    y: number;
  };
}

export function FlowBackground({ mouse }: FlowBackgroundProps) {
  const { x, y, zoom } = useViewport();

  const GAP = 24;
  const DOT_SIZE = 1;

  return (
    <>
      {/* Base dots */}
      <Background
        variant={BackgroundVariant.Dots}
        gap={GAP}
        size={DOT_SIZE}
        // color="#262626"
      />

      {/* Highlighted dots */}
      <div
        className="pointer-events-none absolute inset-0 z-0 mix-blend-screen"
        style={{
          maskImage: `
      radial-gradient(
        180px circle at ${mouse.x}px ${mouse.y}px,
        white,
        transparent 70%
      )
    `,
          WebkitMaskImage: `
      radial-gradient(
        180px circle at ${mouse.x}px ${mouse.y}px,
        white,
        transparent 70%
      )
    `,

          backgroundImage: `
  radial-gradient(
    circle,
    rgba(255,255,255,0.80) ${(DOT_SIZE / 2) * zoom}px,
    rgba(255,255,255,0.80) ${(DOT_SIZE / 2) * zoom}px,
    transparent ${DOT_SIZE * zoom * 3}px
  )
`,

          backgroundSize: `
      ${GAP * zoom}px ${GAP * zoom}px
    `,

          backgroundPosition: `
      ${x + GAP * zoom}px
      ${y + GAP * zoom}px
    `,
        }}
      />
    </>
  );
}
