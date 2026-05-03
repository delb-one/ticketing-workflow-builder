import { SimulationEventBus } from "./event-bus";
import { NODE_HANDLER_REGISTRY } from "./node-handlers";
import type {
  Agent,
  DecisionOutcome,
  EngineRuntimeState,
  NodeConfig,
  QueueState,
  SimulationEvent,
  SimulationRuntime,
  Ticket,
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowNode,
} from "./types";

export type EngineStateListener = (
  state: EngineRuntimeState,
  event?: SimulationEvent,
) => void;

const createDefaultTicket = (index: number = 0): Ticket => {
  const now = Date.now();

  return {
    id: `tkt-${index}`,
    state: "open",
    priority: "medium",
    impact: "medium",
    createdAt: now,
    updatedAt: now,
    context: {
      variables: {},
      events: [],
    },
  };
};

const createDefaultRuntime = (ticket: Ticket): SimulationRuntime => ({
  currentNodeId: null,
  ticket,
  history: [],
  paused: false,
  pausedAt: null,
  pendingDecisionOutcomes: [],
  completed: false,
});

const createDefaultConfig = (
  type: WorkflowNode["data"]["type"],
): NodeConfig => {
  switch (type) {
    case "decision":
      return { nodeType: "decision", decisionType: "manual", outcomes: [] };
    case "automation":
      return { nodeType: "automation", automationType: "business-rules" };
    case "action":
      return { nodeType: "action", ticketAction: "validate" };
    case "actor":
      return { nodeType: "actor" };
    case "status":
      return { nodeType: "status", statusValue: "assigned" };
    case "event":
      return { nodeType: "event", eventTrigger: "manual" };
    case "condition":
      return { nodeType: "condition" };
    case "start":
      return { nodeType: "start" };
    case "end":
    default:
      return { nodeType: "end" };
  }
};

export class SimulationEngine {
  private workflow: WorkflowDefinition;
  private runtimes: Record<string, SimulationRuntime> = {};
  private queues: QueueState = { l1: [], l2: [], l3: [] };
  private agents: Agent[] = [];
  
  private eventBus: SimulationEventBus;
  private listeners: EngineStateListener[] = [];
  private eventLog: SimulationEvent[] = [];

