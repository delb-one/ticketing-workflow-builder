import { useMemo } from "react";
import { useWorkflowStore } from "@/lib/store";
import { selectGlobalSearchResults } from "@/features/panels/logic/search-selectors";

export function useSearch(query: string) {
  const nodes = useWorkflowStore((state) => state.nodes);
  const engineState = useWorkflowStore((state) => state.engineState);
  const simulationEvents = useWorkflowStore((state) => state.simulationEvents);

  return useMemo(
    () =>
      selectGlobalSearchResults(
        { nodes, engineState, simulationEvents },
        query,
      ),
    [nodes, engineState, simulationEvents, query],
  );
}
