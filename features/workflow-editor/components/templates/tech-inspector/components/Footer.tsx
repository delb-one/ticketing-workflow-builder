"use client";
import { Agent } from "../TechInspectorTemplate";

interface FooterProps {
  isIdleMode: boolean;
  isBulkMode: boolean;
  selectedAgents: string[];
  selectedAgent: Agent | null;
}

export const Footer = ({
  isIdleMode,
  isBulkMode,
  selectedAgents,
  selectedAgent,
}: FooterProps) => {
  return (
    <div className="p-2 border-t">
      {isIdleMode ? (
        <div className="text-xs text-muted-foreground">No selection</div>
      ) : isBulkMode ? (
        <div className="text-xs text-muted-foreground">
          Bulk editing {selectedAgents.length} agents
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">
          Editing {selectedAgent?.name}
        </div>
      )}
    </div>
  );
};
