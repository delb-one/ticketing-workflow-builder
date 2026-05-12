"use client";

import { Handle, Position, useReactFlow } from "@xyflow/react";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export default function CanvasNode(props: CanvasNodeProps) {
  const { updateNodeData, deleteElements } = useReactFlow();
  const { setSelectedNode, engineState, simulationConfig, isSimulating } =
    useWorkflowStore();
  const { data, selected, id, isConnecting } = props;

  const deleteNode = () => deleteElements({ nodes: [{ id }] });

  const activeTickets = engineState
    ? Object.values(engineState.runtimes).filter(
        (r) => r.currentNodeId === id && !r.completed,
      )
    : [];
  const configuredAgentCount = (() => {
    if (data.type !== "actor") return 0;
    const actorLevel =
      data.config?.nodeType === "actor" ? data.config.agentLevel : undefined;
    if (actorLevel === "l1" || actorLevel === "l2" || actorLevel === "l3") {
      return simulationConfig.agentPool.filter(
        (agent) => agent.level === actorLevel,
      ).length;
    }
    return 0;
  })();
  const activeTicketCount = activeTickets.length;
  const isActive = activeTicketCount > 0;
  const theme = TYPE_THEME_MAP[data.type];
  const blockId = data.blockId ?? data.id;
  const Icon = getNodeIcon(data.type, blockId);
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
            className={`group relative min-w-55 cursor-pointer rounded-xl p-0 shadow-lg transition-all  ${isActive ? "scale-[1.01] shadow-xl" : ""} ${isConnecting ? "opacity-40" : ""}`}
            style={
              selected
                ? {
                    boxShadow: `0 0 10px ${getCssVarColor(theme.color)}, 0 0 18px ${getCssVarColor(theme.color)}`,
                  }
                : isActive
                  ? {
                      boxShadow: `0 0 6px ${getCssVarColor(theme.color)}, 0 0 12px ${getCssVarColor(theme.color)}`,
                    }
                : undefined
            }
          >
            <div
              className={`relative rounded-[11px] border bg-card px-3 py-3 backdrop-blur-sm `}
              style={{
                borderColor: getCssVarColor(theme.color),
                backgroundImage: getNodeTypeBackgroundGradient(data.type),
              }}
            >
              <div>
                <X
                  className="absolute right-2 top-2 h-4 w-4 rounded-sm p-0.5 cursor-pointer opacity-0 transition-all hover:bg-muted group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode();
                  }}
                />
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-primary"
                    style={{
                      backgroundImage: getNodeTypeIconGradient(data.type),
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <Input
                      onChange={(evt) =>
                        updateNodeData(id, { label: evt.target.value })
                      }
                      value={data.label}
                      style={
                        {
                          "--input-color": getCssVarColor(theme.color),
                        } as React.CSSProperties
                      }
                      className={` w-[90%] border-border hover:border-(--input-color) focus-visible:border-(--input-color) focus-visible:ring-(--input-color) active:border-(--input-color)`}
                    />
                  </div>
                </div>

                <div
                  className="mt-0.5 pl-10 text-[10px] font-medium uppercase tracking-[0.14em]"
                  style={{ color: getCssVarColor(theme.softText) }}
                >
                  {subtitle}
                </div>
              </div>
              {isActive && (
                <motion.div
                  animate={{ opacity: [0.16, 0.35, 0.16] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute inset-0 rounded-[11px]"
                  style={{ backgroundColor: getCssVarColor(theme.gradient) }}
                />
              )}

              {activeTicketCount > 0 && (
                <div className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-white shadow-md ring-2 ring-background">
                  🎫 {activeTicketCount}
                </div>
              )}

              {data.type === "actor" &&
                data.config?.nodeType === "actor" &&
                data.config.agentLevel !== "client" &&
                data.config.agentLevel !== "supervisor" && (
                  <div
                    className="absolute -left-2 top-2 flex h-5 min-w-5 -translate-y-1/2 items-center justify-center rounded-full px-1.5 text-xs font-bold text-primary shadow-md"
                    style={
                      {
                        "--handle-color": getCssVarColor(theme.color),

                        backgroundColor: "var(--handle-color)",

                        boxShadow: `
        0 0 0 1px var(--background),
        0 0 0 2px var(--handle-color)
      `,
                      } as React.CSSProperties
                    }
                  >
                    {configuredAgentCount}
                  </div>
                )}
            </div>

            {data.type !== "start" && (
              <Handle
                type="target"
                position={Position.Top}
                className="
      h-2.5! w-2.5!
      rounded-full!
      border!
      bg-background!
    "
                style={{
                  borderColor: getCssVarColor(theme.handle),
                  transform: "translate(-50%, -35%) ",
                }}
              />
            )}

            {data.type !== "end" && (
              <Handle
                type="source"
                position={Position.Bottom}
                className="
    h-3! w-3!
    rounded-[2px]!
  "
                style={
                  {
                    "--handle-color": getCssVarColor(theme.handle),
                    backgroundColor: "var(--handle-color)",
                    boxShadow: `0 0 0 1px var(--handle-color)`,

                    transform: "translate(-50%, 40%) rotate(45deg)",
                  } as React.CSSProperties
                }
              />
            )}
          </motion.div>
        </TooltipTrigger>
        {isSimulating && (
          <TooltipContent
            side="top"
            className="max-w-64 text-xs bg-background text-primary border border-border"
          >
            <div className="font-semibold mb-1">
              <div className="font-semibold mb-1">
                {activeTickets.length
                  ? "Tickets in this node"
                  : "No tickets in this node"}
              </div>
            </div>
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
