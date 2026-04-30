"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SimulationEngine } from "@/lib/simulation";
import type {
  NodeConfig,
  NodeType,
  SimulationEvent,
  SimulationRuntime,
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowNode,
  EngineRuntimeState,
} from "@/lib/simulation";
import { useWorkflowStore } from "@/lib/store";
import type { CustomNode } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  GitBranch,
  Play,
  Pause,
  CircleStop,
  CirclePlay,
  CirclePause,
  StepForward,
  Settings2,
} from "lucide-react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";


const DEFAULT_STEP_DELAY_MS = 900;

const createDefaultNodeConfig = (
  type: NodeType,
  blockId?: string,
): NodeConfig => {
  switch (type) {
    case "decision":
      return { nodeType: "decision", decisionType: "manual", outcomes: [] };
    case "condition":
      return { nodeType: "condition" };
    case "automation": {
      const automationType =
        blockId === "sla-timer" ||
          blockId === "escalation" ||
          blockId === "auto-assign" ||
          blockId === "notify" ||
          blockId === "business-rules" ||
          blockId === "reopen"
          ? blockId
          : "business-rules";
      return {
        nodeType: "automation",
        automationType,
        duration: blockId === "sla-timer" ? 60 : undefined,
      };
    }
    case "action": {
      const ticketAction =
        blockId === "resolve" || blockId === "validate" || blockId === "close"
          ? blockId
          : "validate";
      return { nodeType: "action", ticketAction };
    }
    case "actor": {
      const agentLevel =
        blockId === "l1-tech"
          ? "l1"
          : blockId === "l2-tech"
            ? "l2"
            : blockId === "l3-specialist"
              ? "l3"
              : blockId === "client"
                ? "client"
                : blockId === "supervisor"
                  ? "supervisor"
                  : undefined;
      return { nodeType: "actor", agentLevel };
    }
    case "status":
      return { nodeType: "status", statusValue: "in_progress" };
    case "event":
      return { nodeType: "event", eventTrigger: "manual" };
    case "start":
      return { nodeType: "start" };
    case "end":
    default:
      return { nodeType: "end" };
  }
};

const toWorkflowDefinition = (
  nodes: CustomNode[],
  edges: WorkflowEdge[],
): WorkflowDefinition => {
  const workflowNodes: WorkflowNode[] = nodes.map((node) => {
    const blockId = node.data.blockId ?? node.data.id;

    return {
      id: node.id,
      type: node.data.type,
      position: node.position,
      data: {
        label: node.data.label,
        type: node.data.type,
        description: node.data.description,
        blockId,
        config:
          node.data.config ?? createDefaultNodeConfig(node.data.type, blockId),
      },
    };
  });

  const workflowEdges: WorkflowEdge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: typeof edge.label === "string" ? edge.label : undefined,
  }));

  return {
    id: "active-workflow",
    name: "Active Workflow",
    nodes: workflowNodes,
    edges: workflowEdges,
  };
};

const getEventIcon = (eventType: SimulationEvent["type"]) => {
  if (eventType === "workflow.started") return Play;
  if (eventType === "decision.required" || eventType === "decision.made")
    return GitBranch;
  if (eventType === "workflow.completed" || eventType === "ticket.closed")
    return CheckCircle2;
  if (eventType === "workflow.error") return AlertTriangle;
  if (eventType === "sla.started" || eventType === "sla.breached") return Clock;
  return ArrowRight;
};

const getEventText = (event: SimulationEvent): string => {
  if (event.type === "decision.required") {
    return `Decision required at ${event.nodeLabel ?? event.nodeId ?? "unknown node"}`;
  }

  if (event.type === "decision.made") {
    const outcome =
      typeof event.payload?.newState === "string"
        ? event.payload.newState
        : "n/a";
    return `Decision made: ${outcome}`;
  }

  if (event.type === "workflow.error") {
    const message =
      typeof event.payload?.reason === "string"
        ? event.payload.reason
        : "Unknown error";
    return `Error: ${message}`;
  }

  if (event.nodeLabel) {
    return `${event.type} @ ${event.nodeLabel}`;
  }

  return event.type;
};

