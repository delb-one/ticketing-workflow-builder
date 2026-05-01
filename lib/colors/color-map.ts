import type { NodeType } from "@/lib/simulation/types";
export type NodeColor =
  | "node-1"
  | "node-2"
  | "node-3"
  | "node-4"
  | "node-5";

const NODE_TYPE_COLOR_MAP: Record<NodeType, NodeColor> = {
  actor: "node-4",
  decision: "node-3",
  condition: "node-3",
  automation: "node-2",
  action: "node-1",
  start: "node-5",
  end: "node-5",
  status: "node-1",
  event: "node-2",
};

export const getNodeTypeColorToken = (type: NodeType): NodeColor =>
  NODE_TYPE_COLOR_MAP[type];

export const getCssVarColor = (token: string): string => `var(--${token})`;

export const getNodeTypeColorVar = (type: NodeType): string =>
  getCssVarColor(getNodeTypeColorToken(type));
