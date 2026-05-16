"use client";

import { Activity, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { getTicketStateBadgeClass } from "@/lib/colors/color-map";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTicketMonitor } from "@/features/panels/hooks/useTicketMonitor";

export function TicketMonitorPanel() {
  const {
    filters,
    setFilters,
    stateOptions,
    priorityOptions,
    impactOptions,
    filteredRuntimes,
    resetFilters,
    getNodeLabel,
  } = useTicketMonitor();

  return (
    <CustomPanel value="ticket-monitor" title="Ticket Monitor" icon={Activity}>
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Select
              value={filters.state}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, state: value }))
              }
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {stateOptions.map((state) => (
                  <SelectItem key={state} value={state}>
                    <span className="capitalize">{state}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.priority}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.impact}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, impact: value }))
              }
            >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All Impacts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impacts</SelectItem>
                {impactOptions.map((impact) => (
                  <SelectItem key={impact} value={impact}>
                    {impact}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="button" size="icon" variant="outline" onClick={resetFilters}>
            <FilterX className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="w-full">
        <div className="max-h-80 ">
          <table className="min-w-max text-sm text-left">
            <thead className="text-xs text-primary bg-card sticky top-0 z-10">
              <tr>
                <th className="px-2 py-2 w-22.5">Ticket ID</th>
                <th className="px-2 py-2 w-20">State</th>
                <th className="px-2 py-2 w-15">Priority</th>
                <th className="px-2 py-2 w-15">Impact</th>
                <th className="px-2 py-2 w-22">Category</th>
                <th className="px-2 py-2 w-35">Current Step</th>
                <th className="px-2 py-2 w-17.5">Agent</th>
                <th className="px-2 py-2 w-17.5">Queue</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-card text-primary">
              {filteredRuntimes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-xs">
                    No active tickets
                  </td>
                </tr>
              ) : (
                filteredRuntimes.map((runtime) => (
                  <tr
                    key={runtime.ticket.id}
                    className="hover:bg-card-800/30 transition-colors"
                  >
                    <td className="px-2 py-2 font-mono text-xs truncate">
                      {runtime.ticket.id}
                    </td>

                    <td className="px-2 py-2">
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase backdrop-blur-md truncate ${getTicketStateBadgeClass(runtime.ticket.state)}`}
                      >
                        {runtime.ticket.state}
                      </Badge>
                    </td>
                    <td className="px-2 py-2 text-xs uppercase">
                      {runtime.ticket.priority}
                    </td>
                    <td className="px-2 py-2 text-xs uppercase">
                      {runtime.ticket.impact}
                    </td>
                    <td className="px-2 py-2 text-xs truncate">
                      {runtime.ticket.category ?? "-"}
                    </td>

                    <td className="px-2 py-2 text-xs truncate">
                      {runtime.completed ? "Completed" : getNodeLabel(runtime.currentNodeId)}
                    </td>

                    <td className="px-2 py-2 text-xs truncate">
                      {runtime.ticket.assignedAgent ? `${runtime.ticket.assignedAgent}` : "-"}
                    </td>

                    <td className="px-2 py-2 text-xs uppercase font-mono truncate">
                      {runtime.ticket.queue != null ? `${runtime.ticket.queue}` : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </CustomPanel>
  );
}
