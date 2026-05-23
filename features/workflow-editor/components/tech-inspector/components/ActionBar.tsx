"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit, Plus, RotateCcw, SlidersHorizontal } from "lucide-react";

interface ActionBarProps {
  addAgent: () => void;
  isSelectionMode: boolean;
  normalizeAgents: () => void;
  // resetCustomAgents: () => void;
  activeSelectionMode: () => void;
  disabled?: boolean;
}

export const ActionBar = ({
  addAgent,
  isSelectionMode,
  normalizeAgents,
  activeSelectionMode,
  disabled = false,
}: ActionBarProps) => {
  return (
    <div className="p-2 flex items-center justify-between ">
      <Button onClick={addAgent} disabled={disabled}>
        <span>Add Agent</span>
        {/* <Plus className="h-4 w-4 text-secondary" /> */}
      </Button>
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={activeSelectionMode}
          className={cn(
            isSelectionMode ? "bg-primary text-secondary hover:bg-primary/80! hover:text-secondary!" : "hover:bg-muted/60",
          )}
        >
          <Edit className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={normalizeAgents}
          disabled={disabled}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>

        {/* <button
          onClick={resetCustomAgents}
          disabled={disabled}
          className="p-2 rounded-md bg-transparent border-none shadow-none hover:bg-muted/60 cursor-pointer transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button> */}
      </div>
    </div>
  );
};
