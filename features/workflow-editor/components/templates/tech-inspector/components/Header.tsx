"use client";

import { PropertyCard } from "@/components/molecules/PropertyCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getNodeTypeColorVar } from "@/lib/colors/color-map";
import { useWorkflowStore } from "@/lib/store";
import { CustomNode } from "@/lib/store";

interface HeaderProps {
  loadPercentage: number;
  loadColor: string;
  selectedNode: CustomNode;
}

export const Header = ({ loadPercentage, loadColor, selectedNode }: HeaderProps) => {
  const { updateNode } = useWorkflowStore();
  const handleLabelChange = (newLabel: string) => {
    updateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        label: newLabel,
      },
    });
  };

  return (
    <div className="p-3 space-y-2">
      <div className="sticky top-0 bg-card mb-2 space-y-2">
        {/* DEBUG HEADER */}
        <Badge className="text-xs text-secondary-foreground bg-amber-500">STILL IN DEV - MOCK DATA</Badge>
        <h2 className="font-semibold text-foreground">Node Inspector</h2>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Type:</span>

          <Badge
            variant="outline"
            className="text-[10px] uppercase font-semibold w-fit"
            style={{
              backgroundColor: `color-mix(in oklab, ${getNodeTypeColorVar(selectedNode.data.type)} 10%, transparent)`,
              color: `color-mix(in oklab, ${getNodeTypeColorVar(selectedNode.data.type)} 50%, white)`,
              border: `1px solid color-mix(in oklab, ${getNodeTypeColorVar(selectedNode.data.type)} 50%, transparent)`,
            }}
          >
            {selectedNode.data.type}{" "}
          </Badge>
        </div>
      </div>
      <PropertyCard label="Label">
        <Input
          value={selectedNode.data.label}
          onChange={(event) => handleLabelChange(event.target.value)}
          className="text-sm"
        />
      </PropertyCard>

      {/* LABEL */}
      <div className="text-xs text-muted-foreground">Node load</div>

      {/* PROGRESS BAR */}
      <div className="h-2 w-full bg-muted rounded overflow-hidden">
        <div
          className={`h-2 rounded transition-all ${loadColor}`}
          style={{ width: `${loadPercentage}%` }}
        />
      </div>

      {/* PERCENTAGE */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Load</span>

        {loadPercentage > 0 && (
          <span className="text-xs text-muted-foreground">
            {loadPercentage}%
          </span>
        )}
      </div>
    </div>
  );
};
