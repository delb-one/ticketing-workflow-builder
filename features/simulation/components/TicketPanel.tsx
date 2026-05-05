"use client";

import { useWorkflowStore } from "@/lib/store";
import { Minus, Plus, Settings2, Tickets } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { Badge } from "@/components/ui/badge";

export function TicketPanel() {
  const { isSimulating, simulationConfig, updateSimulationConfig } =
    useWorkflowStore();
const totalTickets= simulationConfig.ticketCount
  return (
    <CustomPanel
      value="controls"
      title="Ticket Pool"
      icon={Tickets}
      badge={
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 h-5 px-1.5 text-[10px] font-bold min-w-5 flex items-center justify-center rounded-full"
        >
          {totalTickets}
        </Badge>
      }
    >
      <div className="space-y-3 pt-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              Tickets to spawn
            </span>
          </div>
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() =>
                      updateSimulationConfig({
                        ticketCount: Math.max(
                          1,
                          simulationConfig.ticketCount - 1,
                        ),
                      })
                    }
                    disabled={isSimulating || simulationConfig.ticketCount <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="text-xs bg-background text-primary dark:bg-background dark:text-primary border border-border"
                >
                  Remove ticket
                </TooltipContent>
              </Tooltip>

              <div className="flex-1 h-8 w-auto flex items-center justify-center bg-background/50 border rounded-md text-xs font-medium">
                {simulationConfig.ticketCount}
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() =>
                      updateSimulationConfig({
                        ticketCount: Math.min(
                          50,
                          simulationConfig.ticketCount + 1,
                        ),
                      })
                    }
                    disabled={
                      isSimulating || simulationConfig.ticketCount >= 50
                    }
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="text-xs bg-background text-primary dark:bg-background dark:text-primary border border-border"
                >
                  Add ticket
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </CustomPanel>
  );
}
