import { useEffect, useRef } from "react";
import { useWorkflowStore } from "@/lib/store";
import {
  getSimulationEventIcon,
  getSimulationEventText,
  selectSimulationEvents,
} from "@/features/panels/logic/simulation-selectors";

export function useLog() {
  const simulationEvents = useWorkflowStore(selectSimulationEvents);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [simulationEvents]);

  return {
    simulationEvents,
    bottomRef,
    getSimulationEventIcon,
    getSimulationEventText,
  };
}
