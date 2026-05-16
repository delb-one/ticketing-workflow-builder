import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  GitBranch,
  Play,
} from "lucide-react";
import type { SimulationEvent } from "@/lib/simulation";
import type { WorkflowStore } from "@/lib/store";

const EMPTY_SIMULATION_EVENTS: SimulationEvent[] = [];

export const selectSimulationEvents = (
  state: WorkflowStore,
): SimulationEvent[] => state.simulationEvents ?? EMPTY_SIMULATION_EVENTS;

export const getSimulationEventIcon = (eventType: SimulationEvent["type"]) => {
  if (eventType === "workflow.started") return Play;
  if (eventType === "decision.required" || eventType === "decision.made") {
    return GitBranch;
  }
  if (eventType === "workflow.completed" || eventType === "ticket.closed") {
    return CheckCircle2;
  }
  if (eventType === "workflow.error") return AlertTriangle;
  if (eventType === "sla.started" || eventType === "sla.breached") return Clock;
  return ArrowRight;
};

export const getSimulationEventText = (event: SimulationEvent): string => {
  if (event.type === "decision.required") {
    return `Decision required at ${event.nodeLabel ?? event.nodeId ?? "unknown node"}`;
  }

  if (event.type === "decision.made") {
    const outcome =
      typeof event.payload?.newState === "string"
        ? event.payload.newState
        : "n/a";
    return `Decision made: ${outcome}`;
  }

  if (event.type === "workflow.error") {
    const message =
      typeof event.payload?.reason === "string"
        ? event.payload.reason
        : "Unknown error";
    return `Error: ${message}`;
  }

  if (event.nodeLabel) return `${event.type} @ ${event.nodeLabel}`;
  return event.type;
};
