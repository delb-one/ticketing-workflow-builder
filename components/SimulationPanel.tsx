'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SimulationEngine } from '@/lib/simulation';
import type {
  NodeConfig,
  NodeType,
  SimulationEvent,
  SimulationRuntime,
  WorkflowDefinition,
  WorkflowEdge,
  WorkflowNode,
} from '@/lib/simulation';
import { useWorkflowStore } from '@/lib/store';
import type { CustomNode } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  GitBranch,
  Play,
  Pause,
} from 'lucide-react';

const DEFAULT_STEP_DELAY_MS = 900;

const createDefaultNodeConfig = (type: NodeType, blockId?: string): NodeConfig => {
  switch (type) {
    case 'decision':
      return { nodeType: 'decision', decisionType: 'manual', outcomes: [] };
    case 'condition':
      return { nodeType: 'condition' };
    case 'automation': {
      const automationType =
        blockId === 'sla-timer' ||
        blockId === 'escalation' ||
        blockId === 'auto-assign' ||
        blockId === 'notify' ||
        blockId === 'business-rules' ||
        blockId === 'reopen'
          ? blockId
          : 'business-rules';
      return {
        nodeType: 'automation',
        automationType,
        duration: blockId === 'sla-timer' ? 60 : undefined,
      };
    }
    case 'action': {
      const ticketAction =
        blockId === 'resolve' || blockId === 'validate' || blockId === 'close' ? blockId : 'validate';
      return { nodeType: 'action', ticketAction };
    }
    case 'actor': {
      const agentLevel =
        blockId === 'l1-tech'
          ? 'l1'
          : blockId === 'l2-tech'
            ? 'l2'
            : blockId === 'l3-specialist'
              ? 'l3'
              : blockId === 'client'
                ? 'client'
                : blockId === 'supervisor'
                  ? 'supervisor'
                  : undefined;
      return { nodeType: 'actor', agentLevel };
    }
    case 'status':
      return { nodeType: 'status', statusValue: 'in_progress' };
    case 'event':
      return { nodeType: 'event', eventTrigger: 'manual' };
    case 'start':
      return { nodeType: 'start' };
    case 'end':
    default:
      return { nodeType: 'end' };
  }
};

const toWorkflowDefinition = (nodes: CustomNode[], edges: WorkflowEdge[]): WorkflowDefinition => {
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
    label: typeof edge.label === 'string' ? edge.label : undefined,
  }));

  return {
    id: 'active-workflow',
    name: 'Active Workflow',
    nodes: workflowNodes,
    edges: workflowEdges,
  };
};

const getEventIcon = (eventType: SimulationEvent['type']) => {
  if (eventType === 'workflow.started') return Play;
  if (eventType === 'decision.required' || eventType === 'decision.made') return GitBranch;
  if (eventType === 'workflow.completed' || eventType === 'ticket.closed') return CheckCircle2;
  if (eventType === 'workflow.error') return AlertTriangle;
  if (eventType === 'sla.started' || eventType === 'sla.breached') return Clock;
  return ArrowRight;
};

