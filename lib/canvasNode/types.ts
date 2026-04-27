import { NodeConfig, NodeType } from "../simulation/types";

export interface CanvasNodeProps {
  data: {
    label: string;
    type: NodeType;
    blockId?: string;
    id?: string;
    config?: NodeConfig;
    description?: string;
  };
  selected?: boolean;
  id: string;
  isConnecting?: boolean;
}

export interface NodeTheme {
  gradient: string;
  softText: string;
  handle: string;
}