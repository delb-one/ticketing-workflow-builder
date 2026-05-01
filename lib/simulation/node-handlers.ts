import type {
  DecisionOutcome,
  NodeType,
  NodeConfig,
  SimulationContext,
  SimulationEvent,
  Ticket,
  WorkflowEdge,
  WorkflowNode,
} from './types';

export interface HandlerResult {
  ticketUpdates?: Partial<Ticket>;
  events?: SimulationEvent[];
  requiresInput?: boolean;
  inputOptions?: DecisionOutcome[];
  logMessage?: string;
  releaseAgent?: boolean;
  enqueueTo?: "l1" | "l2" | "l3";
}

export interface NodeHandler {
  execute(
    node: WorkflowNode,
    edges: WorkflowEdge[],
    ticket: Ticket,
    context: SimulationContext,
  ): HandlerResult;
}

const buildEvent = (
  type: SimulationEvent['type'],
  ticketId: string,
  node: WorkflowNode,
  payload?: Record<string, unknown>,
): SimulationEvent => ({
  type,
  ticketId,
  timestamp: Date.now(),
  nodeId: node.id,
  nodeLabel: node.data.label,
  payload,
});

const getDefaultDecisionOutcomes = (node: WorkflowNode, edges: WorkflowEdge[]): DecisionOutcome[] => {
  const outgoingEdges = edges.filter((edge) => edge.source === node.id);

  return outgoingEdges.map((edge, index) => ({
    label: edge.label?.trim() || `Opzione ${index + 1}`,
    targetNodeId: edge.target,
    condition: edge.condition,
  }));
};

class StartNodeHandler implements NodeHandler {
  execute(node: WorkflowNode, _edges: WorkflowEdge[], ticket: Ticket): HandlerResult {
    return {
      ticketUpdates: {
        state: 'open',
        updatedAt: Date.now(),
      },
      events: [
        buildEvent('workflow.started', ticket.id, node),
        buildEvent('ticket.created', ticket.id, node),
      ],
    };
  }
}

class EndNodeHandler implements NodeHandler {
  execute(node: WorkflowNode, _edges: WorkflowEdge[], ticket: Ticket): HandlerResult {
    return {
      ticketUpdates: {
        state: 'closed',
        updatedAt: Date.now(),
      },
      events: [
        buildEvent('ticket.closed', ticket.id, node),
        buildEvent('workflow.completed', ticket.id, node),
      ],
    };
  }
}

class ActorNodeHandler implements NodeHandler {
  execute(node: WorkflowNode, _edges: WorkflowEdge[], ticket: Ticket): HandlerResult {
    const config = node.data.config as Extract<NodeConfig, { nodeType: 'actor' }>;
    const agentLevel = config.agentLevel;

    if (!agentLevel) {
      return {
        events: [buildEvent('workflow.step', ticket.id, node)],
      };
    }

    if (!ticket.assignedAgent) {
      return {
        enqueueTo: agentLevel as "l1" | "l2" | "l3",
        ticketUpdates: {
          queue: agentLevel as "l1" | "l2" | "l3",
        },
        events: [
          buildEvent("ticket.queued", ticket.id, node, { queue: agentLevel }),
        ],
      };
    }

    const assignedGroup = agentLevel.toUpperCase();

    return {
      ticketUpdates: {
        assignedGroup,
        updatedAt: Date.now(),
      },
      events: [
        buildEvent("ticket.assigned", ticket.id, node, { assignedGroup }),
        buildEvent("workflow.step", ticket.id, node),
      ],
    };
  }
}

class ActionNodeHandler implements NodeHandler {
  execute(node: WorkflowNode, _edges: WorkflowEdge[], ticket: Ticket): HandlerResult {
    const config = node.data.config as Extract<NodeConfig, { nodeType: 'action' }>;

    if (config.ticketAction === 'resolve') {
      return {
        releaseAgent: true,
        ticketUpdates: { state: 'resolved', updatedAt: Date.now() },
        events: [
          buildEvent('ticket.resolved', ticket.id, node),
          buildEvent('ticket.updated', ticket.id, node, { state: 'resolved' }),
        ],
      };
    }

    if (config.ticketAction === 'close') {
      return {
        releaseAgent: true,
        ticketUpdates: { state: 'closed', updatedAt: Date.now() },
        events: [
          buildEvent('ticket.closed', ticket.id, node),
          buildEvent('ticket.updated', ticket.id, node, { state: 'closed' }),
        ],
      };
    }

    return {
      events: [buildEvent('ticket.updated', ticket.id, node, { action: config.ticketAction })],
    };
  }
}

