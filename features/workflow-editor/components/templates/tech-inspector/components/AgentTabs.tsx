"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Agent } from "../TechInspectorTemplate";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

interface AgentListProps {
  customAgents: Agent[];
  defaultAgents: Agent[];
  selectedAgents: string[];
  activeAgentId: string | null;
  isSelectionMode: boolean;
  activeTab: string;
  onTabChange: (value: string) => void;
  handleAgentSelection: (agent: Agent) => void;
}

export const AgentTabs = ({
  customAgents,
  defaultAgents,
  selectedAgents,
  activeAgentId,
  isSelectionMode,
  activeTab,
  onTabChange,
  handleAgentSelection,
}: AgentListProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-2">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-1 flex-col min-h-0">
        <TabsList variant="line" className="shrink-0">
          <TabsTrigger value="custom-agents">
            {" "}
            Custom Agents ({customAgents.length})
          </TabsTrigger>
          <TabsTrigger value="default-agents">
            Default Agents ({defaultAgents.length})
          </TabsTrigger>
        </TabsList>
        {/* CUSTOM AGENTS */}
        <TabsContent value="custom-agents" className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-3">
            <div className="grid grid-cols-2 gap-2 mt-2">
              {customAgents.map((agent) => {
                const isHighlighted = isSelectionMode
                  ? selectedAgents.includes(agent.id)
                  : activeAgentId === agent.id;

                return (
                  <div
                    key={agent.id}
                    onClick={() => handleAgentSelection(agent)}
                    className={`flex items-center gap-2 p-1 rounded cursor-pointer border transition-all ${isSelectionMode ? "border-dashed" : "border-solid"
                      } ${isHighlighted
                        ? "bg-primary/10 border-primary border-solid"
                        : isSelectionMode
                          ? "border-muted-foreground/30 hover:bg-muted"
                          : "border-transparent hover:bg-muted"
                      }`}
                  >
                    {/* STATUS */}
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${agent.status === "busy"
                        ? "bg-orange-500"
                        : "bg-green-500"
                        }`}
                    />

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {agent.name}
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        Custom
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* DEFAULT AGENTS */}
        <TabsContent value="default-agents" className="flex-1 min-h-0">
          {" "}
          <ScrollArea className="h-full pr-3">
            <div className="grid grid-cols-2 gap-2 mt-2">
              {defaultAgents.map((agent) => {
                const isHighlighted = isSelectionMode
                  ? selectedAgents.includes(agent.id)
                  : activeAgentId === agent.id;

                return (
                  <div
                    key={agent.id}
                    onClick={() => handleAgentSelection(agent)}
                    className={`flex items-center gap-2 p-1 rounded cursor-pointer border transition-all ${isSelectionMode ? "border-dashed" : "border-solid"
                      } ${isHighlighted
                        ? "bg-primary/10 border-primary border-solid"
                        : isSelectionMode
                          ? "border-muted-foreground/30 hover:bg-muted"
                          : "border-transparent hover:bg-muted"
                      }`}
                  >
                    {/* STATUS */}
                    <div
                      className={`h-2 w-2 rounded-full shrink-0 ${agent.status === "busy"
                        ? "bg-orange-500"
                        : "bg-green-500"
                        }`}
                    />

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {agent.name}
                      </p>

                      <p className="text-[10px] text-muted-foreground">
                        Default
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
