'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { NodeType, useWorkflowStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpCircle,
  ArrowRight,
  Bell,
  CheckCircle,
  CheckCircle2,
  Clock,
  Cpu,
  Filter,
  GitBranch,
  Headphones,
  LucideIcon,
  MessageSquare,
  Play,
  RotateCcw,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
  User,
  UserCog,
} from 'lucide-react';

interface SimulationState {
  currentNodeId: string | null;
  decisions: { [key: string]: string };
  history: string[];
  paused: boolean;
  pausedAt: string | null;
}

const DEFAULT_STEP_DELAY_MS = 900;

const BLOCK_ICON_MAP: Record<string, LucideIcon> = {
  start: Play,
  end: CheckCircle2,
  client: User,
  'l1-tech': Headphones,
  'l2-tech': UserCog,
  'l3-specialist': Cpu,
  supervisor: ShieldCheck,
  decision: GitBranch,
  condition: Filter,
  'business-rules': SlidersHorizontal,
  'auto-assign': Shuffle,
  'sla-timer': Clock,
  escalation: ArrowUpCircle,
  notify: Bell,
  reopen: RotateCcw,
  resolve: CheckCircle,
  validate: MessageSquare,
  close: CheckCircle2,
};

const TYPE_ICON_MAP: Record<NodeType, LucideIcon> = {
  actor: User,
  decision: GitBranch,
  condition: Filter,
  automation: SlidersHorizontal,
  action: CheckCircle,
  start: Play,
  end: CheckCircle2,
};

const getLogNodeLabel = (log: string) => {
  if (log.startsWith('Started at: ')) return log.replace('Started at: ', '').trim();
  if (log.startsWith('Decision required at: ')) return log.replace('Decision required at: ', '').trim();
  if (log.startsWith('-> ')) return log.replace('-> ', '').trim();
  return null;
};

