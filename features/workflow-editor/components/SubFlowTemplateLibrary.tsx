"use client";

import { Blocks, Boxes, Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  SUB_FLOW_TEMPLATES,
  type SubFlowTemplate,
} from "@/lib/flow-template/sub-flow-templates";
import {
  getNodeTypeIconGradient,
  getNodeTypeColorVar,
} from "@/lib/colors/color-map";

const handleDragStart = (event: React.DragEvent, template: SubFlowTemplate) => {
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData(
    "application/reactflow",
    JSON.stringify({
      type: "subflow-template",
      templateId: template.id,
    }),
  );
};

export function SubFlowTemplateLibrary() {
  const groupColor = getNodeTypeColorVar("group");

  return (
    <div className="space-y-1">
      {SUB_FLOW_TEMPLATES.map((template) => (
        <Tooltip key={template.id}>
          <TooltipTrigger asChild>
            <Card
              draggable
              onDragStart={(event) => handleDragStart(event, template)}
              className="p-2 flex items-center justify-center bg-transparent border-none shadow-none hover:bg-muted/60 rounded-md cursor-move"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundImage: getNodeTypeIconGradient("group") }}
              >
                <Boxes className="h-4 w-4 text-primary" />
              </div>
            </Card>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            className="text-xs bg-background text-primary border border-border"
          >
            <div className="flex max-w-56 flex-col gap-2">
              <Badge
                className="text-[10px] uppercase font-semibold w-fit border-0"
                style={{
                  backgroundColor: `color-mix(in oklab, ${groupColor} 10%, transparent)`,
                  color: `color-mix(in oklab, ${groupColor} 50%, white)`,
                  border: `1px solid color-mix(in oklab, ${groupColor} 50%, transparent)`,
                }}
              >
                {template.type}
              </Badge>
              <div className="h-px w-full bg-border" />
              <span className="font-medium leading-tight">{template.name}</span>
              <span className="text-muted-foreground text-xs leading-snug">
                {template.description}
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {template.nodes.length} nodes
              </span>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
