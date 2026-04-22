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
  
  let colorClasses = 'bg-slate-500 border-slate-600';
  
  switch (type) {
    case 'actor':
      colorClasses = isActive ? 'bg-blue-600 border-blue-700' : 'bg-blue-500 border-blue-600';
      break;
    case 'decision':
    case 'condition':
      colorClasses = isActive ? 'bg-purple-600 border-purple-700' : 'bg-purple-500 border-purple-600';
      break;
    case 'automation':
      colorClasses = isActive ? 'bg-orange-600 border-orange-700' : 'bg-orange-500 border-orange-600';
      break;
    case 'action':
      colorClasses = isActive ? 'bg-green-600 border-green-700' : 'bg-green-500 border-green-600';
      break;
    case 'start':
      colorClasses = isActive ? 'bg-emerald-600 border-emerald-700' : 'bg-emerald-500 border-emerald-600';
      break;
    case 'end':
      colorClasses = isActive ? 'bg-red-600 border-red-700' : 'bg-red-500 border-red-600';
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
        selected ? 'ring-2 ring-blue-400 ring-offset-2' : ''
      } ${isConnecting ? 'opacity-30' : ''} ${isAutomation ? 'border-dashed' : ''}`}
    >
      <div className="relative">
        <div className="text-sm font-semibold whitespace-nowrap">{data.label}</div>
        {isActive && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 rounded-lg bg-white/20"
          />
        )}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
}
