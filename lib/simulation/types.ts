export type NodeType =
  | 'start'
  | 'end'
  | 'actor'
  | 'action'
  | 'automation'
  | 'decision'
  | 'condition'
  | 'status'
  | 'event';

export interface DecisionOutcome {
  label: string;
  targetNodeId: string;
  condition?: string;
}

export type NodeConfig =
  | {
      nodeType: 'decision';
      decisionType: 'boolean' | 'custom';
      outcomes?: DecisionOutcome[];
    }
  | {
      nodeType: 'automation';
      automationType:
        | 'sla-timer'
        | 'escalation'
        | 'auto-assign'
        | 'notify'
        | 'business-rules'
        | 'reopen';
      duration?: number;
      assignTo?: 'l1' | 'l2' | 'l3';
      channel?: string;
    }
  | {
      nodeType: 'action';
      ticketAction: 'resolve' | 'validate' | 'close';
    }
  | {
      nodeType: 'actor';
      agentLevel?: 'l1' | 'l2' | 'l3' | 'client' | 'supervisor';
    }
  | {
      nodeType: 'status';
      statusValue: string;
      startsSla?: boolean;
      stopsSla?: boolean;
    }
  | {
      nodeType: 'event';
      eventTrigger: string;
    }
  | {
      nodeType: 'start' | 'end' | 'condition';
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
  condition?: string;
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
}

export interface SimulationContext {
  variables: Record<string, unknown>;
  events: string[];
  lastDecisionOutcome?: string;
}

export interface Ticket {
  id: string;
  state: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high';
  assignedAgent?: string;
  assignedGroup?: string;
  createdAt: number;
  updatedAt: number;
  sla?: SlaState;
  context: SimulationContext;
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
  | 'ticket.created'
  | 'ticket.updated'
  | 'ticket.assigned'
  | 'ticket.resolved'
  | 'ticket.closed'
  | 'ticket.escalated'
  | 'ticket.reopened'
  | 'sla.started'
  | 'sla.breached'
  | 'decision.required'
  | 'decision.made'
  | 'workflow.started'
  | 'workflow.step'
  | 'workflow.completed'
  | 'workflow.error';

export interface SimulationEvent {
  type: SimulationEventType;
  ticketId: string;
  timestamp: number;
  nodeId?: string;
  nodeLabel?: string;
  payload?: Record<string, unknown>;
}
