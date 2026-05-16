import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useWorkflowStore } from "@/lib/store";
import {
  EngineRuntimeState,
  SimulationEngine,
  SimulationEvent,
  WorkflowEdge,
} from "@/lib/simulation";
import {
  selectPreflightError,
  selectTotalSpawnedTickets,
  toWorkflowDefinition,
} from "@/features/panels/logic/controls-selectors";

export function useControls() {
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
  } = useWorkflowStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      isSimulating: state.isSimulating,
      startSimulation: state.startSimulation,
      endSimulation: state.endSimulation,
      syncEngineState: state.syncEngineState,
      clearSimulationEvents: state.clearSimulationEvents,
      addSimulationEvent: state.addSimulationEvent,
      engineState: state.engineState,
      simulationConfig: state.simulationConfig,
    })),
  );

  const [showDecisionDialog, setShowDecisionDialog] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [canvasHost, setCanvasHost] = useState<HTMLElement | null>(null);

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

        const pausedRuntime = Object.values(nextState.runtimes).find(
          (runtime) => runtime.paused && runtime.pendingDecisionOutcomes.length > 0,
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

    startSimulation();
    engine.start(simulationConfig.ticketTemplates, simulationConfig.agentPool);
  };

  const handleStop = () => {
    stopAndCleanup(true);
    setShowDecisionDialog(false);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isSimulating || !engineState) return;

    const runtimes = Object.values(engineState.runtimes);
    const allCompleted =
      runtimes.length > 0 && runtimes.every((runtime) => runtime.completed);
    const anyPaused = runtimes.some(
      (runtime) => runtime.paused && runtime.pendingDecisionOutcomes.length > 0,
    );

    if (allCompleted || anyPaused || isPaused) return;

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
    if (toolbarRef.current) {
      const host = toolbarRef.current.closest(".react-flow") as HTMLElement | null;
      if (host) {
        setCanvasHost(host);
        return;
      }
    }

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

  const totalSpawnedTickets = useMemo(
    () => selectTotalSpawnedTickets(simulationConfig.ticketTemplates),
    [simulationConfig.ticketTemplates],
  );

  const preflightError = useMemo(
    () =>
      selectPreflightError(
        simulationConfig.ticketTemplates.length,
        simulationConfig.agentPool.length,
      ),
    [simulationConfig.ticketTemplates.length, simulationConfig.agentPool.length],
  );

  return {
    nodes,
    isSimulating,
    simulationConfig,
    showDecisionDialog,
    isPaused,
    setIsPaused,
    canvasHost,
    toolbarRef,
    pausedRuntime,
    pendingOutcomes,
    totalSpawnedTickets,
    preflightError,
    startSimulationFlow,
    handleStop,
    handleStepBackward: () => engineRef.current?.stepBackward(),
    handleStepForward: () => engineRef.current?.step(),
    handleDecision: (ticketId: string, outcomeLabel: string) =>
      engineRef.current?.handleDecision(ticketId, outcomeLabel),
  };
}
