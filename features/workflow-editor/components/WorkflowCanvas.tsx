"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Edge,
  Controls,
  Background,
  Connection,
  EdgeChange,
  NodeChange,
  ConnectionMode,
  MiniMap,
  NodeTypes,
  BackgroundVariant,
  useReactFlow,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore, CustomNode } from "@/lib/store";
import type { NodeConfig, NodeType } from "@/lib/simulation/types";
import CanvasNode from "./CanvasNode";
import LabelEdge from "./LabelEdge";
import { useTheme } from "next-themes";
import {
  QueuePanel,
  AgentPanel,
  TicketMonitorPanel,
  TicketPanel,
  SimulationPanel,
} from "@/features/simulation";
import { getNodeTypeColorVar } from "@/lib/colors/color-map";
import Draggable from "react-draggable";
import ControlsPanel from "@/features/simulation/components/ControlsPanel";
import { ToolsContainerPanel } from "@/features/simulation/components/ToolsContainerPanel";

const nodeTypes: NodeTypes = {
  canvas: CanvasNode,
};

const edgeTypes = {
  label: LabelEdge,
};

type Props = {
  children: React.ReactNode;
  initial?: { x: number; y: number };
};

const DraggablePanel = ({ children, initial }: Props) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".panel-drag-handle"
      defaultPosition={initial}
      bounds=".react-flow"
    >
      <div ref={nodeRef} className="pointer-events-auto z-50 w-fit h-fit">
        {children}
      </div>
    </Draggable>
  );
};

interface WorkflowCanvasProps {
  onNodeSelect?: (node: CustomNode | null) => void;
}

interface DragPayload {
  type: CustomNode["data"]["type"];
  blockId?: string;
  id?: string;
  label: string;
  description?: string;
  config?: NodeConfig;
}

const isNodeType = (value: unknown): value is NodeType =>
  typeof value === "string" &&
  [
    "start",
    "end",
    "actor",
    "action",
    "automation",
    "decision",
    "condition",
    "status",
    "event",
  ].includes(value);

