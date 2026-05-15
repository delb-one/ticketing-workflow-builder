"use client";

import { useMetrics } from "../hooks/useMetrics";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getTicketStateColor,
  TICKET_STATE_COLOR_MAP,
} from "@/lib/colors/color-map";
import { Ticket } from "@/lib/simulation/types";

export function MetricsPanel() {
  const metrics = useMetrics();

  return (
    <CustomPanel
      value="metrics-panel"
      title="Metrics & Health"
      icon={BarChart3}
      badge={
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 h-5 px-1.5 text-[10px] font-bold min-w-5 flex items-center justify-center rounded-full"
        >
          {metrics.workflowHealth}%
        </Badge>
      }
    >
      <div className="space-y-4 pt-1">
        {/* TOP SECTION */}
        <div className="grid grid-cols-3 gap-4">
          {/* KPI Overview */}
          <div className="col-span-2 grid grid-cols-2 gap-2">
            <div className="flex flex-col p-3 rounded-lg bg-card-800/60 border border-card-700/60 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Active Tickets</span>
              </div>
              <div className="text-xl font-bold text-primary-300">
                {metrics.activeTicketsCount}
              </div>
            </div>

            <div className="flex flex-col p-3 rounded-lg bg-card-800/60 border border-card-700/60 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Resolved</span>
              </div>
              <div className="text-xl font-bold text-emerald-400">
                {metrics.resolvedTicketsCount}
              </div>
            </div>

            <div className="flex flex-col p-3 rounded-lg bg-card-800/60 border border-card-700/60 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Agents</span>
              </div>

              <div className="text-sm font-bold text-primary-400 flex items-baseline gap-1">
                <span className="text-xl text-amber-500">
                  {metrics.busyAgentsCount}
                </span>{" "}
                busy / {metrics.availableAgentsCount} free
              </div>
            </div>

            <div className="flex flex-col p-3 rounded-lg bg-card-800/60 border border-card-700/60 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>SLA Breaches</span>
              </div>
              <div
                className={`text-xl font-bold ${
                  metrics.slaBreachesCount > 0
                    ? "text-red-400"
                    : "text-emerald-400"
                }`}
              >
                {metrics.slaBreachesCount}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE STACK */}
          <div className="flex flex-col gap-4 justify-around">
            {/* Workflow Health */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-primary-300 uppercase">
                Workflow Health
              </div>

              <div className="h-3 w-full bg-card-800/60 rounded-full overflow-hidden border border-card-700/60">
                <div
                  className={`h-full ${
                    metrics.workflowHealth > 80
                      ? "bg-emerald-500"
                      : metrics.workflowHealth > 50
                        ? "bg-amber-500"
                        : "bg-red-500"
                  } transition-all duration-500`}
                  style={{ width: `${metrics.workflowHealth}%` }}
                />
              </div>
            </div>

            {/* Queue Load */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-primary-300 uppercase">
                Queue Load
              </div>

              <div className="grid grid-cols-3 gap-2">
                {metrics.queueLoad.map((q) => (
                  <div
                    key={q.name}
                    className="flex flex-col items-center p-2 rounded-lg bg-card-800/60 border border-card-700/60"
                  >
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {q.name}
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        q.size > 5 ? "text-amber-500" : "text-primary-300"
                      }`}
                    >
                      {q.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CHART SECTION  */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-primary-300 uppercase">
            Ticket Status Volume
          </div>

          

          <div className="h-80 w-full rounded-lg bg-card-800/60 border border-card-700/60 p-3">
            {metrics.throughput.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={metrics.throughput}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="timeLabel"
                    stroke="#666"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#666"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e1e",
                      borderColor: "#333",
                      fontSize: "12px",
                      color: "#ccc",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="open"
                    stroke={getTicketStateColor("open")}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="closed"
                    stroke={getTicketStateColor("closed")}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="assigned"
                    stroke={getTicketStateColor("assigned")}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="reopened"
                    stroke={getTicketStateColor("reopened")}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke={getTicketStateColor("resolved")}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                No data yet
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
            {(Object.keys(TICKET_STATE_COLOR_MAP) as Ticket["state"][]).map(
              (state) => (
                <div key={state} className="flex items-center gap-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getTicketStateColor(state) }}
                  />
                  <span className="capitalize">{state}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </CustomPanel>
  );
}
