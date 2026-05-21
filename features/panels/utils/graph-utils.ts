import type { Edge } from "@xyflow/react";
import type { CustomNode } from "@/lib/store";

export type AdjacencyMap = {
  outgoing: Map<string, string[]>;
  incoming: Map<string, string[]>;
};

const ensureEntry = (map: Map<string, string[]>, nodeId: string) => {
  if (!map.has(nodeId)) {
    map.set(nodeId, []);
  }
};

export const buildAdjacencyMap = (
  nodes: CustomNode[],
  edges: Pick<Edge, "source" | "target">[],
): AdjacencyMap => {
  const outgoing = new Map<string, string[]>();
  const incoming = new Map<string, string[]>();

  for (const node of nodes) {
    ensureEntry(outgoing, node.id);
    ensureEntry(incoming, node.id);
  }

  for (const edge of edges) {
    ensureEntry(outgoing, edge.source);
    ensureEntry(incoming, edge.target);
    outgoing.get(edge.source)!.push(edge.target);
    incoming.get(edge.target)!.push(edge.source);
  }

  return { outgoing, incoming };
};

export const getIncomingNodes = (adjacency: AdjacencyMap, nodeId: string): string[] =>
  adjacency.incoming.get(nodeId) ?? [];

export const getOutgoingNodes = (adjacency: AdjacencyMap, nodeId: string): string[] =>
  adjacency.outgoing.get(nodeId) ?? [];

export const breadthFirstTraversal = (
  adjacency: AdjacencyMap,
  startNodeId: string,
): string[] => {
  const visited = new Set<string>();
  const queue: string[] = [startNodeId];
  const order: string[] = [];

  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    order.push(nodeId);

    for (const next of getOutgoingNodes(adjacency, nodeId)) {
      if (!visited.has(next)) queue.push(next);
    }
  }

  return order;
};

export const depthFirstTraversal = (
  adjacency: AdjacencyMap,
  startNodeId: string,
): string[] => {
  const visited = new Set<string>();
  const stack: string[] = [startNodeId];
  const order: string[] = [];

  while (stack.length > 0) {
    const nodeId = stack.pop()!;
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);
    order.push(nodeId);

    const outgoing = getOutgoingNodes(adjacency, nodeId);
    for (let index = outgoing.length - 1; index >= 0; index -= 1) {
      const next = outgoing[index];
      if (!visited.has(next)) stack.push(next);
    }
  }

  return order;
};

export const findConnectedComponents = (
  nodes: CustomNode[],
  adjacency: AdjacencyMap,
): string[][] => {
  const visited = new Set<string>();
  const components: string[][] = [];

  for (const node of nodes) {
    if (visited.has(node.id)) continue;

    const component: string[] = [];
    const queue: string[] = [node.id];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (visited.has(current)) continue;
      visited.add(current);
      component.push(current);

      const neighbors = new Set([
        ...getIncomingNodes(adjacency, current),
        ...getOutgoingNodes(adjacency, current),
      ]);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) queue.push(neighbor);
      }
    }

    components.push(component);
  }

  return components;
};

const topoSort = (
  nodes: CustomNode[],
  adjacency: AdjacencyMap,
): { order: string[]; hasCycle: boolean } => {
  const indegree = new Map<string, number>();
  for (const node of nodes) {
    indegree.set(node.id, getIncomingNodes(adjacency, node.id).length);
  }

  const queue = nodes.filter((n) => (indegree.get(n.id) ?? 0) === 0).map((n) => n.id);
  const order: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    order.push(current);

    for (const next of getOutgoingNodes(adjacency, current)) {
      const nextIn = (indegree.get(next) ?? 0) - 1;
      indegree.set(next, nextIn);
      if (nextIn === 0) queue.push(next);
    }
  }

  return { order, hasCycle: order.length !== nodes.length };
};

const longestPathOnDag = (
  nodes: CustomNode[],
  adjacency: AdjacencyMap,
): string[] => {
  const { order } = topoSort(nodes, adjacency);
  const distance = new Map<string, number>();
  const parent = new Map<string, string | null>();

  for (const node of nodes) {
    distance.set(node.id, 0);
    parent.set(node.id, null);
  }

  for (const nodeId of order) {
    const currentDistance = distance.get(nodeId) ?? 0;
    for (const next of getOutgoingNodes(adjacency, nodeId)) {
      const nextDistance = distance.get(next) ?? 0;
      if (currentDistance + 1 > nextDistance) {
        distance.set(next, currentDistance + 1);
        parent.set(next, nodeId);
      }
    }
  }

  let tailNodeId: string | null = null;
  let maxDistance = -1;
  for (const [nodeId, value] of distance.entries()) {
    if (value > maxDistance) {
      maxDistance = value;
      tailNodeId = nodeId;
    }
  }

  if (!tailNodeId) return [];

  const path: string[] = [];
  let current: string | null = tailNodeId;
  while (current) {
    path.push(current);
    current = parent.get(current) ?? null;
  }
  path.reverse();
  return path;
};

const longestSimplePathWithCycleGuard = (
  nodes: CustomNode[],
  adjacency: AdjacencyMap,
): string[] => {
  let bestPath: string[] = [];
  const visited = new Set<string>();

  const dfs = (nodeId: string, path: string[]) => {
    if (path.length > bestPath.length) bestPath = [...path];

    for (const next of getOutgoingNodes(adjacency, nodeId)) {
      if (visited.has(next)) continue;
      visited.add(next);
      path.push(next);
      dfs(next, path);
      path.pop();
      visited.delete(next);
    }
  };

  for (const node of nodes) {
    visited.clear();
    visited.add(node.id);
    dfs(node.id, [node.id]);
  }

  return bestPath;
};

export const selectLongestPath = (
  nodes: CustomNode[],
  adjacency: AdjacencyMap,
): string[] => {
  if (nodes.length === 0) return [];
  const { hasCycle } = topoSort(nodes, adjacency);
  return hasCycle
    ? longestSimplePathWithCycleGuard(nodes, adjacency)
    : longestPathOnDag(nodes, adjacency);
};

export const calculateWorkflowDepth = (
  nodes: CustomNode[],
  adjacency: AdjacencyMap,
): number => {
  const longestPath = selectLongestPath(nodes, adjacency);
  return Math.max(longestPath.length - 1, 0);
};
