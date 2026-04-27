import type { LucideIcon } from 'lucide-react';
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
import type { NodeType } from '@/lib/simulation/types';

export const BLOCK_ICON_MAP: Record<string, LucideIcon> = {
  start: Play,
  end: CheckCircle2,
  client: User,
  'l1-tech': Headphones,
  'l2-tech': UserCog,
  'l3-specialist': Cpu,
  supervisor: ShieldCheck,
  decision: GitBranch,
  condition: Filter,
  'business-rules': SlidersHorizontal,
  'auto-assign': Shuffle,
  'sla-timer': Clock,
  escalation: ArrowUpCircle,
  notify: Bell,
  reopen: RotateCcw,
  resolve: CheckCircle,
  validate: MessageSquare,
  close: CheckCircle2,
  status: CheckCircle,
  event: Bell,
};

export const TYPE_ICON_MAP: Record<NodeType, LucideIcon> = {
  actor: User,
  decision: GitBranch,
  condition: Filter,
  automation: SlidersHorizontal,
  action: CheckCircle,
  start: Play,
  end: CheckCircle2,
  status: CheckCircle,
  event: Bell,
};

export const getNodeIcon = (type: NodeType, blockId?: string): LucideIcon =>
  blockId ? BLOCK_ICON_MAP[blockId] ?? TYPE_ICON_MAP[type] : TYPE_ICON_MAP[type];
