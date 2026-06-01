"use client";

import type { NodeConfig, NodeType } from "@/lib/simulation/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockDefinition } from "@/lib/blocks/types";
import { BLOCKS } from "@/lib/blocks/registry";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BlockItem } from "@/components/molecules/BlockItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubFlowTemplateLibrary } from "./SubFlowTemplateLibrary";
import { Blocks, Workflow } from "lucide-react";

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
    <div className="w-20 h-full flex flex-col ">
      <div className="flex h-full flex-col bg-transparent ">
        <TooltipProvider delayDuration={200}>
          <Tabs defaultValue="blocks" className="h-full gap-1 px-1 py-2">
            <TabsList className="mx-auto grid h-auto w-14 grid-cols-2  gap-1 bg-transparent p-0">
              <TabsTrigger className="h-7 px-1 text-[10px]" value="blocks">
                <Blocks className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger className="h-7 px-1 text-[10px]" value="templates">
                <Workflow className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="blocks" className="min-h-0">
              <ScrollArea className="h-full overflow-y-auto">
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
              </ScrollArea>
            </TabsContent>
            <TabsContent value="templates" className="min-h-0">
              <ScrollArea className="h-full overflow-y-auto">
                <SubFlowTemplateLibrary />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </div>
    </div>
  );
}
