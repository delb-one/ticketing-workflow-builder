"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";

interface WorkflowEditorTemplateProps {
  leftSidebar: React.ReactNode;
  canvas: React.ReactNode;
  rightSidebar: React.ReactNode;
  rightCollapsed: boolean;
  onToggleRightSidebar: () => void;
  rightSidebarHeaderActions?: React.ReactNode;
}

export function WorkflowEditorTemplate({
  leftSidebar,
  canvas,
  rightSidebar,
  rightCollapsed,
  onToggleRightSidebar,
  rightSidebarHeaderActions,
}: WorkflowEditorTemplateProps) {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Left Sidebar — invariato */}
        <aside className="flex flex-col h-full">{leftSidebar}</aside>

        {/* Canvas — occupa tutto lo spazio flex */}
        {/*
          overflow-hidden è necessario per il rounded-lg del bordo,
          ma NON blocca backdrop-filter sui figli assoluti (spec CSS).
        */}
        <main className="relative flex-1 flex flex-col rounded-lg shadow-sm border border-border overflow-hidden">
          {canvas}

          {/* ── Overlay sidebar interna al canvas ── */}
          <div
            className={cn(
              "absolute top-0 right-0 h-full z-20 flex items-stretch",
              "transition-transform duration-300 ease-in-out",
              rightCollapsed ? "translate-x-full" : "translate-x-0"
            )}
          >
            {/* ── Tab toggle — stesso stile glass di CustomPanel ── */}
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
                      // stesso token glass di CustomPanel: bg-card/70 + backdrop-blur-md
                      "bg-card/70 backdrop-blur-md",
                      "border border-r-0 border-border",
                      // "shadow-[-4px_0_16px_rgba(0,0,0,0.15)]",
                      "hover:bg-card/90 transition-colors duration-200",
                      "flex items-center justify-center"
                    )}
                  >
                    {rightCollapsed
                      ? <PanelRightOpen className="h-4 w-4 text-muted-foreground" />
                      : <PanelRightClose className="h-4 w-4 text-muted-foreground" />
                    }
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="text-xs bg-background text-primary border border-border"
                >
                  {rightCollapsed ? "Show Inspector" : "Hide Inspector"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* ── Pannello Inspector — glass identico a CustomPanel ── */}
            {/*
              bg-card/70 + backdrop-blur-md: SINGOLO livello di blur, stesso token di CustomPanel.
              I figli (header, content) sono trasparenti così il blur è visibile
              attraverso l'intero pannello senza moltiplicarsi.
            */}
            <div
              className={cn(
                "w-80 h-full flex flex-col",
                "bg-card/70 backdrop-blur-md",
                "border-l border-border rounded-r-lg",
                // "shadow-[-8px_0_32px_rgba(0,0,0,0.18)]"
              )}
            >
              {/* Header — sfondo trasparente, eredita il blur dal parent */}
              <div className="flex items-center justify-end border-b border-border/60 px-2 py-1 bg-secondary/30 shrink-0">
                {rightSidebarHeaderActions && (
                  <div className="flex items-center gap-1 flex-nowrap min-w-0">
                    {rightSidebarHeaderActions}
                  </div>
                )}
              </div>

              {/* Contenuto — nessun background proprio, trasparente */}
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
