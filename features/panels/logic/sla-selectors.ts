import type { WorkflowStore } from "@/lib/store";
import { memoize } from "./metrics-selectors";

export type SLATicketState = {
  ticketId: string;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: number;
  slaStartTime: number;
  slaDeadline: number;
  elapsedTime: number;
  remainingTime: number;
  totalDuration: number;
  riskPercentage: number;
  status: "ok" | "warning" | "breached";
  completed: boolean;
  completedAt?: number;
  ticketState: string;
};

export type SLAOverview = {
  totalTickets: number;
  ok: number;
  warning: number;
  breached: number;
  breachRate: number;
  avgTimeToBreach: number;
};

// Returns SLA state for all tickets that currently have or had an SLA
export const selectSLATicketStates = memoize(
  (state: WorkflowStore): SLATicketState[] => {
    if (!state.engineState) return [];

    const now = Date.now();
    const config = state.simulationConfig.slaConfig;
    const globalWarningThreshold = config?.warningThreshold ?? 0.75;

    return Object.values(state.engineState.runtimes)
      .filter((rt) => rt.ticket.sla)
      .map((rt) => {
        const ticket = rt.ticket;
        const sla = ticket.sla!;

        const isActuallyCompleted =
          !!sla.completed ||
          rt.completed ||
          ticket.state === "resolved" ||
          ticket.state === "closed";
        const referenceTime = isActuallyCompleted
          ? sla.completedAt || ticket.updatedAt || now
          : now;
        const elapsedTime = referenceTime - sla.startTime;
        const remainingTime = Math.max(0, sla.deadline - referenceTime);
        const totalDuration = sla.deadline - sla.startTime;
        const warningThreshold = sla.warningThreshold ?? globalWarningThreshold;

        let status: "ok" | "warning" | "breached" = "ok";

        if (sla.breached || referenceTime > sla.deadline) {
          status = "breached";
        } else if (elapsedTime >= totalDuration * warningThreshold) {
          status = "warning";
        }

        const riskPercentage = Math.min(
          100,
          (elapsedTime / totalDuration) * 100,
        );

        return {
          ticketId: ticket.id,
          priority: ticket.priority,
          createdAt: ticket.createdAt,
          slaStartTime: sla.startTime,
          slaDeadline: sla.deadline,
          elapsedTime,
          remainingTime,
          totalDuration,
          riskPercentage,
          status,
          completed: isActuallyCompleted,
          completedAt:
            sla.completedAt ||
            (isActuallyCompleted
              ? sla.completedAt || ticket.updatedAt || now
              : undefined),
          ticketState: ticket.state,
        };
      });
  },
  (state) => [state.engineState?.runtimes],
);

// Returns only active tickets with an SLA (not completed and not breached yet)
export const selectActiveSLATickets = memoize(
  (state: WorkflowStore): SLATicketState[] => {
    const allStates = selectSLATicketStates(state);
    return allStates.filter((s: SLATicketState) => !s.completed);
  },
  (state) => [state.engineState?.runtimes],
);

export const selectSLAOverview = memoize(
  (state: WorkflowStore): SLAOverview => {
    const allStates = selectSLATicketStates(state);
    const totalTickets = allStates.length;

    if (totalTickets === 0) {
      return {
        totalTickets: 0,
        ok: 0,
        warning: 0,
        breached: 0,
        breachRate: 0,
        avgTimeToBreach: 0,
      };
    }

    let ok = 0;
    let warning = 0;
    let breached = 0;

    allStates.forEach((s: SLATicketState) => {
      if (s.status === "ok") ok++;
      else if (s.status === "warning") warning++;
      else if (s.status === "breached") breached++;
    });

    const breachRate = (breached / totalTickets) * 100;

    const breachedTickets = allStates.filter(
      (s: SLATicketState) => s.status === "breached",
    );
    const totalBreachTime = breachedTickets.reduce(
      (acc: number, s: SLATicketState) => {
        const breachTime = s.completedAt
          ? s.completedAt - s.slaDeadline
          : Date.now() - s.slaDeadline;
        return acc + Math.max(0, breachTime);
      },
      0,
    );

    const avgTimeToBreach =
      breachedTickets.length > 0 ? totalBreachTime / breachedTickets.length : 0;

    return {
      totalTickets,
      ok,
      warning,
      breached,
      breachRate,
      avgTimeToBreach,
    };
  },
  (state) => [state.engineState?.runtimes],
);

