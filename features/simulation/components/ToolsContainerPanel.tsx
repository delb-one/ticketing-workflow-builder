import {
  Activity,
  ListFilter,
  Settings2,
  Terminal,
  Tickets,
  Users,
  X,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export type SimulationTool = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
};

interface ToolsContainerPanelProps {
  activeToolIds: string[];
  onToolToggle: (toolId: string) => void;
  onCloseAll: () => void;
}

export function ToolsContainerPanel({
  activeToolIds,
  onToolToggle,
  onCloseAll,
}: ToolsContainerPanelProps) {
  const tools: SimulationTool[] = [
    {
      id: "agent-panel",
      name: "Agent Panel",
      description: "Define and manage agent groups (L1, L2, L3)",
      icon: <Users className="w-4 h-4 text-primary" />,
    },
    {
      id: "ticket-panel",
      name: "Ticket Panel",
      description: "Generate tickets and control incoming flow",
      icon: <Tickets className="w-4 h-4 text-primary" />,
    },
    {
      id: "queue-panel",
      name: "Queue Panel",
      description: "Inspect queue status and workload distribution",
      icon: <ListFilter className="w-4 h-4 text-primary" />,
    },
    {
      id: "activity-panel",
      name: "Activity Panel",
      description: "Track ticket activity and status changes over time",
      icon: <Activity className="w-4 h-4 text-primary" />,
    },
    {
      id: "log-panel",
      name: "Log Panel",
      description: "View the event log",
      icon: <Terminal className="w-4 h-4 text-primary" />,
    },
  ];

  const activeToolSet = useMemo(() => new Set(activeToolIds), [activeToolIds]);

  return (
    <div className=" border rounded-xl backdrop-blur bg-background/50 ">
      {/* <div className="border-b rounded-tr-xl rounded-tl-xl bg-secondary/50 p-2">
        <Settings2 />
      </div> */}

      <div className="flex flex-row gap-2  p-2">
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  `p-2 rounded-md bg-transparent border-none shadow-none ${activeToolSet.has(tool.id)
                    ? "bg-primary/15   ring-2 ring-primary/50 text-primary/300 cursor-pointer"
                    : "hover:bg-muted/60 cursor-pointer"
                  }`,
                )}
                onClick={() => onToolToggle(tool.id)}
              >
                <span>{tool.icon}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="text-xs bg-background text-primary border border-border py-2"
            >
              <div className="flex flex-col gap-2">
                <span className="font-medium leading-tight">{tool.name}</span>
                <div className="h-px w-full bg-border" />
                <span className="text-muted-foreground text-xs leading-snug">
                  {tool.description}
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
        {/* DIVIDER */}
        <div className="w-px self-stretch bg-border" />
        {/* CLOSE ALL */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="p-2 rounded-md hover:bg-muted/60 cursor-pointer  flex items-center justify-center"
              onClick={onCloseAll}
            >
              <X className="w-4 h-4" />
            </div>
          </TooltipTrigger>

          <TooltipContent
            side="top"
            className="text-xs bg-background text-primary border border-border py-2"
          >
            <span>Close all panels</span>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
