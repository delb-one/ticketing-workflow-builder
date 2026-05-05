"use client";

import { useWorkflowStore } from "@/lib/store";
import { ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { CustomPanel } from "@/components/molecules/CustomPanel";

export function QueuePanel() {
  const { engineState } = useWorkflowStore();
  const queues = engineState?.queues ?? { l1: [], l2: [], l3: [] };

  const totalWaiting = queues.l1.length + queues.l2.length + queues.l3.length;

  return (
    <CustomPanel
      value="queues"
      title="Queues"
      icon={ListFilter}
      badge={
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 h-5 px-1.5 text-[10px] font-bold min-w-[20px] flex items-center justify-center rounded-full"
        >
          {totalWaiting}
        </Badge>
      }
    >
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
    </CustomPanel>
  );
}
