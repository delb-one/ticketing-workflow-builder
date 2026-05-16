import type {
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowNode,
} from "@/lib/simulation";
import type { CustomNode, NodeConfig, NodeType } from "@/lib/store";

export const createDefaultNodeConfig = (
  type: NodeType,
  blockId?: string,
): NodeConfig => {
  switch (type) {
    case "decision":
      return { nodeType: "decision", decisionType: "manual", outcomes: [] };
    case "condition":
      return { nodeType: "condition" };
    case "automation": {
      const automationType =
        blockId === "sla-timer" ||
        blockId === "escalation" ||
        blockId === "auto-assign" ||
        blockId === "notify" ||
        blockId === "business-rules" ||
        blockId === "reopen"
          ? blockId
          : "business-rules";
      return {
        nodeType: "automation",
        automationType,
        duration: blockId === "sla-timer" ? 60 : undefined,
      };
    }
    case "action": {
      const ticketAction =
        blockId === "resolve" || blockId === "validate" || blockId === "close"
          ? blockId
          : "validate";
      return { nodeType: "action", ticketAction };
    }
    case "actor": {
      const agentLevel =
        blockId === "l1-tech"
          ? "l1"
          : blockId === "l2-tech"
            ? "l2"
            : blockId === "l3-specialist"
              ? "l3"
              : blockId === "client"
                ? "client"
                : blockId === "supervisor"
                  ? "supervisor"
                  : undefined;
      return { nodeType: "actor", agentLevel };
    }
    case "status":
      return { nodeType: "status", statusValue: "assigned" };
    case "event":
      return { nodeType: "event", eventTrigger: "manual" };
    case "start":
      return { nodeType: "start" };
    case "end":
    default:
      return { nodeType: "end" };
  }
};

export const toWorkflowDefinition = (
  nodes: CustomNode[],
  edges: WorkflowEdge[],
): WorkflowDefinition => {
  const workflowNodes: WorkflowNode[] = nodes.map((node) => {
    const blockId = node.data.blockId ?? node.data.id;

    return {
      id: node.id,
      type: node.data.type,
      position: node.position,
      data: {
        label: node.data.label,
        type: node.data.type,
        description: node.data.description,
        blockId,
        config:
          node.data.config ?? createDefaultNodeConfig(node.data.type, blockId),
      },
    };
  });

  const workflowEdges: WorkflowEdge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: typeof edge.label === "string" ? edge.label : undefined,
  }));

  return {
    id: "active-workflow",
    name: "Active Workflow",
    nodes: workflowNodes,
    edges: workflowEdges,
  };
};

export const selectTotalSpawnedTickets = (
  ticketTemplates: Array<{ autoSpawnCount?: number }>,
): number =>
  ticketTemplates.reduce(
    (sum, template) => sum + Math.max(1, template.autoSpawnCount ?? 1),
    0,
  );

export const selectPreflightError = (
  ticketTemplatesCount: number,
  agentPoolCount: number,
): string | null => {
  if (ticketTemplatesCount === 0) {
    return "Add at least one ticket template before starting.";
  }
  if (agentPoolCount === 0) {
    return "Add at least one agent before starting.";
  }
  return null;
};
