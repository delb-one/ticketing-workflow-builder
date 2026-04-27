import { NodeType } from "../store";
import { NodeTheme } from "./types";

export const TYPE_THEME_MAP: Record<NodeType, NodeTheme> = {
  actor: {
    gradient: 'from-chart-4 to-chart-4',
    softText: 'text-chart-4/80',
    handle: '!bg-chart-4',
  },
  decision: {
    gradient: 'from-chart-3 to-chart-3',
    softText: 'text-chart-3/80',
    handle: '!bg-chart-3',
  },
  condition: {
    gradient: 'from-chart-3 to-chart-3',
    softText: 'text-chart-3/80',
    handle: '!bg-chart-3',
  },
  automation: {
    gradient: 'from-chart-2 to-chart-2',
    softText: 'text-chart-2/80',
    handle: '!bg-chart-2',
  },
  action: {
    gradient: 'from-chart-1 to-chart-1',
    softText: 'text-chart-1/80',
    handle: '!bg-chart-1',
  },
  start: {
    gradient: 'from-chart-5 to-chart-5',
    softText: 'text-chart-5/80',
    handle: '!bg-chart-5',
  },
  end: {
    gradient: 'from-chart-5 to-chart-5',
    softText: 'text-chart-5/80',
    handle: '!bg-chart-5',
  },
  status: {
    gradient: 'from-chart-1 to-chart-1',
    softText: 'text-chart-1/80',
    handle: '!bg-chart-1',
  },
  event: {
    gradient: 'from-chart-2 to-chart-2',
    softText: 'text-chart-2/80',
    handle: '!bg-chart-2',
  },
};

export const TYPE_LABEL_MAP: Record<NodeType, string> = {
  actor: 'Actor',
  decision: 'Decision',
  condition: 'Condition',
  automation: 'Automation',
  action: 'Action',
  start: 'Start',
  end: 'End',
  status: 'Status',
  event: 'Event',
};