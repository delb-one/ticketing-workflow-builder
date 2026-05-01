"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWorkflowStore, CustomNode } from "@/lib/store";
import type { NodeConfig } from "@/lib/simulation/types";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Bell, GitBranch, UserCog } from "lucide-react";
import { getNodeTypeColorVar } from "@/lib/colors/color-map";

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
  const { updateNode, deleteNode } = useWorkflowStore();

  if (!selectedNode) {
    return (
      <div className="flex h-full w-80 flex-col overflow-y-auto p-4">
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
    <div className="flex h-full w-80 flex-col overflow-y-auto bg-card">
     <div className="sticky top-0 border-b border-border bg-card p-4 space-y-2">
  
  <h2 className="font-semibold text-foreground">
    Node Inspector
  </h2>

  <div className="flex items-center gap-2 text-xs">
    
    <span className="text-muted-foreground">
      Type:
    </span>

    <span
      className="px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold text-background"
      style={{
        backgroundColor: getNodeTypeColorVar(selectedNode.data.type),
      }}
    >
      {selectedNode.data.type}
    </span>

  </div>

</div>

      <ScrollArea className="flex-1 space-y-6 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Card className="p-4 mb-4">
          <label className=" block text-sm font-semibold text-foreground">
            Label
          </label>
          <Input
            value={selectedNode.data.label}
            onChange={(event) => handleLabelChange(event.target.value)}
            className="text-sm"
          />
        </Card>

        <Card className="p-4 mb-4">
          <label className="block text-sm font-semibold text-foreground">
            Description
          </label>
          <p className="text-sm text-muted-foreground">
            {selectedNode.data.description ?? "No description available"}
          </p>
        </Card>

        {selectedNode.data.type === "decision" && (
          <Card className="p-4 mb-4">
            <label className="block text-sm font-semibold text-foreground">
              Decision Type
            </label>

            <Select
              value={
                config?.nodeType === "decision"
                  ? (config.decisionType ?? "boolean")
                  : "boolean"
              }
              onValueChange={(value) =>
                handleConfigChange({
                  nodeType: "decision",
                  decisionType: value as "manual" | "rule-based",
                })
              }
            >
              <SelectTrigger className="w-full max-w-48  flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Select decision type..." />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Decision</SelectLabel>

                  <SelectItem value="manual">Boolean (Yes/No)</SelectItem>

                  <SelectItem value="rule-based">Custom Expression</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
              <label className="block text-sm font-semibold text-foreground">
                Assign To
              </label>

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
            </Card>
          )}

        {selectedNode.data.type === "automation" &&
          blockId?.includes("notify") && (
            <Card className="p-4 mb-4">
              <label className=" block text-sm font-semibold text-foreground">
                Notification Channel
              </label>

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
            </Card>
          )}

        {/* <Card className="p-3">
          <p className="text-xs text-muted-foreground">
            <strong>ID:</strong> {selectedNode.id}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <strong>Position:</strong> {Math.round(selectedNode.position.x)},{" "}
            {Math.round(selectedNode.position.y)}
          </p>
        </Card> */}
      </ScrollArea>

      {/* <div className="space-y-2 border-t border-border p-4">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full"
        >
          Delete Node
        </Button>
      </div> */}
    </div>
  );
}
