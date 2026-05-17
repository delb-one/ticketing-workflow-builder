import { useMemo } from "react";
import { useWorkflowStore } from "@/lib/store";
import { ValidationIssue } from "@/features/panels/logic/validation-selectors";

function validateWorkflowOnce(
  nodes: { id: string; data: { type: string; label: string } }[],
  edges: { source: string; target: string; id: string }[]
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const nodeIds = new Set(nodes.map((n) => n.id));
  const startNodes = nodes.filter((node) => node.data.type === "start");
  const endNodes = nodes.filter((node) => node.data.type === "end");

  if (startNodes.length === 0) {
    issues.push({
      id: "no-start-node",
      severity: "error",
      category: "structure",
      title: "Missing Start Node",
      description: "Workflow must have exactly one Start node to define entry point.",
    });
  } else if (startNodes.length > 1) {
    issues.push({
      id: "multiple-start-nodes",
      severity: "error",
      category: "structure",
      title: "Multiple Start Nodes",
      description: `Found ${startNodes.length} start nodes. Only one is allowed.`,
      nodeId: startNodes[1]?.id,
    });
  }

  if (endNodes.length === 0) {
    issues.push({
      id: "no-end-node",
      severity: "error",
      category: "structure",
      title: "Missing End Node",
      description: "Workflow should have at least one End node to define completion.",
    });
  }

  const connectedIds = new Set<string>();
  for (const edge of edges) {
    connectedIds.add(edge.source);
    connectedIds.add(edge.target);
  }
  for (const node of nodes) {
    if (!connectedIds.has(node.id)) {
      issues.push({
        id: `disconnected-${node.id}`,
        severity: "warning",
        category: "connectivity",
        nodeId: node.id,
        title: "Disconnected Node",
        description: `"${node.data.label}" is not connected to the workflow.`,
      });
    }
  }

  const endNodeIds = new Set(endNodes.map((n) => n.id));
  const outgoingCounts = new Map<string, number>();
  for (const node of nodes) {
    outgoingCounts.set(node.id, 0);
  }
  for (const edge of edges) {
    outgoingCounts.set(edge.source, (outgoingCounts.get(edge.source) ?? 0) + 1);
  }
  for (const node of nodes) {
    if (endNodeIds.has(node.id)) continue;
    const outgoing = outgoingCounts.get(node.id) ?? 0;
    if (outgoing === 0) {
      issues.push({
        id: `dead-end-${node.id}`,
        severity: "warning",
        category: "connectivity",
        nodeId: node.id,
        title: "Dead-end Node",
        description: `"${node.data.label}" has no outgoing connections and is not an End node.`,
      });
    }
  }

  for (const edge of edges) {
    if (!nodeIds.has(edge.source)) {
      issues.push({
        id: `invalid-edge-source-${edge.id}`,
        severity: "error",
        category: "structure",
        title: "Invalid Edge Source",
        description: `Edge references non-existent source node "${edge.source}".`,
      });
    }
    if (!nodeIds.has(edge.target)) {
      issues.push({
        id: `invalid-edge-target-${edge.id}`,
        severity: "error",
        category: "structure",
        title: "Invalid Edge Target",
        description: `Edge references non-existent target node "${edge.target}".`,
      });
    }
  }

  return issues;
}

export interface UseValidationResult {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
  all: ValidationIssue[];
  hasErrors: boolean;
  hasWarnings: boolean;
  isValid: boolean;
}

export function useValidation(): UseValidationResult {
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);

  return useMemo(() => {
    const issues = validateWorkflowOnce(nodes, edges);
    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");
    const info = issues.filter((i) => i.severity === "info");

    return {
      errors,
      warnings,
      info,
      all: issues,
      hasErrors: errors.length > 0,
      hasWarnings: warnings.length > 0,
      isValid: errors.length === 0,
    };
  }, [nodes, edges]);
}
