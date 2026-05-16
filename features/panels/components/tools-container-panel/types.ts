import { LucideIcon } from "lucide-react";

export interface ToolsContainerPanelProps {
  activeToolIds: string[];
  onToolToggle: (toolId: string) => void;
  onCloseAll: () => void;
}

export type SimulationTool = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category?: "core" | "monitoring" | "advanced";
  badgeCount?: number;
  shortcut?: string;

  status?: "coming-soon" | "experimental" | "beta";
};
