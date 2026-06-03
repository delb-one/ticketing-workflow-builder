import type { Edge, XYPosition } from "@xyflow/react";
import type { CustomNode } from "@/lib/store";
import type { SubFlowDefinition } from "@/lib/db/dexie";

interface SubFlowTemplateInstance {
  nodes: CustomNode[];
  edges: Edge[];
  groupNodeId: string;
}

const createInstanceId = (): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const instantiateSubFlowTemplate = (
  template: SubFlowDefinition,
  position: XYPosition,
): SubFlowTemplateInstance => {
  const instanceId = createInstanceId();
  const groupNodeId = `group-${template.id}-${instanceId}`;
  const nodeIdMap = new Map<string, string>();

  for (const node of template.nodes) {
    nodeIdMap.set(node.id, `${node.id}-${instanceId}`);
  }

  const childNodeIds = template.nodes.map((node) => nodeIdMap.get(node.id)!);

  const groupNode: CustomNode = {
    id: groupNodeId,
    type: "canvas",
    position,
    style: {
      width: template.size?.width ?? 600,
      height: template.size?.height ?? 400,
    },
    data: {
      label: template.name,
      type: "group",
      blockId: template.id,
      description: template.description || "Custom Subflow",
      config: {
        nodeType: "group",
        templateId: template.id,
        childNodeIds,
        isCollapsed: true,
        entryNodeId: template.entryNodeId ? (nodeIdMap.get(template.entryNodeId) ?? template.entryNodeId) : undefined,
        exitNodeId: template.exitNodeId ? (nodeIdMap.get(template.exitNodeId) ?? template.exitNodeId) : undefined,
      },
    },
  };

  const childNodes: CustomNode[] = template.nodes.map((node) => ({
    ...node,
    id: nodeIdMap.get(node.id)!,
    parentId: groupNodeId,
    extent: "parent",
    deletable: false,
    selected: false,
    data: {
      ...node.data,
      config: node.data.config ? structuredClone(node.data.config) : undefined,
    },
  }));

  const edges: Edge[] = template.edges.map((edge) => ({
    ...edge,
    id: `${edge.id}-${instanceId}`,
    source: nodeIdMap.get(edge.source) ?? edge.source,
    target: nodeIdMap.get(edge.target) ?? edge.target,
    selected: false,
  }));

  return {
    groupNodeId,
    nodes: [groupNode, ...childNodes],
    edges,
  };
};