  constructor(workflow: WorkflowDefinition) {
    this.workflow = {
      ...workflow,
      nodes: workflow.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          config: node.data.config ?? createDefaultConfig(node.data.type),
        },
      })),
    };
    this.eventBus = new SimulationEventBus();
    this.eventBus.subscribe((event) => {
      this.eventLog.push(event);
      this.notify(event);
    });
  }

  start(ticketCount: number = 1, initialAgents: Agent[] = []): void {
    const startNode = this.resolveStartNode();

    this.runtimes = {};
    this.queues = { l1: [], l2: [], l3: [] };
    this.agents = initialAgents.map(a => ({...a, status: 'available', currentTicketId: undefined}));
    
    if (!startNode) {
      this.emit({
        type: "workflow.error",
        ticketId: "system",
        timestamp: Date.now(),
        payload: { reason: "No start node found" },
      });
      this.notify();
      return;
    }

    for (let i = 0; i < ticketCount; i++) {
      const ticket = createDefaultTicket(i);

      this.runtimes[ticket.id] = {
        ...createDefaultRuntime(ticket),
        currentNodeId: startNode.id,
      };
    }

    this.notify();
  }

  step(): void {
    const dequeuedThisStep = new Set<string>();

    // 1. Scheduler: Assign tickets from queues to available agents
    for (const agent of this.agents) {
      if (agent.status === "available") {
        const queue = this.queues[agent.level];
        if (queue && queue.length > 0) {
          const ticketId = queue.shift()!; // FIFO scheduling
          agent.status = "busy";
          agent.currentTicketId = ticketId;
          
          const runtime = this.runtimes[ticketId];
          if (runtime) {
            runtime.ticket.assignedAgent = agent.id;
            runtime.ticket.state = "assigned";
            runtime.ticket.queue = undefined;
            const nextNode = runtime.currentNodeId
              ? this.resolveNextNode(runtime.currentNodeId)
              : undefined;
            if (nextNode) {
              runtime.currentNodeId = nextNode.id;
            }
            runtime.paused = false; // Resume execution now that we have an agent
            runtime.pausedAt = null;
            dequeuedThisStep.add(ticketId);
            this.emit({ type: "ticket.dequeued", ticketId, timestamp: Date.now(), payload: { queue: agent.level } });
            this.emit({ type: "agent.assigned", ticketId, timestamp: Date.now(), payload: { agentId: agent.id } });
          }
        }
      }
    }

    // 2. Execution: Execute node for each active runtime
    const activeTicketIds = Object.keys(this.runtimes).filter(id => {
      const rt = this.runtimes[id];
      return !rt.completed && !rt.paused && rt.currentNodeId && !dequeuedThisStep.has(id);
    });

    for (const ticketId of activeTicketIds) {
      this.stepRuntime(ticketId);
    }
    
    this.notify();
  }

  private stepRuntime(ticketId: string): void {
    const runtime = this.runtimes[ticketId];
    if (!runtime || !runtime.currentNodeId) return;

    const currentNode = this.workflow.nodes.find(
      (node) => node.id === runtime.currentNodeId,
    );

    if (!currentNode) {
      this.emit({
        type: "workflow.error",
        ticketId,
        timestamp: Date.now(),
        payload: { reason: `Node not found: ${runtime.currentNodeId}` },
      });
      runtime.completed = true;
      runtime.currentNodeId = null;
      return;
    }

    const isWaitingInQueue = runtime.ticket.queue && !runtime.ticket.assignedAgent;
    const nodeRequiresAgent = currentNode.data.type === 'actor' || currentNode.data.type === 'action';
    
    if (isWaitingInQueue && nodeRequiresAgent) {
      return; // Pause execution for this runtime until an agent picks it up
    }

    this.recordHistory(ticketId, currentNode);

    const handler = NODE_HANDLER_REGISTRY[currentNode.data.type];
    if (!handler) {
      this.emit({
        type: "workflow.error",
        ticketId,
        timestamp: Date.now(),
        nodeId: currentNode.id,
        nodeLabel: currentNode.data.label,
        payload: {
          reason: `No handler for node type ${currentNode.data.type}`,
        },
      });
      runtime.completed = true;
      runtime.currentNodeId = null;
      return;
    }

    const result = handler.execute(
      currentNode,
      this.workflow.edges,
      runtime.ticket,
      runtime.ticket.context,
    );

    if (result.ticketUpdates) {
      runtime.ticket = {
        ...runtime.ticket,
        ...result.ticketUpdates,
        context: {
          ...runtime.ticket.context,
          ...(result.ticketUpdates.context ?? {}),
        },
      };
    }

    result.events?.forEach((event) => this.emit(event));

    if (result.releaseAgent) {
      const agent = this.agents.find(a => a.currentTicketId === ticketId);
      if (agent) {
        agent.status = "available";
        agent.currentTicketId = undefined;
        runtime.ticket.assignedAgent = undefined;
        this.emit({ type: "agent.released", ticketId, timestamp: Date.now(), payload: { agentId: agent.id } });
      }
    }

    if (result.enqueueTo) {
      this.queues[result.enqueueTo].push(ticketId);
      runtime.ticket.queue = result.enqueueTo;
      runtime.paused = true;
      runtime.pausedAt = null;
      this.emit({ type: "ticket.queued", ticketId, timestamp: Date.now(), payload: { queue: result.enqueueTo } });
      return;
    }

    if (result.requiresInput) {
      runtime.paused = true;
      runtime.pausedAt = currentNode.data.label;
      runtime.pendingDecisionOutcomes = result.inputOptions ?? [];
      return;
    }

    if (currentNode.data.type === "end") {
      runtime.completed = true;
      runtime.currentNodeId = null;
      runtime.paused = false;
      runtime.pausedAt = null;
      runtime.pendingDecisionOutcomes = [];
      return;
    }

    const nextNode = this.resolveNextNode(currentNode.id);

    if (!nextNode) {
      runtime.completed = true;
      runtime.currentNodeId = null;
      runtime.paused = false;
      runtime.pausedAt = null;
      runtime.pendingDecisionOutcomes = [];
      this.emit({
        type: "workflow.completed",
        ticketId,
        timestamp: Date.now(),
        nodeId: currentNode.id,
        nodeLabel: currentNode.data.label,
        payload: { reason: "no-outgoing-edge" },
      });
      return;
    }

    runtime.currentNodeId = nextNode.id;
    runtime.paused = false;
    runtime.pausedAt = null;
    runtime.pendingDecisionOutcomes = [];
  }

  handleDecision(ticketId: string, outcomeLabel: string): void {
    const runtime = this.runtimes[ticketId];
    if (!runtime || !runtime.paused || !runtime.currentNodeId) {
      return;
    }

    const currentNode = this.workflow.nodes.find(
      (node) => node.id === runtime.currentNodeId,
    );
    if (!currentNode) {
      return;
    }

    const selectedOutcome = runtime.pendingDecisionOutcomes.find(
      (outcome) => outcome.label === outcomeLabel,
    );

    const nextNode =
      this.resolveNextNode(currentNode.id, outcomeLabel) ??
      (selectedOutcome
        ? this.workflow.nodes.find(
            (node) => node.id === selectedOutcome.targetNodeId,
          )
        : undefined);

    if (!nextNode) {
      this.emit({
        type: "workflow.error",
        ticketId,
        timestamp: Date.now(),
        nodeId: currentNode.id,
        nodeLabel: currentNode.data.label,
        payload: { reason: `Decision outcome not routable: ${outcomeLabel}` },
      });
      return;
    }

    runtime.currentNodeId = nextNode.id;
    runtime.paused = false;
    runtime.pausedAt = null;
    runtime.pendingDecisionOutcomes = [];
    runtime.ticket.context.lastDecisionOutcome = outcomeLabel;

    this.emit({
      type: "decision.made",
      ticketId,
      timestamp: Date.now(),
      nodeId: currentNode.id,
      nodeLabel: currentNode.data.label,
      payload: { newState: outcomeLabel },
    });

    this.notify();
  }

  stop(): void {
    for (const id of Object.keys(this.runtimes)) {
      const runtime = this.runtimes[id];
      runtime.completed = true;
      runtime.paused = false;
      runtime.pausedAt = null;
      runtime.pendingDecisionOutcomes = [];
      runtime.currentNodeId = null;
    }
    this.notify();
  }

  getEngineState(): EngineRuntimeState {
    const runtimesCopy: Record<string, SimulationRuntime> = {};
    for (const [id, runtime] of Object.entries(this.runtimes)) {
      runtimesCopy[id] = {
        ...runtime,
        ticket: { ...runtime.ticket, context: { ...runtime.ticket.context } },
        history: [...runtime.history],
        pendingDecisionOutcomes: [...runtime.pendingDecisionOutcomes],
      };
    }

    return {
      runtimes: runtimesCopy,
      queues: {
        l1: [...this.queues.l1],
        l2: [...this.queues.l2],
        l3: [...this.queues.l3],
      },
      agents: this.agents.map(a => ({ ...a })),
    };
  }

  getEventLog(): SimulationEvent[] {
    return [...this.eventLog];
  }

  subscribe(listener: EngineStateListener): () => void {
    this.listeners.push(listener);
    listener(this.getEngineState());

    return () => {
      this.listeners = this.listeners.filter(
        (activeListener) => activeListener !== listener,
      );
    };
  }

  private emit(event: SimulationEvent): void {
    this.eventBus.emit(event);
  }

  private notify(event?: SimulationEvent): void {
    const snapshot = this.getEngineState();
    this.listeners.forEach((listener) => listener(snapshot, event));
  }

  private resolveStartNode(): WorkflowNode | undefined {
    return this.workflow.nodes.find((node) => node.data.type === "start");
  }

  private resolveNextNode(
    currentId: string,
    outcomeLabel?: string,
  ): WorkflowNode | undefined {
    const outgoingEdges = this.workflow.edges.filter(
      (edge) => edge.source === currentId,
    );

    let edge: WorkflowEdge | undefined;
    if (outcomeLabel) {
      edge = outgoingEdges.find(
        (outgoingEdge) => outgoingEdge.label === outcomeLabel,
      );
    } else {
      edge = outgoingEdges[0];
    }

    return this.workflow.nodes.find((node) => node.id === edge?.target);
  }

  private recordHistory(ticketId: string, node: WorkflowNode): void {
    const runtime = this.runtimes[ticketId];
    if (runtime) {
      runtime.history.push({
        nodeId: node.id,
        nodeLabel: node.data.label,
        timestamp: Date.now(),
        ticketSnapshot: {
          ...runtime.ticket,
          context: {
            ...runtime.ticket.context,
          },
        },
      });
    }
  }
}
