'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWorkflowStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface SimulationState {
  currentNodeId: string | null;
  decisions: { [key: string]: string };
  history: string[];
  paused: boolean;
  pausedAt: string | null;
}

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
  const [decisionOptions, setDecisionOptions] = useState<string[]>([]);

  const startSimulationFlow = () => {
    clearSimulationLog();
    startSimulation();
    addSimulationLog('Simulation started...');
    addSimulationLog('🎯 Finding start node...');

    const startNode = nodes.find((n) => n.data.type === 'start' || n.data.label.toLowerCase() === 'start');
    if (startNode) {
      setActiveNode(startNode.id);
      setSimState({
        currentNodeId: startNode.id,
        decisions: {},
        history: [startNode.id],
        paused: false,
        pausedAt: null,
      });
      addSimulationLog(`✅ Started at: ${startNode.data.label}`);
    } else {
      addSimulationLog('⚠️ No start node found. Please create one.');
      endSimulation();
    }
  };

  const continueSimulation = () => {
    if (!simState.currentNodeId) return;

    const currentNode = nodes.find((n) => n.id === simState.currentNodeId);
    if (!currentNode) return;

    const outgoingEdges = edges.filter((e) => e.source === simState.currentNodeId);

    if (outgoingEdges.length === 0) {
      addSimulationLog('✓ Workflow completed!');
      setSimState((prev) => ({ ...prev, paused: false }));
      endSimulation();
      return;
    }

    // Handle decision nodes
    if (currentNode.data.type === 'decision') {
      setShowDecisionDialog(true);
      setDecisionOptions(outgoingEdges.map((e) => e.label || e.target).slice(0, 2));
      setSimState((prev) => ({ ...prev, paused: true, pausedAt: currentNode.data.label }));
      addSimulationLog(`❓ Decision required at: ${currentNode.data.label}`);
      return;
    }

    // Auto-advance for non-decision nodes
    const nextEdge = outgoingEdges[0];
    if (nextEdge) {
      const nextNode = nodes.find((n) => n.id === nextEdge.target);
      if (nextNode) {
        setSimState((prev) => ({
          ...prev,
          currentNodeId: nextNode.id,
          history: [...prev.history, nextNode.id],
        }));
        setActiveNode(nextNode.id);
        addSimulationLog(`➡️ → ${nextNode.data.label}`);

        if (nextNode.data.type === 'action' && nextNode.data.label.includes('Close')) {
          addSimulationLog('✓ Workflow completed!');
          endSimulation();
        }
      }
    }
  };

  const handleDecision = (choice: string) => {
    const currentNode = nodes.find((n) => n.id === simState.currentNodeId);
    if (!currentNode) return;

    const outgoingEdges = edges.filter((e) => e.source === simState.currentNodeId);
    const targetEdge = outgoingEdges[choice === 'Yes' ? 0 : 1];

    if (targetEdge) {
      const nextNode = nodes.find((n) => n.id === targetEdge.target);
      if (nextNode) {
        setSimState((prev) => ({
          ...prev,
          currentNodeId: nextNode.id,
          decisions: { ...prev.decisions, [currentNode.id]: choice },
          history: [...prev.history, nextNode.id],
          paused: false,
          pausedAt: null,
        }));
        setActiveNode(nextNode.id);
        addSimulationLog(`✔️ Decision: ${choice}`);
        addSimulationLog(`➡️ → ${nextNode.data.label}`);
        setShowDecisionDialog(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button
          onClick={startSimulationFlow}
          disabled={isSimulating}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          ▶️ Start Simulation
        </Button>

        {isSimulating && (
          <>
            <Button
              onClick={continueSimulation}
              disabled={simState.paused && showDecisionDialog}
              size="sm"
              variant="outline"
            >
              Next Step
            </Button>
            <Button
              onClick={() => {
                endSimulation();
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
          </>
        )}
      </div>

      <Card className="p-4 bg-slate-900 text-white max-h-72 overflow-y-auto">
        <h3 className="font-semibold mb-3">Simulation Log</h3>
        <div className="space-y-1 text-sm font-mono">
          <AnimatePresence>
            {simulationLog.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-slate-100"
              >
                {log}
              </motion.div>
            ))}
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
                {simState.pausedAt ? `Decision at: ${simState.pausedAt}` : 'What&apos;s your decision?'}
              </h3>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleDecision('Yes')}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Yes
                </Button>
                <Button
                  onClick={() => handleDecision('No')}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
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
