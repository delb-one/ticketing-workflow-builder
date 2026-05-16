import type { WorkflowStore } from "@/lib/store";

export const QUEUE_LEVELS = ["l1", "l2", "l3"] as const;

export type QueueLevel = (typeof QUEUE_LEVELS)[number];

export type QueueMap = Record<QueueLevel, string[]>;

const EMPTY_QUEUES: QueueMap = {
  l1: [],
  l2: [],
  l3: [],
};

export const selectQueues = (state: WorkflowStore): QueueMap =>
  state.engineState?.queues ?? EMPTY_QUEUES;

export const selectTotalWaiting = (queues: QueueMap): number =>
  queues.l1.length + queues.l2.length + queues.l3.length;

export const selectQueueSizeByLevel = (
  queues: QueueMap,
  level: QueueLevel,
): number => queues[level].length;
