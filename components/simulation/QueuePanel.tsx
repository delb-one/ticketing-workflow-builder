"use client";

import { useWorkflowStore } from "@/lib/store";
import { ChevronsUpDown, ListFilter } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";

export function QueuePanel() {
  const { engineState } = useWorkflowStore();
  const queues = engineState?.queues ?? { l1: [], l2: [], l3: [] };

  const totalWaiting = queues.l1.length + queues.l2.length + queues.l3.length;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-card rounded-xl p-4 border border-card-800 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-primary text-sm">Queues</h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-mono bg-card-800 px-2 py-0.5 rounded text-primary border border-card-700">
              Total: {totalWaiting}
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <ChevronsUpDown />
                <span className="sr-only">Toggle details</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>

        <CollapsibleContent>
          <div className="flex-1 grid grid-cols-3 gap-2 overflow-hidden">
            {(["l1", "l2", "l3"] as const).map((level) => (
              <div
                key={level}
                className="flex flex-col bg-card rounded-lg border border-card-700/50 p-2 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {level}
                  </span>
                  <span className="text-xs font-mono font-medium text-primary">
                    {queues[level].length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1">
                  <AnimatePresence>
                    {queues[level].map((ticketId) => (
                      <motion.div
                        key={ticketId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="text-[10px] font-mono p-1.5 rounded bg-card-700/50 border border-card-600/30 text-primary-300 truncate"
                      >
                        {ticketId.replace("ticket-", "")}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
