"use client";

import React, { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
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
import type { NodeConfig } from "@/lib/simulation/types";
import CanvasNode from "./CanvasNode";
import { useTheme } from "next-themes";
import { QueuePanel } from "./simulation/QueuePanel";
import { AgentPanel } from "./simulation/AgentPanel";
import { TicketMonitor } from "./simulation/TicketMonitor";

const nodeTypes: NodeTypes = {
  canvas: CanvasNode,
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

export default function WorkflowCanvas({ onNodeSelect }: WorkflowCanvasProps) {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    addNode,
    setNodes: setStoreNodes,
    addEdge: addStoreEdge,
    setEdges: setStoreEdges,
    selectedNode,
    isSimulating,
  } = useWorkflowStore();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes] = useNodesState<CustomNode>(storeNodes);
  const [edges, setCanvasEdges] = useEdgesState<Edge>(storeEdges);

  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);

  useEffect(() => {
    setCanvasEdges(storeEdges);
  }, [storeEdges, setCanvasEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        id: `${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source || "",
        target: connection.target || "",
      };
      addStoreEdge(edge);
    },
    [addStoreEdge],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange<CustomNode>[]) => {
      setNodes((currentNodes) => {
        const nextNodes = applyNodeChanges(
          changes,
          currentNodes,
        ) as CustomNode[];
        setStoreNodes(nextNodes);
        return nextNodes;
      });
    },
    [setNodes, setStoreNodes],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      setCanvasEdges((currentEdges) => {
        const nextEdges = applyEdgeChanges(changes, currentEdges);
        setStoreEdges(nextEdges);
        return nextEdges;
      });
    },
    [setCanvasEdges, setStoreEdges],
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
      const updatedEdges = storeEdges.map((currentEdge) =>
        currentEdge.id === edge.id
          ? {
            ...currentEdge,
            label: trimmedLabel || undefined,
          }
          : currentEdge,
      );

      setStoreEdges(updatedEdges);
    },
    [setStoreEdges, storeEdges],
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      const deletedIds = new Set(deletedEdges.map((edge) => edge.id));
      setStoreEdges(storeEdges.filter((edge) => !deletedIds.has(edge.id)));
    },
    [setStoreEdges, storeEdges],
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

  const selectedNodeData = storeNodes.find((node) => node.id === selectedNode);

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
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Strict}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
        colorMode={theme === "dark" ? "dark" : "light"}
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.data.type) {
              case "actor":
                return "var(--chart-4)";
              case "decision":
              case "condition":
                return "var(--chart-3)";
              case "automation":
                return "var(--chart-2)";
              case "action":
              case "status":
                return "var(--chart-1)";
              case "event":
                return "var(--chart-2)";
              default:
                return "var(--chart-5)";
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />

        <>
          <Panel position="top-left" className="w-72  pointer-events-auto">
            <div className="h-1/2 min-h-50">
              <QueuePanel />
            </div>
          </Panel>
          <Panel position="top-right" className="w-72  pointer-events-auto">
            <div className="h-1/2 min-h-50">
              <AgentPanel />
            </div>
          </Panel>
          <Panel position="bottom-center" className="w-200 max-w-[70%] max-h-[30%]  pointer-events-auto  mb-4">
            <TicketMonitor />
          </Panel>
        </>

      </ReactFlow>
    </div>
  );
}
