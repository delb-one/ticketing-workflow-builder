import type { WorkflowStore } from "@/lib/store";

// Simple memoization helper for selectors
const memoize = <T extends (state: WorkflowStore) => any>(
  fn: T,
  getDeps: (state: WorkflowStore) => any[],
) => {
  let lastDeps: any[] = [];
  let lastResult: any;
  let firstRun = true;

  return (state: WorkflowStore) => {
    const deps = getDeps(state);
    if (!firstRun && deps.every((d, i) => d === lastDeps[i])) {
      return lastResult;
    }
    const result = fn(state);
    lastDeps = deps;
    lastResult = result;
    firstRun = false;
    return result;
  };
};

export const selectActiveTicketsCount = (state: WorkflowStore): number => {
  if (!state.engineState) return 0;
  return Object.values(state.engineState.runtimes).filter(
    (rt) =>
      !rt.completed &&
      rt.ticket.state !== "resolved" &&
      rt.ticket.state !== "closed",
  ).length;
};

export const selectOpenTicketCount = (state: WorkflowStore): number => {
  if (!state.engineState) return 0;
  return Object.values(state.engineState.runtimes).filter(
    (rt) => rt.ticket.state === "open",
  ).length;
};
export const selectClosedTicketsCount = (state: WorkflowStore): number => {
  if (!state.engineState) return 0;
  return Object.values(state.engineState.runtimes).filter(
    (rt) => rt.ticket.state === "closed",
  ).length;
}

export const selectResolvedTicketsCount = (state: WorkflowStore): number => {
  if (!state.engineState) return 0;
  return Object.values(state.engineState.runtimes).filter(
    (rt) => rt.ticket.state === "resolved",
  ).length;
};

export const selectReopenedTicketsCount = (state: WorkflowStore): number => {
  if (!state.engineState) return 0;
  return Object.values(state.engineState.runtimes).filter(
    (rt) => rt.ticket.state === "reopened",
  ).length;
};

export const selectAssignedTicketsCount = (state: WorkflowStore): number => {
  if (!state.engineState) return 0;
  return Object.values(state.engineState.runtimes).filter(
    (rt) => rt.ticket.state === "assigned",
  ).length;
};

export const selectBusyAgentsCount = (state: WorkflowStore): number => {
  if (!state.engineState) return 0;
  return state.engineState.agents.filter((a) => a.status === "busy").length;
};

export const selectAvailableAgentsCount = (state: WorkflowStore): number => {
  if (!state.engineState) return 0;
  return state.engineState.agents.filter((a) => a.status === "available")
    .length;
};

export const selectQueueLoad = memoize(
  (state: WorkflowStore): { name: string; size: number }[] => {
    if (!state.engineState)
      return [
        { name: "L1", size: 0 },
        { name: "L2", size: 0 },
        { name: "L3", size: 0 },
      ];
    const qs = state.engineState.queues;
    return [
      { name: "L1", size: qs.l1.length },
      { name: "L2", size: qs.l2.length },
      { name: "L3", size: qs.l3.length },
    ];
  },
  (state) => [state.engineState?.queues],
);

export const selectSlaBreachesCount = (state: WorkflowStore): number => {
  if (!state.engineState) return 0;
  return Object.values(state.engineState.runtimes).filter(
    (rt) => rt.ticket.sla?.breached === true,
  ).length;
};

export const selectAverageQueueTime = memoize(
  (state: WorkflowStore): number => {
    const events = state.simulationEvents;
    const queueEvents = events.filter((e) => e.type === "ticket.queued");
    const dequeueEvents = events.filter((e) => e.type === "ticket.dequeued");

    if (queueEvents.length === 0 || dequeueEvents.length === 0) return 0;

    let totalTime = 0;
    let count = 0;

    dequeueEvents.forEach((dq) => {
      const qe = queueEvents
        .filter(
          (q) => q.ticketId === dq.ticketId && q.timestamp <= dq.timestamp,
        )
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      if (qe) {
        totalTime += dq.timestamp - qe.timestamp;
        count++;
      }
    });

    return count > 0 ? Number((totalTime / count / 1000).toFixed(2)) : 0;
  },
  (state) => [state.simulationEvents],
);

export interface ThroughputData {
  time: number;
  timeLabel: string;
  created: number;
  resolved: number;
  assigned: number;
  reopened: number;
  closed: number;
}

export const selectThroughput = memoize(
  (state: WorkflowStore): ThroughputData[] => {
    const events = state.simulationEvents;
    if (events.length === 0) return [];

    const startTime = events[0].timestamp;
    const buckets: Record<number, ThroughputData> = {};

    events.forEach((e) => {
      const timeSec = Math.floor((e.timestamp - startTime) / 5000) * 5;
      if (!buckets[timeSec]) {
        buckets[timeSec] = {
          time: timeSec,
          timeLabel: `${timeSec}s`,
          created: 0,
          resolved: 0,
          assigned: 0,
          reopened: 0,
          closed: 0,
        };
      }
      if (e.type === "ticket.created") buckets[timeSec].created++;
      if (e.type === "ticket.resolved" )
        buckets[timeSec].resolved++;
      if (e.type === "ticket.closed") buckets[timeSec].closed++;
      if (e.type === "ticket.reopened") buckets[timeSec].reopened++;
      if (e.type === "ticket.assigned") buckets[timeSec].assigned++;
    });

    return Object.values(buckets).sort((a, b) => a.time - b.time);
  },
  (state) => [state.simulationEvents],
);

export const selectWorkflowHealth = (state: WorkflowStore): number => {
  if (!state.engineState) return 100;

  const slaBreaches = selectSlaBreachesCount(state);
  const queueLoad = selectQueueLoad(state);
  const queueSizes = queueLoad.reduce((acc, q) => acc + q.size, 0);
  const busyAgents = selectBusyAgentsCount(state);
  const availableAgents = selectAvailableAgentsCount(state);

  let penalty = 0;
  penalty += slaBreaches * 20;
  if (queueSizes > 5) {
    penalty += (queueSizes - 5) * 5;
  }
  if (availableAgents === 0 && busyAgents > 0) {
    penalty += 10;
  }

  return Math.max(0, 100 - penalty);
};
