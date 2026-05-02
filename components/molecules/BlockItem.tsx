"use client";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { BlockDefinition } from "@/lib/blocks/types";
import { getNodeTypeColorVar, getNodeTypeIconGradient } from "@/lib/colors/color-map";

interface BlockItemProps {
  block: BlockDefinition;
  onDragStart: (event: React.DragEvent, block: BlockDefinition) => void;
}

export function BlockItem({ block, onDragStart }: BlockItemProps) {
  const Icon = block.icon;
  const blockColor = getNodeTypeColorVar(block.type);

  return (
    <Tooltip key={block.blockId}>
      <TooltipTrigger asChild>
        <Card
          draggable
          onDragStart={(event) => onDragStart(event, block)}
          className="p-2 flex items-center justify-center bg-transparent border-none shadow-none hover:bg-muted/60 rounded-md cursor-move"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg "
            style={{ backgroundImage: getNodeTypeIconGradient(block.type) }}
          >
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </Card>
      </TooltipTrigger>

      <TooltipContent
        side="right"
        className="text-xs bg-background text-primary border border-border"
      >
        <div className="flex flex-col gap-2">
          {/* TYPE PILL */}
          <Badge
            className="text-[10px] uppercase font-semibold w-fit border-0"
            style={{
              backgroundColor: `color-mix(in oklab, ${blockColor} 10%, transparent)`,
              color: `color-mix(in oklab, ${blockColor} 50%, white)`,
              border: `1px solid color-mix(in oklab, ${blockColor} 50%, transparent)`,
            }}
          >
            {block.type}
          </Badge>

          {/* DIVIDER */}
          <div className="h-px w-full bg-border" />

          {/* LABEL */}
          <span className="font-medium leading-tight">
            {block.label}
          </span>

          {/* DESCRIPTION */}
          <span className="text-muted-foreground text-xs leading-snug">
            {block.description}
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
