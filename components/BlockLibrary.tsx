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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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
  const [collapsed, setCollapsed] = useState(true);

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
    <div
      className={cn(
        "rounded-lg shadow-sm border flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex h-full flex-col rounded-2xl bg-card">
        {/* <div className="sticky top-0 border-b border-border bg-card p-4 flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-foreground">Block Library</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Drag blocks to canvas
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand library" : "Collapse library"}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
        </div> */}

        <ScrollArea
          className={cn(
            "flex-1 space-y-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            collapsed ? "p-2" : "p-4",
          )}
        >
          {" "}
          {Object.entries(BLOCKS).map(([category, blocks]) => (
            <div key={category}>
              {!collapsed && (
                <h3 className="mt-2 mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                  {category}
                </h3>
              )}

              <TooltipProvider delayDuration={200}>
                {blocks.map((block) => {
                  const Icon = block.icon;

                  const card = (
                    <Card
                      key={block.blockId}
                      draggable
                      onDragStart={(event) => handleDragStart(event, block)}
                      className={cn(
                        "cursor-move transition-all",
                        collapsed
                          ? "p-2 flex items-center justify-center bg-transparent border-none shadow-none hover:bg-muted/60 rounded-md"
                          : "p-3 rounded-lg border bg-card hover:shadow-md",
                        !collapsed && colorMap[block.color],
                      )}
                    >
                      <div
                        className={cn(
                          "flex w-full items-center",
                          collapsed ? "justify-center" : "gap-2",
                        )}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg !bg-${block.color} text-background`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {!collapsed && (
                          <span className="text-sm font-medium truncate">
                            {block.label}
                          </span>
                        )}
                      </div>
                    </Card>
                  );

                  return collapsed ? (
                    <Tooltip key={block.blockId}>
                      <TooltipTrigger asChild>{card}</TooltipTrigger>
                      <TooltipContent
                        side="right"
                        className="text-xs bg-background text-primary dark:bg-background dark:text-primary border border-border"
                      >
                        {block.label}
                        <br />
                        <span className="text-muted-foreground text-xs">
                          {block.description}
                        </span>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    card
                  );
                })}
              </TooltipProvider>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
