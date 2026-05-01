"use client";

import { useWorkflowStore } from "@/lib/store";
import { Users, Briefcase, Settings2, Minus, Plus, Headphones, UserCog, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const levelIcons = {
  l1: Headphones,
  l2: UserCog,
  l3: Cpu,
};
export function AgentPanel() {
  const { engineState, isSimulating, simulationConfig, updateSimulationConfig } = useWorkflowStore();
  const agents = engineState?.agents ?? [];

  return (
    <Accordion type="single" collapsible >
      <div className="bg-card/70 rounded-xl p-4 border border-card-800/80 backdrop-blur-md flex flex-col h-full overflow-hidden">
        <AccordionItem value="agent-pool" className="border-0">
          <AccordionTrigger className="py-0 mb-4 hover:no-underline">
            <div className="flex gap-2 items-center">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-primary text-sm">Agent Pool</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            {!isSimulating ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2 mb-3">
                  <Settings2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">Pool Configuration</span>
                </div>
                {(['l1', 'l2', 'l3'] as const).map((level) => {
                  const Icon = levelIcons[level];

                  return (
                    <div
                      key={level}
                      className="flex justify-between items-center gap-2 bg-card-800/30 px-2 py-1.5 rounded-md border border-card-700/30"
                    >
                      {/* ICON + LABEL */}
                      <div className="flex items-center gap-1 w-16 shrink-0">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          {level}
                        </span>
                      </div>

                      {/* STEPPER */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-card-700/50"
                          onClick={() =>
                            updateSimulationConfig({
                              agents: {
                                ...simulationConfig.agents,
                                [level]: Math.max(
                                  0,
                                  simulationConfig.agents[level] - 1
                                ),
                              },
                            })
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>

                        <div className="h-6 min-w-[24px] px-1 flex items-center justify-center bg-background/30 border border-card-700/50 rounded-md text-[10px] font-medium">
                          {simulationConfig.agents[level]}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-card-700/50"
                          onClick={() =>
                            updateSimulationConfig({
                              agents: {
                                ...simulationConfig.agents,
                                [level]: Math.min(
                                  20,
                                  simulationConfig.agents[level] + 1
                                ),
                              },
                            })
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-y-auto space-y-2 flex-1 pr-1 custom-scrollbar">
                {agents.length === 0 ? (
                  <div className="text-xs text-primary-500 text-center py-4">
                    No agents active
                  </div>
                ) : (
                  agents.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex flex-col p-3 rounded-lg bg-card-800/60 border border-card-700/60 backdrop-blur-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-primary-300">
                          {agent.level.toUpperCase()} Agent
                        </span>
                        <Badge
                          variant={
                            agent.status === "available" ? "secondary" : "default"
                          }
                          className={
                            agent.status === "available"
                              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20"
                          }
                        >
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-primary-400">
                        <Briefcase className="w-3 h-3" />
                        <span className="truncate">
                          {agent.currentTicketId
                            ? agent.currentTicketId.replace("ticket-", "")
                            : "Idle"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </div>
    </Accordion>
  );
}
