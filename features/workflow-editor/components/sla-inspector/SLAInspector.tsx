"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CustomNode, useWorkflowStore } from "@/lib/store";
import type { NodeConfig } from "@/lib/simulation/types";
import { PropertyCard } from "@/components/molecules/PropertyCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getNodeTypeColorVar } from "@/lib/colors/color-map";
import { Button } from "@/components/ui/button";
import type { Ticket } from "@/lib/simulation/types";

interface SLAInspectorProps {
  selectedNode: CustomNode;
}

const DEFAULT_MULTIPLIERS = {
  critical: 0.5,
  high: 0.75,
  medium: 1,
  low: 1.5,
};

const PRIORITIES: Ticket["priority"][] = ["critical", "high", "medium", "low"];

export function SLAInspector({ selectedNode }: SLAInspectorProps) {
  const { updateNode, nodes } = useWorkflowStore();
  const liveNode = nodes.find((node) => node.id === selectedNode.id) ?? selectedNode;
  const config = liveNode.data.config as Extract<NodeConfig, { nodeType: "automation" }>;

  if (config.nodeType !== "automation" || config.automationType !== "sla-timer") {
    return null;
  }

  const duration = config.duration ?? 60;
  const warningThreshold = config.warningThreshold ?? 0.75;
  const priorityMultipliers = config.priorityMultipliers ?? DEFAULT_MULTIPLIERS;

  const handleConfigChange = (patch: Partial<NodeConfig>) => {
    updateNode(liveNode.id, {
      data: {
        ...liveNode.data,
        config: { ...config, ...patch },
      },
    });
  };

  const setPreset = (presetDuration: number) => {
    handleConfigChange({ duration: presetDuration });
  };

  const updateMultiplier = (priority: Ticket["priority"], value: number) => {
    handleConfigChange({
      priorityMultipliers: {
        ...priorityMultipliers,
        [priority]: value,
      },
    });
  };

  return (
    <div className="flex h-full w-80 flex-col overflow-y-auto bg-transparent">
      <div className="sticky top-0 p-3 space-y-2 bg-background/95 backdrop-blur z-10 border-b border-border/50">
        <h2 className="font-semibold text-foreground">SLA Policy</h2>
        <div className="flex items-center gap-2 text-xs">
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-semibold w-fit"
            style={{
              backgroundColor: `color-mix(in oklab, ${getNodeTypeColorVar(selectedNode.data.type)} 10%, transparent)`,
              color: `color-mix(in oklab, ${getNodeTypeColorVar(selectedNode.data.type)} 50%, white)`,
              border: `1px solid color-mix(in oklab, ${getNodeTypeColorVar(selectedNode.data.type)} 50%, transparent)`,
            }}
          >
            {selectedNode.data.type}
          </Badge>
          <span className="text-muted-foreground truncate">{selectedNode.data.label}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 space-y-4 p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <PropertyCard label="Base Max Resolution Time">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Slider
                value={[duration]}
                min={1}
                max={1440}
                step={1}
                onValueChange={([val]) => handleConfigChange({ duration: val })}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right font-medium">{duration}m</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPreset(60)}>1h</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPreset(240)}>4h</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPreset(480)}>8h</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setPreset(1440)}>24h</Button>
            </div>
          </div>
        </PropertyCard>

        <PropertyCard label={`Warning Threshold (${Math.round(warningThreshold * 100)}%)`}>
          <div className="space-y-4 pt-2">
            <Slider
              value={[warningThreshold * 100]}
              min={10}
              max={95}
              step={5}
              onValueChange={([val]) => handleConfigChange({ warningThreshold: val / 100 })}
            />
            <p className="text-xs text-muted-foreground leading-tight">
              Tickets will enter the "warning" state when {Math.round(warningThreshold * 100)}% of their resolution time has elapsed.
            </p>
          </div>
        </PropertyCard>

        <PropertyCard label="Priority Modifiers">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground leading-tight mb-2">
              Multiplier applied to the base resolution time based on ticket priority.
            </p>
            {PRIORITIES.map((priority) => (
              <div key={priority} className="flex items-center justify-between gap-3">
                <Label className="capitalize text-xs w-16">{priority}</Label>
                <Slider
                  value={[priorityMultipliers[priority] ?? 1]}
                  min={0.1}
                  max={3}
                  step={0.1}
                  onValueChange={([val]) => updateMultiplier(priority, val)}
                  className="flex-1"
                />
                <span className="text-xs w-8 text-right text-muted-foreground">x{(priorityMultipliers[priority] ?? 1).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </PropertyCard>
      </ScrollArea>
    </div>
  );
}
