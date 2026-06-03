"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface SubFlowHeaderProps {
  name: string;
  onChangeName: (val: string) => void;
  description: string;
  onChangeDescription: (val: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function SubFlowHeader({ name, onChangeName, description, onChangeDescription, onSave, isSaving }: SubFlowHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-4 py-2 w-[600px] max-w-[90vw] bg-card/80 backdrop-blur-md border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] gap-4 pointer-events-auto">
      <div className="flex items-center gap-4 flex-1">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="shrink-0 h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs bg-background text-primary border border-border">
              <p>Return to main Canvas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex flex-row flex-1 max-w-2xl gap-2">
          <Input
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            className="font-semibold text-lg bg-transparent border-transparent hover:border-input focus:border-input focus-visible:ring-1 focus-visible:border-input transition-colors h-8 px-2 w-full"
            placeholder="Subflow Name..."
          />
          <Input
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            className="text-xs text-muted-foreground bg-transparent border-transparent hover:border-input focus:border-input focus-visible:ring-1 focus-visible:border-input transition-colors h-8 px-2 w-full"
            placeholder="Add a description..."
          />
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onSave} disabled={isSaving} size="sm" className="gap-2">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs bg-background text-primary border border-border">
              <p>Save Subflow</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
