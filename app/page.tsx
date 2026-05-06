"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { BlockLibrary, InspectorPanel, Toolbar } from "@/features/workflow-editor";
import { WorkflowEditorTemplate } from "@/components/templates/WorkflowEditorTemplate";
import { CustomNode, useWorkflowStore } from "@/lib/store";
import { WORKFLOW_TEMPLATES } from "@/lib/templates/workflow-templates";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal,
  Trash2,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { Edge } from "@xyflow/react";

const WorkflowCanvas = dynamic(() => import("@/features/workflow-editor/components/WorkflowCanvas"), {
  ssr: false,
});

export default function Home() {
  const { nodes, edges, selectedNode, clearWorkflow, loadWorkflow } =
    useWorkflowStore();
  const selectedNodeData = nodes.find((n) => n.id === selectedNode);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportWorkflow = async () => {
    setIsExporting(true);
    try {
      const workflow = {
        nodes,
        edges,
        exportedAt: new Date().toISOString(),
      };
      const jsonString = JSON.stringify(workflow, null, 2);
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:application/json;charset=utf-8," + encodeURIComponent(jsonString),
      );
      element.setAttribute("download", `workflow-${Date.now()}.json`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("[page] Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportWorkflow = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const rawContent = await file.text();
      const parsed = JSON.parse(rawContent) as {
        nodes?: CustomNode[];
        edges?: Edge[];
      };

      if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
        throw new Error("Invalid workflow JSON format");
      }

      clearWorkflow();
      loadWorkflow(parsed.nodes, parsed.edges);
      setSelectedTemplateId("");
    } catch (error) {
      console.error("[page] Import error:", error);
      window.alert(
        "Import fallito: il file JSON non e valido o non contiene nodes/edges.",
      );
    } finally {
      event.target.value = "";
    }
  };

  const loadTemplate = (templateId: string) => {
    const template = WORKFLOW_TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;

    clearWorkflow();
    loadWorkflow(template.nodes, template.edges);
  };

  return (
    <WorkflowEditorTemplate
      leftSidebar={<BlockLibrary onBlockDrag={() => { }} />}
      canvas={
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>
      }
      rightCollapsed={rightCollapsed}
      onToggleRightSidebar={() => setRightCollapsed((p) => !p)}
      rightSidebarHeaderActions={
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportWorkflow}
          />
          <TooltipProvider>
            <div className="flex gap-1 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExportWorkflow}
                    disabled={isExporting || nodes.length === 0}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs bg-background text-primary border border-border">
                  Export JSON
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isExporting}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs bg-background text-primary border border-border">
                  Import JSON
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearWorkflow()}
                    disabled={nodes.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs bg-background text-primary border border-border">
                  Clear workflow
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          <ThemeToggle />
        </>
      }
      rightSidebar={
        <>
          <div className="flex-1 overflow-hidden">
            <InspectorPanel selectedNode={selectedNodeData} />
          </div>
         
        </>
      }
      
    // Passing the toggle button as part of the header logic in the template
    // For now, I'll update the template to accept the toggle button separately or handle it better
    />
  );
}
