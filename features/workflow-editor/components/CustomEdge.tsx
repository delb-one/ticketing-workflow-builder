import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";

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
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
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

      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <div
              className={cn(
                "group flex items-center gap-1.5 rounded-full border bg-card/90 px-2.5 py-1 text-[10px] font-bold tracking-tight text-foreground shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all hover:scale-105 hover:shadow-md",
                selected ? "border-primary ring-1 ring-primary/20" : "border-border/50",
              )}
              style={{
                borderLeftColor: selected ? undefined : color,
                borderLeftWidth: selected ? undefined : "3px",
              }}
            >
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm opacity-90">{label}</span>
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
