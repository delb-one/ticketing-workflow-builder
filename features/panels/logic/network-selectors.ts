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

const selectExecutableNetworkState = (state: NetworkState): NetworkState => {
  const nodes = state.nodes.filter((node) => node.data.type !== "group");
  const nodeIds = new Set(nodes.map((node) => node.id));

  return {
    nodes,
    edges: state.edges.filter(
      (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target),
    ),
  };
};

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
  const { nodes, edges } = selectExecutableNetworkState(state);
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
  const nodeExists = state.nodes.some(
    (node) => node.id === nodeId && node.data.type !== "group",
  );
  if (!nodeExists) return null;

  const executableState = selectExecutableNetworkState(state);
  const adjacency = buildAdjacencyMap(
    executableState.nodes,
    executableState.edges,
  );
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
  const executableState = selectExecutableNetworkState(state);
  const adjacency = buildAdjacencyMap(
    executableState.nodes,
    executableState.edges,
  );

  return executableState.nodes
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
  const executableState = selectExecutableNetworkState(state);
  const adjacency = buildAdjacencyMap(
    executableState.nodes,
    executableState.edges,
  );
  return selectLongestPath(executableState.nodes, adjacency);
};

export const selectGraphDensity = (state: NetworkState): number => {
  const executableState = selectExecutableNetworkState(state);
  const n = executableState.nodes.length;
  if (n <= 1) return 0;
  const maxDirectedEdges = n * (n - 1);
  return executableState.edges.length / maxDirectedEdges;
};