class AutomationNodeHandler implements NodeHandler {
  execute(node: WorkflowNode, _edges: WorkflowEdge[], ticket: Ticket): HandlerResult {
    const config = node.data.config as Extract<NodeConfig, { nodeType: 'automation' }>;

    switch (config.automationType) {
      case 'sla-timer': {
        const now = Date.now();
        const durationMs = Math.max(1, config.duration ?? 60) * 60 * 1000;
        return {
          ticketUpdates: {
            sla: {
              startTime: now,
              deadline: now + durationMs,
              breached: false,
            },
            updatedAt: now,
          },
          events: [buildEvent('sla.started', ticket.id, node, { durationMinutes: config.duration ?? 60 })],
        };
      }
      case 'escalation':
        return {
          releaseAgent: true,
          enqueueTo: 'l2',
          events: [buildEvent('ticket.escalated', ticket.id, node)],
        };
      case 'auto-assign': {
        const assignedQueue = (config.assignTo ?? 'l1').toLowerCase() as "l1" | "l2" | "l3";
        const assignedGroup = assignedQueue.toUpperCase();
        return {
          releaseAgent: true,
          enqueueTo: assignedQueue,
          ticketUpdates: {
            assignedGroup,
            updatedAt: Date.now(),
          },
          events: [buildEvent('ticket.assigned', ticket.id, node, { assignedGroup })],
        };
      }
      case 'notify':
        return {
          events: [buildEvent('ticket.updated', ticket.id, node, { channel: config.channel ?? 'email' })],
        };
      case 'reopen':
        return {
          ticketUpdates: { state: 'reopened', updatedAt: Date.now() },
          events: [buildEvent('ticket.reopened', ticket.id, node)],
        };
      case 'business-rules':
      default:
        return {
          events: [buildEvent('workflow.step', ticket.id, node, { automationType: config.automationType })],
        };
    }
  }
}

class DecisionNodeHandler implements NodeHandler {
  execute(node: WorkflowNode, edges: WorkflowEdge[], ticket: Ticket): HandlerResult {
    const config = node.data.config;
    const configuredOutcomes =
      config.nodeType === 'decision' ? config.outcomes : undefined;
    const outcomes = configuredOutcomes && configuredOutcomes.length > 0
      ? configuredOutcomes
      : getDefaultDecisionOutcomes(node, edges);

    return {
      requiresInput: true,
      inputOptions: outcomes,
      events: [buildEvent('decision.required', ticket.id, node, { outcomes: outcomes.map((outcome) => outcome.label) })],
    };
  }
}

class StatusNodeHandler implements NodeHandler {
  execute(node: WorkflowNode, _edges: WorkflowEdge[], ticket: Ticket): HandlerResult {
    const config = node.data.config as Extract<NodeConfig, { nodeType: 'status' }>;
    const now = Date.now();
    const updates: Partial<Ticket> = {
      state: config.statusValue,
      updatedAt: now,
    };
    const events: SimulationEvent[] = [buildEvent('ticket.updated', ticket.id, node, { state: config.statusValue })];

    if (config.startsSla) {
      updates.sla = {
        startTime: now,
        deadline: now + 60 * 60 * 1000,
        breached: false,
      };
      events.push(buildEvent('sla.started', ticket.id, node));
    }

    if (config.stopsSla && ticket.sla) {
      updates.sla = undefined;
    }

    return {
      ticketUpdates: updates,
      events,
    };
  }
}

class EventNodeHandler implements NodeHandler {
  execute(node: WorkflowNode, _edges: WorkflowEdge[], ticket: Ticket): HandlerResult {
    const config = node.data.config as Extract<NodeConfig, { nodeType: 'event' }>;
    return {
      events: [buildEvent('workflow.step', ticket.id, node, { trigger: config.eventTrigger })],
    };
  }
}

export const NODE_HANDLER_REGISTRY: Partial<Record<NodeType, NodeHandler>> = {
  start: new StartNodeHandler(),
  end: new EndNodeHandler(),
  actor: new ActorNodeHandler(),
  action: new ActionNodeHandler(),
  automation: new AutomationNodeHandler(),
  decision: new DecisionNodeHandler(),
  condition: new DecisionNodeHandler(),
  status: new StatusNodeHandler(),
  event: new EventNodeHandler(),
};
