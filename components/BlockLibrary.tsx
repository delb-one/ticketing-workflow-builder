"use client";

import { Card } from "@/components/ui/card";
import { NodeType } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  Play,
  CheckCircle2,
  User,
  Headphones,
  UserCog,
  Cpu,
  ShieldCheck,
  GitBranch,
  Filter,
  SlidersHorizontal,
  Shuffle,
  Clock,
  ArrowUpCircle,
  Bell,
  RotateCcw,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type ChartColor = "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5";
interface BlockDefinition {
  id: string;
  label: string;
  type: NodeType;
  color: ChartColor;
  icon: LucideIcon;
  description?: string;
}

const BLOCKS: Record<string, BlockDefinition[]> = {
  Other: [
    {
      id: "start",
      label: "Start",
      type: "start",
      color: "chart-5",
      icon: Play,
    },
    {
      id: "end",
      label: "End",
      type: "end",
      color: "chart-5",
      icon: CheckCircle2,
    },
  ],

  Actors: [
    {
      id: "client",
      label: "Client",
      type: "actor",
      color: "chart-4",
      icon: User,
    },
    {
      id: "l1-tech",
      label: "L1 Technician",
      type: "actor",
      color: "chart-4",
      icon: Headphones,
    },
    {
      id: "l2-tech",
      label: "L2 Technician",
      type: "actor",
      color: "chart-4",
      icon: UserCog,
    },
    {
      id: "l3-specialist",
      label: "L3 Specialist",
      type: "actor",
      color: "chart-4",
      icon: Cpu,
    },
    {
      id: "supervisor",
      label: "Supervisor",
      type: "actor",
      color: "chart-4",
      icon: ShieldCheck,
    },
  ],

  "Logic Blocks": [
    {
      id: "decision",
      label: "Decision",
      type: "decision",
      color: "chart-3",
      icon: GitBranch,
    },
    {
      id: "condition",
      label: "Condition",
      type: "condition",
      color: "chart-3",
      icon: Filter,
    },
  ],

  Automation: [
    {
      id: "business-rules",
      label: "Business Rules",
      type: "automation",
      color: "chart-2",
      icon: SlidersHorizontal,
    },
    {
      id: "auto-assign",
      label: "Auto Assignment",
      type: "automation",
      color: "chart-2",
      icon: Shuffle,
    },
    {
      id: "sla-timer",
      label: "SLA Timer",
      type: "automation",
      color: "chart-2",
      icon: Clock,
    },
    {
      id: "escalation",
      label: "Escalation",
      type: "automation",
      color: "chart-2",
      icon: ArrowUpCircle,
    },
    {
      id: "notify",
      label: "Notification",
      type: "automation",
      color: "chart-2",
      icon: Bell,
    },
    {
      id: "reopen",
      label: "Reopen Ticket",
      type: "automation",
      color: "chart-2",
      icon: RotateCcw,
    },
  ],

  Actions: [
    {
      id: "resolve",
      label: "Resolve Ticket",
      type: "action",
      color: "chart-1",
      icon: CheckCircle,
    },
    {
      id: "validate",
      label: "Validate Ticket",
      type: "action",
      color: "chart-1",
      icon: MessageSquare,
    },
    {
      id: "close",
      label: "Close Ticket",
      type: "action",
      color: "chart-1",
      icon: CheckCircle2,
    },
  ],
};

interface BlockLibraryProps {
  onBlockDrag: (
    blockType: NodeType,
    blockId: string,
    blockLabel: string,
  ) => void;
}

export default function BlockLibrary({ onBlockDrag }: BlockLibraryProps) {
  const colorMap: Record<ChartColor, string> = {
    "chart-1": "border-chart-1 hover:bg-chart-1/10 ",
    "chart-2": "border-chart-2 hover:bg-chart-2/10 ",
    "chart-3": "border-chart-3 hover:bg-chart-3/10",
    "chart-4": "border-chart-4 hover:bg-chart-4/10 ",
    "chart-5": "border-chart-5 hover:bg-chart-5/10 ",
  };
  const handleDragStart = (e: React.DragEvent, block: BlockDefinition) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        type: block.type,
        id: block.id,
        label: block.label,
      }),
    );
  };

  return (
    <div className="w-64 bg-card border-r border-border overflow-y-auto h-full flex flex-col">
      <div className="p-4 border-b border-border sticky top-0 bg-card">
        <h2 className="font-semibold text-foreground">Block Library</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag blocks to canvas
        </p>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto p-4 space-y-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Object.entries(BLOCKS).map(([category, blocks]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide mt-2">
              {category}
            </h3>

            <div className="space-y-2">
              {blocks.map((block) => {
                const Icon = block.icon;

                return (
                  <Card
                    key={block.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, block)}
                    className={cn(
                      "p-3 cursor-move hover:shadow-md transition-shadow rounded-lg bg-card border",
                      colorMap[block.color],
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={cn("w-4 h-4", `text-${block.color}`)} />{" "}
                      <span className="text-sm font-medium">{block.label}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
