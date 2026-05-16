import { useWorkflowStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";
import {
  selectSLATicketStates,
  selectActiveSLATickets,
  selectSLAOverview,
  selectSLATrend,
} from "@/features/panels/logic/sla-selectors";

export function useSLA() {
  return useWorkflowStore(
    useShallow((state) => ({
      allSLATickets: selectSLATicketStates(state),
      activeSLATickets: selectActiveSLATickets(state),
      overview: selectSLAOverview(state),
      trend: selectSLATrend(state),
    }))
  );
}
