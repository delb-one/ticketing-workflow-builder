"use client";

import { useWorkflowStore } from "@/lib/store";
import { ListFilter, GripHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function QueuePanel() {
  const { engineState } = useWorkflowStore();
  const queues = engineState?.queues ?? { l1: [], l2: [], l3: [] };

  const totalWaiting = queues.l1.length + queues.l2.length + queues.l3.length;

  return (
    <Accordion type="single" className="w-full pointer-events-auto panel-drag-handle active:cursor-grabbing" collapsible>
      <div className="bg-card/70 rounded-xl p-4 border border-card-800/80 backdrop-blur-md flex flex-col h-full overflow-hidden">
        <div className="flex justify-center pb-2 mb-1">
          <GripHorizontal className="w-4 h-4 text-muted-foreground/40" />
        </div>
        <AccordionItem value="queues" className="border-0">
          <AccordionTrigger className="py-0 mb-4 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-2">
              <div className="flex items-center gap-2">
                <ListFilter className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-primary text-sm">Queues</h3>
              </div>


            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-0">
            <div className="w-fit text-xs mb-2 font-mono bg-card-800/60 px-2 py-0.5  text-primary  backdrop-blur-md">
              Total: {totalWaiting}
            </div>
            <div className="flex-1 grid grid-cols-3 gap-2 overflow-hidden">
              {(["l1", "l2", "l3"] as const).map((level) => (
                <div
                  key={level}
                  className="flex flex-col bg-card/60 rounded-lg border border-card-700/60 p-2 overflow-hidden backdrop-blur-md"
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
                          {ticketId}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </div>
    </Accordion>
  );
}
