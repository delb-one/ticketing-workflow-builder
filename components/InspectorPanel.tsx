'use client';

import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWorkflowStore, CustomNode } from '@/lib/store';

interface InspectorPanelProps {
  selectedNode: CustomNode | undefined;
}

export default function InspectorPanel({ selectedNode }: InspectorPanelProps) {
  const { updateNode, deleteNode } = useWorkflowStore();

  if (!selectedNode) {
    return (
      <div className="w-80 border-l border-border overflow-y-auto h-full flex flex-col p-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Select a node to inspect</p>
        </div>
      </div>
    );
  }

  const handleLabelChange = (newLabel: string) => {
    updateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        label: newLabel,
      },
    });
  };

  const handleConfigChange = (key: string, value: any) => {
    updateNode(selectedNode.id, {
      data: {
        ...selectedNode.data,
        config: {
          ...selectedNode.data.config,
          [key]: value,
        },
      },
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'actor':
        return 'text-blue-600';
      case 'decision':
      case 'condition':
        return 'text-purple-600';
      case 'automation':
        return 'text-orange-600';
      case 'action':
        return 'text-green-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="w-80 border-l bg-card border-border overflow-y-auto h-full flex flex-col">
      <div className="p-4 border-b border-border sticky top-0 bg-card">
        <h2 className="font-semibold text-foreground">Node Inspector</h2>
        <p className={`text-xs mt-1 font-medium ${getTypeColor(selectedNode.data.type)}`}>
          Type: {selectedNode.data.type.toUpperCase()}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Card className="p-4">
          <label className="text-sm font-semibold text-foreground block mb-2">
            Label
          </label>
          <Input
            value={selectedNode.data.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="text-sm"
          />
        </Card>

        {selectedNode.data.type === 'decision' && (
          <Card className="p-4">
            <label className="text-sm font-semibold text-foreground block mb-2">
              Decision Type
            </label>
            <select
              value={selectedNode.data.config?.decisionType || 'boolean'}
              onChange={(e) => handleConfigChange('decisionType', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
            >
              <option value="boolean">Boolean (Yes/No)</option>
              <option value="custom">Custom Expression</option>
            </select>
          </Card>
        )}

        {selectedNode.data.type === 'automation' && selectedNode.data.id?.includes('sla') && (
          <Card className="p-4">
            <label className="text-sm font-semibold text-foreground block mb-2">
              SLA Duration (minutes)
            </label>
            <Input
              type="number"
              value={selectedNode.data.config?.duration || 60}
              onChange={(e) => handleConfigChange('duration', parseInt(e.target.value))}
              min="1"
              className="text-sm"
            />
          </Card>
        )}

        {selectedNode.data.type === 'automation' && selectedNode.data.id?.includes('assign') && (
          <Card className="p-4">
            <label className="text-sm font-semibold text-foreground block mb-2">
              Assign To
            </label>
            <select
              value={selectedNode.data.config?.assignTo || 'l1'}
              onChange={(e) => handleConfigChange('assignTo', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
            >
              <option value="l1">L1 Technician</option>
              <option value="l2">L2 Technician</option>
              <option value="l3">L3 Specialist</option>
            </select>
          </Card>
        )}

        {selectedNode.data.type === 'automation' && selectedNode.data.id?.includes('notify') && (
          <Card className="p-4">
            <label className="text-sm font-semibold text-foreground block mb-2">
              Notification Channel
            </label>
            <select
              value={selectedNode.data.config?.channel || 'email'}
              onChange={(e) => handleConfigChange('channel', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md text-sm bg-background"
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="portal">Portal</option>
            </select>
          </Card>
        )}

        <Card className="p-3 ">
          <p className="text-xs text-muted-foreground">
            <strong>ID:</strong> {selectedNode.id}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <strong>Position:</strong> {Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)}
          </p>
        </Card>
      </div>

      <div className="p-4 border-t border-border space-y-2 ">
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full"
        >
          Delete Node
        </Button>
      </div>
    </div>
  );
}
