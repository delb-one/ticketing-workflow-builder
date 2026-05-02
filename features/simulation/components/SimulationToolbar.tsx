"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SimulationEngine } from "@/lib/simulation";
import type {
  EngineRuntimeState,
  NodeConfig,
  NodeType,
  SimulationEvent,
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowNode,
} from "@/lib/simulation";
import { useWorkflowStore } from "@/lib/store";
import type { CustomNode } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { CirclePause, CirclePlay, CircleStop, GitBranch, StepForward, Minus, Plus, SlidersHorizontal, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const DEFAULT_STEP_DELAY_MS = 900;

const createDefaultNodeConfig = (type: NodeType, blockId?: string): NodeConfig => {
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
        config: node.data.config ?? createDefaultNodeConfig(node.data.type, blockId),
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

export default function SimulationToolbar() {
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
    unsubscribeRef.current = engine.subscribe((nextState: EngineRuntimeState, event?: SimulationEvent) => {
      syncEngineState(nextState);

      const pausedRuntime = Object.values(nextState.runtimes).find(
        (runtime) => runtime.paused && runtime.pendingDecisionOutcomes.length > 0,
      );
      setShowDecisionDialog(Boolean(pausedRuntime));

      if (event) {
        addSimulationEvent(event);
      }

      const runtimes = Object.values(nextState.runtimes);
      const allCompleted = runtimes.length > 0 && runtimes.every((runtime) => runtime.completed);
      if (allCompleted) {
        endSimulation();
      }
    });

    const initialAgents: Array<{
      id: string;
      level: "l1" | "l2" | "l3";
      capacity: number;
      status: "available";
    }> = [];

    const { agents } = simulationConfig;
    (['l1', 'l2', 'l3'] as const).forEach(level => {
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
    const allCompleted = runtimes.length > 0 && runtimes.every((runtime) => runtime.completed);
    const anyPaused = runtimes.some((runtime) => runtime.paused);

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
      const host = toolbarRef.current.closest(".react-flow") as HTMLElement | null;
      if (host) {
        setCanvasHost(host);
        return;
      }
    }

    // Fallback: search globally if the ref isn't available yet or isn't in a flow
    const globalHost = document.querySelector(".react-flow") as HTMLElement | null;
    if (globalHost) {
      setCanvasHost(globalHost);
    }
  }, [isSimulating]);

  const pausedRuntime = useMemo(() => {
    if (!engineState) return null;
    return (
      Object.values(engineState.runtimes).find(
        (runtime) => runtime.paused && runtime.pendingDecisionOutcomes.length > 0,
      ) ?? null
    );
  }, [engineState]);

  const pendingOutcomes = useMemo(
    () => pausedRuntime?.pendingDecisionOutcomes ?? [],
    [pausedRuntime],
  );

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className="w-full pointer-events-auto"
      >
        <div className="bg-card/70 rounded-xl p-4 border border-card-800/80 backdrop-blur-md flex flex-col h-full overflow-hidden">
          <AccordionItem
            value="controls"
            className="border-0"
          >
            <AccordionTrigger className="py-0 mb-4 hover:no-underline">
              <div className="flex items-center gap-2 flex-1">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Simulation Controls</span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pb-0">
              <div
                ref={toolbarRef}
                className="flex flex-col gap-4"
              >
                {/* TICKETS */}
                <div className="flex flex-col gap-1">
                  <TooltipProvider>
                    <div className="flex items-center gap-1">
                      {/* REMOVE */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() =>
                              updateSimulationConfig({
                                ticketCount: Math.max(
                                  1,
                                  simulationConfig.ticketCount - 1
                                ),
                              })
                            }
                            disabled={isSimulating || simulationConfig.ticketCount <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="text-xs bg-background text-primary dark:bg-background dark:text-primary border border-border">
                          Remove ticket
                        </TooltipContent>
                      </Tooltip>

                      {/* COUNT */}
                      <div className="flex-1 h-8 w-auto flex items-center justify-center bg-background/50 border rounded-md text-xs font-medium">
                        {simulationConfig.ticketCount}
                      </div>

                      {/* ADD */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() =>
                              updateSimulationConfig({
                                ticketCount: Math.min(
                                  50,
                                  simulationConfig.ticketCount + 1
                                ),
                              })
                            }
                            disabled={isSimulating || simulationConfig.ticketCount >= 50}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs bg-background text-primary dark:bg-background dark:text-primary border border-border">
                          Add ticket
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>

                {/* CONTROLLI */}
                <div className="flex justify-center items-center gap-2">
                  {!isSimulating ? (
                    <Button
                      onClick={startSimulationFlow}
                      disabled={nodes.length === 0}
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
                        className={`h-8 w-8 ${isPaused
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-amber-500 hover:bg-amber-600 text-white"
                          }`}
                        title={isPaused ? "Resume" : "Pause"}
                      >
                        {isPaused ? (
                          <CirclePlay className="h-4 w-4" />
                        ) : (
                          <CirclePause className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        onClick={() => engineRef.current?.step()}
                        disabled={!isPaused}
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        title="Step Forward"
                      >
                        <StepForward className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={handleStop}
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        title="Stop"
                      >
                        <CircleStop className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </div>
      </Accordion>

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
                      ? `Decision at: ${pausedRuntime.pausedAt} (${pausedRuntime.ticket.id})`
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
