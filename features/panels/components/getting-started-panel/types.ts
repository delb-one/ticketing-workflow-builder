import { LucideIcon } from "lucide-react";

export type WorkFlowStep = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export type NodeType = {
  name: string;
  description: string;
};

export type ChecklistSection = {
  title: string;
  icon: LucideIcon;
  items: string[];
};
