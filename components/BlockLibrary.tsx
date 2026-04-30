"use client";

import { Card } from "@/components/ui/card";
import type { NodeConfig, NodeType } from "@/lib/simulation/types";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./ui/scroll-area";
import { BlockDefinition } from "@/lib/blocks/types";
import { BLOCKS } from "@/lib/blocks/registry";
import { colorMap } from "@/lib/blocks/color-map";
import { Button } from "./ui/button";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
  void onBlockDrag;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    <div className="flex h-full w-64 flex-col overflow-y-auto border-r border-border bg-card">
      <div className="sticky top-0 border-b border-border bg-card p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Block Library</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Drag blocks to canvas
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={() => {}}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>

      <ScrollArea className="flex-1 space-y-6 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Object.entries(BLOCKS).map(([category, blocks]) => (
          <div key={category}>
            <h3 className="mt-2 mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {category}
            </h3>

            <div className="space-y-2">
              {blocks.map((block) => {
                const Icon = block.icon;

                return (
                  <Card
                    key={block.blockId}
                    draggable
                    onDragStart={(event) => handleDragStart(event, block)}
                    className={cn(
                      "cursor-move rounded-lg border bg-card p-3 transition-shadow hover:shadow-md",
                      colorMap[block.color],
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg  !bg-${block.color} text-white`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
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
