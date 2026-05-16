import type { SimulationRuntime } from "@/lib/simulation/types";
import type { WorkflowStore } from "@/lib/store";

const EMPTY_RUNTIMES: SimulationRuntime[] = [];

export const TICKET_STATE_OPTIONS = [
  "open",
  "assigned",
  "resolved",
  "closed",
  "reopened",
] as const;

export type TicketMonitorFilters = {
  state: string;
  priority: string;
  impact: string;
};

export const selectTicketMonitorRuntimes = (
  state: WorkflowStore,
): SimulationRuntime[] =>
  state.engineState ? Object.values(state.engineState.runtimes) : EMPTY_RUNTIMES;

export const selectTicketMonitorNodes = (state: WorkflowStore) => state.nodes;

export const selectPriorityOptions = (runtimes: SimulationRuntime[]): string[] =>
  Array.from(
    new Set(
      runtimes
        .map((runtime) => runtime.ticket.priority)
        .filter((priority) => Boolean(priority)),
    ),
  );

export const selectImpactOptions = (runtimes: SimulationRuntime[]): string[] =>
  Array.from(
    new Set(
      runtimes
        .map((runtime) => runtime.ticket.impact)
        .filter((impact) => Boolean(impact)),
    ),
  );

export const getTicketCurrentStepLabel = (
  currentNodeId: string | null,
  nodes: WorkflowStore["nodes"],
): string => {
  if (!currentNodeId) return "N/A";
  const node = nodes.find((candidateNode) => candidateNode.id === currentNodeId);
  return node ? node.data.label : currentNodeId;
};

export const selectFilteredRuntimes = (
  runtimes: SimulationRuntime[],
  filters: TicketMonitorFilters,
): SimulationRuntime[] =>
  runtimes.filter((runtime) => {
    const matchesState =
      filters.state === "all" || runtime.ticket.state === filters.state;
    const matchesPriority =
      filters.priority === "all" || runtime.ticket.priority === filters.priority;
    const matchesImpact =
      filters.impact === "all" || runtime.ticket.impact === filters.impact;

    return matchesState && matchesPriority && matchesImpact;
  });
