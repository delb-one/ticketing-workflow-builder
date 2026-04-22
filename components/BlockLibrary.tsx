"use client";

import { Card } from "@/components/ui/card";
import { NodeType } from "@/lib/store";

interface BlockDefinition {
  id: string;
  label: string;
  type: NodeType;
  color: string;
  icon: string;
}

const BLOCKS: Record<string, BlockDefinition[]> = {
  Other: [
    {
      id: "start",
      label: "Start",
      type: "start",
      color: "bg-chart-5",
      icon: "🚀",
    },
    { id: "end", label: "End", type: "end", color: "bg-chart-5", icon: "🏁" },
  ],
  Actors: [
    {
      id: "client",
      label: "Client",
      type: "actor",
      color: "bg-chart-4",
      icon: "👤",
    },
    {
      id: "l1-tech",
      label: "L1 Technician",
      type: "actor",
      color: "bg-chart-4",
      icon: "🔧",
    },
    {
      id: "l2-tech",
      label: "L2 Technician",
      type: "actor",
      color: "bg-chart-4",
      icon: "⚙️",
    },
    {
      id: "l3-specialist",
      label: "L3 Specialist",
      type: "actor",
      color: "bg-chart-4",
      icon: "🎯",
    },
    {
      id: "supervisor",
      label: "Supervisor",
      type: "actor",
      color: "bg-chart-4",
      icon: "👔",
    },
  ],
  "Logic Blocks": [
    {
      id: "decision",
      label: "Decision",
      type: "decision",
      color: "bg-chart-3",
      icon: "🔀",
    },
    {
      id: "condition",
      label: "Condition",
      type: "condition",
      color: "bg-chart-3",
      icon: "📋",
    },
  ],
  Automation: [
    {
      id: "business-rules",
      label: "Business Rules",
      type: "automation",
      color: "bg-chart-2",
      icon: "📐",
    },
    {
      id: "auto-assign",
      label: "Auto Assignment",
      type: "automation",
      color: "bg-chart-2",
      icon: "📍",
    },
    {
      id: "sla-timer",
      label: "SLA Timer",
      type: "automation",
      color: "bg-chart-2",
      icon: "⏱️",
    },
    {
      id: "escalation",
      label: "Escalation",
      type: "automation",
      color: "bg-chart-2",
      icon: "📈",
    },
    {
      id: "notify",
      label: "Notification",
      type: "automation",
      color: "bg-chart-2",
      icon: "🔔",
    },
    {
      id: "reopen",
      label: "Reopen Ticket",
      type: "automation",
      color: "bg-chart-2",
      icon: "🔄",
    },
  ],
  Actions: [
    {
      id: "resolve",
      label: "Resolve Ticket",
      type: "action",
      color: "bg-chart-1",
      icon: "✅",
    },
    {
      id: "validate",
      label: "Validate Ticket",
      type: "action",
      color: "bg-chart-1",
      icon: "✔️",
    },
    {
      id: "close",
      label: "Close Ticket",
      type: "action",
      color: "bg-chart-1",
      icon: "🏁",
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

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {Object.entries(BLOCKS).map(([category, blocks]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
              {category}
            </h3>
            <div className="space-y-2">
              {blocks.map((block) => (
                <Card
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  className={`p-3 cursor-move hover:shadow-md transition-shadow ${block.color} text-white rounded-lg`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{block.icon}</span>
                    <span className="text-sm font-medium">{block.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
