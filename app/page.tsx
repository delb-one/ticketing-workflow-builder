"use client";

import { ReactFlowProvider } from "@xyflow/react";
import {
  BlockLibrary,
  InspectorPanel,
} from "@/features/workflow-editor";
import { WorkflowEditorTemplate } from "@/components/templates/WorkflowEditorTemplate";
import { CustomNode, useWorkflowStore } from "@/lib/store";
import {
  WORKFLOW_TEMPLATES,
  WorkflowTemplate,
} from "@/lib/flow-template/workflow-templates";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Trash2, Upload } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { Edge } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WorkflowCanvas = dynamic(
  () => import("@/features/workflow-editor/components/WorkflowCanvas"),
  {
    ssr: false,
  },
);

export default function Home() {
  const { nodes, edges, selectedNodeId, clearWorkflow, loadWorkflow } =
    useWorkflowStore();
  const selectedNodeData = nodes.find((n) => n.id === selectedNodeId);
  const [leftCollapsed, setLeftCollapsed] = useState(true);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState<boolean>(false);

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

  const loadTemplate = async (templateId: string) => {
    const template = WORKFLOW_TEMPLATES.find(
      (item: WorkflowTemplate) => item.id === templateId,
    );

    if (!template) return;

    setIsLoadingTemplate(true);

    try {
      clearWorkflow();
      await new Promise((r) => setTimeout(r, 1000));
      loadWorkflow(template.nodes, template.edges);
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  const handleClearWorkflow = () => {
    clearWorkflow();
    setSelectedTemplateId("");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setLeftCollapsed((prev) => !prev);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setRightCollapsed((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <WorkflowEditorTemplate
      leftSidebar={<BlockLibrary onBlockDrag={() => {}} />}
      canvas={
        <ReactFlowProvider>
          <WorkflowCanvas />
        </ReactFlowProvider>
      }
      leftCollapsed={leftCollapsed}
      rightCollapsed={rightCollapsed}
      onToggleLeftSidebar={() => setLeftCollapsed((p) => !p)}
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
              <Select
                value={selectedTemplateId}
                onValueChange={(id) => {
                  setSelectedTemplateId(id);
                  loadTemplate(id);
                }}
                disabled={isLoadingTemplate}
              >
                <SelectTrigger
                  className="h-9 w-40 text-sm overflow-hidden"
                  title="Select and load a workflow template"
                >
                  <div className="flex w-full items-center gap-2 overflow-hidden">
                    <SelectValue
                      placeholder="Select Template"
                      className="truncate"
                    />

                    {isLoadingTemplate ? (
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                    ) : null}
                  </div>
                </SelectTrigger>

                <SelectContent>
                  {WORKFLOW_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    onClick={handleClearWorkflow}
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
          {/* <ThemeToggle /> */}
        </>
      }
      rightSidebar={
        <>
          <div className="flex-1 overflow-hidden">
            <InspectorPanel selectedNode={selectedNodeData} />
          </div>
        </>
      }
    />
  );
}
