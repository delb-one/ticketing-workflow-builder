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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useWorkflowStore, CustomNode } from "@/lib/store";
import CanvasNode from "./CanvasNode";

const nodeTypes: NodeTypes = {
  canvas: CanvasNode,
};

interface WorkflowCanvasProps {
  onNodeSelect?: (node: CustomNode | null) => void;
}

export default function WorkflowCanvas({ onNodeSelect }: WorkflowCanvasProps) {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    addNode,
    setNodes: setStoreNodes,
    addEdge: addStoreEdge,
    deleteEdge,
    setEdges: setStoreEdges,
    selectedNode,
  } = useWorkflowStore();
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes] = useNodesState(storeNodes);
  const [edges, setCanvasEdges] = useEdgesState(storeEdges);

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
        const nextNodes = applyNodeChanges(changes, currentNodes) as CustomNode[];
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
      deleteEdge(edge.id);
    },
    [deleteEdge],
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
        const blockData = JSON.parse(data);

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const nodeId = `${blockData.type}-${Date.now()}`;
        const newNode: CustomNode = {
          id: nodeId,
          data: {
            label: blockData.label,
            type: blockData.type,
            id: blockData.id,
            config: {},
          },
          position,
          type: "canvas",
        };

        addNode(newNode);
      } catch (error) {
        console.error("[v0] Error parsing dropped block:", error);
      }
    },
    [addNode, screenToFlowPosition],
  );

  const selectedNodeData = storeNodes.find((n) => n.id === selectedNode);

  useEffect(() => {
    onNodeSelect?.(selectedNodeData ?? null);
  }, [onNodeSelect, selectedNodeData]);

  return (
    <div
      className="flex-1 bg-card relative"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
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
        connectionMode={ConnectionMode.Loose}
        deleteKeyCode={["Backspace", "Delete"]}
        fitView
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
                return "var(--chart-1)";
              default:
                return "var(--chart-5)";
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
