"use client";

import { useWorkflowStore } from "@/lib/store";
import {
  Users,
  Briefcase,
  Settings2,
  Minus,
  Plus,
  Headphones,
  UserCog,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomPanel } from "@/components/molecules/CustomPanel";

const levelIcons = {
  l1: Headphones,
  l2: UserCog,
  l3: Cpu,
};
export function AgentPanel() {
  const {
    engineState,
    isSimulating,
    simulationConfig,
    updateSimulationConfig,
  } = useWorkflowStore();
  const agents = engineState?.agents ?? [];

  return (
    <CustomPanel value="agent-pool" title="Agent Pool" icon={Users}>
      {!isSimulating ? (
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              Pool Configuration
            </span>
          </div>
          {(["l1", "l2", "l3"] as const).map((level) => {
            const Icon = levelIcons[level];

            return (
              <div
                key={level}
                className="flex justify-between items-center gap-2 bg-card-800/30 px-2 py-1.5 rounded-md border border-card-700/30"
              >
                <div className="flex items-center gap-1 w-16 shrink-0">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">
                    {level}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-card-700/50"
                    onClick={() =>
                      updateSimulationConfig({
                        agents: {
                          ...simulationConfig.agents,
                          [level]: Math.max(0, simulationConfig.agents[level] - 1),
                        },
                      })
                    }
                  >
                    <Minus className="h-3 w-3" />
                  </Button>

                  <div className="h-6 min-w-6 px-1 flex items-center justify-center bg-background/30 border border-card-700/50 rounded-md text-[10px] font-medium">
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
                          [level]: Math.min(20, simulationConfig.agents[level] + 1),
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
        <ScrollArea className="w-full pr-2">
          <div className="max-h-80 space-y-2">
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
                      {agent.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          agent.status === "available"
                            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                            : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] animate-pulse"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-primary-400">
                    <Briefcase className="w-3 h-3" />
                    <span className="truncate">
                      {agent.currentTicketId ? agent.currentTicketId : "Idle"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </CustomPanel>
  );
}
