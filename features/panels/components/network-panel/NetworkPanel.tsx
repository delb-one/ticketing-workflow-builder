"use client";

import { useMemo } from "react";
import { useReactFlow } from "@xyflow/react";
import { Network, Route, Share2, Split } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { useWorkflowStore } from "@/lib/store";
import { useNetwork } from "@/features/panels/hooks/useNetwork";

const densityLabel = (density: number): string => {
  if (density < 0.15) return "Sparse workflow";
  if (density > 0.45) return "Dense workflow";
  return "Balanced workflow";
};

export function NetworkPanel() {
  const { fitView } = useReactFlow();
  const nodes = useWorkflowStore((state) => state.nodes);
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode);
  const {
    topology,
    criticalNodes,
    longestPath,
    graphDensity,
    selectedNodeId,
    selectedNodeConnectivity,
  } = useNetwork();


  const nodeLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const node of nodes) {
      map.set(node.id, node.data.label);
    }
    return map;
  }, [nodes]);

  const focusNode = (nodeId: string) => {
    setSelectedNode(nodeId);
    fitView({ nodes: [{ id: nodeId }], duration: 300, padding: 0.25 });
  };

  const selectedNodeLabel = selectedNodeId
    ? nodeLabelMap.get(selectedNodeId) ?? selectedNodeId
    : null;

  return (
    <CustomPanel
      value="network-panel"
      title="Network"
      icon={Network}
      defaultExpanded
    >
      <div className="w-90 space-y-2">
        {topology.totalNodes === 0 ? (
          <div className="rounded-lg border p-4 text-xs text-muted-foreground">
            No workflow available
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="rounded-lg border p-2">
                <div className="text-[10px] text-muted-foreground">Nodes</div>
                <div className="text-base font-semibold">{topology.totalNodes}</div>
              </div>
              <div className="rounded-lg border p-2">
                <div className="text-[10px] text-muted-foreground">Edges</div>
                <div className="text-base font-semibold">{topology.totalEdges}</div>
              </div>
              <div className="rounded-lg border p-2">
                <div className="text-[10px] text-muted-foreground">Depth</div>
                <div className="text-base font-semibold">{topology.workflowDepth}</div>
              </div>
              <div className="rounded-lg border p-2">
                <div className="text-[10px] text-muted-foreground">Components</div>
                <div className="text-base font-semibold">
                  {topology.connectedComponents}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              <Badge className="bg-muted text-foreground">
                Branching: {topology.averageBranchingFactor.toFixed(2)}
              </Badge>
              <Badge className="bg-muted text-foreground">
                Density: {graphDensity.toFixed(2)}
              </Badge>
              <Badge className="bg-muted text-foreground">
                {densityLabel(graphDensity)}
              </Badge>
            </div>

            <div className="rounded-lg border p-2 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Share2 className="h-3.5 w-3.5" />
                Connectivity Explorer
              </div>
              {!selectedNodeConnectivity || !selectedNodeLabel ? (
                <div className="text-xs text-muted-foreground">
                  Select a node to inspect connectivity
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-primary">
                    {selectedNodeLabel}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Role: {selectedNodeConnectivity.role} · Degree:{" "}
                    {selectedNodeConnectivity.degree}
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-muted-foreground">
                      Incoming ({selectedNodeConnectivity.incoming.length})
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedNodeConnectivity.incoming.length === 0 && (
                        <span className="text-[11px] text-muted-foreground">None</span>
                      )}
                      {selectedNodeConnectivity.incoming.map((id) => (
                        <button
                          key={`in-${id}`}
                          type="button"
                          onClick={() => focusNode(id)}
                          className="rounded border px-1.5 py-0.5 text-[11px] hover:bg-muted/70"
                        >
                          {nodeLabelMap.get(id) ?? id}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-muted-foreground">
                      Outgoing ({selectedNodeConnectivity.outgoing.length})
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedNodeConnectivity.outgoing.length === 0 && (
                        <span className="text-[11px] text-muted-foreground">None</span>
                      )}
                      {selectedNodeConnectivity.outgoing.map((id) => (
                        <button
                          key={`out-${id}`}
                          type="button"
                          onClick={() => focusNode(id)}
                          className="rounded border px-1.5 py-0.5 text-[11px] hover:bg-muted/70"
                        >
                          {nodeLabelMap.get(id) ?? id}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border p-2 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Split className="h-3.5 w-3.5" />
                Critical Nodes
              </div>
              <ScrollArea className="h-40">
                <div className="space-y-1 pr-2">
                  {criticalNodes.length === 0 && (
                    <div className="text-xs text-muted-foreground">
                      No connected nodes yet
                    </div>
                  )}
                  {criticalNodes.map((node) => (
                    <button
                      key={node.nodeId}
                      type="button"
                      onClick={() => focusNode(node.nodeId)}
                      className="w-full rounded border px-2 py-1 text-left hover:bg-muted/60"
                    >
                      <div className="text-xs font-medium">{node.label}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {node.degree} connections · in {node.incoming} / out{" "}
                        {node.outgoing}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="rounded-lg border p-2 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <Route className="h-3.5 w-3.5" />
                Path Explorer
              </div>
              {longestPath.length === 0 ? (
                <div className="text-xs text-muted-foreground">
                  No execution path available
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1">
                  {longestPath.map((nodeId, index) => (
                    <div key={`path-${nodeId}-${index}`} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => focusNode(nodeId)}
                        className="rounded border px-1.5 py-0.5 text-[11px] hover:bg-muted/70"
                      >
                        {nodeLabelMap.get(nodeId) ?? nodeId}
                      </button>
                      {index < longestPath.length - 1 && (
                        <span className="text-[11px] text-muted-foreground">-&gt;</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </CustomPanel>
  );
}
