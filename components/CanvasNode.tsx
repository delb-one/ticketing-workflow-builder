"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { getNodeIcon } from "@/lib/node-icons";
import { useWorkflowStore } from "@/lib/store";
import { CanvasNodeProps } from "@/lib/canvasNode/types";
import { TYPE_LABEL_MAP, TYPE_THEME_MAP } from "@/lib/canvasNode/color-map";

export default function CanvasNode(props: CanvasNodeProps) {
  const { setSelectedNode, engineState } = useWorkflowStore();
  const { data, selected, id, isConnecting } = props;
  const activeTicketCount = engineState
    ? Object.values(engineState.runtimes).filter((r) => r.currentNodeId === id && !r.completed).length
    : 0;
  const isActive = activeTicketCount > 0;
  const theme = TYPE_THEME_MAP[data.type];
  const blockId = data.blockId ?? data.id;
  const Icon = getNodeIcon(data.type, blockId);
  const isAutomation = data.type === "automation";
  const subtitle = blockId
    ? blockId.replace(/-/g, " ")
    : TYPE_LABEL_MAP[data.type];

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => setSelectedNode(id)}
      className={`group relative min-w-55 cursor-pointer rounded-xl  p-px shadow-lg transition-all ${selected ? "ring-2 ring-primary-foreground ring-offset-2" : ""} ${isActive ? "scale-[1.01] shadow-xl" : ""} ${isConnecting ? "opacity-40" : ""}`}
    >
      <div
        className={`relative rounded-[11px] border border-border/70 border-${theme.color} bg-card px-3 py-3 backdrop-blur-sm ${isAutomation ? "border-dashed" : ""}`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${theme.gradient} text-background`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">
              {data.label}
            </div>
            <div
              className={`mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${theme.softText}`}
            >
              {subtitle}
            </div>
          </div>
        </div>

        {isActive && (
          <motion.div
            animate={{ opacity: [0.16, 0.35, 0.16] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className={`pointer-events-none absolute inset-0 rounded-[11px] bg-linear-to-r ${theme.gradient}`}
          />
        )}
        
        {activeTicketCount > 0 && (
          <div className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-primary shadow-md ring-2 ring-background">
            🎫 {activeTicketCount}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className={`-top-1.5! h-3! w-3! border-2! border-card! transition-transform group-hover:scale-110! ${theme.handle}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`-bottom-1.5! h-3! w-3! border-2! border-card! transition-transform group-hover:scale-110! ${theme.handle}`}
      />
    </motion.div>
  );
}
