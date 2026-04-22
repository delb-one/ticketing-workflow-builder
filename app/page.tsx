'use client';

import { ReactFlowProvider } from '@xyflow/react';
import BlockLibrary from '@/components/BlockLibrary';
import InspectorPanel from '@/components/InspectorPanel';
import Toolbar from '@/components/Toolbar';
import SimulationEngine from '@/components/SimulationEngine';
import { useWorkflowStore } from '@/lib/store';
import dynamic from 'next/dynamic';

const WorkflowCanvas = dynamic(() => import('@/components/WorkflowCanvas'), {
  ssr: false,
});

export default function Home() {
  const { nodes, selectedNode } = useWorkflowStore();
  const selectedNodeData = nodes.find((n) => n.id === selectedNode);

  return (
    <div className="flex flex-col h-screen ">
      <Toolbar />

      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Left Sidebar */}
        <div className="w-64  rounded-lg shadow-sm border  overflow-hidden flex flex-col">
          <BlockLibrary onBlockDrag={() => {}} />
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col rounded-lg shadow-sm border border-border overflow-hidden">
          <ReactFlowProvider>
            <WorkflowCanvas />
          </ReactFlowProvider>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-4 w-80">
          {/* Inspector */}
          <div className="flex-1 rounded-lg shadow-sm border border-border overflow-hidden">
            <InspectorPanel selectedNode={selectedNodeData} />
          </div>

          {/* Simulation Controls */}
          <div className=" rounded-lg shadow-sm border border-red p-4">
            <SimulationEngine />
          </div>
        </div>
      </div>
    </div>
  );
}
