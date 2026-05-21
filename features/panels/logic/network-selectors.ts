import type { WorkflowStore } from "@/lib/store";
import {
  buildAdjacencyMap,
  calculateWorkflowDepth,
  findConnectedComponents,
  getIncomingNodes,
  getOutgoingNodes,
  selectLongestPath,
} from "@/features/panels/utils/graph-utils";

type NetworkState = Pick<WorkflowStore, "nodes" | "edges">;

export type NodeConnectivity = {
  nodeId: string;
  incoming: string[];
  outgoing: string[];
  degree: number;
  role: "isolated" | "source" | "sink" | "intermediate";
};

export type WorkflowTopology = {
  totalNodes: number;
  totalEdges: number;
  connectedComponents: number;
  workflowDepth: number;
  averageBranchingFactor: number;
};

export type CriticalNetworkNode = {
  nodeId: string;
  label: string;
  degree: number;
  incoming: number;
  outgoing: number;
};

export const selectWorkflowTopology = (state: NetworkState): WorkflowTopology => {
  const { nodes, edges } = state;
  const adjacency = buildAdjacencyMap(nodes, edges);
  const connectedComponents = findConnectedComponents(nodes, adjacency);
  const nodesWithOutgoingEdges = nodes.filter(
    (node) => getOutgoingNodes(adjacency, node.id).length > 0,
  ).length;

  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    connectedComponents: connectedComponents.length,
    workflowDepth: calculateWorkflowDepth(nodes, adjacency),
    averageBranchingFactor:
      nodesWithOutgoingEdges > 0 ? edges.length / nodesWithOutgoingEdges : 0,
  };
};

export const selectNodeConnectivity = (
  state: NetworkState,
  nodeId: string,
): NodeConnectivity | null => {
  const nodeExists = state.nodes.some((node) => node.id === nodeId);
  if (!nodeExists) return null;

  const adjacency = buildAdjacencyMap(state.nodes, state.edges);
  const incoming = getIncomingNodes(adjacency, nodeId);
  const outgoing = getOutgoingNodes(adjacency, nodeId);
  const degree = incoming.length + outgoing.length;

  let role: NodeConnectivity["role"] = "intermediate";
  if (degree === 0) role = "isolated";
  else if (incoming.length === 0) role = "source";
  else if (outgoing.length === 0) role = "sink";

  return {
    nodeId,
    incoming,
    outgoing,
    degree,
    role,
  };
};

export const selectCriticalNetworkNodes = (
  state: NetworkState,
): CriticalNetworkNode[] => {
  const adjacency = buildAdjacencyMap(state.nodes, state.edges);

  return state.nodes
    .map((node) => {
      const incoming = getIncomingNodes(adjacency, node.id).length;
      const outgoing = getOutgoingNodes(adjacency, node.id).length;
      return {
        nodeId: node.id,
        label: node.data.label,
        degree: incoming + outgoing,
        incoming,
        outgoing,
      };
    })
    .filter((node) => node.degree > 0)
    .sort((a, b) => b.degree - a.degree || b.outgoing - a.outgoing)
    .slice(0, 5);
};

export const selectLongestWorkflowPath = (state: NetworkState): string[] => {
  const adjacency = buildAdjacencyMap(state.nodes, state.edges);
  return selectLongestPath(state.nodes, adjacency);
};

export const selectGraphDensity = (state: NetworkState): number => {
  const n = state.nodes.length;
  if (n <= 1) return 0;
  const maxDirectedEdges = n * (n - 1);
  return state.edges.length / maxDirectedEdges;
};
