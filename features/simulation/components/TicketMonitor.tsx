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

export function TicketMonitor() {
  const { engineState, nodes } = useWorkflowStore();
  const runtimes = engineState ? Object.values(engineState.runtimes) : [];

  const getNodeLabel = (nodeId: string | null) => {
    if (!nodeId) return "N/A";
    const node = nodes.find((n) => n.id === nodeId);
    return node ? node.data.label : nodeId;
  };

  return (
    <Accordion type="single" className="w-full pointer-events-auto panel-drag-handle active:cursor-grabbing" collapsible>
      <div className="bg-card/70 rounded-xl p-4 border border-card-800/80 backdrop-blur-md flex flex-col h-full overflow-hidden">
        <div className=" flex justify-center pb-2  mb-1">
          <GripHorizontal className="w-4 h-4 text-muted-foreground/40" />
        </div>
        <AccordionItem value="ticket-monitor" className="border-0">
          <AccordionTrigger className="py-0 mb-4 hover:no-underline">
            <div className="flex gap-2 items-center">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-primary text-sm">Ticket Monitor</h3>
            </div>
          </AccordionTrigger>

          <AccordionContent className="flex-1 overflow-hidden pb-0">
            <ScrollArea className="h-[250px] w-[800px] max-w-full">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-primary bg-card sticky top-0 z-10 ">
                  <tr>
                    <th className="px-4 py-2 font-bold">Ticket ID</th>
                    <th className="px-4 py-2 font-bold">State</th>
                    <th className="px-4 py-2 font-bold">Current Step</th>
                    <th className="px-4 py-2 font-bold">Agent</th>
                    <th className="px-4 py-2 font-bold">Queue</th>
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
                        <td className="px-4 py-2.5 font-mono text-xs">
                          {rt.ticket.id}
                        </td>

                        <td className="px-4 py-2.5">
                          <Badge
                            variant="outline"
                            className="bg-card-800/60 text-[10px] uppercase border-card-700/80 backdrop-blur-md"
                          >
                            {rt.ticket.state}
                          </Badge>
                        </td>

                        <td className="px-4 py-2.5 text-xs truncate max-w-37.5">
                          {rt.completed ? "Completed" : getNodeLabel(rt.currentNodeId)}
                        </td>

                        <td className="px-4 py-2.5 text-xs">
                          {rt.ticket.assignedAgent ? "Assigned" : "-"}
                        </td>

                        <td className="px-4 py-2.5 text-xs uppercase font-mono">
                          {rt.ticket.queue ?? "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

      </div>
    </Accordion>
  );
}
