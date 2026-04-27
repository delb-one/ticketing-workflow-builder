export type NodeType =
  | "start"
  | "end"
  | "actor"
  | "action"
  | "automation"
  | "decision"
  | "condition"
  | "status"
  | "event";

export interface DecisionOutcome {
  label: string;
  targetNodeId: string;
  priority?: number;
  condition?: {
    field: string;
    operator: "equals" | "gt" | "lt" | "includes";
    value: string | number | boolean;
  };
}

export type NodeConfig =
  | {
      nodeType: "decision";
      decisionType: "manual" | "rule-based";
      outcomes?: DecisionOutcome[];
    }
  | {
      nodeType: "automation";
      automationType:
        | "sla-timer"
        | "escalation"
        | "auto-assign"
        | "notify"
        | "business-rules"
        | "reopen";
      duration?: number;
      assignTo?: "l1" | "l2" | "l3";
      channel?: string;
    }
  | {
      nodeType: "action";
      ticketAction: "resolve" | "validate" | "close";
    }
  | {
      nodeType: "actor";
      agentLevel?: "l1" | "l2" | "l3" | "client" | "supervisor";
    }
  | {
      nodeType: "status";
      statusValue: "open" | "in_progress" | "pending" | "resolved" | "closed"| "reopened";
      startsSla?: boolean;
      stopsSla?: boolean;
      isFinal?: boolean;
    }
  | {
      nodeType: "event";
      eventTrigger: string;
    }
  | {
      nodeType: "start" | "end" | "condition";
    };

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: {
    label: string;
    type: NodeType;
    blockId?: string;
    description?: string;
    config: NodeConfig;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: {
    field: string;
    operator: "equals" | "gt" | "lt" | "includes";
    value: string | number | boolean;
  }
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  metadata?: {
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface SlaState {
  startTime: number;
  deadline: number;
  breached: boolean;
  paused?: boolean;
  pausedAt?: number;
}

export interface SimulationContext {
  variables: {
    category?: string;
    priority?: string;
    source?: string;
    [key: string]: unknown;
  };
  events: SimulationEventType[];
  lastDecisionOutcome?: string;
}

export interface Ticket {
  id: string;
  state:
    | "open"
    | "in_progress"
    | "pending"
    | "resolved"
    | "closed"
    | "reopened";
  priority: "low" | "medium" | "high" | "critical";
  impact: "low" | "medium" | "high";
  assignedAgent?: {
    id: string;
    level: "l1" | "l2" | "l3";
  };
  assignedGroup?: string;
  createdAt: number;
  updatedAt: number;
  sla?: SlaState;
  context: SimulationContext;
  queue?: "l1" | "l2" | "l3";
  history?: string[];
}

export interface HistoryEntry {
  nodeId: string;
  nodeLabel: string;
  timestamp: number;
  ticketSnapshot: Partial<Ticket>;
}

export interface SimulationRuntime {
  currentNodeId: string | null;
  ticket: Ticket;
  history: HistoryEntry[];
  paused: boolean;
  pausedAt: string | null;
  pendingDecisionOutcomes: DecisionOutcome[];
  completed: boolean;
}

export type SimulationEventType =
  | "ticket.created"
  | "ticket.updated"
  | "ticket.assigned"
  | "ticket.resolved"
  | "ticket.closed"
  | "ticket.escalated"
  | "ticket.reopened"
  | "sla.started"
  | "sla.breached"
  | "decision.required"
  | "decision.made"
  | "workflow.started"
  | "workflow.step"
  | "workflow.completed"
  | "workflow.error";

export interface SimulationEvent {
  type: SimulationEventType;
  ticketId: string;
  timestamp: number;
  nodeId?: string;
  nodeLabel?: string;
  payload?: {
    previousState?: string;
    newState?: string;
    assignedTo?: string;
    reason?: string;
  };
}

export interface ExecutionResult {
  nextNodeId?: string;
  ticketUpdates?: Partial<Ticket>;
  events?: SimulationEvent[];
  pause?: boolean;
}
