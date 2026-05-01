"use client";

import { Card } from "@/components/ui/card";
import type { NodeConfig, NodeType } from "@/lib/simulation/types";
import { ScrollArea } from "./ui/scroll-area";
import { BlockDefinition } from "@/lib/blocks/types";
import { BLOCKS } from "@/lib/blocks/registry";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { getNodeTypeColorVar, getNodeTypeIconGradient } from "@/lib/colors/color-map";
import { Badge } from "./ui/badge";

interface BlockLibraryProps {
  onBlockDrag: (
    blockType: NodeType,
    blockId: string,
    blockLabel: string,
    blockConfig: NodeConfig,
    blockDescription: string,
  ) => void;
}

export default function BlockLibrary({ onBlockDrag }: BlockLibraryProps) {
  void onBlockDrag;

  const handleDragStart = (event: React.DragEvent, block: BlockDefinition) => {
    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({
        type: block.type,
        blockId: block.blockId,
        label: block.label,
        config: block.config,
        description: block.description,
      }),
    );
  };

  return (
    <div className="w-20 rounded-lg shadow-sm border flex flex-col">
      <div className="flex h-full flex-col rounded-2xl bg-card">
        <ScrollArea className="flex-1 p-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TooltipProvider delayDuration={200}>
            <div className="space-y-1">
              {Object.values(BLOCKS)
                .flat()
                .map((block) => {
                  const Icon = block.icon;
                  const blockColor = getNodeTypeColorVar(block.type);

                  return (
                    <Tooltip key={block.blockId}>
                      <TooltipTrigger asChild>
                        <Card
                          draggable
                          onDragStart={(event) => handleDragStart(event, block)}
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
                })}
            </div>
          </TooltipProvider>
        </ScrollArea>
      </div>
    </div>
  );
}
