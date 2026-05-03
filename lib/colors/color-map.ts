import type { NodeType, Ticket } from "@/lib/simulation/types";
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

export const getNodeTypeIconGradient = (type: NodeType): string => {
  const base = getNodeTypeColorVar(type);
  const light = `color-mix(in oklab, ${base} 78%, white)`;
  const deep = `color-mix(in oklab, ${base} 88%, black)`;
  return `linear-gradient(135deg, ${light} 0%, ${base} 52%, ${deep} 100%)`;
};

export const getNodeTypeBackgroundGradient = (type: NodeType): string => {
  const base = getNodeTypeColorVar(type);
  const wash = `color-mix(in oklab, ${base} 20%, transparent)`;
  const clear = "transparent";
  return `linear-gradient(160deg, ${wash} 0%, ${clear} 70%)`;
};

const TICKET_STATE_BADGE_CLASS_MAP: Record<Ticket["state"], string> = {
  open: "bg-sky-500/15 text-sky-300 border-sky-500/40",
  assigned: "bg-indigo-500/15 text-indigo-300 border-indigo-500/40",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/40",
  resolved: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40",
  closed: "bg-slate-500/20 text-slate-300 border-slate-500/40",
  reopened: "bg-rose-500/15 text-rose-300 border-rose-500/40",
};

export const getTicketStateBadgeClass = (state: Ticket["state"]): string =>
  TICKET_STATE_BADGE_CLASS_MAP[state];
