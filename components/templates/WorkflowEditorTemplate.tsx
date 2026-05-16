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

interface WorkflowEditorTemplateProps {
  leftSidebar: React.ReactNode;
  canvas: React.ReactNode;
  rightSidebar: React.ReactNode;
  leftCollapsed: boolean;
  rightCollapsed: boolean;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  rightSidebarHeaderActions?: React.ReactNode;
}

export function WorkflowEditorTemplate({
  leftSidebar,
  canvas,
  rightSidebar,
  leftCollapsed,
  rightCollapsed,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  rightSidebarHeaderActions,
}: WorkflowEditorTemplateProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden gap-4">
        {/* Canvas — occupa tutto lo spazio flex */}
        <main className="relative flex-1 flex flex-col rounded-lg shadow-sm border border-border overflow-hidden">
          {canvas}

          {/* ── Overlay sidebar SINISTRA interna al canvas ── */}
          <div
            className={cn(
              "absolute top-2 left-2 bottom-2 z-20 flex flex-col items-stretch",
              "transition-transform duration-300 ease-in-out",
              leftCollapsed
                ? "-translate-x-[calc(100%+1rem)]"
                : "translate-x-0",
            )}
          >
            {/* ── Pannello Library — glass identico a CustomPanel ── */}
            <div
              className={cn(
                "w-20 h-full flex flex-col",
                "bg-card/70 backdrop-blur-md",
                "border border-border rounded-2xl",
                "shadow-[8px_0_32px_rgba(0,0,0,0.1)]",
              )}
            >
              {/* Contenuto scrollabile */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {leftSidebar}
              </div>
            </div>

            {/* Tab pulsante toggle — ancorata al bordo destro del pannello */}
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
                <TooltipContent
                  side="right"
                  className="text-xs flex  gap-2 bg-background text-primary border border-border items-center"
                >
                  {leftCollapsed ? "Show Library" : "Hide Library"}
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground border px-1.5 py-0.5 flex items-center gap-1">
                    CTRL +<span className="text-xs">→</span>
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* ── Overlay sidebar DESTRA interna al canvas ── */}
          <div
            className={cn(
              "absolute top-2 right-2 bottom-2 z-20 flex flex-col items-stretch",
              "transition-transform duration-300 ease-in-out",
              rightCollapsed
                ? "translate-x-[calc(100%+1rem)]"
                : "translate-x-0",
            )}
          >
            {/* Tab pulsante toggle — ancorata al bordo sinistro del pannello */}
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleRightSidebar}
                    className={cn(
                      "absolute -left-9 top-1/2 -translate-y-1/2",
                      "h-16 w-9 rounded-l-xl rounded-r-none",
                      "bg-card/70 backdrop-blur-md",
                      "border border-r-0 border-border",
                      "hover:bg-card/90 transition-colors duration-200",
                      "flex items-center justify-center shadow-sm",
                    )}
                  >
                    {rightCollapsed ? (
                      <PanelRightOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <PanelRightClose className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="text-xs flex  gap-2 bg-background text-primary border border-border items-center"
                >
                  {rightCollapsed ? "Show Inspector" : "Hide Inspector"}
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground border px-1.5 py-0.5 flex items-center gap-1">
                    CTRL +<span className="text-xs">←</span>
                  </span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* ── Pannello Inspector — glass identico a CustomPanel ── */}
            <div
              className={cn(
                "w-80 h-full flex flex-col",
                "bg-card/70 backdrop-blur-md",
                "border border-border rounded-2xl",
                "shadow-[-8px_0_32px_rgba(0,0,0,0.1)]",
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-end border-b border-border/60 px-2 py-1 bg-secondary/30 shrink-0">
                {rightSidebarHeaderActions && (
                  <div className="flex items-center gap-1 flex-nowrap min-w-0">
                    {rightSidebarHeaderActions}
                  </div>
                )}
              </div>

              {/* Contenuto scrollabile */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {rightSidebar}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
