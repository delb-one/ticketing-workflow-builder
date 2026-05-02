"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";

interface WorkflowEditorTemplateProps {
  leftSidebar: React.ReactNode;
  canvas: React.ReactNode;
  rightSidebar: React.ReactNode;
  rightCollapsed: boolean;
  onToggleRightSidebar: () => void;
  rightSidebarHeaderActions?: React.ReactNode;
  rightSidebarCollapsedContent?: React.ReactNode;
}

export function WorkflowEditorTemplate({
  leftSidebar,
  canvas,
  rightSidebar,
  rightCollapsed,
  onToggleRightSidebar,
  rightSidebarHeaderActions,
  rightSidebarCollapsedContent,
}: WorkflowEditorTemplateProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Left Sidebar */}
        <aside className="flex flex-col h-full">{leftSidebar}</aside>

        {/* Center Canvas */}
        <main className="flex-1 flex flex-col rounded-lg shadow-sm border border-border overflow-hidden">
          {canvas}
        </main>

        {/* Right Sidebar */}
        <aside
          className={cn(
            "flex flex-col transition-all duration-300 bg-card rounded-lg border border-border overflow-hidden",
            rightCollapsed ? "w-12 gap-0" : "w-80 gap-4"
          )}
        >
          <div className="flex items-center justify-between border-b border-border p-1 bg-muted/20">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleRightSidebar}
                  >
                    {rightCollapsed ? (

                      <PanelLeftClose className="h-4 w-4" />
                    ) : (
                      <PanelLeftOpen className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs bg-background text-primary border border-border">
                  {rightCollapsed ? "Expand" : "Collapse"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!rightCollapsed && (
              <div className="flex items-center gap-2 flex-nowrap min-w-0 pr-2">
                {rightSidebarHeaderActions}
              </div>
            )}
          </div>

          {!rightCollapsed ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {rightSidebar}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center py-4 gap-4 overflow-hidden">
              {rightSidebarCollapsedContent}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
