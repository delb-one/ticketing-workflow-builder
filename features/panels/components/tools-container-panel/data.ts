import {
  Sparkles,
  Users,
  Tickets,
  ListFilter,
  Terminal,
  BarChart3,
  ShieldAlert,
  Workflow,
  BrainCircuit,
  ScanSearch,
  Activity,
  Network,
  X,
} from "lucide-react";
import { SimulationTool } from "./types";

export const tools: SimulationTool[] = [
  {
    id: "getting-started-panel",
    name: "Getting Started",
    description: "Quick guide to start building workflows",
    icon: Sparkles,
    shortcut: "G",
  },

  {
    id: "agent-panel",
    name: "Agent Panel",
    description: "Define and manage agent groups (L1, L2, L3)",
    icon: Users,
    badgeKey: "agents",
    category: "core",
    shortcut: "A",
  },

  {
    id: "ticket-panel",
    name: "Ticket Panel",
    description: "Generate tickets and control incoming flow",
    icon: Tickets,
    badgeKey: "tickets",
    category: "core",
    shortcut: "T",
  },

  {
    id: "queue-panel",
    name: "Queue Panel",
    description: "Inspect queue status and workload distribution",
    icon: ListFilter,
    badgeKey: "queue",
    category: "monitoring",
    shortcut: "Q",
  },

  {
    id: "activity-panel",
    name: "Activity Panel",
    description: "Track ticket activity and status changes over time",
    icon: Activity,
    category: "monitoring",
    shortcut: "Y",
  },

  {
    id: "log-panel",
    name: "Log Panel",
    description: "View the event log",
    icon: Terminal,
    category: "monitoring",
    shortcut: "L",
  },

  {
    id: "metrics-panel",
    name: "Metrics Panel",
    description: "Monitor real-time simulation metrics",
    icon: BarChart3,
    category: "monitoring",
    shortcut: "M",
  },

  {
    id: "sla-panel",
    name: "SLA Monitor",
    description: "Track SLA compliance and violations",
    icon: ShieldAlert,
    category: "monitoring",
    shortcut: "S",
  },
  {
    id: "validation-panel",
    name: "Flow Validation",
    description: "Detect invalid states and graph issues",
    icon: Workflow,
    category: "traversal",
    badgeKey: "validation",
    shortcut: "V",
  },
  {
    id: "network-panel",
    name: "Network",
    description: "Inspect workflow communication graph",
    icon: Network,
    category: "traversal",
    shortcut: "N",
  },
  {
    id: "search-panel",
    name: "Search",
    description: "Search nodes, tickets and events",
    icon: ScanSearch,
    category: "traversal",
    shortcut: "K",
  },
  // {
  //   id: "insights-panel",
  //   name: "Insights",
  //   description: "Workflow intelligence and optimization insights",
  //   icon: BrainCircuit,
  //   category: "intelligence",
  //   shortcut: "I",
  // },

  {
    id: "close-panels",
    name: "Close Panels",
    icon: X,
    shortcut: "X",
  },
];
