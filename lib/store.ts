import { create } from 'zustand';
import type { Edge, Node } from '@xyflow/react';
import type {
  NodeConfig,
  NodeType,
  SimulationEvent,
  SimulationRuntime,
  EngineRuntimeState,
  Agent,
  QueueState,
} from '@/lib/simulation/types';

export type { NodeType, NodeConfig } from '@/lib/simulation/types';

export interface CustomNodeData {
  [key: string]: unknown;
  label: string;
  type: NodeType;
  blockId?: string;
  config?: NodeConfig;
  description?: string;
  // Legacy support for older saved JSON/templates.
  id?: string;
}

export type CustomNode = Node<CustomNodeData, 'canvas'>;

export interface WorkflowStore {
  nodes: CustomNode[];
  edges: Edge[];
  selectedNode: string | null;
  isSimulating: boolean;
  simulationStep: number;
  activeNodeId: string | null;
  simulationLog: string[];
  simulationRuntime: SimulationRuntime | null; // Keep for legacy UI compatibility
  engineState: EngineRuntimeState | null;
  schedulingMode: "fifo" | "priority";
  simulationEvents: SimulationEvent[];

  addNode: (node: CustomNode) => void;
  setNodes: (nodes: CustomNode[]) => void;
  updateNode: (id: string, data: Partial<CustomNode>) => void;
  deleteNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;

  addEdge: (edge: Edge) => void;
  deleteEdge: (id: string) => void;
  setEdges: (edges: Edge[]) => void;

  startSimulation: () => void;
  endSimulation: () => void;
  nextStep: () => void;
  previousStep: () => void;
  setActiveNode: (id: string | null) => void;
  addSimulationLog: (message: string) => void;
  clearSimulationLog: () => void;
  setSimulationRuntime: (runtime: SimulationRuntime | null) => void;
  syncEngineState: (state: EngineRuntimeState | null) => void;
  setSchedulingMode: (mode: "fifo" | "priority") => void;
  addSimulationEvent: (event: SimulationEvent) => void;
  clearSimulationEvents: () => void;

  clearWorkflow: () => void;
  loadWorkflow: (nodes: CustomNode[], edges: Edge[]) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  isSimulating: false,
  simulationStep: 0,
  activeNodeId: null,
  simulationLog: [],
  simulationRuntime: null,
  engineState: null,
  schedulingMode: "fifo",
  simulationEvents: [],

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  setNodes: (nodes) => set({ nodes }),

  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === id ? { ...node, ...data } : node)),
    })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
    })),

  setSelectedNode: (id) => set({ selectedNode: id }),

  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),

  deleteEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),

  setEdges: (edges) => set({ edges }),

  startSimulation: () =>
    set({
      isSimulating: true,
      simulationStep: 0,
      simulationLog: ['Simulation started...'],
      activeNodeId: null,
      simulationRuntime: null,
      engineState: null,
      simulationEvents: [],
    }),

  endSimulation: () =>
    set({
      isSimulating: false,
      activeNodeId: null,
    }),

  nextStep: () =>
    set((state) => ({
      simulationStep: state.simulationStep + 1,
    })),

  previousStep: () =>
    set((state) => ({
      simulationStep: Math.max(0, state.simulationStep - 1),
    })),

  setActiveNode: (id) => set({ activeNodeId: id }),

  addSimulationLog: (message) =>
    set((state) => ({
      simulationLog: [...state.simulationLog, message],
    })),

  clearSimulationLog: () => set({ simulationLog: [] }),

  setSimulationRuntime: (runtime) =>
    set({
      simulationRuntime: runtime,
      activeNodeId: runtime?.currentNodeId ?? null,
    }),

  syncEngineState: (state) =>
    set({
      engineState: state,
      // For backward compatibility with UI, we can try to find the first active runtime
      simulationRuntime: state ? Object.values(state.runtimes)[0] ?? null : null,
      activeNodeId: state ? Object.values(state.runtimes)[0]?.currentNodeId ?? null : null,
    }),

  setSchedulingMode: (mode) => set({ schedulingMode: mode }),

  addSimulationEvent: (event) =>
    set((state) => ({
      simulationEvents: [...state.simulationEvents, event],
    })),

  clearSimulationEvents: () => set({ simulationEvents: [] }),

  clearWorkflow: () =>
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      isSimulating: false,
      simulationStep: 0,
      activeNodeId: null,
      simulationLog: [],
      simulationRuntime: null,
      engineState: null,
      simulationEvents: [],
    }),

  loadWorkflow: (nodes, edges) =>
    set({
      nodes,
      edges,
      selectedNode: null,
      activeNodeId: null,
      simulationRuntime: null,
      engineState: null,
      simulationEvents: [],
      simulationLog: [],
    }),
}));
