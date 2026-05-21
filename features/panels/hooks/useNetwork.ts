import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useWorkflowStore } from "@/lib/store";
import {
  selectCriticalNetworkNodes,
  selectGraphDensity,
  selectLongestWorkflowPath,
  selectNodeConnectivity,
  selectWorkflowTopology,
  type NodeConnectivity,
} from "@/features/panels/logic/network-selectors";

export type UseNetworkResult = {
  selectedNodeId: string | null;
  topology: ReturnType<typeof selectWorkflowTopology>;
  criticalNodes: ReturnType<typeof selectCriticalNetworkNodes>;
  longestPath: string[];
  graphDensity: number;
  selectedNodeConnectivity: NodeConnectivity | null;
};

export function useNetwork(): UseNetworkResult {
  const { nodes, edges, selectedNodeId } = useWorkflowStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      selectedNodeId: state.selectedNodeId,
    })),
  );

  return useMemo(() => {
    const graphState = { nodes, edges };
    return {
      selectedNodeId,
      topology: selectWorkflowTopology(graphState),
      criticalNodes: selectCriticalNetworkNodes(graphState),
      longestPath: selectLongestWorkflowPath(graphState),
      graphDensity: selectGraphDensity(graphState),
      selectedNodeConnectivity: selectedNodeId
        ? selectNodeConnectivity(graphState, selectedNodeId)
        : null,
    };
  }, [edges, nodes, selectedNodeId]);
}
