import type { CustomNode } from "@/lib/store";
import type { NodeType } from "@/lib/simulation/types";

export type ValidationSeverity = "error" | "warning" | "info";

export type ValidationCategory = "structure" | "connectivity" | "logic" | "itsm";

export interface ValidationIssue {
  id: string;
  severity: ValidationSeverity;
  category: ValidationCategory;
  nodeId?: string;
  title: string;
  description?: string;
}

const START_NODE_TYPE: NodeType = "start";
const END_NODE_TYPE: NodeType = "end";

export const selectStartNodeIssues = (
  state: { nodes: CustomNode[] }
): ValidationIssue[] => {
  const startNodes = state.nodes.filter((node) => node.data.type === START_NODE_TYPE);

  const issues: ValidationIssue[] = [];

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

  return issues;
};

export const selectEndNodeIssues = (
  state: { nodes: CustomNode[] }
): ValidationIssue[] => {
  const endNodes = state.nodes.filter((node) => node.data.type === END_NODE_TYPE);

  const issues: ValidationIssue[] = [];

  if (endNodes.length === 0) {
    issues.push({
      id: "no-end-node",
      severity: "error",
      category: "structure",
      title: "Missing End Node",
      description: "Workflow should have at least one End node to define completion.",
    });
  }

  return issues;
};

export const selectDisconnectedNodeIds = (state: {
  nodes: CustomNode[];
  edges: { source: string; target: string }[];
}): Set<string> => {
  const nodeIds = new Set(state.nodes.map((n) => n.id));
  const connectedIds = new Set<string>();

  for (const edge of state.edges) {
    connectedIds.add(edge.source);
    connectedIds.add(edge.target);
  }

  const disconnected = new Set<string>();
  for (const id of nodeIds) {
    if (!connectedIds.has(id)) {
      disconnected.add(id);
    }
  }

  return disconnected;
};

export const selectDisconnectedNodes = (
  state: { nodes: CustomNode[]; edges: { source: string; target: string }[] }
): ValidationIssue[] => {
  const disconnectedIds = selectDisconnectedNodeIds(state);

  if (disconnectedIds.size === 0) return [];

  const issues: ValidationIssue[] = [];
  disconnectedIds.forEach((nodeId) => {
    const node = state.nodes.find((n) => n.id === nodeId);
    issues.push({
      id: `disconnected-${nodeId}`,
      severity: "warning",
      category: "connectivity",
      nodeId,
      title: "Disconnected Node",
      description: `"${node?.data.label ?? nodeId}" is not connected to the workflow.`,
    });
  });

  return issues;
};

export const selectDeadEndNodes = (
  state: { nodes: CustomNode[]; edges: { source: string; target: string }[] }
): ValidationIssue[] => {
  const endNodeIds = new Set(
    state.nodes.filter((n) => n.data.type === END_NODE_TYPE).map((n) => n.id)
  );

  const outgoingCounts = new Map<string, number>();
  for (const node of state.nodes) {
    outgoingCounts.set(node.id, 0);
  }
  for (const edge of state.edges) {
    outgoingCounts.set(edge.source, (outgoingCounts.get(edge.source) ?? 0) + 1);
  }

  const issues: ValidationIssue[] = [];

  for (const node of state.nodes) {
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

  return issues;
};

export const selectInvalidEdgeReferences = (
  state: { nodes: CustomNode[]; edges: { source: string; target: string; id: string }[] }
): ValidationIssue[] => {
  const nodeIds = new Set(state.nodes.map((n) => n.id));
  const issues: ValidationIssue[] = [];

  for (const edge of state.edges) {
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
};

export const selectAllIssues = (state: {
  nodes: CustomNode[];
  edges: { source: string; target: string; id: string }[];
}): ValidationIssue[] => [
  ...selectStartNodeIssues(state),
  ...selectEndNodeIssues(state),
  ...selectDisconnectedNodes(state),
  ...selectDeadEndNodes(state),
  ...selectInvalidEdgeReferences(state),
];