export default function SimulationEngine() {
  const {
    nodes,
    edges,
    isSimulating,
    startSimulation,
    endSimulation,
    setActiveNode,
    simulationLog,
    addSimulationLog,
    clearSimulationLog,
  } = useWorkflowStore();

  const [simState, setSimState] = useState<SimulationState>({
    currentNodeId: null,
    decisions: {},
    history: [],
    paused: false,
    pausedAt: null,
  });

  const [showDecisionDialog, setShowDecisionDialog] = useState(false);
  const [stepDelayMs, setStepDelayMs] = useState(DEFAULT_STEP_DELAY_MS);

  const getIconForLog = useCallback(
    (log: string): LucideIcon => {
      const label = getLogNodeLabel(log);
      if (label) {
        const matchedNode = nodes.find(
          (node) => node.data.label.toLowerCase() === label.toLowerCase(),
        );
        if (matchedNode?.data?.id && BLOCK_ICON_MAP[matchedNode.data.id]) {
          return BLOCK_ICON_MAP[matchedNode.data.id];
        }
        if (matchedNode) {
          return TYPE_ICON_MAP[matchedNode.data.type];
        }
      }

      if (log.startsWith('Workflow completed')) return CheckCircle2;
      if (log.startsWith('Simulation started')) return Play;
      if (log.startsWith('Step delay')) return Clock;
      if (log.startsWith('Finding start node')) return ArrowRight;
      if (log.startsWith('Decision:')) return GitBranch;
      if (log.startsWith('No start node found')) return Filter;

      return ArrowRight;
    },
    [nodes],
  );

  const startSimulationFlow = () => {
    clearSimulationLog();
    setShowDecisionDialog(false);
    startSimulation();
    addSimulationLog('Simulation started...');
    addSimulationLog(`Step delay: ${stepDelayMs}ms`);
    addSimulationLog('Finding start node...');

    const startNode = nodes.find(
      (n) => n.data.type === 'start' || n.data.label.toLowerCase() === 'start',
    );

    if (startNode) {
      setActiveNode(startNode.id);
      setSimState({
        currentNodeId: startNode.id,
        decisions: {},
        history: [startNode.id],
        paused: false,
        pausedAt: null,
      });
      addSimulationLog(`Started at: ${startNode.data.label}`);
    } else {
      addSimulationLog('No start node found. Please create one.');
      endSimulation();
    }
  };

  const continueSimulation = useCallback(() => {
    if (!simState.currentNodeId) return;

    const currentNode = nodes.find((n) => n.id === simState.currentNodeId);
    if (!currentNode) return;

    const outgoingEdges = edges.filter((e) => e.source === simState.currentNodeId);

    if (outgoingEdges.length === 0) {
      addSimulationLog('Workflow completed!');
      setSimState((prev) => ({ ...prev, paused: false }));
      endSimulation();
      return;
    }

    if (currentNode.data.type === 'decision') {
      setShowDecisionDialog(true);
      setSimState((prev) => ({
        ...prev,
        paused: true,
        pausedAt: currentNode.data.label,
      }));
      addSimulationLog(`Decision required at: ${currentNode.data.label}`);
      return;
    }

    const nextEdge = outgoingEdges[0];
    if (!nextEdge) return;

    const nextNode = nodes.find((n) => n.id === nextEdge.target);
    if (!nextNode) return;

    setSimState((prev) => ({
      ...prev,
      currentNodeId: nextNode.id,
      history: [...prev.history, nextNode.id],
    }));
    setActiveNode(nextNode.id);
    addSimulationLog(`-> ${nextNode.data.label}`);

    if (nextNode.data.type === 'action' && nextNode.data.label.includes('Close')) {
      addSimulationLog('Workflow completed!');
      endSimulation();
    }
  }, [addSimulationLog, edges, endSimulation, nodes, setActiveNode, simState.currentNodeId]);

  useEffect(() => {
    if (!isSimulating || simState.paused || !simState.currentNodeId) return;

    const timeoutId = setTimeout(() => {
      continueSimulation();
    }, stepDelayMs);

    return () => clearTimeout(timeoutId);
  }, [continueSimulation, isSimulating, simState.currentNodeId, simState.paused, stepDelayMs]);

  const handleDecision = (choice: string) => {
    const currentNode = nodes.find((n) => n.id === simState.currentNodeId);
    if (!currentNode) return;

    const outgoingEdges = edges.filter((e) => e.source === simState.currentNodeId);
    const targetEdge = outgoingEdges[choice === 'Yes' ? 0 : 1];
    if (!targetEdge) return;

    const nextNode = nodes.find((n) => n.id === targetEdge.target);
    if (!nextNode) return;

    setSimState((prev) => ({
      ...prev,
      currentNodeId: nextNode.id,
      decisions: { ...prev.decisions, [currentNode.id]: choice },
      history: [...prev.history, nextNode.id],
      paused: false,
      pausedAt: null,
    }));
    setActiveNode(nextNode.id);
    addSimulationLog(`Decision: ${choice}`);
    addSimulationLog(`-> ${nextNode.data.label}`);
    setShowDecisionDialog(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="step-delay" className="text-xs text-muted-foreground whitespace-nowrap">
            Delay
          </label>
          <select
            id="step-delay"
            value={stepDelayMs}
            onChange={(e) => setStepDelayMs(parseInt(e.target.value, 10))}
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
          disabled={isSimulating}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Start Simulation
        </Button>

        {isSimulating && (
          <Button
            onClick={() => {
              endSimulation();
              setShowDecisionDialog(false);
              setSimState({
                currentNodeId: null,
                decisions: {},
                history: [],
                paused: false,
                pausedAt: null,
              });
            }}
            size="sm"
            variant="destructive"
          >
            Stop
          </Button>
        )}
      </div>

      <Card className="p-4 bg-slate-900 text-white max-h-72 overflow-y-auto">
        <h3 className="font-semibold mb-3">Simulation Log</h3>
        <div className="space-y-1 text-sm font-mono">
          <AnimatePresence>
            {simulationLog.map((log, idx) => {
              const LogIcon = getIconForLog(log);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-slate-100 flex items-center gap-2"
                >
                  <LogIcon className="h-4 w-4 shrink-0 text-slate-300" />
                  <span>{log}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </Card>

      <AnimatePresence>
        {showDecisionDialog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Card className="p-6 max-w-sm">
              <h3 className="font-semibold text-lg mb-4">
                {simState.pausedAt ? `Decision at: ${simState.pausedAt}` : 'What\'s your decision?'}
              </h3>
              <div className="flex gap-3">
                <Button onClick={() => handleDecision('Yes')} className="flex-1 bg-green-600 hover:bg-green-700">
                  Yes
                </Button>
                <Button onClick={() => handleDecision('No')} className="flex-1 bg-red-600 hover:bg-red-700">
                  No
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
