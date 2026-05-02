"use client";

import { Card } from "@/components/ui/card";
import type { NodeConfig, NodeType } from "@/lib/simulation/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockDefinition } from "@/lib/blocks/types";
import { BLOCKS } from "@/lib/blocks/registry";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockItem } from "@/components/molecules/BlockItem";

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
    <div className="w-20 h-full rounded-lg shadow-sm border flex flex-col">
      <div className="flex h-full flex-col rounded-2xl bg-card">
        <ScrollArea className="flex-1 p-2 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TooltipProvider delayDuration={200}>
            <div className="space-y-1">
              {Object.values(BLOCKS)
                .flat()
                .map((block) => (
                  <BlockItem
                    key={block.blockId}
                    block={block}
                    onDragStart={handleDragStart}
                  />
                ))}
            </div>
          </TooltipProvider>
        </ScrollArea>
      </div>
    </div>
  );
}
