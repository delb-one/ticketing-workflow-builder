import type { WorkflowStore } from "@/lib/store";

// Simple memoization helper for selectors
export const memoize = <T extends (state: WorkflowStore) => any>(
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
};

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
  open: number;
  resolved: number;
  assigned: number;
  reopened: number;
  closed: number;
}

export const selectThroughput = memoize(
  (state: WorkflowStore): ThroughputData[] => {
    const events = state.simulationEvents;
    if (events.length === 0) return [];

    // Sort events by timestamp to ensure chronological processing
    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
    const startTime = sortedEvents[0].timestamp;
    const lastEventTime = sortedEvents[sortedEvents.length - 1].timestamp;

    const buckets: ThroughputData[] = [];
    const bucketInterval = 5000; // 5 seconds

    // Track the current state of each ticket as we process events
    const ticketStates: Record<string, string> = {};
    let eventIdx = 0;

    // We iterate from startTime to slightly past lastEventTime to capture the final state
    for (
      let t = startTime;
      t <= lastEventTime + bucketInterval;
      t += bucketInterval
    ) {
      // Process all events that occurred up to this point in time
      while (
        eventIdx < sortedEvents.length &&
        sortedEvents[eventIdx].timestamp <= t
      ) {
        const e = sortedEvents[eventIdx];
        let newState = "";

        if (e.type === "ticket.created") newState = "open";
        else if (e.type === "agent.assigned") newState = "assigned";
        else if (e.type === "ticket.resolved") newState = "resolved";
        else if (e.type === "ticket.closed") newState = "closed";
        else if (e.type === "ticket.reopened") newState = "reopened";
        else if (e.type === "ticket.updated" && e.payload?.newState) {
          newState = e.payload.newState as string;
        }

        if (newState) {
          ticketStates[e.ticketId] = newState;
        }
        eventIdx++;
      }

      // Calculate counts of tickets in each of the 5 main states at this point in time
      const counts = {
        open: 0,
        assigned: 0,
        resolved: 0,
        reopened: 0,
        closed: 0,
      };
      Object.values(ticketStates).forEach((s) => {
        if (s in counts) {
          counts[s as keyof typeof counts]++;
        }
      });

      const timeSec = Math.floor((t - startTime) / 1000);
      buckets.push({
        time: timeSec,
        timeLabel: `${timeSec}s`,
        ...counts,
      });

      // If we've processed all events and reached the end of the timeline, we can stop
      if (eventIdx >= sortedEvents.length && t >= lastEventTime) break;
    }

    return buckets;
  },
  (state) => [state.simulationEvents],
);

export const selectWorkflowHealth = (state: WorkflowStore): number => {
  if (!state.engineState) return 100;

  const slaBreaches = selectSlaBreachesCount(state);
  const queueLoad = selectQueueLoad(state);
  const queueSizes = queueLoad.reduce(
    (acc: number, q: { size: number }) => acc + q.size,
    0,
  );
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
