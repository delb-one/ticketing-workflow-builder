import { create } from "zustand";
import { Node, Edge } from "@xyflow/react";

export type NodeType =
  | "actor"
  | "decision"
  | "condition"
  | "automation"
  | "action"
  | "start"
  | "end";

export interface CustomNode extends Node {
  data: {
    label: string;
    type: NodeType;
    id?: string;
    config?: {
      [key: string]: any;
    };
    description?: string;
  };
}

export interface WorkflowStore {
  nodes: CustomNode[];
  edges: Edge[];
  selectedNode: string | null;
  isSimulating: boolean;
  simulationStep: number;
  activeNodeId: string | null;
  simulationLog: string[];

  // Node operations
  addNode: (node: CustomNode) => void;
  setNodes: (nodes: CustomNode[]) => void;
  updateNode: (id: string, data: Partial<CustomNode>) => void;
  deleteNode: (id: string) => void;
  setSelectedNode: (id: string | null) => void;

  // Edge operations
  addEdge: (edge: Edge) => void;
  deleteEdge: (id: string) => void;
  setEdges: (edges: Edge[]) => void;

  // Simulation
  startSimulation: () => void;
  endSimulation: () => void;
  nextStep: () => void;
  previousStep: () => void;
  setActiveNode: (id: string | null) => void;
  addSimulationLog: (message: string) => void;
  clearSimulationLog: () => void;

  // Workflow
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

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),

  setNodes: (nodes) => set({ nodes }),

  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...data } : node,
      ),
    })),

  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id,
      ),
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
      simulationLog: ["Simulation started..."],
      activeNodeId: "start",
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

  clearWorkflow: () =>
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      isSimulating: false,
      simulationStep: 0,
      activeNodeId: null,
      simulationLog: [],
    }),

  loadWorkflow: (nodes, edges) =>
    set({
      nodes,
      edges,
    }),
}));
