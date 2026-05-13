"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Edge,
  Controls,
  Background,
  Connection,
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
import { GettingStartedPanel } from "@/features/simulation/components/GettingStartedPanel";
import { CustomEdge } from "./CustomEdge";
import { FlowBackground } from "./FlowBackground";
import { Button } from "@/components/ui/button";
import { Map } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AnimatedPanel } from "./AnimatedPanel";

const nodeTypes: NodeTypes = {
  canvas: CanvasNode,
};

const edgeTypes = {
  glow: CustomEdge,
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

const INITIAL_VISIBLE_PANELS: Record<string, boolean> = {
  "getting-started-panel": true,

  "agent-panel": false,
  "ticket-panel": false,
  "queue-panel": false,
  "activity-panel": false,
  "log-panel": false,

  "metrics-panel": false,
  "sla-panel": false,
  "performance-panel": false,
  "heatmap-panel": false,
  "validation-panel": false,
  "ai-panel": false,
  // "debug-panel": false,
  "notification-panel": false,
  "dependency-panel": false,
  "network-panel": false,
  "search-panel": false,
};

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
    selectedNodeId,
  } = useWorkflowStore();
  const { theme } = useTheme();

  const [visiblePanels, setVisiblePanels] = useState<Record<string, boolean>>(
    INITIAL_VISIBLE_PANELS,
  );
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [showMinimap, setShowMinimap] = useState<boolean>(false);

  const handleShowMinimap = () => {
    setShowMinimap(!showMinimap);
  };
  const handleCloseAll = useCallback(() => {
    setVisiblePanels({
      ...INITIAL_VISIBLE_PANELS,

      // keep onboarding visible
      "getting-started-panel": false,
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

        type: "glow",
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

  const selectedNodeData = nodes.find((node) => node.id === selectedNodeId);
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
        onPaneMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();

          setMouse({
            x: event.clientX - bounds.left,
            y: event.clientY - bounds.top,
          });
        }}
        nodes={nodes.map((node) => ({
          ...node,
          selected: node.id === selectedNodeId,
        }))}
        edges={edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const isSelected = edge.selected;
          return {
            ...edge,
            type: edge.type ?? "glow",
            data: {
              color: sourceNode
                ? getNodeTypeColorVar(sourceNode.data.type)
                : "var(--primary)",
            },
            selected: isSelected,
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
        colorMode="dark"
      >
        <FlowBackground mouse={mouse} />
        {/* <Controls /> */}
        <Panel position="bottom-right">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShowMinimap}
                className="bg-background/50 border backdrop-blur"
              >
                <Map className="w-4 h-4" />
              </Button>
            </TooltipTrigger>

            <TooltipContent
              side="left"
              className="text-xs bg-background text-primary border border-border"
            >
              {showMinimap ? "Hide Minimap" : "Show Minimap"}
            </TooltipContent>
          </Tooltip>
        </Panel>

        <div
          className={cn(
            "pointer-events-none absolute bottom-12 right-8 z-50 transition-all duration-300 ease-out",
            showMinimap
              ? "translate-y-0 opacity-100 scale-100 visible"
              : "translate-y-6 opacity-0 scale-95 invisible",
          )}
        >
          <div
            className={cn(
              "pointer-events-auto rounded-xl border border-border bg-background/70 backdrop-blur-xl",
            )}
          >
            <MiniMap
              nodeColor={(node) =>
                isNodeType(node.data?.type)
                  ? getNodeTypeColorVar(node.data.type)
                  : getNodeTypeColorVar("start")
              }
              maskColor="rgba(0,0,0,0.1)"
            />
          </div>
        </div>
        <Panel position="top-center">
          <ControlsPanel />
        </Panel>
        <Panel position="bottom-center">
          <ToolsContainerPanel
            activeToolIds={activeToolIds}
            onToolToggle={handleToolToggle}
            onCloseAll={handleCloseAll}
          />
        </Panel>

        <Panel position="center-right"></Panel>
      </ReactFlow>

      <div className="absolute inset-0 pointer-events-none z-10">
        {/* GETTING-STARTED PANEL */}
        <AnimatedPanel
          visible={visiblePanels["getting-started-panel"]}
          className="absolute inset-0 pointer-events-none"
        >
          <DraggablePanel initial={{ x: 200, y: 16 }}>
            <GettingStartedPanel />
          </DraggablePanel>
        </AnimatedPanel>

        {/* QUEUE PANEL */}
        <AnimatedPanel
          visible={visiblePanels["queue-panel"]}
          className="absolute inset-0 pointer-events-none"
        >
          <DraggablePanel initial={{ x: 16, y: 16 }}>
            <QueuePanel />
          </DraggablePanel>
        </AnimatedPanel>

        {/* TICKET PANEL */}
        <AnimatedPanel
          visible={visiblePanels["ticket-panel"]}
          className="absolute inset-0 pointer-events-none"
        >
          <DraggablePanel initial={{ x: 350, y: 16 }}>
            <TicketPanel />
          </DraggablePanel>
        </AnimatedPanel>

        {/* AGENT PANEL */}
        <AnimatedPanel
          visible={visiblePanels["agent-panel"]}
          className="absolute inset-0 pointer-events-none"
        >
          <DraggablePanel initial={{ x: 800, y: 16 }}>
            <AgentPanel />
          </DraggablePanel>
        </AnimatedPanel>

        {/* ACTIVITY PANEL */}
        <AnimatedPanel
          visible={visiblePanels["activity-panel"]}
          className="absolute inset-0 pointer-events-none"
        >
          <DraggablePanel initial={{ x: 150, y: 500 }}>
            <TicketMonitorPanel />
          </DraggablePanel>
        </AnimatedPanel>

        {/* LOG PANEL */}
        <AnimatedPanel
          visible={visiblePanels["log-panel"]}
          className="absolute inset-0 pointer-events-none"
        >
          <DraggablePanel initial={{ x: 150, y: 100 }}>
            <SimulationPanel />
          </DraggablePanel>
        </AnimatedPanel>
      </div>
    </div>
  );
}
