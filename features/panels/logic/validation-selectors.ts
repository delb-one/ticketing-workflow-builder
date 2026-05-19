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
const STATUS_FLOW_ORDER = ["open", "assigned", "pending", "resolved", "closed"] as const;

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
  ...selectDisconnectedBranches(state),
  ...selectUnreachableNodes(state),
  ...selectDisconnectedNodes(state),
  ...selectDeadEndNodes(state),
  ...selectInvalidDecisionNodes(state),
  ...selectActorIssues(state),
  ...selectAutomationIssues(state),
  ...selectInvalidStatusTransitions(state),
  ...selectITSMIssues(state),
  ...selectInvalidEdgeReferences(state),
];

export const selectDisconnectedBranches = (state: {
  nodes: CustomNode[];
  edges: { source: string; target: string }[];
}): ValidationIssue[] => {
  if (state.nodes.length === 0) return [];

  const adjacency = new Map<string, string[]>();
  for (const node of state.nodes) adjacency.set(node.id, []);
  for (const edge of state.edges) {
    adjacency.get(edge.source)?.push(edge.target);
    adjacency.get(edge.target)?.push(edge.source);
  }

  const visited = new Set<string>();
  const components: string[][] = [];

  for (const node of state.nodes) {
    if (visited.has(node.id)) continue;
    const queue = [node.id];
    visited.add(node.id);
    const component: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      component.push(current);
      for (const next of adjacency.get(current) ?? []) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }

    components.push(component);
  }

  if (components.length <= 1) return [];

  return components.slice(1).map((component, index) => ({
    id: `disconnected-branch-${index}`,
    severity: "warning",
    category: "connectivity",
    nodeId: component[0],
    title: "Disconnected Branch",
    description: `Detected isolated branch with ${component.length} node(s).`,
  }));
};

export const selectUnreachableNodes = (state: {
  nodes: CustomNode[];
  edges: { source: string; target: string }[];
}): ValidationIssue[] => {
  const start = state.nodes.find((n) => n.data.type === START_NODE_TYPE);
  if (!start) return [];

  const outgoing = new Map<string, string[]>();
  for (const node of state.nodes) outgoing.set(node.id, []);
  for (const edge of state.edges) outgoing.get(edge.source)?.push(edge.target);

  const visited = new Set<string>();
  const queue = [start.id];
  visited.add(start.id);

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of outgoing.get(current) ?? []) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }

  return state.nodes
    .filter((n) => !visited.has(n.id))
    .map((node) => ({
      id: `unreachable-${node.id}`,
      severity: "error" as const,
      category: "connectivity" as const,
      nodeId: node.id,
      title: "Unreachable Node",
      description: `"${node.data.label}" cannot be reached from Start.`,
    }));
};

export const selectInvalidDecisionNodes = (state: {
  nodes: CustomNode[];
  edges: { source: string; target: string; id: string; label?: string }[];
}): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const decisionNodes = state.nodes.filter((n) => n.data.type === "decision");

  for (const node of decisionNodes) {
    const outgoing = state.edges.filter((e) => e.source === node.id);
    if (outgoing.length < 2) {
      issues.push({
        id: `decision-min-outputs-${node.id}`,
        severity: "warning",
        category: "logic",
        nodeId: node.id,
        title: "Decision Node With Insufficient Outputs",
        description: `"${node.data.label}" should have at least 2 outgoing paths.`,
      });
    }

    const normalizedLabels = outgoing.map((edge) => (edge.label ?? "").trim().toLowerCase());
    if (normalizedLabels.some((label) => label.length === 0)) {
      issues.push({
        id: `decision-missing-label-${node.id}`,
        severity: "warning",
        category: "logic",
        nodeId: node.id,
        title: "Decision Path Missing Label",
        description: `"${node.data.label}" has one or more unlabeled outgoing paths.`,
      });
    }

    const unique = new Set(normalizedLabels.filter((label) => label.length > 0));
    if (unique.size !== normalizedLabels.filter((label) => label.length > 0).length) {
      issues.push({
        id: `decision-duplicate-outcomes-${node.id}`,
        severity: "warning",
        category: "logic",
        nodeId: node.id,
        title: "Duplicated Decision Outcomes",
        description: `"${node.data.label}" contains duplicated outcome labels.`,
      });
    }
  }

  return issues;
};

