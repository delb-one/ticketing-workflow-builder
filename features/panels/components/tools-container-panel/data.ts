import {
  Sparkles,
  Users,
  Tickets,
  ListFilter,
  Terminal,
  BarChart3,
  ShieldAlert,
  Gauge,
  Radar,
  Workflow,
  BrainCircuit,
  Bell,
  GitBranch,
  ScanSearch,
  Activity,
  Network
} from "lucide-react";
import { SimulationTool } from "./types";

export const tools: SimulationTool[] = [
  {
    id: "getting-started-panel",
    name: "Getting Started",
    description: "Quick guide to start building workflows",
    icon: Sparkles,
  },

  {
    id: "agent-panel",
    name: "Agent Panel",
    description: "Define and manage agent groups (L1, L2, L3)",
    icon: Users,
  },

  {
    id: "ticket-panel",
    name: "Ticket Panel",
    description: "Generate tickets and control incoming flow",
    icon: Tickets,
  },

  {
    id: "queue-panel",
    name: "Queue Panel",
    description: "Inspect queue status and workload distribution",
    icon: ListFilter,
  },

  {
    id: "activity-panel",
    name: "Activity Panel",
    description: "Track ticket activity and status changes over time",
    icon: Activity,
  },

  {
    id: "log-panel",
    name: "Log Panel",
    description: "View the event log",
    icon: Terminal,
  },

  {
    id: "metrics-panel",
    name: "Metrics Panel",
    description: "Monitor real-time simulation metrics",
    icon: BarChart3,
  },

  {
    id: "sla-panel",
    name: "SLA Monitor",
    description: "Track SLA compliance and violations",
    icon: ShieldAlert,
  },

  {
    id: "performance-panel",
    name: "Performance",
    description: "Inspect throughput and processing performance",
    icon: Gauge,
    status: "coming-soon",
  },

  {
    id: "heatmap-panel",
    name: "Heatmap",
    description: "Visualize node congestion and activity",
    icon: Radar,
    status: "coming-soon",
  },

  {
    id: "validation-panel",
    name: "Flow Validation",
    description: "Detect invalid states and graph issues",
    icon: Workflow,
    status: "coming-soon",
  },

  {
    id: "ai-panel",
    name: "AI Suggestions",
    description: "Receive workflow optimization suggestions",
    icon: BrainCircuit,
    status: "coming-soon",
  },
  {
    id: "notification-panel",
    name: "Notifications",
    description: "View alerts and simulation warnings",
    icon: Bell,
    status: "coming-soon",
  },

  {
    id: "dependency-panel",
    name: "Dependencies",
    description: "Inspect workflow relationships and dependencies",
    icon: GitBranch,
    status: "coming-soon",
  },

  {
    id: "network-panel",
    name: "Network",
    description: "Inspect workflow communication graph",
    icon: Network,
    status: "coming-soon",
  },

  {
    id: "search-panel",
    name: "Search",
    description: "Search nodes, tickets and events",
    icon: ScanSearch,
    status: "coming-soon",
  },
];
