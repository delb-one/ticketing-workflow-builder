"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PropertyCard } from "@/components/molecules/PropertyCard";
import { getNodeTypeColorVar } from "@/lib/colors/color-map";
import { CustomNode, useWorkflowStore } from "@/lib/store";
import type { DecisionOutcome, NodeConfig } from "@/lib/simulation/types";

interface DecisionInspectorProps {
  selectedNode: CustomNode;
}

type ConditionOperator = "equals" | "gt" | "lt" | "includes";
type ConditionValueType = "string" | "number" | "boolean";

const DEFAULT_OPERATORS: ConditionOperator[] = [
  "equals",
  "includes",
  "gt",
  "lt",
];

const BOOLEAN_OPTIONS = ["true", "false"] as const;

const toDecisionConfig = (
  config: NodeConfig | undefined,
): Extract<NodeConfig, { nodeType: "decision" }> => {
  if (config?.nodeType === "decision") {
    return config;
  }
  return {
    nodeType: "decision",
    decisionType: "manual",
    outcomes: [],
  };
};

const parseNumberOrKeepString = (value: string): string | number => {
  const normalized = value.trim();
  if (!normalized) return "";
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : value;
};

export function DecisionInspector({ selectedNode }: DecisionInspectorProps) {
  const { nodes, edges, updateNode, setEdges } = useWorkflowStore();
  const liveNode = nodes.find((node) => node.id === selectedNode.id) ?? selectedNode;
  const nodeType = liveNode.data.type;
  const isDecisionNode = nodeType === "decision";
  const isConditionNode = nodeType === "condition";

  if (!isDecisionNode && !isConditionNode) return null;

  const decisionConfig = toDecisionConfig(liveNode.data.config);
  const outgoingEdges = edges.filter((edge) => edge.source === liveNode.id);
  const fallbackOutcomesFromEdges: DecisionOutcome[] = outgoingEdges.map((edge, index) => ({
    label: typeof edge.label === "string" && edge.label.trim().length > 0 ? edge.label : `Option ${index + 1}`,
    targetNodeId: edge.target,
    condition:
      "condition" in edge && edge.condition
        ? (edge.condition as DecisionOutcome["condition"])
        : undefined,
  }));
  const activeOutcomes = isConditionNode
    ? fallbackOutcomesFromEdges
    : decisionConfig.outcomes && decisionConfig.outcomes.length > 0
      ? decisionConfig.outcomes
      : fallbackOutcomesFromEdges;

  const availableTargets = (() => {
    const targets = outgoingEdges
      .map((edge) => nodes.find((node) => node.id === edge.target))
      .filter((node): node is CustomNode => Boolean(node));
    if (targets.length > 0) return targets;
    return nodes.filter((node) => node.id !== liveNode.id);
  })();

  const updateDecisionConfig = (
    patch: Partial<Extract<NodeConfig, { nodeType: "decision" }>>,
  ) => {
    const nextConfig: Extract<NodeConfig, { nodeType: "decision" }> = {
      ...decisionConfig,
      ...patch,
      nodeType: "decision",
    };
    updateNode(liveNode.id, {
      data: {
        ...liveNode.data,
        config: nextConfig,
      },
    });
  };

  const updateOutcome = (
    index: number,
    updater: (current: DecisionOutcome) => DecisionOutcome,
  ) => {
    const nextOutcomes = [...activeOutcomes];
    nextOutcomes[index] = updater(nextOutcomes[index]);
    if (isConditionNode) {
      const edgeToUpdate = outgoingEdges[index];
      if (!edgeToUpdate) return;
      const nextOutcome = nextOutcomes[index];
      setEdges(
        edges.map((edge) =>
          edge.id === edgeToUpdate.id
            ? {
                ...edge,
                target: nextOutcome.targetNodeId,
                label: nextOutcome.label,
                condition: nextOutcome.condition,
              }
            : edge,
        ),
      );
      return;
    }
    updateDecisionConfig({ outcomes: nextOutcomes });
  };

  const addOutcome = () => {
    if (!isDecisionNode) return;
    const defaultTarget = availableTargets[0]?.id ?? "";
    updateDecisionConfig({
      outcomes: [
        ...activeOutcomes,
        {
          label: `Option ${activeOutcomes.length + 1}`,
          targetNodeId: defaultTarget,
          priority: activeOutcomes.length + 1,
        },
      ],
    });
  };

  const removeOutcome = (index: number) => {
    if (!isDecisionNode) return;
    const nextOutcomes = activeOutcomes.filter((_, currentIndex) => currentIndex !== index);
    updateDecisionConfig({ outcomes: nextOutcomes });
  };

  const handleValueTypeChange = (index: number, nextType: ConditionValueType) => {
    updateOutcome(index, (current) => {
      const condition = current.condition ?? {
        field: "",
        operator: "equals",
        value: "",
      };

      if (nextType === "number") {
        return {
          ...current,
          condition: {
            ...condition,
            value: Number(condition.value) || 0,
          },
        };
      }

      if (nextType === "boolean") {
        return {
          ...current,
          condition: {
            ...condition,
            value: Boolean(condition.value),
            operator: "equals",
          },
        };
      }

      return {
        ...current,
        condition: {
          ...condition,
          value: String(condition.value ?? ""),
        },
      };
    });
  };

  const getConditionValueType = (outcome: DecisionOutcome): ConditionValueType => {
    const value = outcome.condition?.value;
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    return "string";
  };

  const shouldShowRules =
    isConditionNode ||
    (isDecisionNode && decisionConfig.decisionType === "rule-based");

  return (
    <div className="flex h-full w-80 flex-col overflow-y-auto bg-transparent">
      <div className="sticky top-0 p-3 space-y-2 bg-background/95 backdrop-blur z-10 border-b border-border/50">
        <h2 className="font-semibold text-foreground">Decision & Conditions</h2>
        <div className="flex items-center gap-2 text-xs">
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-semibold w-fit"
            style={{
              backgroundColor: `color-mix(in oklab, ${getNodeTypeColorVar(liveNode.data.type)} 10%, transparent)`,
              color: `color-mix(in oklab, ${getNodeTypeColorVar(liveNode.data.type)} 50%, white)`,
              border: `1px solid color-mix(in oklab, ${getNodeTypeColorVar(liveNode.data.type)} 50%, transparent)`,
            }}
          >
            {liveNode.data.type}
          </Badge>
          <span className="text-muted-foreground truncate">{liveNode.data.label}</span>
        </div>
      </div>

      <ScrollArea className="flex-1 space-y-4 p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {isDecisionNode && (
          <PropertyCard label="Decision Mode">
            <Select
              value={decisionConfig.decisionType}
              onValueChange={(value) =>
                updateDecisionConfig({
                  decisionType: value as "manual" | "rule-based",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual Boolean</SelectItem>
                <SelectItem value="rule-based">Rule-based</SelectItem>
              </SelectContent>
            </Select>
          </PropertyCard>
        )}

        <PropertyCard label="Outcomes">
          <div className="space-y-3">
            {activeOutcomes.map((outcome, index) => {
              const valueType = getConditionValueType(outcome);
              return (
                <div key={`${outcome.targetNodeId}-${index}`} className="rounded-md border border-border/70 p-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={outcome.label}
                      onChange={(event) =>
                        updateOutcome(index, (current) => ({
                          ...current,
                          label: event.target.value,
                        }))
                      }
                      placeholder="Outcome label"
                    />
                    {isDecisionNode && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOutcome(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={outcome.targetNodeId}
                      onValueChange={(value) =>
                        updateOutcome(index, (current) => ({ ...current, targetNodeId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Target node" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTargets.map((target) => (
                          <SelectItem key={target.id} value={target.id}>
                            {target.data.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="number"
                      value={outcome.priority ?? ""}
                      placeholder="Priority"
                      onChange={(event) =>
                        updateOutcome(index, (current) => ({
                          ...current,
                          priority:
                            event.target.value.trim().length > 0
                              ? Number(event.target.value)
                              : undefined,
                        }))
                      }
                    />
                  </div>

                  {shouldShowRules && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded border border-border/60 px-2 py-1">
                        <Label className="text-xs">Use Condition</Label>
                        <Switch
                          checked={Boolean(outcome.condition)}
                          onCheckedChange={(checked) =>
                            updateOutcome(index, (current) => ({
                              ...current,
                              condition: checked
                                ? {
                                    field: "",
                                    operator: "equals" as ConditionOperator,
                                    value: "",
                                  }
                                : undefined,
                            }))
                          }
                        />
                      </div>

                      {outcome.condition && (
                        <div className="space-y-2">
                          <Input
                            value={outcome.condition.field}
                            placeholder="Field (ex: priority, category)"
                            onChange={(event) =>
                              updateOutcome(index, (current) => ({
                                ...current,
                                condition: {
                                  ...current.condition!,
                                  field: event.target.value,
                                },
                              }))
                            }
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <Select
                              value={outcome.condition.operator}
                              onValueChange={(value) =>
                                updateOutcome(index, (current) => ({
                                  ...current,
                                  condition: {
                                    ...current.condition!,
                                    operator: value as ConditionOperator,
                                  },
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {DEFAULT_OPERATORS.map((operator) => (
                                  <SelectItem key={operator} value={operator}>
                                    {operator}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={valueType}
                              onValueChange={(value) =>
                                handleValueTypeChange(index, value as ConditionValueType)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Value type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="string">string</SelectItem>
                                <SelectItem value="number">number</SelectItem>
                                <SelectItem value="boolean">boolean</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {valueType === "boolean" ? (
                            <Select
                              value={String(Boolean(outcome.condition.value))}
                              onValueChange={(value) =>
                                updateOutcome(index, (current) => ({
                                  ...current,
                                  condition: {
                                    ...current.condition!,
                                    value: value === "true",
                                  },
                                }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {BOOLEAN_OPTIONS.map((value) => (
                                  <SelectItem key={value} value={value}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={valueType === "number" ? "number" : "text"}
                              value={String(outcome.condition.value ?? "")}
                              placeholder="Condition value"
                              onChange={(event) =>
                                updateOutcome(index, (current) => {
                                  const nextValue =
                                    valueType === "number"
                                      ? parseNumberOrKeepString(event.target.value)
                                      : event.target.value;
                                  return {
                                    ...current,
                                    condition: {
                                      ...current.condition!,
                                      value: nextValue as string | number | boolean,
                                    },
                                  };
                                })
                              }
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isDecisionNode && (
              <Button type="button" variant="outline" onClick={addOutcome}>
                Add outcome
              </Button>
            )}
          </div>
        </PropertyCard>
      </ScrollArea>
    </div>
  );
}
