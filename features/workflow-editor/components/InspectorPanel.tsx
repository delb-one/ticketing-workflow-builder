"use client";

import { useWorkflowStore, CustomNode } from "@/lib/store";
import type { NodeConfig } from "@/lib/simulation/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, UserCog } from "lucide-react";
import { getNodeTypeColorVar } from "@/lib/colors/color-map";
import { Badge } from "@/components/ui/badge";
import { PropertyCard } from "@/components/molecules/PropertyCard";
import { TechInspector } from "./tech-inspector/TechInspector";
import { SLAInspector } from "./sla-inspector/SLAInspector";
import { DecisionInspector } from "./decision-inspector/DecisionInspector";

interface InspectorPanelProps {
  selectedNode: CustomNode | undefined;
}

const mergeNodeConfig = (
  base: NodeConfig | undefined,
  patch: Partial<NodeConfig>,
): NodeConfig => {
  if (!base) {
    return patch as NodeConfig;
  }

  return {
    ...base,
    ...patch,
  } as NodeConfig;
};

export default function InspectorPanel({ selectedNode }: InspectorPanelProps) {
  const { updateNode } = useWorkflowStore();

  if (!selectedNode) {
    return (
      <div className="flex h-full w-80 flex-col overflow-y-auto p-4 bg-transparent">
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Select a node to inspect</p>
        </div>
      </div>
    );
  }

  const blockId = selectedNode.data.blockId ?? selectedNode.data.id;

  

  const handleConfigChange = (patch: Partial<NodeConfig>) => {
    updateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        config: mergeNodeConfig(selectedNode.data.config, patch),
      },
    });
  };

  const config = selectedNode.data.config;

  const isTechInspector = Boolean(blockId?.includes("tech"));
  const isSlaInspector = Boolean(blockId?.includes("sla"));
  const isDecisionInspector =
    selectedNode.data.type === "decision" || selectedNode.data.type === "condition";

  if (isTechInspector) {
    return <TechInspector selectedNode={selectedNode} />;
  }

  if (isSlaInspector) {
    return <SLAInspector selectedNode={selectedNode} />;
  }

  if (isDecisionInspector) {
    return <DecisionInspector selectedNode={selectedNode} />;
  }

  return (
    <>
      <div className="flex h-full w-80 flex-col overflow-y-auto bg-transparent">
        <div className="sticky top-0 p-3 space-y-2">
          <h2 className="font-semibold text-foreground">Node Inspector - {selectedNode.data.label}</h2>

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

        <ScrollArea className="flex-1 space-y-6 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {selectedNode.data.type === "automation" &&
            blockId?.includes("assign") && (
              <PropertyCard label="Assign To">
                <Select
                  value={
                    config?.nodeType === "automation"
                      ? (config.assignTo ?? "l1")
                      : "l1"
                  }
                  onValueChange={(value) =>
                    handleConfigChange({
                      nodeType: "automation",
                      automationType: "auto-assign",
                      assignTo: value as "l1" | "l2" | "l3",
                    })
                  }
                >
                  <SelectTrigger className="w-full max-w-48 flex items-center gap-2 [&>span]:truncate">
                    {" "}
                    <UserCog className="h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Assign to..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Automation</SelectLabel>
                      <SelectItem value="l1">L1 Technician</SelectItem>
                      <SelectItem value="l2">L2 Technician</SelectItem>
                      <SelectItem value="l3">L3 Specialist</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </PropertyCard>
            )}

          {selectedNode.data.type === "automation" &&
            blockId?.includes("notify") && (
              <PropertyCard label="Notification Channel">
                <Select
                  value={
                    config?.nodeType === "automation"
                      ? (config.channel ?? "email")
                      : "email"
                  }
                  onValueChange={(value) =>
                    handleConfigChange({
                      nodeType: "automation",
                      automationType: "notify",
                      channel: value as "email" | "sms" | "portal",
                    })
                  }
                >
                  <SelectTrigger className="w-full max-w-48 flex items-center gap-2 [&>span]:truncate">
                    <Bell className="h-4 w-4 text-muted-foreground shrink-0" />
                    <SelectValue placeholder="Select channel..." />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Notification</SelectLabel>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="portal">Portal</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </PropertyCard>
            )}
        </ScrollArea>
      </div>
    </>
  );
}
