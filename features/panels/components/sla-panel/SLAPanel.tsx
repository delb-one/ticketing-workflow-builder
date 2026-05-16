"use client";

import { useState, useEffect } from "react";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  ArrowUpDown,
} from "lucide-react";
import { useSLA } from "../../hooks/useSLA";
import { SLATicketState } from "../../logic/sla-selectors";

export function SLAPanel() {
  const { overview, allSLATickets } = useSLA();

  const [sortBy, setSortBy] = useState<"time" | "urgency">("urgency");

  // Force re-render every second to update timers
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Priority score mapping for sorting
  const PRIORITY_SCORE: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const now = Date.now();

  // Keep timers live in the UI, but preserve SLA status computed by selectors/store.
  const liveTickets = allSLATickets.map((ticket: SLATicketState) => {
    if (ticket.completed) return ticket;

    const elapsedTime = now - ticket.slaStartTime;
    const remainingTime = Math.max(0, ticket.slaDeadline - now);
    const riskPercentage = Math.min(
      100,
      (elapsedTime / ticket.totalDuration) * 100,
    );

    return {
      ...ticket,
      elapsedTime,
      remainingTime,
      riskPercentage,
    };
  });

  // Sort tickets
  const sortedTickets = [...liveTickets].sort((a, b) => {
    // If one is completed and other is not, show active first?
    // Or just rely on urgency. User wants to see them in the list.
    if (!a.completed && b.completed) return -1;
    if (a.completed && !b.completed) return 1;

    // Breached tickets ALWAYS come first among active or completed
    if (a.status === "breached" && b.status !== "breached") return -1;
    if (a.status !== "breached" && b.status === "breached") return 1;

    if (sortBy === "urgency") {
      const scoreA = (PRIORITY_SCORE[a.priority] || 0) * 100 + a.riskPercentage;
      const scoreB = (PRIORITY_SCORE[b.priority] || 0) * 100 + b.riskPercentage;
      return scoreB - scoreA; // highest urgency first
    }

    // Default to remaining time ascending
    return a.remainingTime - b.remainingTime;
  });

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(Math.abs(ms) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <CustomPanel value="sla-panel" title="SLA Monitor" icon={ShieldAlert}>
      <div className="flex h-full flex-col gap-4 p-4 min-w-85">
        <div className="grid grid-cols-3 gap-2 shrink-0">
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
            <CheckCircle2 className="mb-1 h-5 w-5 text-emerald-500" />
            <div className="text-2xl font-bold">{overview.ok}</div>
            <div className="text-[10px] uppercase text-muted-foreground">
              Healthy
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
            <AlertTriangle className="mb-1 h-5 w-5 text-amber-500" />
            <div className="text-2xl font-bold">{overview.warning}</div>
            <div className="text-[10px] uppercase text-muted-foreground">
              Warning
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-3 text-card-foreground shadow-sm">
            <XCircle className="mb-1 h-5 w-5 text-red-500" />
            <div className="text-2xl font-bold">{overview.breached}</div>
            <div className="text-[10px] uppercase text-muted-foreground">
              Breached
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          <div className="flex items-center justify-between px-1 shrink-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Active Risk List</h3>
              <button
                onClick={() =>
                  setSortBy((prev) => (prev === "time" ? "urgency" : "time"))
                }
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors bg-muted px-2 py-0.5 rounded-full"
              >
                <ArrowUpDown className="w-3 h-3" />
                Sort: {sortBy === "urgency" ? "Urgency" : "Time"}
              </button>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Total: {allSLATickets.length}</span>
            </div>
          </div>

          <ScrollArea className="p-2">
            {sortedTickets.length === 0 ? (
              <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground ">
                No SLA records available
              </div>
            ) : (
              <div className="space-y-2 max-h-100">
                {sortedTickets.map((ticket) => {
                  const isBreached = ticket.status === "breached";
                  const isWarning = ticket.status === "warning";
                  const totalDuration = ticket.totalDuration;
                  const excessTime = ticket.elapsedTime - totalDuration;

                  return (
                    <div
                      key={ticket.ticketId}
                      className={`flex flex-col gap-1 rounded-lg border p-3 text-sm ${
                        ticket.completed
                          ? "bg-muted/30 border-muted opacity-80"
                          : isBreached
                            ? "border-red-500/50 bg-red-500/10"
                            : isWarning
                              ? "border-amber-500/50 bg-amber-500/10"
                              : "bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {ticket.ticketId}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground font-mono uppercase">
                            {ticket.ticketState}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            isBreached
                              ? "bg-red-500/20 text-red-500"
                              : isWarning
                                ? "bg-amber-500/20 text-amber-500"
                                : "bg-emerald-500/20 text-emerald-500"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-col gap-1.5">
                        <Progress
                          value={ticket.riskPercentage}
                          className="h-1.5"
                          indicatorColor={
                            isBreached
                              ? "bg-red-500"
                              : isWarning
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                          }
                        />
                        <div className="flex justify-between items-center text-[10px] uppercase">
                          <span className="text-muted-foreground">
                            Pri:{" "}
                            <span className="font-bold text-foreground">
                              {ticket.priority}
                            </span>
                          </span>
                          <span
                            className={
                              isBreached
                                ? "text-red-500 font-medium"
                                : "text-muted-foreground font-medium"
                            }
                          >
                            {ticket.completed
                              ? "Resolved in: "
                              : isBreached
                                ? "Exceeded by "
                                : "Left: "}
                            <span className="font-mono">
                              {formatTime(
                                ticket.completed
                                  ? ticket.elapsedTime
                                  : isBreached
                                    ? excessTime
                                    : ticket.remainingTime,
                              )}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </CustomPanel>
  );
}
