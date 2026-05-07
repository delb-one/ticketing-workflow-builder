import { Edit, Plus, RotateCcw, SlidersHorizontal } from "lucide-react";

interface ActionBarProps {
  addDefaultAgent: () => void;
  isSelectionMode: boolean;
  normalizeAgents: () => void;
  resetCustomAgents: () => void;
  activeSelectionMode: () => void;
}

export const ActionBar = ({
  addDefaultAgent,
  isSelectionMode,
  normalizeAgents,
  resetCustomAgents,
  activeSelectionMode,
}: ActionBarProps) => {
  return (
    <div className="p-2 flex items-center justify-between ">
      <div className="flex items-center bg-primary gap-2 p-2 rounded-md border-none shadow-none ">
        <button
          onClick={addDefaultAgent}
          className="font-semibold text-xs text-secondary flex items-center gap-2"
        >
          <span>Add Agent</span>
          <Plus className="h-4 w-4 text-secondary" />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={activeSelectionMode}
          className={`p-2 rounded-md transition-colors
  ${isSelectionMode ? "bg-primary text-secondary" : "hover:bg-muted/60"}
  `}
        >
          <Edit className="h-4 w-4" />
        </button>

        <button
          onClick={normalizeAgents}
          className="p-2 rounded-md bg-transparent border-none shadow-none hover:bg-muted/60 cursor-pointer transition-colors"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

        <button
          onClick={resetCustomAgents}
          className="p-2 rounded-md bg-transparent border-none shadow-none hover:bg-muted/60 cursor-pointer transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
