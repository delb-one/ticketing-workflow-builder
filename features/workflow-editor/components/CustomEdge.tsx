import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

import { cn } from "@/lib/utils";
import { url } from "inspector";
import { hover } from "framer-motion";
import { useState } from "react";

const PARTICLE_COUNT = 6;
const ANIMATE_DURATION = 6;

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  const color = (data?.color as string) ?? "var(--primary)";
  const gradientId = `edge-gradient-${id}`;
  return (
    <>
      <defs>
        <radialGradient
          id={gradientId}
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </radialGradient>
      </defs>
      {/* BASE EDGE */}
      <BaseEdge
        id={id}
        path={edgePath}
        className={cn("edge", selected && "edge--active")}
        style={{
          stroke: color,
          filter: selected
            ? `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 14px ${color})`
            : `drop-shadow(0 0 4px ${color})`,
        }}
      />

      {/* PARTICLES (flow) */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <ellipse
          key={`${id}-particle-${i}`}
          rx="5"
          ry="1.8"
          fill={`url(#${gradientId})`}
          opacity="0.85"
        >
          <animateMotion
            path={edgePath}
            dur={`${ANIMATE_DURATION}s`}
            repeatCount="indefinite"
            begin={`${-i * (ANIMATE_DURATION / PARTICLE_COUNT)}s`}
            rotate="auto"
            calcMode="spline"
            keySplines="0.42, 0, 0.58, 1.0"
          />
        </ellipse>
      ))}
    </>
  );
}
