import Dexie, { type EntityTable } from 'dexie';
import type { CustomNode } from "@/lib/store";
import type { Edge } from "@xyflow/react";

export interface SubFlowDefinition {
  id: string;
  name: string;
  description?: string;
  nodes: CustomNode[];
  edges: Edge[];
  entryNodeId?: string;
  exitNodeId?: string;
  size?: {
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}

export const db = new Dexie('WorkflowBuilderDB') as Dexie & {
  subflows: EntityTable<SubFlowDefinition, 'id'>;
};

// Declare tables, IDs and indexes
db.version(1).stores({
  subflows: 'id, name, updatedAt' // Primary key and indexed props
});
