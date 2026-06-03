"use client";

import React, { useState, useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { SubFlowEditorTemplate } from "@/components/templates/SubFlowEditorTemplate";
import WorkflowCanvas from "@/features/workflow-editor/components/WorkflowCanvas";
import BlockLibrary from "@/features/workflow-editor/components/BlockLibrary";
import { SubFlowHeader } from "./SubFlowHeader";
import { useSubFlowEditor } from "../hooks/useSubFlowEditor";

export interface SubFlowEditorProps {
  subflowId?: string;
}

export function SubFlowEditor({ subflowId }: SubFlowEditorProps) {
  const { subflowName, setSubflowName, subflowDescription, setSubflowDescription, isLoading, saveSubFlow } = useSubFlowEditor(subflowId);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await Promise.all([
      saveSubFlow(),
      new Promise((resolve) => setTimeout(resolve, 1000))
    ]);
    setIsSaving(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-pulse text-muted-foreground">Loading subflow...</div>
      </div>
    );
  }

  return (
    <SubFlowEditorTemplate
      leftSidebar={<BlockLibrary />}
      canvas={
        <ReactFlowProvider>
          <WorkflowCanvas 
            mode="subflow"
            headerPanel={
              <SubFlowHeader 
                name={subflowName} 
                onChangeName={setSubflowName} 
                description={subflowDescription}
                onChangeDescription={setSubflowDescription}
                onSave={handleSave} 
                isSaving={isSaving}
              />
            }
          />
        </ReactFlowProvider>
      }
      leftCollapsed={leftCollapsed}
      onToggleLeftSidebar={() => setLeftCollapsed(!leftCollapsed)}
    />
  );
}
