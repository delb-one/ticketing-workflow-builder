"use client";

import type { NodeConfig, NodeType } from "@/lib/simulation/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockDefinition } from "@/lib/blocks/types";
import { BLOCKS } from "@/lib/blocks/registry";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BlockItem } from "@/components/molecules/BlockItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubFlowTemplateLibrary } from "./SubFlowTemplateLibrary";
import { Blocks, Plus, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BlockLibraryProps {
  onBlockDrag?: (
    blockType: NodeType,
    blockId: string,
    blockLabel: string,
    blockConfig: NodeConfig,
    blockDescription: string,
  ) => void;
}

export default function BlockLibrary({ onBlockDrag }: BlockLibraryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isSubflowMode = pathname.includes("/subflows");

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
          <Tabs defaultValue="blocks" className="h-full gap-1 px-1 py-2 flex flex-col">
            <TabsList className="mx-auto grid h-auto w-14 grid-cols-2 gap-1 bg-transparent p-0 flex-shrink-0">
              <TabsTrigger className="h-7 px-1 text-[10px]" value="blocks">
                <Blocks className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger className="h-7 px-1 text-[10px]" value="templates">
                <Workflow className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>
            <TabsContent value="blocks" className="flex-1 min-h-0 overflow-hidden">
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
            <TabsContent value="templates" className="flex-1 min-h-0 overflow-hidden flex flex-col relative">
              <ScrollArea className={cn("flex-1 overflow-y-auto", !isSubflowMode && "pb-10")}>
                <SubFlowTemplateLibrary />
              </ScrollArea>

              {!isSubflowMode && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="absolute bottom-0 left-1/2 -translate-x-1/2"
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/subflows/new')}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent
                    side="right"
                    className="text-xs bg-background text-primary border border-border"
                  >
                    <p>Create New Subflow</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TabsContent>
          </Tabs>
        </TooltipProvider>
      </div>
    </div>
  );
}
