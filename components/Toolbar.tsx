'use client';

import { Button } from '@/components/ui/button';
import { useWorkflowStore } from '@/lib/store';
import { toPng } from 'html-to-image';
import { useState } from 'react';
import { ThemeToggle } from './theme-toggle';

interface ToolbarProps {
  onImport?: () => void;
  onExport?: () => void;
}

export default function Toolbar({ onImport, onExport }: ToolbarProps) {
  const { nodes, edges, clearWorkflow } = useWorkflowStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportWorkflow = async () => {
    setIsExporting(true);
    try {
      const workflow = {
        nodes,
        edges,
        exportedAt: new Date().toISOString(),
      };
      const jsonString = JSON.stringify(workflow, null, 2);
      const element = document.createElement('a');
      element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonString));
      element.setAttribute('download', `workflow-${Date.now()}.json`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error('[v0] Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      const canvas = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!canvas) {
        console.error('[v0] Canvas not found');
        return;
      }

      const image = await toPng(canvas);
      const link = document.createElement('a');
      link.href = image;
      link.download = `workflow-diagram-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('[v0] Image export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const loadTemplate = (templateNodes: any[], templateEdges: any[]) => {
    clearWorkflow();
    useWorkflowStore.setState({
      nodes: templateNodes,
      edges: templateEdges,
    });
  };

  const handleLoadTemplate = () => {
    // Basic L1 -> L2 escalation flow
    const templateNodes = [
      { id: 'start', data: { label: 'Start', type: 'start', config: {} }, position: { x: 250, y: 0 }, type: 'canvas' },
      { id: 'l1-actor', data: { label: 'L1 Technician', type: 'actor', config: {} }, position: { x: 150, y: 100 }, type: 'canvas' },
      { id: 'resolve-check', data: { label: 'Can Resolve?', type: 'decision', config: { decisionType: 'boolean' } }, position: { x: 150, y: 250 }, type: 'canvas' },
      { id: 'escalate-l2', data: { label: 'Escalate to L2', type: 'automation', id: 'escalation', config: {} }, position: { x: 350, y: 250 }, type: 'canvas' },
      { id: 'l2-actor', data: { label: 'L2 Technician', type: 'actor', config: {} }, position: { x: 350, y: 400 }, type: 'canvas' },
      { id: 'resolve-l2', data: { label: 'Resolve Ticket', type: 'action', config: {} }, position: { x: 150, y: 400 }, type: 'canvas' },
      { id: 'close', data: { label: 'Close Ticket', type: 'action', config: {} }, position: { x: 250, y: 550 }, type: 'canvas' },
    ];

    const templateEdges = [
      { id: 'start-l1', source: 'start', target: 'l1-actor' },
      { id: 'l1-check', source: 'l1-actor', target: 'resolve-check' },
      { id: 'check-resolve', source: 'resolve-check', target: 'resolve-l2', label: 'Yes' },
      { id: 'check-escalate', source: 'resolve-check', target: 'escalate-l2', label: 'No' },
      { id: 'escalate-l2-actor', source: 'escalate-l2', target: 'l2-actor' },
      { id: 'l2-resolve', source: 'l2-actor', target: 'close' },
      { id: 'resolve-close', source: 'resolve-l2', target: 'close' },
    ];

    loadTemplate(templateNodes, templateEdges);
  };

  const handleLoadComplexTemplate = () => {
    // Complex incident workflow with triage, escalation loops, vendor handling, and postmortem
    const templateNodes = [
      { id: 'start', data: { label: 'Ticket Created', type: 'start', config: {} }, position: { x: 460, y: 0 }, type: 'canvas' },
      { id: 'intake-bot', data: { label: 'Auto Intake Bot', type: 'automation', config: {} }, position: { x: 460, y: 100 }, type: 'canvas' },
      { id: 'triage-l1', data: { label: 'L1 Triage', type: 'actor', config: {} }, position: { x: 460, y: 200 }, type: 'canvas' },
      { id: 'critical-check', data: { label: 'Critical Impact?', type: 'decision', config: { decisionType: 'boolean' } }, position: { x: 460, y: 320 }, type: 'canvas' },

      { id: 'assign-im', data: { label: 'Assign Incident Manager', type: 'automation', config: {} }, position: { x: 220, y: 440 }, type: 'canvas' },
      { id: 'notify-stakeholders', data: { label: 'Notify Stakeholders', type: 'action', config: {} }, position: { x: 460, y: 440 }, type: 'canvas' },
      { id: 'l3-investigation', data: { label: 'L3 Deep Investigation', type: 'actor', config: {} }, position: { x: 700, y: 440 }, type: 'canvas' },
      { id: 'workaround-check', data: { label: 'Workaround Available?', type: 'condition', config: {} }, position: { x: 700, y: 560 }, type: 'canvas' },
      { id: 'publish-workaround', data: { label: 'Publish Workaround', type: 'action', config: {} }, position: { x: 540, y: 680 }, type: 'canvas' },
      { id: 'vendor-escalation', data: { label: 'Escalate to Vendor', type: 'automation', config: {} }, position: { x: 860, y: 680 }, type: 'canvas' },
      { id: 'vendor-response', data: { label: 'Vendor Fix Ready?', type: 'decision', config: { decisionType: 'boolean' } }, position: { x: 860, y: 800 }, type: 'canvas' },
      { id: 'monitoring', data: { label: 'Monitor Stability', type: 'action', config: {} }, position: { x: 700, y: 920 }, type: 'canvas' },

      { id: 'standard-resolution', data: { label: 'Standard Resolution', type: 'action', config: {} }, position: { x: 220, y: 560 }, type: 'canvas' },
      { id: 'qa-validation', data: { label: 'QA Validation', type: 'actor', config: {} }, position: { x: 220, y: 680 }, type: 'canvas' },
      { id: 'resolved-check', data: { label: 'Resolved?', type: 'decision', config: { decisionType: 'boolean' } }, position: { x: 360, y: 800 }, type: 'canvas' },
      { id: 'postmortem', data: { label: 'Postmortem + KB Update', type: 'automation', config: {} }, position: { x: 460, y: 920 }, type: 'canvas' },
      { id: 'close', data: { label: 'Close Ticket', type: 'end', config: {} }, position: { x: 460, y: 1040 }, type: 'canvas' },
    ];

    const templateEdges = [
      { id: 'e1', source: 'start', target: 'intake-bot' },
      { id: 'e2', source: 'intake-bot', target: 'triage-l1' },
      { id: 'e3', source: 'triage-l1', target: 'critical-check' },

      { id: 'e4', source: 'critical-check', target: 'assign-im', label: 'Yes' },
      { id: 'e5', source: 'assign-im', target: 'notify-stakeholders' },
      { id: 'e6', source: 'notify-stakeholders', target: 'l3-investigation' },
      { id: 'e7', source: 'l3-investigation', target: 'workaround-check' },
      { id: 'e8', source: 'workaround-check', target: 'publish-workaround', label: 'Yes' },
      { id: 'e9', source: 'workaround-check', target: 'vendor-escalation', label: 'No' },
      { id: 'e10', source: 'vendor-escalation', target: 'vendor-response' },
      { id: 'e11', source: 'vendor-response', target: 'monitoring', label: 'Yes' },
      { id: 'e12', source: 'vendor-response', target: 'l3-investigation', label: 'No' },
      { id: 'e13', source: 'publish-workaround', target: 'monitoring' },
      { id: 'e14', source: 'monitoring', target: 'postmortem' },

      { id: 'e15', source: 'critical-check', target: 'standard-resolution', label: 'No' },
      { id: 'e16', source: 'standard-resolution', target: 'qa-validation' },
      { id: 'e17', source: 'qa-validation', target: 'resolved-check' },
      { id: 'e18', source: 'resolved-check', target: 'postmortem', label: 'Yes' },
      { id: 'e19', source: 'resolved-check', target: 'triage-l1', label: 'No' },

      { id: 'e20', source: 'postmortem', target: 'close' },
    ];

    loadTemplate(templateNodes, templateEdges);
  };

  return (
    <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">Workflow Builder</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleLoadTemplate} title="Load a basic L1-L2 escalation template">
          Template
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLoadComplexTemplate}
          title="Load a more complex incident management template"
        >
          Complex Template
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportWorkflow} disabled={isExporting || nodes.length === 0}>
          Export JSON
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportImage} disabled={isExporting || nodes.length === 0}>
          Export Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            clearWorkflow();
          }}
          disabled={nodes.length === 0}
        >
          Clear
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
