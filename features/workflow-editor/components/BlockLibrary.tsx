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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);
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

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="absolute bottom-2 left-1/2 -translate-x-1/2"
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>

                <TooltipContent
                  side="right"
                  className="text-xs bg-background text-primary border border-border"
                >
                  <p>Add Group Flow</p>
                </TooltipContent>
              </Tooltip>
            </TabsContent>
          </Tabs>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Custom Group Flow </DialogTitle>
                <DialogDescription>
                  This feature is coming soon! In the meantime, you can test out
                  the sub-flow template feature by dragging and dropping the
                  Group Flow template from the library, and customizing it to
                  your needs. You can also create your own sub-flow templates by
                  defining them in code.
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </TooltipProvider>
      </div>
    </div>
  );
}