export default function SimulationPanel() {
  const {
    nodes,
    edges,
    isSimulating,
    startSimulation,
    endSimulation,
    syncEngineState,
    clearSimulationEvents,
    addSimulationEvent,
    simulationEvents,
    engineState,
  } = useWorkflowStore();

  const [stepDelayMs, setStepDelayMs] = useState(DEFAULT_STEP_DELAY_MS);
  const [showDecisionDialog, setShowDecisionDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [ticketCount, setTicketCount] = useState(2);

  const engineRef = useRef<SimulationEngine | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const stopAndCleanup = (clearRuntime: boolean) => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    engineRef.current?.stop();
    engineRef.current = null;
    endSimulation();

    if (clearRuntime) {
      syncEngineState(null);
    }
  };

  const startSimulationFlow = () => {
    clearSimulationEvents();
    setShowDecisionDialog(false);
    setIsPaused(false);

    const workflow = toWorkflowDefinition(nodes, edges as WorkflowEdge[]);

    const engine = new SimulationEngine(workflow);
    engineRef.current = engine;

    unsubscribeRef.current?.();
    unsubscribeRef.current = engine.subscribe(
      (nextState: EngineRuntimeState, event?: SimulationEvent) => {
        syncEngineState(nextState);

        const pausedRuntime = Object.values(nextState.runtimes).find(r => r.paused && r.pendingDecisionOutcomes.length > 0);
        setShowDecisionDialog(!!pausedRuntime);

        if (event) {
          addSimulationEvent(event);
        }

        const allCompleted = Object.values(nextState.runtimes).every(r => r.completed);
        if (allCompleted && Object.keys(nextState.runtimes).length > 0) {
          endSimulation();
        }
      },
    );

    const initialAgents: any[] = [];
    workflow.nodes.forEach((node, index) => {
      const config = node.data.config;
      if (node.type === "actor" && config?.nodeType === "actor" && config.agentLevel) {
        const level = config.agentLevel;
        if (["l1", "l2", "l3"].includes(level)) {
          initialAgents.push({
            id: `${node.data.label.replace(/\s+/g, '-')}-${index + 1}`,
            level: level,
            capacity: 1,
            status: "available"
          });
        }
      }
    });

    startSimulation();
    engine.start(ticketCount, initialAgents);
  };

  const handleStop = () => {
    stopAndCleanup(true);
    setShowDecisionDialog(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isSimulating || !engineState) {
      return;
    }

    const runtimes = Object.values(engineState.runtimes);
    const allCompleted = runtimes.length > 0 && runtimes.every(r => r.completed);
    const anyPaused = runtimes.some(r => r.paused);

    if (allCompleted || anyPaused || isPaused) {
      return;
    }

    const timeoutId = setTimeout(() => {
      engineRef.current?.step();
    }, stepDelayMs);

    return () => clearTimeout(timeoutId);
  }, [isSimulating, engineState, stepDelayMs, isPaused]);

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
      engineRef.current?.stop();
    };
  }, []);

  const pausedRuntime = useMemo(() => {
    if (!engineState) return null;
    return Object.values(engineState.runtimes).find(r => r.paused && r.pendingDecisionOutcomes.length > 0) || null;
  }, [engineState]);

  const pendingOutcomes = useMemo(
    () => pausedRuntime?.pendingDecisionOutcomes ?? [],
    [pausedRuntime],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Simulation Toolbar */}
      <div className="flex flex-col gap-3 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Simulation Settings</span>
          <div className="flex gap-2 shrink-0">
            {!isSimulating ? (
              <Button
                onClick={startSimulationFlow}
                disabled={isSimulating || nodes.length === 0}
                size="icon"
                className="bg-emerald-600 hover:bg-emerald-700 h-8 w-8"
                title="Start Simulation"
              >
                <CirclePlay className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setIsPaused(!isPaused)}
                  size="icon"
                  className={`h-8 w-8 ${isPaused ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"}`}
                  title={isPaused ? "Resume" : "Pause"}
                >
                  {isPaused ? <CirclePlay className="h-4 w-4" /> : <CirclePause className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => engineRef.current?.step()}
                  disabled={!isPaused}
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 text-foreground"
                  title="Step Forward"
                >
                  <StepForward className="h-4 w-4" />
                </Button>
                <Button onClick={handleStop} size="icon" variant="destructive" className="h-8 w-8" title="Stop">
                  <CircleStop className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Tickets</label>
            <Input
              type="number"
              min={1} max={50}
              value={ticketCount}
              onChange={(e) => setTicketCount(parseInt(e.target.value, 10) || 1)}
              className="h-8 text-xs"
              disabled={isSimulating}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="step-delay" className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Speed</label>
            <select
              id="step-delay"
              value={stepDelayMs}
              onChange={(e) => setStepDelayMs(parseInt(e.target.value, 10))}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs"
              disabled={isSimulating}
            >
              <option value={300}>Fast</option>
              <option value={600}>Normal</option>
              <option value={900}>Slow</option>
            </select>
          </div>
        </div>
      </div>

      {/* Event Log */}
      <div className="h-64">
        <Card className="h-full flex flex-col overflow-hidden bg-card-900 border-card-800 text-primary p-0 gap-0">
          <div className="p-4 border-b border-card-800 shrink-0">
            <h3 className="font-semibold text-sm">Simulation Log</h3>
          </div>

          <ScrollArea className="flex-1  overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">




            <div className="space-y-1.5 font-mono text-sm ">
              <AnimatePresence>
                {simulationEvents.map((event, index) => {
                  const EventIcon = getEventIcon(event.type);
                  return (
                    <motion.div
                      key={`${event.timestamp}-${event.type}-${index}`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-primary"
                    >
                      <EventIcon className="h-4 w-4 shrink-0 text-primary" />
                      <span>{getEventText(event)}</span>
                    </motion.div>
                  );
                })}



                {simulationEvents.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-primary"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Idle</span>
                  </motion.div>
                )}



              </AnimatePresence>
            </div>

          </ScrollArea>
        </Card>
      </div>

      <AnimatePresence>
        {showDecisionDialog && pausedRuntime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-card/50"
          >
            <Card className="max-w-sm p-6">
              <h3 className="mb-4 text-lg font-semibold">
                {pausedRuntime.pausedAt
                  ? `Decision at: ${pausedRuntime.pausedAt} (${pausedRuntime.ticket.id})`
                  : "What is your decision?"}
              </h3>
              <div className="flex flex-wrap gap-3">
                {pendingOutcomes.map((outcome) => (
                  <Button
                    key={outcome.label}
                    onClick={() => {
                      if (pausedRuntime) {
                        engineRef.current?.handleDecision(pausedRuntime.ticket.id, outcome.label);
                      }
                    }}
                    className="flex-1"
                  >
                    {outcome.label}
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
