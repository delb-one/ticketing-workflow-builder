"use client";

import { useWorkflowStore } from "@/lib/store";
import { Activity, GripHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { getTicketStateBadgeClass } from "@/lib/colors/color-map";

export function TicketMonitor() {
  const { engineState, nodes } = useWorkflowStore();
  const runtimes = engineState ? Object.values(engineState.runtimes) : [];

  const getNodeLabel = (nodeId: string | null) => {
    if (!nodeId) return "N/A";
    const node = nodes.find((n) => n.id === nodeId);
    return node ? node.data.label : nodeId;
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="h-full pointer-events-auto active:cursor-grabbing w-120 "
    >
      <Card className="w-full panel-drag-handle p-0 bg-card/70 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden">
        <AccordionItem
          value="ticket-monitor"
          className="min-w-0 flex flex-col h-full"
        >
          <div className="flex justify-center bg-secondary/50 shrink-0">
            <GripHorizontal className="w-4 h-4 text-primary/70" />
          </div>

          <AccordionTrigger className="p-4 shrink-0 hover:no-underline">
            <div className="flex gap-2 items-center">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-primary text-sm">
                Ticket Monitor
              </h3>
            </div>
          </AccordionTrigger>

          <AccordionContent className="p-2 min-h-0 flex-1 overflow-hidden">
            <ScrollArea className="w-full">
              <div className="max-h-80 ">
                <table className="min-w-max text-sm text-left">
                <thead className="text-xs text-primary bg-card sticky top-0 z-10">
                  <tr>
                    <th className="px-2 py-2 w-22.5">Ticket ID</th>
                    <th className="px-2 py-2 w-20">State</th>
                    <th className="px-2 py-2 w-35">Current Step</th>
                    <th className="px-2 py-2 w-17.5">Agent</th>
                    <th className="px-2 py-2 w-17.5">Queue</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-card text-primary">
                  {runtimes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-xs">
                        No active tickets
                      </td>
                    </tr>
                  ) : (
                    runtimes.map((rt) => (
                      <tr
                        key={rt.ticket.id}
                        className="hover:bg-card-800/30 transition-colors"
                      >
                        <td className="px-2 py-2 font-mono text-xs truncate">
                          {rt.ticket.id}
                        </td>

                        <td className="px-2 py-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase backdrop-blur-md truncate ${getTicketStateBadgeClass(rt.ticket.state)}`}
                          >
                            {rt.ticket.state}
                          </Badge>
                        </td>

                        <td className="px-2 py-2 text-xs truncate">
                          {rt.completed
                            ? "Completed"
                            : getNodeLabel(rt.currentNodeId)}
                        </td>

                        <td className="px-2 py-2 text-xs truncate">
                          {rt.ticket.assignedAgent ? `${rt.ticket.assignedAgent}` : "-"}
                        </td>

                        <td className="px-2 py-2 text-xs uppercase font-mono truncate">
                          {rt.ticket.queue ?? "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>
      </Card>
    </Accordion>
  );
}
