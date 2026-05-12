import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

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
        className={cn("edge")}
        style={{
          stroke: color,
          strokeWidth: selected ? 2.5 : 1,
          filter: selected
            ? `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${color}) drop-shadow(0 0 32px ${color})`
            : `drop-shadow(0 0 2px ${color})`,
        }}
      />

      {/* PARTICLES (flow) */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <ellipse
          key={`${id}-particle-${i}`}
          rx={selected ? "6.4" : "4.6"}
          ry={selected ? "2.4" : "1.6"}
          fill={`url(#${gradientId})`}
          opacity={selected ? 1 : 0.7}
        >
          <animateMotion
            path={edgePath}
            dur={selected ? `${ANIMATE_DURATION * 0.3}` : `${ANIMATE_DURATION}`}
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
