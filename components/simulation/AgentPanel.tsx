"use client";

import { useWorkflowStore } from "@/lib/store";
import { Users, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export function AgentPanel() {
  const { engineState } = useWorkflowStore();
  const agents = engineState?.agents ?? [];

  return (
    <Accordion type="single" collapsible>
      <div className="bg-card rounded-xl p-4 border border-card-800 flex flex-col h-full overflow-hidden">
        <AccordionItem value="agent-pool" className="border-0">
          <AccordionTrigger className="py-0 mb-4 hover:no-underline">
            <div className="flex gap-2 items-center">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-primary text-sm">Agent Pool</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="overflow-y-auto space-y-2 flex-1 pr-1 custom-scrollbar">
              {agents.length === 0 ? (
                <div className="text-xs text-primary-500 text-center py-4">
                  No agents active
                </div>
              ) : (
                agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex flex-col p-3 rounded-lg bg-card-800 border border-card-700/50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-primary-300">
                        {agent.level.toUpperCase()} Agent
                      </span>
                      <Badge
                        variant={
                          agent.status === "available" ? "secondary" : "default"
                        }
                        className={
                          agent.status === "available"
                            ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20"
                        }
                      >
                        {agent.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-primary-400">
                      <Briefcase className="w-3 h-3" />
                      <span className="truncate">
                        {agent.currentTicketId
                          ? agent.currentTicketId.replace("ticket-", "")
                          : "Idle"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </div>
    </Accordion>
  );
}
