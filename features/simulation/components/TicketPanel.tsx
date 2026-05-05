"use client";

import { useWorkflowStore } from "@/lib/store";
import { Minus, Plus, Ticket , GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DEFAULT_STEP_DELAY_MS = 900;

export  function TicketPanel() {
  const { isSimulating, simulationConfig, updateSimulationConfig } =
    useWorkflowStore();

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className=" h-full pointer-events-auto  active:cursor-grabbing"
      >
        <Card className="w-50 panel-drag-handle p-0 bg-card/70 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden">
          <AccordionItem value="controls" className=" flex flex-col h-full">
            <div className="flex justify-center bg-secondary/50">
              <GripHorizontal className="w-4 h-4 text-primary/70" />
            </div>
            <AccordionTrigger
              value="controls"
              className="p-4  shrink-0 hover:no-underline"
            >
              <div className="flex items-center gap-2">
                <Ticket  className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-primary text-sm">
                  Ticket Pool
                </h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-2">
              <div className="flex flex-col gap-4">
                {/* TICKETS */}
                <div className="flex flex-col gap-1">
                  <TooltipProvider>
                    <div className="flex items-center gap-1">
                      {/* REMOVE */}
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
                            disabled={
                              isSimulating || simulationConfig.ticketCount <= 1
                            }
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

                      {/* COUNT */}
                      <div className="flex-1 h-8 w-auto flex items-center justify-center bg-background/50 border rounded-md text-xs font-medium">
                        {simulationConfig.ticketCount}
                      </div>

                      {/* ADD */}
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
            </AccordionContent>
          </AccordionItem>
        </Card>
      </Accordion>
    </>
  );
}
