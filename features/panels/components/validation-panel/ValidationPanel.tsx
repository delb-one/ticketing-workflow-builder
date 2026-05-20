"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  CircleX,
  Lightbulb,
  TriangleAlert,
} from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useValidation } from "@/features/panels/hooks/useValidation";
import { useWorkflowStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { statusConfig } from "./data";

export function ValidationPanel() {
  const { errors, warnings, info, all, isValid, hasErrors, hasWarnings } =
    useValidation();
  const nodesCount = useWorkflowStore((state) => state.nodes.length);
  const setSelectedNode = useWorkflowStore((state) => state.setSelectedNode);
  const { fitView } = useReactFlow();

  const getStatusIcon = () => {
    if (hasErrors) return AlertCircle;
    if (hasWarnings) return AlertTriangle;
    return CheckCircle2;
  };

  const focusNode = (nodeId?: string) => {
    if (!nodeId) return;
    setSelectedNode(nodeId);
    fitView({ nodes: [{ id: nodeId }], duration: 300, padding: 0.25 });
  };

  const status = hasErrors ? "invalid" : hasWarnings ? "warning" : "valid";

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <CustomPanel
      value="validation"
      title="Flow validation"
      icon={getStatusIcon()}
      defaultExpanded
      badge={
        <div className="flex items-center gap-1.5">
          {errors.length > 0 && (
            <Badge
              variant="destructive"
              className="h-5 px-1.5  font-bold min-w-5"
            >
              {errors.length}
            </Badge>
          )}
          {warnings.length > 0 && (
            <Badge className="h-5 px-1.5  font-bold min-w-5 bg-amber-500/20 text-amber-600">
              {warnings.length}
            </Badge>
          )}
        </div>
      }
    >
      <div className="space-y-2 pt-1 w-90">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-1.5">
          <div className="rounded-lg border  p-2 flex flex-col  items-center justify-center min-w-0">
            <CircleX className="w-4 h-4 text-red-500 mb-1" />
            <div className="text-lg font-semibold ">{errors.length}</div>
            <div className="text-[10px] text-muted-foreground truncate">
              ERRORS
            </div>
          </div>

          <div className="rounded-lg border  p-2 flex flex-col items-center justify-center min-w-0">
            <TriangleAlert className="w-4 h-4 text-amber-500 mb-1" />
            <div className="text-lg font-semibold ">{warnings.length}</div>
            <div className="text-[10px] text-muted-foreground truncate">
              WARNINGS
            </div>
          </div>

          <div className="rounded-lg border   p-2 flex flex-col items-center justify-center min-w-0">
            <Lightbulb className="w-4 h-4 text-blue-500 mb-1" />
            <div className="text-lg font-semibold ">{info.length}</div>
            <div className="text-[10px] text-muted-foreground truncate">
              SUGGESTIONS
            </div>
          </div>

          <div
            className={`rounded-lg border p-2 flex flex-col items-center justify-center min-w-0 ${currentStatus.border} ${currentStatus.bg}`}
          >
            <StatusIcon className={`w-4 h-4 mb-1 ${currentStatus.color}`} />

            <div className={`text-lg font-semibold ${currentStatus.color}`}>
              {currentStatus.label}
            </div>
            <div className="text-[10px] text-muted-foreground truncate">
              STATE
            </div>
          </div>
        </div>

        <Tabs defaultValue="errors">
          <TabsList variant="line">
            <TabsTrigger
              value="errors"
              className="bg-card-200/40 hover:bg-card-200/30"
            >
              Errors {errors.length > 0 && `(${errors.length})`}
            </TabsTrigger>
            <TabsTrigger
              value="warnings"
              className="bg-card-200/40 hover:bg-card-200/30"
            >
              Warnings {warnings.length > 0 && `(${warnings.length})`}
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="bg-card-200/40 hover:bg-card-200/30"
            >
              Suggestions {info.length > 0 && `(${info.length})`}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="errors">
            <ScrollArea className="h-40 px-2">
              {errors.length === 0 && (
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground ">
                  No errors
                </div>
              )}
              {errors.map((issue) => (
                <button
                  key={issue.id}
                  className=" py-0.5 border-b border-border/50 last:border-0 text-left w-full"
                  onClick={() => focusNode(issue.nodeId)}
                >
                  <div className="text-red-500 font-medium flex items-center gap-1">
                    <CircleX className="w-3 h-3" />
                    {issue.title}
                  </div>
                  {issue.description && (
                    <div className="text-muted-foreground  leading-tight">
                      {issue.description}
                    </div>
                  )}
                </button>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="warnings">
            <ScrollArea className="h-40 px-2">
              {warnings.length === 0 && (
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                  No warnings
                </div>
              )}
              {warnings.map((issue) => (
                <button
                  key={issue.id}
                  className=" py-0.5 border-b border-border/50 last:border-0 text-left w-full"
                  onClick={() => focusNode(issue.nodeId)}
                >
                  <div className="text-amber-500 font-medium flex items-center gap-1">
                    <TriangleAlert className="w-3 h-3" />
                    {issue.title}
                  </div>
                  {issue.description && (
                    <div className="text-muted-foreground  leading-tight">
                      {issue.description}
                    </div>
                  )}
                </button>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="info">
            {" "}
            <ScrollArea className="h-40 px-2">
              {info.length === 0 && (
                <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
                  No suggestions
                </div>
              )}
              {info.map((issue) => (
                <button
                  key={issue.id}
                  className=" py-0.5 border-b border-border/50 last:border-0 text-left w-full"
                  onClick={() => focusNode(issue.nodeId)}
                >
                  <div className="text-blue-500 font-medium flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    {issue.title}
                  </div>
                  {issue.description && (
                    <div className="text-muted-foreground  leading-tight">
                      {issue.description}
                    </div>
                  )}
                </button>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="space-y-1">
          <div className="flex flex-wrap gap-1">
            <Badge
              className="cursor-pointer bg-muted text-foreground hover:bg-muted/80 px-1 h-5 "
              onClick={() => fitView({ duration: 300, padding: 0.2 })}
            >
              Fit Workflow
            </Badge>
            <Badge
              className="cursor-pointer bg-muted text-foreground hover:bg-muted/80 px-1 h-5 "
              onClick={() => {
                const firstIssueNode = all.find((issue) =>
                  Boolean(issue.nodeId),
                )?.nodeId;
                if (firstIssueNode) focusNode(firstIssueNode);
              }}
            >
              Focus Issue
            </Badge>
            <Badge className="bg-muted text-foreground px-1 h-5 ">
              {nodesCount} nodes
            </Badge>
          </div>
        </div>

        {isValid && warnings.length === 0 && info.length === 0 && (
          <div className="text-xs text-muted-foreground">
            Workflow structure is valid. Ready to simulate.
          </div>
        )}
      </div>
    </CustomPanel>
  );
}
