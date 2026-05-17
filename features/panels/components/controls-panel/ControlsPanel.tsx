import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import {
  GitBranch,
  Pause,
  Play,
  Square,
  StepBack,
  StepForward,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useControls } from "@/features/panels/hooks/useControls";

export default function ControlsPanel() {
  const {
    nodes,
    isSimulating,
    showDecisionDialog,
    isPaused,
    setIsPaused,
    canvasHost,
    toolbarRef,
    pausedRuntime,
    pendingOutcomes,
    preflightError,
    startSimulationFlow,
    handleStop,
    handleStepBackward,
    handleStepForward,
    handleDecision,
  } = useControls();

  return (
    <>
      <div
        ref={toolbarRef}
        className="flex flex-col gap-2 px-3 py-2 rounded-xl bg-background/50 border backdrop-blur"
      >
        <div className="flex justify-center items-center gap-3">
          <div className="left-3 flex items-center gap-2 text-xs text-muted-foreground">
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
            <Button
              onClick={() => {
                if (!isSimulating) return startSimulationFlow();
                handleStepBackward();
              }}
              disabled={!isSimulating || !isPaused}
              size="icon"
              variant="outline"
              className={`h-8 w-8 transition ${isPaused ? "opacity-100" : "opacity-40"}`}
              title="Step Backward"
            >
              <StepBack />
            </Button>

            <Button
              onClick={() => {
                if (!isSimulating) {
                  if (preflightError) return;
                  return startSimulationFlow();
                }
                setIsPaused(!isPaused);
              }}
              disabled={!isSimulating && (nodes.length === 0 || Boolean(preflightError))}
              size="icon"
              variant="outline"
              className={`h-8 w-8 transition  ${
                !isSimulating
                  ? "bg-emerald-600! !hover:bg-emerald-700"
                  : isPaused
                    ? "bg-emerald-600! !hover:bg-emerald-700"
                    : "bg-amber-500! !hover:bg-amber-600"
              }`}
              title={!isSimulating ? "Start" : isPaused ? "Resume" : "Pause"}
            >
              {!isSimulating || isPaused ? <Play /> : <Pause />}
            </Button>

            <Button
              onClick={() => {
                if (!isSimulating) return startSimulationFlow();
                handleStepForward();
              }}
              disabled={!isSimulating || !isPaused}
              size="icon"
              variant="outline"
              className={`h-8 w-8 transition ${isPaused ? "opacity-100" : "opacity-40"}`}
              title="Step Forward"
            >
              <StepForward />
            </Button>

            <Button
              onClick={handleStop}
              disabled={!isSimulating}
              size="icon"
              variant="destructive"
              className="h-8 w-8"
              title="Stop"
            >
              <Square />
            </Button>
          </div>
        </div>
        {/* <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span>Templates: {simulationConfig.ticketTemplates.length}</span>
          <span>Spawned Tickets: {totalSpawnedTickets}</span>
          <span>Agents: {simulationConfig.agentPool.length}</span>
          <span>Step Delay: {simulationConfig.stepDelayMs}ms</span>
        </div>
        {!isSimulating && preflightError && (
          <div className="text-[11px] text-amber-400">{preflightError}</div>
        )} */}
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
                      ? `${[pausedRuntime.ticket.assignedAgent, pausedRuntime.pausedAt]
                          .filter(Boolean)
                          .join(" ")} (${pausedRuntime.ticket.id})`
                      : "What is your decision?"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {pendingOutcomes.map((outcome) => (
                      <Button
                        key={outcome.label}
                        onClick={() => handleDecision(pausedRuntime.ticket.id, outcome.label)}
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
