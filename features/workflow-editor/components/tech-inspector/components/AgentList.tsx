"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Agent } from "../TechInspector";
interface AgentListProps {
  agents: Agent[];
  selectedAgents: string[];
  activeAgentId: string | null;
  isSelectionMode: boolean;
  handleAgentSelection: (agent: Agent) => void;
}

export const AgentList = ({
  agents,
  selectedAgents,
  activeAgentId,
  isSelectionMode,
  handleAgentSelection,
}: AgentListProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-2">
      <ScrollArea className="h-full pr-3">
        <div className="grid grid-cols-2 gap-2 mt-2">
          {agents.map((agent) => {
            const isHighlighted = isSelectionMode
              ? selectedAgents.includes(agent.id)
              : activeAgentId === agent.id;

            return (
              <div
                key={agent.id}
                onClick={() => handleAgentSelection(agent)}
                className={`flex items-center gap-2 p-1 rounded cursor-pointer border transition-all ${
                  isSelectionMode ? "border-dashed" : "border-solid"
                } ${
                  isHighlighted
                    ? "bg-primary/10 border-primary border-solid"
                    : isSelectionMode
                      ? "border-muted-foreground/30 hover:bg-muted"
                      : "border-transparent hover:bg-muted"
                }`}
              >
                {/* STATUS */}
                <div
                  className={`h-2 w-2 rounded-full shrink-0 ${
                    agent.status === "busy" ? "bg-orange-500" : "bg-green-500"
                  }`}
                />

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{agent.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    EFF: {agent.efficiency}, CAP: {agent.capacity},
                    {agent.skills?.length
                      ? ` Skills: ${agent.skills.join(", ")}`
                      : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
