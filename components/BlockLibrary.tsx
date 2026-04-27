'use client';

import { Card } from '@/components/ui/card';
import type { NodeConfig, NodeType } from '@/lib/simulation/types';
import { cn } from '@/lib/utils';
import {
  ArrowUpCircle,
  Bell,
  CheckCircle,
  CheckCircle2,
  Clock,
  Cpu,
  Filter,
  GitBranch,
  Headphones,
  MessageSquare,
  Play,
  RotateCcw,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
  User,
  UserCog,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

type ChartColor = 'chart-1' | 'chart-2' | 'chart-3' | 'chart-4' | 'chart-5';

interface BlockDefinition {
  blockId: string;
  label: string;
  type: NodeType;
  color: ChartColor;
  icon: LucideIcon;
  description?: string;
  config: NodeConfig;
}

const BLOCKS: Record<string, BlockDefinition[]> = {
  Other: [
    {
      blockId: 'start',
      label: 'Start',
      type: 'start',
      color: 'chart-5',
      icon: Play,
      config: { nodeType: 'start' },
    },
    {
      blockId: 'end',
      label: 'End',
      type: 'end',
      color: 'chart-5',
      icon: CheckCircle2,
      config: { nodeType: 'end' },
    },
  ],

  Actors: [
    {
      blockId: 'client',
      label: 'Client',
      type: 'actor',
      color: 'chart-4',
      icon: User,
      config: { nodeType: 'actor', agentLevel: 'client' },
    },
    {
      blockId: 'l1-tech',
      label: 'L1 Technician',
      type: 'actor',
      color: 'chart-4',
      icon: Headphones,
      config: { nodeType: 'actor', agentLevel: 'l1' },
    },
    {
      blockId: 'l2-tech',
      label: 'L2 Technician',
      type: 'actor',
      color: 'chart-4',
      icon: UserCog,
      config: { nodeType: 'actor', agentLevel: 'l2' },
    },
    {
      blockId: 'l3-specialist',
      label: 'L3 Specialist',
      type: 'actor',
      color: 'chart-4',
      icon: Cpu,
      config: { nodeType: 'actor', agentLevel: 'l3' },
    },
    {
      blockId: 'supervisor',
      label: 'Supervisor',
      type: 'actor',
      color: 'chart-4',
      icon: ShieldCheck,
      config: { nodeType: 'actor', agentLevel: 'supervisor' },
    },
  ],

  'Logic Blocks': [
    {
      blockId: 'decision',
      label: 'Decision',
      type: 'decision',
      color: 'chart-3',
      icon: GitBranch,
      config: { nodeType: 'decision', decisionType: 'boolean', outcomes: [] },
    },
    {
      blockId: 'condition',
      label: 'Condition',
      type: 'condition',
      color: 'chart-3',
      icon: Filter,
      config: { nodeType: 'condition' },
    },
  ],

  Automation: [
    {
      blockId: 'business-rules',
      label: 'Business Rules',
      type: 'automation',
      color: 'chart-2',
      icon: SlidersHorizontal,
      config: { nodeType: 'automation', automationType: 'business-rules' },
    },
    {
      blockId: 'auto-assign',
      label: 'Auto Assignment',
      type: 'automation',
      color: 'chart-2',
      icon: Shuffle,
      config: { nodeType: 'automation', automationType: 'auto-assign', assignTo: 'l1' },
    },
    {
      blockId: 'sla-timer',
      label: 'SLA Timer',
      type: 'automation',
      color: 'chart-2',
      icon: Clock,
      config: { nodeType: 'automation', automationType: 'sla-timer', duration: 60 },
    },
    {
      blockId: 'escalation',
      label: 'Escalation',
      type: 'automation',
      color: 'chart-2',
      icon: ArrowUpCircle,
      config: { nodeType: 'automation', automationType: 'escalation' },
    },
    {
      blockId: 'notify',
      label: 'Notification',
      type: 'automation',
      color: 'chart-2',
      icon: Bell,
      config: { nodeType: 'automation', automationType: 'notify', channel: 'email' },
    },
    {
      blockId: 'reopen',
      label: 'Reopen Ticket',
      type: 'automation',
      color: 'chart-2',
      icon: RotateCcw,
      config: { nodeType: 'automation', automationType: 'reopen' },
    },
  ],

  Actions: [
    {
      blockId: 'resolve',
      label: 'Resolve Ticket',
      type: 'action',
      color: 'chart-1',
      icon: CheckCircle,
      config: { nodeType: 'action', ticketAction: 'resolve' },
    },
    {
      blockId: 'validate',
      label: 'Validate Ticket',
      type: 'action',
      color: 'chart-1',
      icon: MessageSquare,
      config: { nodeType: 'action', ticketAction: 'validate' },
    },
    {
      blockId: 'close',
      label: 'Close Ticket',
      type: 'action',
      color: 'chart-1',
      icon: CheckCircle2,
      config: { nodeType: 'action', ticketAction: 'close' },
    },
  ],
};

interface BlockLibraryProps {
  onBlockDrag: (
    blockType: NodeType,
    blockId: string,
    blockLabel: string,
    blockConfig: NodeConfig,
  ) => void;
}

export default function BlockLibrary({ onBlockDrag }: BlockLibraryProps) {
  void onBlockDrag;

  const colorMap: Record<ChartColor, string> = {
    'chart-1': 'border-chart-1 hover:bg-chart-1/10 ',
    'chart-2': 'border-chart-2 hover:bg-chart-2/10 ',
    'chart-3': 'border-chart-3 hover:bg-chart-3/10',
    'chart-4': 'border-chart-4 hover:bg-chart-4/10 ',
    'chart-5': 'border-chart-5 hover:bg-chart-5/10 ',
  };

  const handleDragStart = (event: React.DragEvent, block: BlockDefinition) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify({
        type: block.type,
        blockId: block.blockId,
        label: block.label,
        config: block.config,
      }),
    );
  };

  return (
    <div className="flex h-full w-64 flex-col overflow-y-auto border-r border-border bg-card">
      <div className="sticky top-0 border-b border-border bg-card p-4">
        <h2 className="font-semibold text-foreground">Block Library</h2>
        <p className="mt-1 text-xs text-muted-foreground">Drag blocks to canvas</p>
      </div>

      <ScrollArea className="flex-1 space-y-6 overflow-y-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Object.entries(BLOCKS).map(([category, blocks]) => (
          <div key={category}>
            <h3 className="mt-2 mb-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {category}
            </h3>

            <div className="space-y-2">
              {blocks.map((block) => {
                const Icon = block.icon;

                return (
                  <Card
                    key={block.blockId}
                    draggable
                    onDragStart={(event) => handleDragStart(event, block)}
                    className={cn(
                      'cursor-move rounded-lg border bg-card p-3 transition-shadow hover:shadow-md',
                      colorMap[block.color],
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={cn('h-4 w-4', `text-${block.color}`)} />
                      <span className="text-sm font-medium">{block.label}</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
