import { LucideIcon } from "lucide-react";
import { NodeConfig, NodeType } from "../simulation/types";
import type { NodeColor } from "../colors/color-map";

export interface BlockDefinition {
  blockId: string;
  label: string;
  type: NodeType;
  color?: NodeColor;
  icon: LucideIcon;
  description?: string;
  config: NodeConfig;
}
