import { SimulationEventBus } from "./event-bus";
import { NODE_HANDLER_REGISTRY } from "./node-handlers";
import type {
  DecisionOutcome,
  NodeConfig,
  SimulationEvent,
  SimulationRuntime,
  Ticket,
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowNode,
} from "./types";

export type EngineStateListener = (
  runtime: SimulationRuntime,
  event?: SimulationEvent,
) => void;

const createDefaultTicket = (): Ticket => {
  const now = Date.now();

  return {
    id: `ticket-${now}`,
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

const createDefaultRuntime = (): SimulationRuntime => ({
  currentNodeId: null,
  ticket: createDefaultTicket(),
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
      return { nodeType: "status", statusValue: "in_progress" };
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
  private runtime: SimulationRuntime;
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
    this.runtime = createDefaultRuntime();
    this.eventBus = new SimulationEventBus();
    this.eventBus.subscribe((event) => {
      this.eventLog.push(event);
      this.notify(event);
    });
  }

  start(): void {
    const startNode = this.resolveStartNode();

    if (!startNode) {
      this.runtime = {
        ...this.runtime,
        completed: true,
        currentNodeId: null,
        paused: false,
        pausedAt: null,
        pendingDecisionOutcomes: [],
      };
      this.emit({
        type: "workflow.error",
        ticketId: this.runtime.ticket.id,
        timestamp: Date.now(),
        payload: { reason: "No start node found" },
      });
      return;
    }

    this.runtime = {
      ...createDefaultRuntime(),
      ticket: {
        ...createDefaultTicket(),
      },
      currentNodeId: startNode.id,
    };

    this.notify();
  }

  step(): void {
    if (
      !this.runtime.currentNodeId ||
      this.runtime.completed ||
      this.runtime.paused
    ) {
      return;
    }

    const currentNode = this.workflow.nodes.find(
      (node) => node.id === this.runtime.currentNodeId,
    );

    if (!currentNode) {
      this.emit({
        type: "workflow.error",
        ticketId: this.runtime.ticket.id,
        timestamp: Date.now(),
        payload: { reason: `Node not found: ${this.runtime.currentNodeId}` },
      });
      this.runtime = { ...this.runtime, completed: true, currentNodeId: null };
      this.notify();
      return;
    }

    this.recordHistory(currentNode);

    const handler = NODE_HANDLER_REGISTRY[currentNode.data.type];
    if (!handler) {
      this.emit({
        type: "workflow.error",
        ticketId: this.runtime.ticket.id,
        timestamp: Date.now(),
        nodeId: currentNode.id,
        nodeLabel: currentNode.data.label,
        payload: {
          reason: `No handler for node type ${currentNode.data.type}`,
        },
      });
      this.runtime = { ...this.runtime, completed: true, currentNodeId: null };
      this.notify();
      return;
    }

    const result = handler.execute(
      currentNode,
      this.workflow.edges,
      this.runtime.ticket,
      this.runtime.ticket.context,
    );

    if (result.ticketUpdates) {
      this.runtime = {
        ...this.runtime,
        ticket: {
          ...this.runtime.ticket,
          ...result.ticketUpdates,
          context: {
            ...this.runtime.ticket.context,
            ...(result.ticketUpdates.context ?? {}),
          },
        },
      };
    }

    result.events?.forEach((event) => this.emit(event));

    if (result.requiresInput) {
      this.runtime = {
        ...this.runtime,
        paused: true,
        pausedAt: currentNode.data.label,
        pendingDecisionOutcomes: result.inputOptions ?? [],
      };
      this.notify();
      return;
    }

    if (currentNode.data.type === "end") {
      this.runtime = {
        ...this.runtime,
        completed: true,
        currentNodeId: null,
        paused: false,
        pausedAt: null,
        pendingDecisionOutcomes: [],
      };
      this.notify();
      return;
    }

    const nextNode = this.resolveNextNode(currentNode.id);

    if (!nextNode) {
      this.runtime = {
        ...this.runtime,
        completed: true,
        currentNodeId: null,
        paused: false,
        pausedAt: null,
        pendingDecisionOutcomes: [],
      };
      this.emit({
        type: "workflow.completed",
        ticketId: this.runtime.ticket.id,
        timestamp: Date.now(),
        nodeId: currentNode.id,
        nodeLabel: currentNode.data.label,
        payload: { reason: "no-outgoing-edge" },
      });
      return;
    }

    this.runtime = {
      ...this.runtime,
      currentNodeId: nextNode.id,
      paused: false,
      pausedAt: null,
      pendingDecisionOutcomes: [],
    };
    this.notify();
  }

  handleDecision(outcomeLabel: string): void {
    if (!this.runtime.paused || !this.runtime.currentNodeId) {
      return;
    }

    const currentNode = this.workflow.nodes.find(
      (node) => node.id === this.runtime.currentNodeId,
    );
    if (!currentNode) {
      return;
    }

    const selectedOutcome = this.runtime.pendingDecisionOutcomes.find(
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
        ticketId: this.runtime.ticket.id,
        timestamp: Date.now(),
        nodeId: currentNode.id,
        nodeLabel: currentNode.data.label,
        payload: { reason: `Decision outcome not routable: ${outcomeLabel}` },
      });
      return;
    }

    this.runtime = {
      ...this.runtime,
      currentNodeId: nextNode.id,
      paused: false,
      pausedAt: null,
      pendingDecisionOutcomes: [],
      ticket: {
        ...this.runtime.ticket,
        context: {
          ...this.runtime.ticket.context,
          lastDecisionOutcome: outcomeLabel,
        },
      },
    };

    this.emit({
      type: "decision.made",
      ticketId: this.runtime.ticket.id,
      timestamp: Date.now(),
      nodeId: currentNode.id,
      nodeLabel: currentNode.data.label,
      payload: { newState: outcomeLabel },
    });

    this.notify();
  }

  stop(): void {
    this.runtime = {
      ...this.runtime,
      completed: true,
      paused: false,
      pausedAt: null,
      pendingDecisionOutcomes: [],
      currentNodeId: null,
    };
    this.notify();
  }

  getRuntime(): SimulationRuntime {
    return {
      ...this.runtime,
      ticket: {
        ...this.runtime.ticket,
        context: {
          ...this.runtime.ticket.context,
        },
      },
      history: [...this.runtime.history],
      pendingDecisionOutcomes: [...this.runtime.pendingDecisionOutcomes],
    };
  }

  getEventLog(): SimulationEvent[] {
    return [...this.eventLog];
  }

  subscribe(listener: EngineStateListener): () => void {
    this.listeners.push(listener);
    listener(this.getRuntime());

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
    const snapshot = this.getRuntime();
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

  private recordHistory(node: WorkflowNode): void {
    this.runtime.history.push({
      nodeId: node.id,
      nodeLabel: node.data.label,
      timestamp: Date.now(),
      ticketSnapshot: {
        ...this.runtime.ticket,
        context: {
          ...this.runtime.ticket.context,
        },
      },
    });
  }
}
