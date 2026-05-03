"use client";

import { useWorkflowStore } from "@/lib/store";
import { ListFilter, GripHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export function QueuePanel() {
  const { engineState } = useWorkflowStore();
  const queues = engineState?.queues ?? { l1: [], l2: [], l3: [] };

  const totalWaiting = queues.l1.length + queues.l2.length + queues.l3.length;

  return (
    <Accordion
      type="single"
      className=" h-full pointer-events-auto  active:cursor-grabbing"
      collapsible
    >
      <Card className="w-50 panel-drag-handle p-0 bg-card/70 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden">
        <AccordionItem value="queues" className=" flex flex-col h-full">
          <div className="flex justify-center bg-secondary/50">
            <GripHorizontal className="w-4 h-4 text-primary/70" />
          </div>
          <AccordionTrigger
            value="queues"
            className="p-4  shrink-0 hover:no-underline"
          >
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-primary text-sm">Queues</h3>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 h-5 px-1.5 text-[10px] font-bold min-w-[20px] flex items-center justify-center rounded-full"
              >
                {totalWaiting}
              </Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-2">
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
                          className="text-[10px] font-mono  bg-card-700/50  text-primary-300 truncate"
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
      </Card>
    </Accordion>
  );
}