export const selectActorIssues = (state: { nodes: CustomNode[] }): ValidationIssue[] =>
  state.nodes
    .filter((n) => n.data.type === "actor")
    .flatMap((node) => {
      const config = node.data.config as { agentLevel?: string } | undefined;
      if (config?.agentLevel) return [];
      return [
        {
          id: `actor-missing-role-${node.id}`,
          severity: "warning" as const,
          category: "logic" as const,
          nodeId: node.id,
          title: "Actor Without Assigned Role",
          description: `"${node.data.label}" has no agent level configured.`,
        },
      ];
    });

export const selectAutomationIssues = (state: { nodes: CustomNode[] }): ValidationIssue[] =>
  state.nodes
    .filter((n) => n.data.type === "automation")
    .flatMap((node) => {
      const config = node.data.config as { automationType?: string } | undefined;
      if (config?.automationType) return [];
      return [
        {
          id: `automation-missing-config-${node.id}`,
          severity: "warning" as const,
          category: "logic" as const,
          nodeId: node.id,
          title: "Automation Missing Configuration",
          description: `"${node.data.label}" has no automation type configured.`,
        },
      ];
    });

export const selectInvalidStatusTransitions = (state: {
  nodes: CustomNode[];
  edges: { source: string; target: string }[];
}): ValidationIssue[] => {
  const indexByStatus = new Map<string, number>(STATUS_FLOW_ORDER.map((status, i) => [status, i]));
  const nodesById = new Map(state.nodes.map((node) => [node.id, node]));
  const issues: ValidationIssue[] = [];

  for (const edge of state.edges) {
    const sourceNode = nodesById.get(edge.source);
    const targetNode = nodesById.get(edge.target);
    if (sourceNode?.data.type !== "status" || targetNode?.data.type !== "status") continue;

    const sourceStatus = (sourceNode.data.config as { statusValue?: string } | undefined)?.statusValue;
    const targetStatus = (targetNode.data.config as { statusValue?: string } | undefined)?.statusValue;
    if (!sourceStatus || !targetStatus) continue;

    const sourceIndex = indexByStatus.get(sourceStatus);
    const targetIndex = indexByStatus.get(targetStatus);
    if (sourceIndex === undefined || targetIndex === undefined) continue;

    if (sourceStatus === "resolved" && targetStatus === "reopened") continue;
    if (sourceStatus === "reopened" && targetStatus === "assigned") continue;

    if (targetIndex < sourceIndex) {
      issues.push({
        id: `status-transition-${edge.source}-${edge.target}`,
        severity: "warning",
        category: "itsm",
        nodeId: sourceNode.id,
        title: "Potentially Invalid Status Transition",
        description: `Transition "${sourceStatus}" -> "${targetStatus}" may violate expected lifecycle progression.`,
      });
    }
  }

  return issues;
};

export const selectITSMIssues = (state: { nodes: CustomNode[] }): ValidationIssue[] => {
  const automationTypes = new Set(
    state.nodes
      .filter((n) => n.data.type === "automation")
      .map((n) => (n.data.config as { automationType?: string } | undefined)?.automationType)
      .filter((v): v is string => Boolean(v))
  );

  const hasResolvePath = state.nodes.some(
    (n) => n.data.type === "action" && (n.data.config as { ticketAction?: string })?.ticketAction === "resolve"
  );

  const hasReopenPath = automationTypes.has("reopen");

  const issues: ValidationIssue[] = [];

  if (!automationTypes.has("escalation")) {
    issues.push({
      id: "itsm-missing-escalation",
      severity: "info",
      category: "itsm",
      title: "Missing Escalation Path",
      description: "Consider adding escalation logic for stuck or high-priority tickets.",
    });
  }

  if (!automationTypes.has("sla-timer")) {
    issues.push({
      id: "itsm-missing-sla",
      severity: "info",
      category: "itsm",
      title: "Missing SLA Handling",
      description: "Consider adding SLA timer automation to monitor deadlines.",
    });
  }

  if (!hasResolvePath) {
    issues.push({
      id: "itsm-missing-resolution",
      severity: "info",
      category: "itsm",
      title: "Missing Resolution Path",
      description: "No explicit resolution action was detected in the workflow.",
    });
  }

  if (!hasReopenPath) {
    issues.push({
      id: "itsm-missing-reopen",
      severity: "info",
      category: "itsm",
      title: "Missing Reopen Flow",
      description: "Consider adding a reopen path for failed or rejected resolutions.",
    });
  }

  if (!automationTypes.has("notify")) {
    issues.push({
      id: "itsm-missing-notification",
      severity: "info",
      category: "itsm",
      title: "No Notification System",
      description: "Consider adding notification automation for stakeholder updates.",
    });
  }

  return issues;
};
