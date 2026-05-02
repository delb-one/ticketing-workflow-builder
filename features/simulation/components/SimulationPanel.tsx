"use client";

import { useWorkflowStore } from "@/lib/store";
import type { SimulationEvent } from "@/lib/simulation";
import { motion, AnimatePresence } from "framer-motion";
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
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export default function SimulationPanel() {
  const { simulationEvents } = useWorkflowStore();

  return (
    <Accordion type="single" collapsible>
      <Card className="flex flex-col overflow-hidden bg-card-900 border-card-800 text-primary p-0 gap-0">
        <AccordionItem value="simulation-log" className="border-0">
          <AccordionTrigger className="p-4 border-b border-card-800 shrink-0 hover:no-underline">
            <div className="flex gap-2 items-center">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm">Simulation Log</h3>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="h-64">
              <ScrollArea className="h-full p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="space-y-1.5 font-mono text-sm">
                  <AnimatePresence>
                    {simulationEvents.map((event, index) => {
                      const EventIcon = getEventIcon(event.type);
                      return (
                        <motion.div
                          key={`${event.timestamp}-${event.type}-${index}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2 text-primary"
                        >
                          <EventIcon className="h-4 w-4 shrink-0 text-primary" />
                          <span>{getEventText(event)}</span>
                        </motion.div>
                      );
                    })}

                    {simulationEvents.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-primary"
                      >
                        <Pause className="h-4 w-4" />
                        <span>Idle</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Card>
    </Accordion>
  );
}