export interface SLATrendData {
  time: number;
  timeLabel: string;
  ok: number;
  warning: number;
  breached: number;
}

export const selectSLATrend = memoize(
  (state: WorkflowStore): SLATrendData[] => {
    // This is a simplified trend that takes snapshots over time based on simulation events
    // Since we don't store historical SLA states at each tick, we reconstruct it from events
    const events = state.simulationEvents;
    if (events.length === 0) return [];

    const sortedEvents = [...events].sort((a, b) => a.timestamp - b.timestamp);
    const startTime = sortedEvents[0].timestamp;
    const lastEventTime = sortedEvents[sortedEvents.length - 1].timestamp;

    const buckets: SLATrendData[] = [];
    const bucketInterval = 5000; // 5 seconds
    const globalWarningThreshold =
      state.simulationConfig.slaConfig?.warningThreshold ?? 0.75;

    // We need to replay SLA states
    const activeSLAs: Record<
      string,
      {
        startTime: number;
        deadline: number;
        warningThreshold: number;
        completed: boolean;
        completedAt?: number;
        breached: boolean;
      }
    > = {};
    let eventIdx = 0;

    for (
      let t = startTime;
      t <= lastEventTime + bucketInterval;
      t += bucketInterval
    ) {
      while (
        eventIdx < sortedEvents.length &&
        sortedEvents[eventIdx].timestamp <= t
      ) {
        const e = sortedEvents[eventIdx];

        if (e.type === "sla.started") {
          // Since we don't have the deadline in the event payload, we infer it from the current runtimes
          // This is a slight approximation for the charts
          const runtime = state.engineState?.runtimes[e.ticketId];
          if (runtime && runtime.ticket.sla) {
            activeSLAs[e.ticketId] = {
              startTime: runtime.ticket.sla.startTime,
              deadline: runtime.ticket.sla.deadline,
              warningThreshold:
                runtime.ticket.sla.warningThreshold ?? globalWarningThreshold,
              completed: false,
              breached: false,
            };
          }
        } else if (e.type === "sla.breached") {
          if (activeSLAs[e.ticketId]) {
            activeSLAs[e.ticketId].breached = true;
          }
        } else if (e.type === "ticket.resolved" || e.type === "ticket.closed") {
          if (activeSLAs[e.ticketId]) {
            activeSLAs[e.ticketId].completed = true;
            activeSLAs[e.ticketId].completedAt = e.timestamp;
          }
        }
        eventIdx++;
      }

      let okCount = 0;
      let warningCount = 0;
      let breachedCount = 0;

      Object.values(activeSLAs).forEach((sla) => {
        const referenceTime =
          sla.completed && sla.completedAt && sla.completedAt <= t
            ? sla.completedAt
            : t;
        const elapsedTime = referenceTime - sla.startTime;
        const totalDuration = sla.deadline - sla.startTime;

        if (sla.breached || referenceTime > sla.deadline) {
          breachedCount++;
        } else if (
          !sla.completed &&
          elapsedTime >= totalDuration * sla.warningThreshold
        ) {
          warningCount++;
        } else {
          okCount++;
        }
      });

      const timeSec = Math.floor((t - startTime) / 1000);
      buckets.push({
        time: timeSec,
        timeLabel: `${timeSec}s`,
        ok: okCount,
        warning: warningCount,
        breached: breachedCount,
      });

      if (eventIdx >= sortedEvents.length && t >= lastEventTime) break;
    }

    return buckets;
  },
  (state) => [state.simulationEvents, state.engineState?.runtimes],
);
