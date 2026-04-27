import { LucideIcon } from "lucide-react";
import { NodeConfig, NodeType } from "../store";


type ChartColor = 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5';
export interface BlockDefinition {
  blockId: string;
  label: string;
  type: NodeType;
  color: ChartColor;
  icon: LucideIcon;
  description?: string;
  config: NodeConfig;
}