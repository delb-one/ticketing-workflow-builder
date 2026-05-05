"use client";

import { useWorkflowStore } from "@/lib/store";
import { Minus, Plus, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomPanel } from "@/components/molecules/CustomPanel";

export function TicketPanel() {
  const { isSimulating, simulationConfig, updateSimulationConfig } =
    useWorkflowStore();

  return (
    <CustomPanel value="controls" title="Ticket Pool" icon={Ticket}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
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
                        ticketCount: Math.max(1, simulationConfig.ticketCount - 1),
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
                        ticketCount: Math.min(50, simulationConfig.ticketCount + 1),
                      })
                    }
                    disabled={isSimulating || simulationConfig.ticketCount >= 50}
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
