import {
  ArrowRight,
  Bot,
  GitBranch,
  Play,
  SquareMousePointer,
  SquareTerminal,
} from "lucide-react";
import { ChecklistSection, NodeType, WorkFlowStep } from "./types";

export const workFlowSteps: WorkFlowStep[] = [
  {
    title: "Drag Blocks",
    description: "Drag workflow blocks from the left sidebar onto the canvas.",
    icon: SquareMousePointer,
  },
  {
    title: "Connect Nodes",
    description:
      "Create connections by dragging from output handles to input handles.",
    icon: GitBranch,
  },
  {
    title: "Configure Nodes",
    description:
      "Select a node to edit its properties inside the right inspector sidebar.",
    icon: Bot,
  },
  {
    title: "Setup and Run",
    description:
      "Configure Ticket Factory and Agent Pool, then start simulation.",
    icon: Play,
  },
];

export const quickStartSection: ChecklistSection = {
  title: "Quick Start",
  icon: ArrowRight,
  items: [],
};

export const simulationSetupSection: ChecklistSection = {
  title: "Simulation Setup",
  icon: Bot,
  items: [
    "Add at least one template in Ticket Factory (id, priority, impact, autoSpawnCount)",
    "Add at least one agent in Agent Pool (level, efficiency, capacity)",
    "Configure Actor, Decision, and Action nodes",
    "Start from Controls and monitor State, Priority, Impact, and Category in Ticket Monitor",
  ],
};

export const simulationFlowSection: ChecklistSection = {
  title: "Simulation Flow",
  icon: Play,
  items: [
    "Start the simulation from the Controls Panel",
    "Observe workflow execution step-by-step",
    "Interact with decision nodes when prompted",
    "Inspect logs and runtime activity in real time",
  ],
};

export const nodeTypesSection: ChecklistSection = {
  title: "Workflow Node Types",
  icon: SquareTerminal,
  items: [],
};

export const nodeTypes: NodeType[] = [
  {
    name: "Start",
    description: "Entry point of the workflow",
  },
  {
    name: "End",
    description: "Termination point",
  },
  {
    name: "Actor",
    description: "Represents roles like L1, L2, L3 or supervisors",
  },
  {
    name: "Action",
    description: "Ticket actions such as resolve, validate or close",
  },
  {
    name: "Automation",
    description: "Automated processes like SLA or escalations",
  },
  {
    name: "Decision",
    description: "Manual or rule-based branching",
  },
  {
    name: "Condition",
    description: "Conditional logic evaluation",
  },
  {
    name: "Event",
    description: "Custom event triggers",
  },
];
