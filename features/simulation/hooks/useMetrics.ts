import { useWorkflowStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import {
  selectActiveTicketsCount,
  selectResolvedTicketsCount,
  selectBusyAgentsCount,
  selectAvailableAgentsCount,
  selectQueueLoad,
  selectAverageQueueTime,
  selectThroughput,
  selectWorkflowHealth,
  selectSlaBreachesCount,
  selectReopenedTicketsCount,
  selectAssignedTicketsCount,
  selectClosedTicketsCount
} from "@/lib/metrics-selectors";

export function useMetrics() {
  return useWorkflowStore(useShallow((state) => ({
    activeTicketsCount: selectActiveTicketsCount(state),
    resolvedTicketsCount: selectResolvedTicketsCount(state),
    reopenedTicketCount: selectReopenedTicketsCount(state),
    assignedTicketCount: selectAssignedTicketsCount(state),
    closedTicketsCount: selectClosedTicketsCount(state),
    busyAgentsCount: selectBusyAgentsCount(state),
    availableAgentsCount: selectAvailableAgentsCount(state),
    queueLoad: selectQueueLoad(state),
    averageQueueTime: selectAverageQueueTime(state),
    throughput: selectThroughput(state),
    workflowHealth: selectWorkflowHealth(state),
    slaBreachesCount: selectSlaBreachesCount(state),
  })));
}
