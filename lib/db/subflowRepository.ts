import { db, type SubFlowDefinition } from './dexie';
import type { CustomNode } from "@/lib/store";
import type { Edge } from "@xyflow/react";

export const subflowRepository = {
  async createSubFlow(data: Omit<SubFlowDefinition, 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    const newSubFlow: SubFlowDefinition = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    await db.subflows.add(newSubFlow);
    return newSubFlow;
  },

  async getSubFlow(id: string) {
    return await db.subflows.get(id);
  },

  async updateSubFlow(id: string, data: Partial<Omit<SubFlowDefinition, 'id' | 'createdAt' | 'updatedAt'>>) {
    const now = new Date().toISOString();
    await db.subflows.update(id, {
      ...data,
      updatedAt: now,
    });
    return await db.subflows.get(id);
  },

  async deleteSubFlow(id: string) {
    return await db.subflows.delete(id);
  },

  async listSubFlows() {
    return await db.subflows.orderBy('updatedAt').reverse().toArray();
  },

  async saveSubFlow(
    id: string, 
    name: string, 
    nodes: CustomNode[], 
    edges: Edge[],
    description?: string,
    entryNodeId?: string,
    exitNodeId?: string,
    size?: { width: number; height: number }
  ) {
    const existing = await this.getSubFlow(id);
    const now = new Date().toISOString();
    
    if (existing) {
      await db.subflows.update(id, {
        name,
        nodes,
        edges,
        description: description !== undefined ? description : existing.description,
        entryNodeId: entryNodeId !== undefined ? entryNodeId : existing.entryNodeId,
        exitNodeId: exitNodeId !== undefined ? exitNodeId : existing.exitNodeId,
        size: size !== undefined ? size : existing.size,
        updatedAt: now,
      });
    } else {
      await db.subflows.add({
        id,
        name,
        nodes,
        edges,
        description,
        entryNodeId,
        exitNodeId,
        size,
        createdAt: now,
        updatedAt: now,
      });
    }
  }
};
