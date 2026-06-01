import type { Edge } from "@xyflow/react";
import type { CustomNode } from "@/lib/store";

export interface SubFlowTemplate {
  id: string;
  name: string;
  description: string;
  nodes: CustomNode[];
  edges: Edge[];
  entryNodeId: string;
  exitNodeId: string;
  size: {
    width: number;
    height: number;
  };
}

export const SUB_FLOW_TEMPLATES: SubFlowTemplate[] = [
  {
    id: "incident-triage",
    name: "Incident triage",
    description: "Classify, assign and start SLA tracking for a new incident.",
    entryNodeId: "triage-status",
    exitNodeId: "triage-assign",
    size: {
      width: 620,
      height: 280,
    },
    nodes: [
      {
        id: "triage-status",
        type: "canvas",
        position: { x: 40, y: 88 },
        data: {
          label: "Ticket opened",
          type: "status",
          blockId: "status",
          description: "Mark ticket as open before triage.",
          config: { nodeType: "status", statusValue: "open", startsSla: true },
        },
      },
      {
        id: "triage-rules",
        type: "canvas",
        position: { x: 235, y: 88 },
        data: {
          label: "Apply rules",
          type: "automation",
          blockId: "business-rules",
          description: "Calculate priority and normalize category.",
          config: { nodeType: "automation", automationType: "business-rules" },
        },
      },
      {
        id: "triage-assign",
        type: "canvas",
        position: { x: 430, y: 88 },
        data: {
          label: "Assign L1",
          type: "automation",
          blockId: "auto-assign",
          description: "Assign ticket to the first available L1 technician.",
          config: {
            nodeType: "automation",
            automationType: "auto-assign",
            assignTo: "l1",
          },
        },
      },
    ],
    edges: [
      {
        id: "triage-status-triage-rules",
        source: "triage-status",
        target: "triage-rules",
        type: "glow",
      },
      {
        id: "triage-rules-triage-assign",
        source: "triage-rules",
        target: "triage-assign",
        type: "glow",
      },
    ],
  },
  {
    id: "resolution-validation",
    name: "Resolution validation",
    description: "Resolve, ask the client to validate, then close the ticket.",
    entryNodeId: "resolution-action",
    exitNodeId: "resolution-close",
    size: {
      width: 620,
      height: 280,
    },
    nodes: [
      {
        id: "resolution-action",
        type: "canvas",
        position: { x: 40, y: 88 },
        data: {
          label: "Resolve ticket",
          type: "action",
          blockId: "resolve",
          description: "Mark ticket as resolved.",
          config: { nodeType: "action", ticketAction: "resolve" },
        },
      },
      {
        id: "resolution-validate",
        type: "canvas",
        position: { x: 235, y: 88 },
        data: {
          label: "Client validates",
          type: "action",
          blockId: "validate",
          description: "Client validates the proposed resolution.",
          config: { nodeType: "action", ticketAction: "validate" },
        },
      },
      {
        id: "resolution-close",
        type: "canvas",
        position: { x: 430, y: 88 },
        data: {
          label: "Close ticket",
          type: "action",
          blockId: "close",
          description: "Permanently close the ticket.",
          config: { nodeType: "action", ticketAction: "close" },
        },
      },
    ],
    edges: [
      {
        id: "resolution-action-resolution-validate",
        source: "resolution-action",
        target: "resolution-validate",
        type: "glow",
      },
      {
        id: "resolution-validate-resolution-close",
        source: "resolution-validate",
        target: "resolution-close",
        type: "glow",
      },
    ],
  },
];
