import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useWorkflowStore } from "@/lib/store";
import {
  getTicketCurrentStepLabel,
  selectFilteredRuntimes,
  selectImpactOptions,
  selectPriorityOptions,
  selectTicketMonitorNodes,
  TICKET_STATE_OPTIONS,
  type TicketMonitorFilters,
} from "@/features/panels/logic/ticket-monitor-selectors";

const INITIAL_FILTERS: TicketMonitorFilters = {
  state: "all",
  priority: "all",
  impact: "all",
};

export function useTicketMonitor() {
  const { runtimeMap, nodes } = useWorkflowStore(
    useShallow((state) => ({
      runtimeMap: state.engineState?.runtimes ?? null,
      nodes: selectTicketMonitorNodes(state),
    })),
  );
  const runtimes = useMemo(
    () => (runtimeMap ? Object.values(runtimeMap) : []),
    [runtimeMap],
  );

  const [filters, setFilters] = useState<TicketMonitorFilters>(INITIAL_FILTERS);

  const stateOptions = TICKET_STATE_OPTIONS;

  const priorityOptions = useMemo(() => selectPriorityOptions(runtimes), [runtimes]);

  const impactOptions = useMemo(() => selectImpactOptions(runtimes), [runtimes]);

  const filteredRuntimes = useMemo(
    () => selectFilteredRuntimes(runtimes, filters),
    [runtimes, filters],
  );

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const getNodeLabel = (nodeId: string | null) =>
    getTicketCurrentStepLabel(nodeId, nodes);

  return {
    filters,
    setFilters,
    stateOptions,
    priorityOptions,
    impactOptions,
    filteredRuntimes,
    resetFilters,
    getNodeLabel,
  };
}
