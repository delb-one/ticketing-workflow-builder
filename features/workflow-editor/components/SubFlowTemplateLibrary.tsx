"use client";

import { Boxes, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  getNodeTypeIconGradient,
  getNodeTypeColorVar,
} from "@/lib/colors/color-map";
import { useLiveQuery } from "dexie-react-hooks";
import { subflowRepository } from "@/lib/db/subflowRepository";
import { useRouter } from "next/navigation";
import type { SubFlowDefinition } from "@/lib/db/dexie";

const handleDragStart = (event: React.DragEvent, template: SubFlowDefinition) => {
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
  const subflows = useLiveQuery(() => subflowRepository.listSubFlows()) || [];
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subflow?")) {
      await subflowRepository.deleteSubFlow(id);
    }
  };

  return (
    <div className="space-y-1 px-1">
      {subflows.map((template) => (
        <ContextMenu key={template.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ContextMenuTrigger asChild>
                <Card
                  draggable
                  onDragStart={(event) => handleDragStart(event, template)}
                  className="p-2 flex items-center justify-center bg-transparent border-none shadow-none hover:bg-muted/60 rounded-md cursor-move transition-colors"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundImage: getNodeTypeIconGradient("group") }}
                  >
                    <Boxes className="h-4 w-4 text-primary" />
                  </div>
                </Card>
              </ContextMenuTrigger>
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
                  Custom Group
                </Badge>
                <div className="h-px w-full bg-border" />
                <span className="font-medium leading-tight">{template.name}</span>
                {template.description && (
                  <span className="text-muted-foreground text-xs leading-snug">
                    {template.description}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  {template.nodes?.length || 0} nodes
                </span>
                <div className="text-[10px] text-muted-foreground/60 italic mt-1">
                  Right-click for options
                </div>
              </div>
            </TooltipContent>
          </Tooltip>

          <ContextMenuContent >
            <ContextMenuItem onClick={() => router.push(`/subflows/${template.id}`)}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleDelete(template.id)}
              className="text-destructive-foreground focus:text-destructive-foreground focus:bg-destructive/10"
            // variant="destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}

      {subflows.length === 0 && (
        <div className="text-[10px] text-muted-foreground text-center p-2 pt-4 leading-relaxed">
          No custom flows yet.
        </div>
      )}
    </div>
  );
}
