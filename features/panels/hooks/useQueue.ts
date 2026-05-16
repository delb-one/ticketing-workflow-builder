import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useWorkflowStore } from "@/lib/store";
import {
  QUEUE_LEVELS,
  selectQueues,
  selectTotalWaiting,
} from "@/features/panels/logic/queue-selectors";

export function useQueue() {
  const { queues } = useWorkflowStore(
    useShallow((state) => ({
      queues: selectQueues(state),
    })),
  );

  const totalWaiting = useMemo(() => selectTotalWaiting(queues), [queues]);

  return {
    queues,
    totalWaiting,
    levels: QUEUE_LEVELS,
  };
}
