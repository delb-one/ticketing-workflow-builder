"use client";

import { useWorkflowStore } from "@/lib/store";
import type { SimulationEvent } from "@/lib/simulation";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  GitBranch,
  Pause,
  Play,
  Terminal,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { CustomPanel } from "@/components/molecules/CustomPanel";

const getEventIcon = (eventType: SimulationEvent["type"]) => {
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

const getEventText = (event: SimulationEvent): string => {
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

export function SimulationPanel() {
  const { simulationEvents } = useWorkflowStore();

  return (
    <CustomPanel title="Log Panel" value="log-panel" icon={Terminal}>
      <ScrollArea className="w-full ">
        <div className="max-h-54">
          <div className="space-y-1.5 font-mono text-sm">
            {simulationEvents.length === 0 ? (
              <div className="flex items-center gap-2 text-primary">
                <Pause className="h-4 w-4" />
                <span>Idle</span>
              </div>
            ) : (
              simulationEvents.map((event, index) => {
                const EventIcon = getEventIcon(event.type);
                return (
                  <div
                    key={`${event.timestamp}-${event.type}-${index}`}
                    className="flex items-center gap-2 text-primary"
                  >
                    <EventIcon className="h-4 w-4 shrink-0 text-primary" />
                    <span>{getEventText(event)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </ScrollArea>
    </CustomPanel>
  );
}
