"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useValidation } from "@/features/panels/hooks/useValidation";
import { useWorkflowStore } from "@/lib/store";

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

  const getStatusText = () => {
    if (hasErrors) return "INVALID";
    if (hasWarnings) return "VALID WITH WARNINGS";
    return "VALID";
  };

  const getStatusColor = () => {
    if (hasErrors) return "text-red-500";
    if (hasWarnings) return "text-amber-500";
    return "text-emerald-500";
  };

  const focusNode = (nodeId?: string) => {
    if (!nodeId) return;
    setSelectedNode(nodeId);
    fitView({ nodes: [{ id: nodeId }], duration: 300, padding: 0.25 });
  };
  const shouldScroll = (count: number) => count > 3;

  return (
    <CustomPanel
      value="validation"
      title="Validation"
      icon={getStatusIcon()}
      defaultExpanded
      badge={
        <div className="flex items-center gap-1.5">
          {errors.length > 0 && (
            <Badge
              variant="destructive"
              className="h-5 px-1.5 text-[11px] font-bold min-w-5"
            >
              {errors.length}
            </Badge>
          )}
          {warnings.length > 0 && (
            <Badge className="h-5 px-1.5 text-[11px] font-bold min-w-5 bg-amber-500/20 text-amber-600">
              {warnings.length}
            </Badge>
          )}
        </div>
      }
    >
      <div className="space-y-2 pt-1  max-w-80">
        <div className="grid grid-cols-2 gap-1">
          <div className="rounded border border-border/70 p-1 text-center">
            <div className="text-[11px] text-muted-foreground">Errors</div>
            <div className="text-xs font-semibold text-red-500">
              {errors.length}
            </div>
          </div>
          <div className="rounded border border-border/70 p-1 text-center">
            <div className="text-[11px] text-muted-foreground">Warnings</div>
            <div className="text-xs font-semibold text-amber-500">
              {warnings.length}
            </div>
          </div>
          <div className="rounded border border-border/70 p-1 text-center">
            <div className="text-[11px] text-muted-foreground">Suggestions</div>
            <div className="text-xs font-semibold text-blue-500">
              {info.length}
            </div>
          </div>
          <div className="rounded border border-border/70 p-1 text-center">
            <div className="text-[11px] text-muted-foreground">State</div>
            <div className={`text-xs font-semibold ${getStatusColor()}`}>
              {isValid ? "OK" : "KO"}
            </div>
          </div>
        </div>

        <div className={`text-[11px] font-medium ${getStatusColor()}`}>
          {isValid ? "OK" : "KO"} {getStatusText()}
        </div>

        {errors.length > 0 && (
          <div className="space-y-1">
            <div className="text-[11px] text-muted-foreground uppercase">
              Errors
            </div>
            {shouldScroll(errors.length) ? (
              <ScrollArea className="h-24">
                {errors.map((issue) => (
                  <button
                    key={issue.id}
                    className="text-[11px] py-0.5 border-b border-border/50 last:border-0 text-left w-full"
                    onClick={() => focusNode(issue.nodeId)}
                  >
                    <div className="text-red-500 font-medium">
                      {issue.title}
                    </div>
                    {issue.description && (
                      <div className="text-muted-foreground text-[11px] leading-tight">
                        {issue.description}
                      </div>
                    )}
                  </button>
                ))}
              </ScrollArea>
            ) : (
              <div>
                {errors.map((issue) => (
                  <button
                    key={issue.id}
                    className="text-[11px] py-0.5 border-b border-border/50 last:border-0 text-left w-full"
                    onClick={() => focusNode(issue.nodeId)}
                  >
                    <div className="text-red-500 font-medium">
                      {issue.title}
                    </div>
                    {issue.description && (
                      <div className="text-muted-foreground text-[11px] leading-tight">
                        {issue.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="space-y-1">
            <div className="text-[11px] text-muted-foreground uppercase">
              Warnings
            </div>
            {shouldScroll(warnings.length) ? (
              <ScrollArea className="h-24">
                {warnings.map((issue) => (
                  <button
                    key={issue.id}
                    className="text-[11px] py-0.5 border-b border-border/50 last:border-0 text-left w-full"
                    onClick={() => focusNode(issue.nodeId)}
                  >
                    <div className="text-amber-500 font-medium">
                      {issue.title}
                    </div>
                    {issue.description && (
                      <div className="text-muted-foreground text-[11px] leading-tight">
                        {issue.description}
                      </div>
                    )}
                  </button>
                ))}
              </ScrollArea>
            ) : (
              <div>
                {warnings.map((issue) => (
                  <button
                    key={issue.id}
                    className="text-[11px] py-0.5 border-b border-border/50 last:border-0 text-left w-full"
                    onClick={() => focusNode(issue.nodeId)}
                  >
                    <div className="text-amber-500 font-medium">
                      {issue.title}
                    </div>
                    {issue.description && (
                      <div className="text-muted-foreground text-[11px] leading-tight">
                        {issue.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {info.length > 0 && (
          <div className="space-y-1">
            <div className="text-[11px] text-muted-foreground uppercase">
              Suggestions
            </div>
            {shouldScroll(info.length) ? (
              <ScrollArea className="h-24">
                {info.map((issue) => (
                  <button
                    key={issue.id}
                    className="text-[11px] py-0.5 border-b border-border/50 last:border-0 text-left w-full"
                    onClick={() => focusNode(issue.nodeId)}
                  >
                    <div className="text-blue-500 font-medium flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      {issue.title}
                    </div>
                    {issue.description && (
                      <div className="text-muted-foreground text-[11px] leading-tight">
                        {issue.description}
                      </div>
                    )}
                  </button>
                ))}
              </ScrollArea>
            ) : (
              <div>
                {info.map((issue) => (
                  <button
                    key={issue.id}
                    className="text-[11px] py-0.5 border-b border-border/50 last:border-0 text-left w-full"
                    onClick={() => focusNode(issue.nodeId)}
                  >
                    <div className="text-blue-500 font-medium flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      {issue.title}
                    </div>
                    {issue.description && (
                      <div className="text-muted-foreground text-[11px] leading-tight">
                        {issue.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-1">
          <div className="text-[11px] text-muted-foreground uppercase">
            Quick Actions
          </div>
          <div className="flex flex-wrap gap-1">
            <Badge
              className="cursor-pointer bg-muted text-foreground hover:bg-muted/80 px-1 h-5 text-[11px]"
              onClick={() => fitView({ duration: 300, padding: 0.2 })}
            >
              Fit Workflow
            </Badge>
            <Badge
              className="cursor-pointer bg-muted text-foreground hover:bg-muted/80 px-1 h-5 text-[11px]"
              onClick={() => {
                const firstIssueNode = all.find((issue) =>
                  Boolean(issue.nodeId),
                )?.nodeId;
                if (firstIssueNode) focusNode(firstIssueNode);
              }}
            >
              Focus Issue
            </Badge>
            <Badge className="bg-muted text-foreground px-1 h-5 text-[11px]">
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