export default function WorkflowCanvas({ onNodeSelect }: WorkflowCanvasProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addNode,
    setSelectedNode,
    addEdge: addStoreEdge,
    setEdges: setStoreEdges,
    selectedNode,
    isSimulating,
  } = useWorkflowStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [visiblePanels, setVisiblePanels] = useState<Record<string, boolean>>({
    "queue-panel": false,
    "ticket-panel": false,
    "agent-panel": false,
    "activity-panel": false,
    "log-panel": false,
  });

  const handleCloseAll = useCallback(() => {
    setVisiblePanels({
      "queue-panel": false,
      "ticket-panel": false,
      "agent-panel": false,
      "activity-panel": false,
      "log-panel": false,
    });
  }, []);

  const { screenToFlowPosition } = useReactFlow();

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: CustomNode) => {
      setSelectedNode(node.id);
      // Clear edge selection when a node is selected
      setStoreEdges(edges.map((e) => ({ ...e, selected: false })));
    },
    [setSelectedNode, setStoreEdges, edges],
  );

  const onEdgeClick = useCallback(() => {
    // Clear node selection when an edge is selected
    setSelectedNode(null);
  }, [setSelectedNode]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const color = sourceNode
        ? getNodeTypeColorVar(sourceNode.data.type)
        : "var(--primary)";

      const edge: Edge = {
        id: `${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source || "",
        target: connection.target || "",
        style: {
          stroke: color,
          strokeWidth: 1,
        },
        animated: true,
      };
      addStoreEdge(edge);
    },
    [addStoreEdge, nodes],
  );

  const onEdgeDoubleClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      const currentLabel = typeof edge.label === "string" ? edge.label : "";
      const nextLabel = window.prompt(
        "Inserisci label edge (vuoto per rimuoverla):",
        currentLabel,
      );

      if (nextLabel === null) return;

      const trimmedLabel = nextLabel.trim();
      const updatedEdges = edges.map((currentEdge) =>
        currentEdge.id === edge.id
          ? {
            ...currentEdge,
            label: trimmedLabel || undefined,
          }
          : currentEdge,
      );

      setStoreEdges(updatedEdges);
    },
    [setStoreEdges, edges],
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      const deletedIds = new Set(deletedEdges.map((edge) => edge.id));
      setStoreEdges(edges.filter((edge) => !deletedIds.has(edge.id)));
    },
    [setStoreEdges, edges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      try {
        const blockData = JSON.parse(data) as DragPayload;

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const nodeId = `${blockData.type}-${Date.now()}`;
        const blockId = blockData.blockId ?? blockData.id;
        const newNode: CustomNode = {
          id: nodeId,
          data: {
            label: blockData.label,
            type: blockData.type,
            blockId,
            description: blockData.description,
            config: blockData.config,
          },
          position,
          type: "canvas",
        };

        addNode(newNode);
      } catch (error) {
        console.error("[workflow-canvas] Error parsing dropped block:", error);
      }
    },
    [addNode, screenToFlowPosition],
  );

  const selectedNodeData = nodes.find((node) => node.id === selectedNode);
  const activeToolIds = useMemo(
    () =>
      Object.entries(visiblePanels)
        .filter(([, isVisible]) => isVisible)
        .map(([panelId]) => panelId),
    [visiblePanels],
  );
  const handleToolToggle = useCallback((toolId: string) => {
    setVisiblePanels((prev) => ({ ...prev, [toolId]: !prev[toolId] }));
  }, []);

  useEffect(() => {
    onNodeSelect?.(selectedNodeData ?? null);
  }, [onNodeSelect, selectedNodeData]);

  return (
    <div
      className="relative flex-1 bg-card"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow<CustomNode, Edge>
        nodes={nodes.map((node) => ({
          ...node,
          selected: node.id === selectedNode,
        }))}
        edges={edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const color = sourceNode
            ? getNodeTypeColorVar(sourceNode.data.type)
            : "var(--primary)";

          const isSelected = edge.selected;

          return {
            ...edge,
            type: "label",
            animated: edge.animated ?? true,
            style: {
              ...edge.style,
              stroke: isSelected ? "var(--primary)" : color,
              strokeWidth: isSelected ? 3 : 1,
            },
          };
        })}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Strict}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
        colorMode={theme === "dark" ? "dark" : "light"}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap
          nodeColor={(node) =>
            isNodeType(node.data?.type)
              ? getNodeTypeColorVar(node.data.type)
              : getNodeTypeColorVar("start")
          }
          maskColor="rgba(0, 0, 0, 0.1)"
        />

        <Panel position="bottom-center">
          <div className="flex items-center gap-2 border rounded-xl bg-background/50 p-1 backdrop-blur-2xl ">


            <ControlsPanel />
            <ToolsContainerPanel
              activeToolIds={activeToolIds}
              onToolToggle={handleToolToggle}
              onCloseAll={handleCloseAll}
            />


          </div>
        </Panel>

        <Panel position="center-right">
        </Panel>
      </ReactFlow>

      <div className="absolute inset-0 pointer-events-none z-10">
        {/* QUEUE PANEL */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-150 ${visiblePanels["queue-panel"] ? "opacity-100" : "opacity-0"
            }`}
        >
          <DraggablePanel initial={{ x: 16, y: 16 }}>
            <QueuePanel />
          </DraggablePanel>
        </div>

        {/* TICKET PANEL */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-150 ${visiblePanels["ticket-panel"] ? "opacity-100" : "opacity-0"
            }`}
        >
          <DraggablePanel initial={{ x: 350, y: 16 }}>
            <TicketPanel />
          </DraggablePanel>
        </div>

        {/* AGENT PANEL */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-150 ${visiblePanels["agent-panel"] ? "opacity-100" : "opacity-0"
            }`}
        >
          <DraggablePanel initial={{ x: 800, y: 16 }}>
            <AgentPanel />
          </DraggablePanel>
        </div>

        {/* ACTIVITY PANEL */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-150 ${visiblePanels["activity-panel"] ? "opacity-100" : "opacity-0"
            }`}
        >
          <DraggablePanel initial={{ x: 150, y: 500 }}>
            <TicketMonitorPanel />
          </DraggablePanel>
        </div>
        {/* LOG PANEL */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-150 ${visiblePanels["log-panel"] ? "opacity-100" : "opacity-0"
            }`}
        >
          <DraggablePanel initial={{ x: 150, y: 100 }}>
            <SimulationPanel />
          </DraggablePanel>
        </div>
      </div>
    </div>
  );
}