const getEventText = (event: SimulationEvent): string => {
  if (event.type === 'decision.required') {
    return `Decision required at ${event.nodeLabel ?? event.nodeId ?? 'unknown node'}`;
  }

  if (event.type === 'decision.made') {
    const outcome = typeof event.payload?.newState === 'string' ? event.payload.newState : 'n/a';
    return `Decision made: ${outcome}`;
  }

  if (event.type === 'workflow.error') {
    const message = typeof event.payload?.reason === 'string' ? event.payload.reason : 'Unknown error';
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
    setSimulationRuntime,
    clearSimulationEvents,
    addSimulationEvent,
    simulationEvents,
    simulationRuntime,
  } = useWorkflowStore();

  const [stepDelayMs, setStepDelayMs] = useState(DEFAULT_STEP_DELAY_MS);
  const [showDecisionDialog, setShowDecisionDialog] = useState(false);

  const engineRef = useRef<SimulationEngine | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const runtime = simulationRuntime;

  const stopAndCleanup = (clearRuntime: boolean) => {
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    engineRef.current?.stop();
    engineRef.current = null;
    endSimulation();

    if (clearRuntime) {
      setSimulationRuntime(null);
    }
  };

  const startSimulationFlow = () => {
    clearSimulationEvents();
    setShowDecisionDialog(false);

    const workflow = toWorkflowDefinition(nodes, edges as WorkflowEdge[]);

    const engine = new SimulationEngine(workflow);
    engineRef.current = engine;

    unsubscribeRef.current?.();
    unsubscribeRef.current = engine.subscribe((nextRuntime: SimulationRuntime, event?: SimulationEvent) => {
      setSimulationRuntime(nextRuntime);
      setShowDecisionDialog(nextRuntime.paused && nextRuntime.pendingDecisionOutcomes.length > 0);

      if (event) {
        addSimulationEvent(event);
      }

      if (nextRuntime.completed) {
        endSimulation();
      }
    });

    startSimulation();
    engine.start();
  };

  const handleStop = () => {
    stopAndCleanup(true);
    setShowDecisionDialog(false);
  };

  useEffect(() => {
    if (!isSimulating || !runtime || runtime.paused || runtime.completed) {
      return;
    }

    const timeoutId = setTimeout(() => {
      engineRef.current?.step();
    }, stepDelayMs);

    return () => clearTimeout(timeoutId);
  }, [isSimulating, runtime, stepDelayMs]);

  useEffect(() => {
    return () => {
      unsubscribeRef.current?.();
      engineRef.current?.stop();
    };
  }, []);

  const pendingOutcomes = useMemo(() => runtime?.pendingDecisionOutcomes ?? [], [runtime]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <label htmlFor="step-delay" className="whitespace-nowrap text-xs text-muted-foreground">
            Delay
          </label>
          <select
            id="step-delay"
            value={stepDelayMs}
            onChange={(event) => setStepDelayMs(parseInt(event.target.value, 10))}
            className="h-8 rounded-md border border-border bg-background px-2 text-xs"
          >
            <option value={300}>300ms</option>
            <option value={600}>600ms</option>
            <option value={900}>900ms</option>
            <option value={1200}>1200ms</option>
            <option value={1500}>1500ms</option>
          </select>
        </div>

        <Button
          onClick={startSimulationFlow}
          disabled={isSimulating || nodes.length === 0}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Start Simulation
        </Button>

        {isSimulating && (
          <Button onClick={handleStop} size="sm" variant="destructive">
            Stop
          </Button>
        )}
      </div>

      <Card className="max-h-72 overflow-y-auto bg-slate-900 p-4 text-white">
        <h3 className="mb-3 font-semibold">Simulation Log</h3>
        <div className="space-y-1 font-mono text-sm">
          <AnimatePresence>
            {simulationEvents.map((event, index) => {
              const EventIcon = getEventIcon(event.type);
              return (
                <motion.div
                  key={`${event.timestamp}-${event.type}-${index}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-slate-100"
                >
                  <EventIcon className="h-4 w-4 shrink-0 text-slate-300" />
                  <span>{getEventText(event)}</span>
                </motion.div>
              );
            })}

            {simulationEvents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-slate-400"
              >
                <Pause className="h-4 w-4" />
                <span>Idle</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <AnimatePresence>
        {showDecisionDialog && runtime && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <Card className="max-w-sm p-6">
              <h3 className="mb-4 text-lg font-semibold">
                {runtime.pausedAt ? `Decision at: ${runtime.pausedAt}` : 'What is your decision?'}
              </h3>
              <div className="flex flex-wrap gap-3">
                {pendingOutcomes.map((outcome) => (
                  <Button
                    key={outcome.label}
                    onClick={() => engineRef.current?.handleDecision(outcome.label)}
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
