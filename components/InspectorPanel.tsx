"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkflowStore, CustomNode } from "@/lib/store";
import type { NodeConfig } from "@/lib/simulation/types";
import { ScrollArea } from "./ui/scroll-area";

interface InspectorPanelProps {
  selectedNode: CustomNode | undefined;
}

const getNodeTypeColor = (type: string) => {
  switch (type) {
    case "actor":
      return "text-chart-4";
    case "decision":
    case "condition":
      return "text-chart-3";
    case "automation":
      return "text-chart-2";
    case "action":
    case "status":
      return "text-chart-1";
    default:
      return "text-chart-5";
  }
};

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
  const { updateNode, deleteNode } = useWorkflowStore();

  if (!selectedNode) {
    return (
      <div className="flex h-full w-80 flex-col overflow-y-auto border-l border-border p-4">
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Select a node to inspect</p>
        </div>
      </div>
    );
  }

  const blockId = selectedNode.data.blockId ?? selectedNode.data.id;

  const handleLabelChange = (newLabel: string) => {
    updateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        label: newLabel,
      },
    });
  };

  const handleConfigChange = (patch: Partial<NodeConfig>) => {
    updateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        config: mergeNodeConfig(selectedNode.data.config, patch),
      },
    });
  };

  const config = selectedNode.data.config;

  return (
    <div className="flex h-full w-80 flex-col overflow-y-auto border-l border-border bg-card">
      <div className="sticky top-0 border-b border-border bg-card p-4">
        <h2 className="font-semibold text-foreground">Node Inspector</h2>
        <p
          className={`mt-1 text-xs font-medium ${getNodeTypeColor(selectedNode.data.type)}`}
        >
          Type: {selectedNode.data.type.toUpperCase()}
        </p>
      </div>

      <ScrollArea className="flex-1 space-y-6 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Card className="p-4 mb-4">
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Label
          </label>
          <Input
            value={selectedNode.data.label}
            onChange={(event) => handleLabelChange(event.target.value)}
            className="text-sm"
          />
        </Card>

        <Card className="p-4 mb-4">
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Description
          </label>
          <p className="text-sm text-muted-foreground">
            {selectedNode.data.description ?? "No description available"}
          </p>
        </Card>

        {selectedNode.data.type === "decision" && (
          <Card className="p-4 mb-4">
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Decision Type
            </label>
            <select
              value={
                config?.nodeType === "decision"
                  ? config.decisionType
                  : "boolean"
              }
              onChange={(event) =>
                handleConfigChange({
                  nodeType: "decision",
                  decisionType: event.target.value as "manual" | "rule-based",
                })
              }
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="boolean">Boolean (Yes/No)</option>
              <option value="custom">Custom Expression</option>
            </select>
          </Card>
        )}

        {selectedNode.data.type === "automation" &&
          blockId?.includes("sla") && (
            <Card className="p-4 mb-4">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                SLA Duration (minutes)
              </label>
              <Input
                type="number"
                value={
                  config?.nodeType === "automation"
                    ? (config.duration ?? 60)
                    : 60
                }
                onChange={(event) =>
                  handleConfigChange({
                    nodeType: "automation",
                    automationType: "sla-timer",
                    duration: parseInt(event.target.value, 10),
                  })
                }
                min="1"
                className="text-sm"
              />
            </Card>
          )}

        {selectedNode.data.type === "automation" &&
          blockId?.includes("assign") && (
            <Card className="p-4 mb-4">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Assign To
              </label>
              <select
                value={
                  config?.nodeType === "automation"
                    ? (config.assignTo ?? "l1")
                    : "l1"
                }
                onChange={(event) =>
                  handleConfigChange({
                    nodeType: "automation",
                    automationType: "auto-assign",
                    assignTo: event.target.value as "l1" | "l2" | "l3",
                  })
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="l1">L1 Technician</option>
                <option value="l2">L2 Technician</option>
                <option value="l3">L3 Specialist</option>
              </select>
            </Card>
          )}

        {selectedNode.data.type === "automation" &&
          blockId?.includes("notify") && (
            <Card className="p-4 mb-4">
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Notification Channel
              </label>
              <select
                value={
                  config?.nodeType === "automation"
                    ? (config.channel ?? "email")
                    : "email"
                }
                onChange={(event) =>
                  handleConfigChange({
                    nodeType: "automation",
                    automationType: "notify",
                    channel: event.target.value,
                  })
                }
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="portal">Portal</option>
              </select>
            </Card>
          )}

        <Card className="p-3">
          <p className="text-xs text-muted-foreground">
            <strong>ID:</strong> {selectedNode.id}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <strong>Position:</strong> {Math.round(selectedNode.position.x)},{" "}
            {Math.round(selectedNode.position.y)}
          </p>
        </Card>
      </ScrollArea>

      <div className="space-y-2 border-t border-border p-4">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full"
        >
          Delete Node
        </Button>
      </div>
    </div>
  );
}
