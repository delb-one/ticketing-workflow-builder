import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { SimulationTool, ToolsContainerPanelProps } from "./types";
import { tools } from "./data";
import { useAgent } from "../../hooks/useAgent";
import { useTicket } from "../../hooks/useTicket";
import { useQueue } from "../../hooks/useQueue";

export function ToolsContainerPanel({
  activeToolIds,
  onToolToggle,
  onCloseAll,
}: ToolsContainerPanelProps) {
  const CLOSE_PANELS_TOOL_ID = "close-panels";
  const activeToolSet = useMemo(() => new Set(activeToolIds), [activeToolIds]);
  const { totalAgents } = useAgent();
  const { totalTickets } = useTicket();
  const { totalWaiting } = useQueue();

  const getStatusLabel = (status?: SimulationTool["status"]) => {
    switch (status) {
      case "coming-soon":
        return "Coming soon";
      default:
        return null;
    }
  };

  // const closeTools = tools.pop();

  const badgeCounts = {
    agents: totalAgents,
    tickets: totalTickets,
    queue: totalWaiting,
  } as const;

  return (
    <div className="flex justify-center items-center gap-3 px-3 py-2 rounded-xl bg-background/50 border backdrop-blur ">
      {tools.map((tool) => {
        const statusLabel = getStatusLabel(tool.status);
        const badgeCount = tool.badgeKey ? badgeCounts[tool.badgeKey] : null;
        const isCloseTool = tool.id === CLOSE_PANELS_TOOL_ID;

        return (
          <div key={tool.id} className="flex items-stretch">
            {isCloseTool && (
              <div className="w-px self-stretch bg-border mr-3" />
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() =>
                    isCloseTool ? onCloseAll() : onToolToggle(tool.id)
                  }
                  className={cn(
                    "relative p-2 rounded-md border-none shadow-none transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    !isCloseTool &&
                      (activeToolSet.has(tool.id)
                        ? [
                            "bg-linear-to-br from-primary to-primary/70",
                            "text-primary-foreground",
                            "[&_svg]:text-primary-foreground",
                            "[&_svg]:stroke-current",
                            "border border-primary/20",
                            "shadow-[0_0_20px_hsl(var(--primary)/0.25)]",
                            "hover:brightness-110",
                          ]
                        : "hover:bg-muted/60"),
                    isCloseTool && "hover:bg-muted/60",
                    tool.status && "opacity-70",
                    tool.status === "coming-soon" && "cursor-not-allowed",
                  )}
                  disabled={tool.status === "coming-soon"}
                >
                  <tool.icon className="w-4 h-4 text-primary" />

                  {badgeCount !== null && badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full border  bg-amber-200 text-black text-[10px] font-semibold flex items-center justify-center  z-10">
                      {badgeCount}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="text-xs bg-background text-primary border border-border py-2 max-w-56"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium leading-tight">
                      {tool.name}
                    </span>
                    {tool.shortcut !== undefined && (
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground border  px-1.5 py-0.5">
                        CTRL + {tool.shortcut}
                      </span>
                    )}

                    {statusLabel && (
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground border rounded-md px-1.5 py-0.5">
                        {statusLabel}
                      </span>
                    )}
                  </div>
                  {tool.id !== CLOSE_PANELS_TOOL_ID && (
                    <div className="h-px w-full bg-border" />
                  )}

                  <span className="text-muted-foreground text-xs leading-snug">
                    {tool.description}
                  </span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
}
