"use client";

import { Pause, Terminal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { useLog } from "../../hooks/useLog";

export function LogPanel() {
  const { simulationEvents, bottomRef, getSimulationEventIcon, getSimulationEventText } =
    useLog();

  return (
    <CustomPanel title="Log Panel" value="log-panel" icon={Terminal}>
      <ScrollArea className="w-full">
        <div className="space-y-1.5 font-mono text-sm p-2 max-h-56">
          {simulationEvents.length === 0 ? (
            <div className="flex justify-center items-center gap-2 text-primary">
              <Pause className="h-4 w-4" />
              <span>Idle</span>
            </div>
          ) : (
            simulationEvents.map((event, index) => {
              const EventIcon = getSimulationEventIcon(event.type);
              return (
                <div
                  key={`${event.timestamp}-${event.type}-${index}`}
                  className="flex items-center gap-2 text-primary"
                >
                  <EventIcon className="h-4 w-4 shrink-0 text-primary" />
                  <span>{getSimulationEventText(event)}</span>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </CustomPanel>
  );
}
