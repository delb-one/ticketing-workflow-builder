import type { WorkflowStore } from "@/lib/store";

export type SearchResultType = "node" | "ticket" | "event";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  metadata?: string;
  targetId?: string;
}

type SearchableState = Pick<
  WorkflowStore,
  "nodes" | "engineState" | "simulationEvents"
>;

const normalize = (value: string): string => value.trim().toLowerCase();

const includesQuery = (query: string, ...values: Array<string | undefined>): boolean => {
  if (!query) return false;
  return values.some((value) => normalize(value ?? "").includes(query));
};

export const selectNodeSearchResults = (
  state: SearchableState,
  rawQuery: string,
): SearchResult[] => {
  const query = normalize(rawQuery);
  if (!query) return [];

  return state.nodes
    .filter((node) =>
      includesQuery(
        query,
        node.id,
        node.data.label,
        node.data.type,
        node.data.description,
        node.data.blockId,
      ),
    )
    .map((node) => ({
      id: `node-${node.id}`,
      type: "node" as const,
      title: node.data.label,
      subtitle: `Type: ${node.data.type}`,
      metadata: node.id,
      targetId: node.id,
    }));
};

export const selectTicketSearchResults = (
  state: SearchableState,
  rawQuery: string,
): SearchResult[] => {
  const query = normalize(rawQuery);
  if (!query) return [];

  const runtimes = Object.values(state.engineState?.runtimes ?? {});
  return runtimes
    .filter((runtime) => {
      const ticket = runtime.ticket;
      return includesQuery(
        query,
        ticket.id,
        ticket.state,
        ticket.priority,
        ticket.assignedAgent,
        ticket.category,
        ticket.assignedGroup,
        ticket.queue,
        ...(ticket.history ?? []),
      );
    })
    .map((runtime) => {
      const ticket = runtime.ticket;
      return {
        id: `ticket-${ticket.id}`,
        type: "ticket" as const,
        title: `Ticket ${ticket.id}`,
        subtitle: `${ticket.state} · ${ticket.priority}`,
        metadata: ticket.assignedAgent ? `Agent: ${ticket.assignedAgent}` : "Unassigned",
        targetId: runtime.currentNodeId ?? undefined,
      };
    });
};

export const selectEventSearchResults = (
  state: SearchableState,
  rawQuery: string,
): SearchResult[] => {
  const query = normalize(rawQuery);
  if (!query) return [];

  return state.simulationEvents
    .filter((event) =>
      includesQuery(
        query,
        event.type,
        event.ticketId,
        event.nodeId,
        event.nodeLabel,
        String(event.timestamp),
        event.payload?.previousState,
        event.payload?.newState,
        event.payload?.assignedTo,
        event.payload?.reason,
        event.payload?.queue,
        event.payload?.agentId,
      ),
    )
    .slice()
    .reverse()
    .map((event, index) => ({
      id: `event-${event.timestamp}-${event.type}-${index}`,
      type: "event" as const,
      title: `${event.type} · ${event.ticketId}`,
      subtitle: event.nodeLabel ?? event.nodeId ?? "Runtime event",
      metadata: new Date(event.timestamp).toLocaleString(),
      targetId: event.nodeId,
    }));
};

export const selectGlobalSearchResults = (state: SearchableState, query: string) => ({
  nodes: selectNodeSearchResults(state, query),
  tickets: selectTicketSearchResults(state, query),
  events: selectEventSearchResults(state, query),
});
