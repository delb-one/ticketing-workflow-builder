'use client';

import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useWorkflowStore } from '@/lib/store';

interface CanvasNodeProps {
  data: {
    label: string;
    type: string;
    id?: string;
  };
  selected?: boolean;
  id: string;
  isConnecting?: boolean;
}

const getNodeStyles = (type: string, isActive: boolean) => {
  const baseClasses = 'rounded-lg px-4 py-3 font-medium text-white shadow-lg border-2 transition-all';
  
  let colorClasses = 'bg-chart-5 border-chart-5';
  
  switch (type) {
    case 'actor':
      colorClasses = isActive ? 'bg-chart-4 border-chart-4 brightness-110' : 'bg-chart-4 border-chart-4';
      break;
    case 'decision':
    case 'condition':
      colorClasses = isActive ? 'bg-chart-3 border-chart-3 brightness-110' : 'bg-chart-3 border-chart-3';
      break;
    case 'automation':
      colorClasses = isActive ? 'bg-chart-2 border-chart-2 brightness-110' : 'bg-chart-2 border-chart-2';
      break;
    case 'action':
      colorClasses = isActive ? 'bg-chart-1 border-chart-1 brightness-110' : 'bg-chart-1 border-chart-1';
      break;
    case 'start':
      colorClasses = isActive ? 'bg-chart-5 border-chart-5 brightness-110' : 'bg-chart-5 border-chart-5';
      break;
    case 'end':
      colorClasses = isActive ? 'bg-chart-5 border-chart-5 brightness-110' : 'bg-chart-5 border-chart-5';
      break;
  }

  return `${baseClasses} ${colorClasses}`;
};

export default function CanvasNode(props: CanvasNodeProps) {
  const { setSelectedNode, activeNodeId } = useWorkflowStore();
  const { data, selected, id, isConnecting } = props;
  const isActive = activeNodeId === id;

  const handleClick = () => {
    setSelectedNode(id);
  };

  const isAutomation = data.type === 'automation';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className={`${getNodeStyles(data.type, isActive)} cursor-pointer ${
        selected ? 'ring-2 ring-accent-foreground ring-offset-2' : ''
      } ${isConnecting ? 'opacity-30' : ''} ${isAutomation ? 'border-dashed' : ''}`}
    >
      <div className="relative">
        <div className="text-sm font-semibold whitespace-nowrap">{data.label}</div>
        {isActive && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-lg bg-card/20"
          />
        )}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
}
