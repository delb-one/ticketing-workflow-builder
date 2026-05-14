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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTicketStateColor } from "@/lib/colors/color-map";

export function MetricsPanel() {
  const metrics = useMetrics();

  return (
    <CustomPanel
      value="metrics-panel"
      title="Metrics & Health"
      icon={Activity}
      badge={
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 h-5 px-1.5 text-[10px] font-bold min-w-5 flex items-center justify-center rounded-full"
        >
          {metrics.workflowHealth}%
        </Badge>
      }
    >
      <ScrollArea className="w-full pr-2">
        <div className="space-y-4 pt-1 max-h-96">
          {/* KPI Overview */}
          <div className="grid grid-cols-2 gap-2">
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
                className={`text-xl font-bold ${metrics.slaBreachesCount > 0 ? "text-red-400" : "text-emerald-400"}`}
              >
                {metrics.slaBreachesCount}
              </div>
            </div>
            <div className="flex flex-col p-3 rounded-lg bg-card-800/60 border border-card-700/60 backdrop-blur-md col-span-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Avg Queue Time</span>
              </div>
              <div className="text-xl font-bold text-primary-300">
                {metrics.averageQueueTime}s
              </div>
            </div>
          </div>

          {/* Workflow Health */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-primary-300 uppercase">
              Workflow Health
            </div>
            <div className="h-3 w-full bg-card-800/60 rounded-full overflow-hidden border border-card-700/60">
              <div
                className={`h-full ${metrics.workflowHealth > 80 ? "bg-emerald-500" : metrics.workflowHealth > 50 ? "bg-amber-500" : "bg-red-500"} transition-all duration-500`}
                style={{ width: `${metrics.workflowHealth}%` }}
              />
            </div>
          </div>

          {/* Queue Saturation */}
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
                    className={`text-lg font-bold ${q.size > 5 ? "text-amber-500" : "text-primary-300"}`}
                  >
                    {q.size}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Throughput Chart */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-primary-300 uppercase">
              Ticket Status Volume
            </div>
            <div className="h-40 w-full rounded-lg bg-card-800/60 border border-card-700/60 p-2 text-xs">
              {metrics.throughput.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={metrics.throughput}
                    margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
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
                      itemStyle={{ padding: 0 }}
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
          </div>
        </div>
      </ScrollArea>
    </CustomPanel>
  );
}
