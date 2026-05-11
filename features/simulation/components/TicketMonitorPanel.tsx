"use client";

import { useMemo, useState } from "react";
import { useWorkflowStore } from "@/lib/store";
import { Activity, FilterX, Undo } from "lucide-react";
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

export function TicketMonitorPanel() {
  const { engineState, nodes } = useWorkflowStore();
  const runtimes = engineState ? Object.values(engineState.runtimes) : [];
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [impactFilter, setImpactFilter] = useState<string>("all");

  const getNodeLabel = (nodeId: string | null) => {
    if (!nodeId) return "N/A";
    const node = nodes.find((n) => n.id === nodeId);
    return node ? node.data.label : nodeId;
  };
  const priorityOptions = useMemo(
    () =>
      Array.from(
        new Set(
          runtimes
            .map((rt) => rt.ticket.priority)
            .filter((priority) => Boolean(priority)),
        ),
      ),
    [runtimes],
  );

  const impactOptions = useMemo(
    () =>
      Array.from(
        new Set(
          runtimes
            .map((rt) => rt.ticket.impact)
            .filter((impact) => Boolean(impact)),
        ),
      ),
    [runtimes],
  );

  const stateOptions = useMemo(
    () =>
      Array.from(
        new Set(
          runtimes
            .map((rt) => rt.ticket.state)
            .filter((state) => Boolean(state)),
        ),
      ),
    [runtimes],
  );

  const filteredRuntimes = useMemo(
    () =>
      runtimes.filter((rt) => {
        const matchesState =
          stateFilter === "all" || rt.ticket.state === stateFilter;
        const matchesPriority =
          priorityFilter === "all" || rt.ticket.priority === priorityFilter;
        const matchesImpact =
          impactFilter === "all" || rt.ticket.impact === impactFilter;

        return matchesState && matchesPriority && matchesImpact;
      }),
    [runtimes, stateFilter, priorityFilter, impactFilter],
  );

  return (
    <CustomPanel value="ticket-monitor" title="Ticket Monitor" icon={Activity}>
      <div className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Select value={stateFilter} onValueChange={setStateFilter} >
              <SelectTrigger className="text-xs">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {stateOptions.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
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
            <Select value={impactFilter} onValueChange={setImpactFilter}>
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
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => {
              setStateFilter("all");
              setPriorityFilter("all");
              setImpactFilter("all");
            }}
          >
            <FilterX className="h-4 w-4" />{" "}
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
                filteredRuntimes.map((rt) => (
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
                    <td className="px-2 py-2 text-xs uppercase">
                      {rt.ticket.priority}
                    </td>
                    <td className="px-2 py-2 text-xs uppercase">
                      {rt.ticket.impact}
                    </td>
                    <td className="px-2 py-2 text-xs truncate">
                      {rt.ticket.category ?? "-"}
                    </td>

                    <td className="px-2 py-2 text-xs truncate">
                      {rt.completed
                        ? "Completed"
                        : getNodeLabel(rt.currentNodeId)}
                    </td>

                    <td className="px-2 py-2 text-xs truncate">
                      {rt.ticket.assignedAgent
                        ? `${rt.ticket.assignedAgent}`
                        : "-"}
                    </td>

                    <td className="px-2 py-2 text-xs uppercase font-mono truncate">
                      {rt.ticket.queue != null ? `${rt.ticket.queue}` : "-"}
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
