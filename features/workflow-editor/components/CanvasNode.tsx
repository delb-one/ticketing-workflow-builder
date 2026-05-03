"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { getNodeIcon } from "@/lib/node-icons";
import { useWorkflowStore } from "@/lib/store";
import { CanvasNodeProps } from "@/lib/canvasNode/types";
import { TYPE_LABEL_MAP, TYPE_THEME_MAP } from "@/lib/canvasNode/color-map";
import {
  getCssVarColor,
  getNodeTypeBackgroundGradient,
  getNodeTypeIconGradient,
} from "@/lib/colors/color-map";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CanvasNode(props: CanvasNodeProps) {
  const { setSelectedNode, engineState } = useWorkflowStore();
  const { data, selected, id, isConnecting } = props;
  const activeTickets = engineState
    ? Object.values(engineState.runtimes).filter(
      (r) => r.currentNodeId === id && !r.completed,
    )
    : [];
  const activeTicketCount = activeTickets.length;
  const isActive = activeTicketCount > 0;
  const theme = TYPE_THEME_MAP[data.type];
  const blockId = data.blockId ?? data.id;
  const Icon = getNodeIcon(data.type, blockId);
  const isAutomation = data.type === "automation";
  const subtitle = blockId
    ? blockId.replace(/-/g, " ")
    : TYPE_LABEL_MAP[data.type];

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={() => setSelectedNode(id)}
      className={`group relative min-w-55 cursor-pointer rounded-xl  p-px shadow-lg transition-all ${selected ? "ring-1 ring-primary ring-offset-2" : ""} ${isActive ? "scale-[1.01] shadow-xl" : ""} ${isConnecting ? "opacity-40" : ""}`}
    >
      <div
        className={`relative rounded-[11px] border border-border/70  bg-card px-3 py-3 backdrop-blur-sm `}
        style={{
          borderColor: getCssVarColor(theme.color),
          backgroundImage: getNodeTypeBackgroundGradient(data.type),
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br  text-primary`}
            style={{ backgroundImage: getNodeTypeIconGradient(data.type) }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">
              {data.label}
            </div>
            <div
              className={`mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] `}
              style={{ color: getCssVarColor(theme.softText) }}
            >
              {subtitle}
            </div>
          </div>
        </div>

        {isActive && (
          <motion.div
            animate={{ opacity: [0.16, 0.35, 0.16] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 rounded-[11px]"
            style={{ backgroundColor: getCssVarColor(theme.gradient) }}
          />
        )}

        {activeTicketCount > 0 && (
          <div className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-white shadow-md ring-2 ring-background">
            🎫 {activeTicketCount}
          </div>
        )}
      </div>
      {}
      {data.type !== "start" && (
        <Handle
          type="target"
          position={Position.Top}
        // className={`-top-1! h-2! w-2!   `}
        // style={{ backgroundColor: getCssVarColor(theme.handle) }}
        />
      )}
      {data.type !== "end" && (
        <Handle
          type="source"
          position={Position.Bottom}
        // className={`-bottom-1! h-2! w-2! `}
        // style={{ backgroundColor: getCssVarColor(theme.handle) }}
        />
      )}
    </motion.div>
        </TooltipTrigger>
        {isActive && (
          <TooltipContent
            side="top"
            className="max-w-64 text-xs bg-background text-primary border border-border"
          >
            <div className="font-semibold mb-1">Tickets in this node</div>
            <div className="space-y-1">
              {activeTickets.map((runtime) => (
                <div key={runtime.ticket.id} className="font-mono text-[11px]">
                  {runtime.ticket.id} ({runtime.ticket.state})
                </div>
              ))}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
