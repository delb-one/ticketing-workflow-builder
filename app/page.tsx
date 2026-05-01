"use client";

import { ReactFlowProvider } from "@xyflow/react";
import BlockLibrary from "@/components/BlockLibrary";
import InspectorPanel from "@/components/InspectorPanel";
import Toolbar from "@/components/Toolbar";
import SimulationPanel from "@/components/SimulationPanel";
import { CustomNode, useWorkflowStore } from "@/lib/store";
import { WORKFLOW_TEMPLATES } from "@/lib/templates/workflow-templates";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Download,
  PanelLeftClose,
  PanelLeftOpen,
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
import { ThemeToggle } from "@/components/theme-toggle";
import { Edge } from "@xyflow/react";

const WorkflowCanvas = dynamic(() => import("@/components/WorkflowCanvas"), {
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
    <div className="flex flex-col h-screen ">
      {/* <Toolbar /> */}

      <div className="flex flex-1 overflow-hidden gap-4 p-4">
        {/* Left Sidebar */}
        <BlockLibrary onBlockDrag={() => {}} />

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col rounded-lg shadow-sm border border-border overflow-hidden">
          <ReactFlowProvider>
            <WorkflowCanvas />
          </ReactFlowProvider>
        </div>

        {/* Right Sidebar */}
        <div
          className={cn(
            "flex flex-col gap-4 transition-all duration-300",
            rightCollapsed ? "w-12" : "w-80",
          )}
        >
          <div className="flex items-center justify-between border-b border-border p-1">
            {/* {!rightCollapsed && (
              <span className="text-sm font-semibold">Inspector</span>
            )} */}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setRightCollapsed((p) => !p)}
                  >
                    {rightCollapsed ? (
                      <PanelLeftOpen className="h-4 w-4 rotate-180" />
                    ) : (
                      <PanelLeftClose className="h-4 w-4 rotate-180" />
                    )}
                  </Button>
                </TooltipTrigger>

                <TooltipContent
                  side="left"
                  className="text-xs bg-background text-primary dark:bg-background dark:text-primary border border-border"
                >
                  {rightCollapsed ? "Show inspector" : "Hide inspector"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {!rightCollapsed && (
              <div className="flex items-center gap-2 flex-nowrap min-w-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={handleImportWorkflow}
                />

                {/* <select
                  value={selectedTemplateId}
                  onChange={(e) => {
                    const nextTemplateId = e.target.value;
                    setSelectedTemplateId(nextTemplateId);
                    loadTemplate(nextTemplateId);
                  }}
                  className="h-9 w-45 shrink-0 rounded-md border border-border bg-background px-3 text-sm"
                  title="Select and load a workflow template"
                >
                  <option value="" disabled>
                    Select Template
                  </option>
                  {WORKFLOW_TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select> */}

                {/* ACTIONS */}
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
              </div>
            )}
          </div>
          {!rightCollapsed && (
            <>
              {/* Inspector */}
              <div className="flex-1 overflow-hidden">
                <InspectorPanel selectedNode={selectedNodeData} />
              </div>

              {/* Simulation Controls */}
              <div className="p-2">
                <SimulationPanel />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
