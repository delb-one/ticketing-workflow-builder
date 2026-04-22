'use client';

import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  applyEdgeChanges,
  Connection,
  EdgeChange,
  MiniMap,
  NodeTypes,
  ReactFlowInstance,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore, CustomNode } from '@/lib/store';
import CanvasNode from './CanvasNode';

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
    addEdge: addStoreEdge,
    setEdges: setStoreEdges,
    selectedNode,
  } = useWorkflowStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setCanvasEdges] = useEdgesState(storeEdges);
  const reactFlowInstanceRef = React.useRef<ReactFlowInstance | null>(null);

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
        source: connection.source || '',
        target: connection.target || '',
      };
      addStoreEdge(edge);
    },
    [addStoreEdge]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      setCanvasEdges((currentEdges) => {
        const nextEdges = applyEdgeChanges(changes, currentEdges);
        setStoreEdges(nextEdges);
        return nextEdges;
      });
    },
    [setCanvasEdges, setStoreEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;

      try {
        const blockData = JSON.parse(data);
        const reactFlowInstance = reactFlowInstanceRef.current;
        if (!reactFlowInstance) return;

        const position = reactFlowInstance.screenToFlowPosition({
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
          type: 'canvas',
        };

        addNode(newNode);
      } catch (error) {
        console.error('[v0] Error parsing dropped block:', error);
      }
    },
    [addNode]
  );

  const selectedNodeData = storeNodes.find((n) => n.id === selectedNode);

  useEffect(() => {
    onNodeSelect?.(selectedNodeData ?? null);
  }, [onNodeSelect, selectedNodeData]);

  return (
    <div className="flex-1 bg-card relative" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          selected: node.id === selectedNode,
        }))}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
          reactFlowInstanceRef.current = instance;
        }}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.data.type) {
              case 'actor':
                return '#3b82f6';
              case 'decision':
              case 'condition':
                return '#a855f7';
              case 'automation':
                return '#f97316';
              case 'action':
                return '#22c55e';
              default:
                return '#64748b';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}
