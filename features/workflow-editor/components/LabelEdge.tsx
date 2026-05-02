"use client";

import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";

export default function LabelEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const strokeColor = style.stroke || "var(--primary)";

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2,
          transition: "stroke-width 0.2s ease",
        }}
      />
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
              className={`group flex items-center gap-1.5 rounded-full border bg-card/90 px-2.5 py-1 text-[10px] font-bold tracking-tight text-foreground shadow-[0_2px_10px_-3px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all hover:scale-105 hover:shadow-md ${selected ? "border-primary ring-1 ring-primary/20" : "border-border/50"
                }`}
              style={{
                borderLeftColor: selected ? undefined : strokeColor,
                borderLeftWidth: selected ? undefined : "3px",
              }}
            >
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: strokeColor }}
              />
              <span className="opacity-90 text-sm ">{label}</span>
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
