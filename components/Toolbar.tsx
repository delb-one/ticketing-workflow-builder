"use client";

import { Button } from "@/components/ui/button";
import { CustomNode, useWorkflowStore } from "@/lib/store";
import { WORKFLOW_TEMPLATES } from "@/lib/templates/workflow-templates";
import { Edge } from "@xyflow/react";
import { useRef, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { Download, Trash2, Upload } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ToolbarProps {
  onImport?: () => void;
  onExport?: () => void;
}

export default function Toolbar({ onImport, onExport }: ToolbarProps) {
  const { nodes, edges, clearWorkflow, loadWorkflow } = useWorkflowStore();
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
      console.error("[v0] Export error:", error);
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
      onImport?.();
    } catch (error) {
      console.error("Import error:", error);
      window.alert(
        "Import fallito: il file JSON non e valido o non contiene nodes/edges.",
      );
    } finally {
      // Reset input so the same file can be selected again.
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
    <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">Workflow Builder</h1>
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportWorkflow}
        />
        <select
          value={selectedTemplateId}
          onChange={(e) => {
            const nextTemplateId = e.target.value;
            setSelectedTemplateId(nextTemplateId);
            loadTemplate(nextTemplateId);
          }}
          className="h-9 min-w-65 rounded-md border border-border bg-background px-3 text-sm"
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
        </select>
        <TooltipProvider>
          <div className="flex gap-2">
            {/* EXPORT */}
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
              <TooltipContent className="text-xs bg-background text-primary dark:bg-background dark:text-primary border border-border">
                Export JSON
              </TooltipContent>
            </Tooltip>

            {/* IMPORT */}
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
              <TooltipContent className="text-xs bg-background text-primary dark:bg-background dark:text-primary border border-border">
                Import JSON
              </TooltipContent>
            </Tooltip>

            {/* CLEAR */}
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
              <TooltipContent className="text-xs bg-background text-primary dark:bg-background dark:text-primary border border-border">
                Clear workflow
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
        <ThemeToggle />
      </div>
    </div>
  );
}
