'use client';

import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { getNodeIcon } from '@/lib/node-icons';
import { NodeType, useWorkflowStore } from '@/lib/store';

interface CanvasNodeProps {
  data: {
    label: string;
    type: NodeType;
    blockId?: string;
    id?: string;
  };
  selected?: boolean;
  id: string;
  isConnecting?: boolean;
}

interface NodeTheme {
  gradient: string;
  softText: string;
  handle: string;
}

const TYPE_THEME_MAP: Record<NodeType, NodeTheme> = {
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

const TYPE_LABEL_MAP: Record<NodeType, string> = {
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

export default function CanvasNode(props: CanvasNodeProps) {
  const { setSelectedNode, activeNodeId } = useWorkflowStore();
  const { data, selected, id, isConnecting } = props;
  const isActive = activeNodeId === id;
  const theme = TYPE_THEME_MAP[data.type];
  const blockId = data.blockId ?? data.id;
  const Icon = getNodeIcon(data.type, blockId);
  const isAutomation = data.type === 'automation';
  const subtitle = blockId ? blockId.replace(/-/g, ' ') : TYPE_LABEL_MAP[data.type];

  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={() => setSelectedNode(id)}
      className={`group relative min-w-55 cursor-pointer rounded-xl bg-linear-to-br p-px ${theme.gradient} shadow-lg transition-all ${selected ? 'ring-2 ring-accent-foreground ring-offset-2' : ''} ${isActive ? 'scale-[1.01] shadow-xl' : ''} ${isConnecting ? 'opacity-40' : ''}`}
    >
      <div
        className={`relative rounded-[11px] border border-border/70 bg-card px-3 py-3 backdrop-blur-sm ${isAutomation ? 'border-dashed' : ''}`}
      >
        <div className="flex items-start gap-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br ${theme.gradient} text-white`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">{data.label}</div>
            <div className={`mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${theme.softText}`}>
              {subtitle}
            </div>
          </div>
        </div>

        {isActive && (
          <motion.div
            animate={{ opacity: [0.16, 0.35, 0.16] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className={`pointer-events-none absolute inset-0 rounded-[11px] bg-linear-to-r ${theme.gradient}`}
          />
        )}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className={`-top-1.5! h-3! w-3! border-2! border-card! transition-transform group-hover:scale-110! ${theme.handle}`}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className={`-bottom-1.5! h-3! w-3! border-2! border-card! transition-transform group-hover:scale-110! ${theme.handle}`}
      />
    </motion.div>
  );
}
