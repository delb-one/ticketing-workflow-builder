import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  EngineRuntimeState,
  SimulationEngine,
  SimulationEvent,
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowNode,
} from "@/lib/simulation";
import {
  CustomNode,
  NodeConfig,
  NodeType,
  useWorkflowStore,
} from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import {
  CirclePause,
  CirclePlay,
  CircleStop,
  GitBranch,
  StepBack,
  StepForward,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

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
      return { nodeType: "status", statusValue: "assigned" };
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
export default function ControlsPanel() {
  const {
    nodes,
    edges,
    isSimulating,
    startSimulation,
    endSimulation,
    syncEngineState,
    clearSimulationEvents,
    addSimulationEvent,
    engineState,
    simulationConfig,
    updateSimulationConfig,
  } = useWorkflowStore();

  const [showDecisionDialog, setShowDecisionDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const engineRef = useRef<SimulationEngine | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [canvasHost, setCanvasHost] = useState<HTMLElement | null>(null);

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

        const pausedRuntime = Object.values(nextState.runtimes).find(
          (runtime) =>
            runtime.paused && runtime.pendingDecisionOutcomes.length > 0,
        );
        setShowDecisionDialog(Boolean(pausedRuntime));

        if (event) {
          addSimulationEvent(event);
        }

        const runtimes = Object.values(nextState.runtimes);
        const allCompleted =
          runtimes.length > 0 && runtimes.every((runtime) => runtime.completed);
        if (allCompleted) {
          endSimulation();
        }
      },
    );

    const initialAgents: Array<{
      id: string;
      level: "l1" | "l2" | "l3";
      capacity: number;
      status: "available";
    }> = [];

    const { agents } = simulationConfig;
    (["l1", "l2", "l3"] as const).forEach((level) => {
      const count = agents[level];
      for (let i = 0; i < count; i++) {
        initialAgents.push({
          id: `Agent-${level.toUpperCase()}-${i + 1}`,
          level,
          capacity: 1,
          status: "available",
        });
      }
    });

    startSimulation();
    engine.start(simulationConfig.ticketCount, initialAgents);
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
    const allCompleted =
      runtimes.length > 0 && runtimes.every((runtime) => runtime.completed);
    const anyPaused = runtimes.some(
      (runtime) => runtime.paused && runtime.pendingDecisionOutcomes.length > 0,
    );

    if (allCompleted || anyPaused || isPaused) {
      return;
    }

    const timeoutId = setTimeout(() => {
      engineRef.current?.step();
    }, simulationConfig.stepDelayMs);

    return () => clearTimeout(timeoutId);
  }, [isSimulating, engineState, simulationConfig.stepDelayMs, isPaused]);

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
      engineRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    // Try to find the host through the ref first (most accurate for nested flows)
    if (toolbarRef.current) {
      const host = toolbarRef.current.closest(
        ".react-flow",
      ) as HTMLElement | null;
      if (host) {
        setCanvasHost(host);
        return;
      }
    }

    // Fallback: search globally if the ref isn't available yet or isn't in a flow
    const globalHost = document.querySelector(
      ".react-flow",
    ) as HTMLElement | null;
    if (globalHost) {
      setCanvasHost(globalHost);
    }
  }, [isSimulating]);

  const pausedRuntime = useMemo(() => {
    if (!engineState) return null;
    return (
      Object.values(engineState.runtimes).find(
        (runtime) =>
          runtime.paused && runtime.pendingDecisionOutcomes.length > 0,
      ) ?? null
    );
  }, [engineState]);

  const pendingOutcomes = useMemo(
    () => pausedRuntime?.pendingDecisionOutcomes ?? [],
    [pausedRuntime],
  );

  return (
    <>
      {/* CONTROLS */}
      <div className="flex justify-center items-center gap-3 px-3 py-2 rounded-xl bg-background/50 border backdrop-blur">
        {/* STATUS */}
        <div className=" left-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span
            className={`h-2 w-2 rounded-full ${
              !isSimulating
                ? "bg-gray-400"
                : isPaused
                  ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                  : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"
            }`}
          />
        </div>

        <div className="flex items-center gap-1">
          {/* STEP BACKWARD */}
          <Button
            onClick={() => {
              if (!isSimulating) return startSimulationFlow();
              engineRef.current?.stepBackward();
            }}
            disabled={!isSimulating || !isPaused}
            size="icon"
            variant="outline"
            className={`h-8 w-8 transition ${
              isPaused ? "opacity-100" : "opacity-40"
            }`}
            title="Step Backward"
          >
            <StepBack className="h-4 w-4" />
          </Button>
          {/* PLAY / PAUSE */}

          <Button
            onClick={() => {
              if (!isSimulating) return startSimulationFlow();
              setIsPaused(!isPaused);
            }}
            disabled={!isSimulating && nodes.length === 0}
            size="icon"
            className={`h-8 w-8 transition ${
              !isSimulating
                ? "bg-emerald-600 hover:bg-emerald-700"
                : isPaused
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-amber-500 hover:bg-amber-600"
            }`}
            title={!isSimulating ? "Start" : isPaused ? "Resume" : "Pause"}
          >
            {!isSimulating || isPaused ? (
              <CirclePlay className="h-4 w-4" />
            ) : (
              <CirclePause className="h-4 w-4" />
            )}
          </Button>

          {/* STEP FORWARD */}
          <Button
            onClick={() => {
              if (!isSimulating) return startSimulationFlow();
              engineRef.current?.step();
            }}
            disabled={!isSimulating || !isPaused}
            size="icon"
            variant="outline"
            className={`h-8 w-8 transition ${
              isPaused ? "opacity-100" : "opacity-40"
            }`}
            title="Step Forward"
          >
            <StepForward className="h-4 w-4" />
          </Button>

          {/* STOP */}
          <Button
            onClick={handleStop}
            disabled={!isSimulating}
            size="icon"
            variant="destructive"
            className="h-8 w-8"
            title="Stop"
          >
            <CircleStop className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {canvasHost &&
        createPortal(
          <AnimatePresence>
            {showDecisionDialog && pausedRuntime && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-card/50 pointer-events-auto"
              >
                <Card className="max-w-sm p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    {pausedRuntime.pausedAt
                      ? `${[
                          pausedRuntime.ticket.assignedAgent,
                          pausedRuntime.pausedAt,
                        ]
                          .filter(Boolean)
                          .join(" ")} (${pausedRuntime.ticket.id})`
                      : "What is your decision?"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {pendingOutcomes.map((outcome) => (
                      <Button
                        key={outcome.label}
                        onClick={() =>
                          engineRef.current?.handleDecision(
                            pausedRuntime.ticket.id,
                            outcome.label,
                          )
                        }
                        className="flex-1"
                      >
                        <GitBranch className="h-4 w-4 mr-2" />
                        {outcome.label}
                      </Button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>,
          canvasHost,
        )}
    </>
  );
}
