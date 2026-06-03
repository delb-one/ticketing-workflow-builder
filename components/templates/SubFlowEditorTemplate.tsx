"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";

interface SubFlowEditorTemplateProps {
  leftSidebar: React.ReactNode;
  canvas: React.ReactNode;
  leftCollapsed: boolean;
  onToggleLeftSidebar: () => void;
}

export function SubFlowEditorTemplate({
  leftSidebar,
  canvas,
  leftCollapsed,
  onToggleLeftSidebar,
}: SubFlowEditorTemplateProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        <main className="relative flex-1 flex flex-col rounded-lg shadow-sm border border-border overflow-hidden bg-dot-pattern">
          {canvas}

          {/* ── Overlay sidebar SINISTRA ── */}
          <div
            className={cn(
              "absolute top-2 left-2 bottom-2 z-20 flex flex-col items-stretch",
              "transition-transform duration-300 ease-in-out",
              leftCollapsed
                ? "-translate-x-[calc(100%+1rem)]"
                : "translate-x-0",
            )}
          >
            <div
              className={cn(
                "w-20 h-full flex flex-col",
                "bg-card/70 backdrop-blur-md",
                "border border-border rounded-2xl",
                "shadow-[8px_0_32px_rgba(0,0,0,0.1)]",
              )}
            >
              <div className="flex-1 flex flex-col overflow-hidden">
                {leftSidebar}
              </div>
            </div>

            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleLeftSidebar}
                    className={cn(
                      "absolute -right-9 top-1/2 -translate-y-1/2",
                      "h-16 w-9 rounded-r-xl rounded-l-none",
                      "bg-card/70 backdrop-blur-md",
                      "border border-l-0 border-border",
                      "hover:bg-card/90 transition-colors duration-200",
                      "flex items-center justify-center shadow-sm",
                    )}
                  >
                    {leftCollapsed ? (
                      <PanelRightOpen className="h-4 w-4 text-muted-foreground rotate-180" />
                    ) : (
                      <PanelRightClose className="h-4 w-4 text-muted-foreground rotate-180" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs flex gap-2 bg-background text-primary border border-border items-center">
                  {leftCollapsed ? "Show Library" : "Hide Library"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
