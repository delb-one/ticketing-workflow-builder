import { LucideIcon } from "lucide-react";

export interface ToolsContainerPanelProps {
  activeToolIds: string[];
  onToolToggle: (toolId: string) => void;
  onCloseAll: () => void;
}

export type ToolBadgeKey =
  | "agents"
  | "tickets"
  | "queue";

export type SimulationTool = {
  id: string;
  name: string;
  description?: string;
  icon: LucideIcon;

  category?: "core" | "monitoring" | "advanced";

  badgeKey?: ToolBadgeKey;

  shortcut?: string;

  status?: "coming-soon" | "experimental" | "beta";
};
