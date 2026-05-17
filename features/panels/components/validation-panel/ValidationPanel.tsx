"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useValidation } from "@/features/panels/hooks/useValidation";

export function ValidationPanel() {
  const { errors, warnings, info, isValid, hasErrors, hasWarnings } = useValidation();

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

  return (
    <CustomPanel
      value="validation"
      title="Validation"
      icon={getStatusIcon()}
      defaultExpanded
      badge={
        <div className="flex items-center gap-1.5">
          {errors.length > 0 && (
            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-bold min-w-5">
              {errors.length}
            </Badge>
          )}
          {warnings.length > 0 && (
            <Badge className="h-5 px-1.5 text-[10px] font-bold min-w-5 bg-amber-500/20 text-amber-600">
              {warnings.length}
            </Badge>
          )}
        </div>
      }
    >
      <div className="space-y-3 pt-1">
        <div className={`text-xs font-medium ${getStatusColor()}`}>
          {isValid ? "✓" : "✖"} {getStatusText()}
        </div>

        {errors.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] text-muted-foreground uppercase">Errors</div>
            <ScrollArea className="max-h-32">
              {errors.map((issue) => (
                <div key={issue.id} className="text-xs py-1 border-b border-border/50 last:border-0">
                  <div className="text-red-500 font-medium">{issue.title}</div>
                  {issue.description && (
                    <div className="text-muted-foreground text-[10px] mt-0.5">
                      {issue.description}
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] text-muted-foreground uppercase">Warnings</div>
            <ScrollArea className="max-h-32">
              {warnings.map((issue) => (
                <div key={issue.id} className="text-xs py-1 border-b border-border/50 last:border-0">
                  <div className="text-amber-500 font-medium">{issue.title}</div>
                  {issue.description && (
                    <div className="text-muted-foreground text-[10px] mt-0.5">
                      {issue.description}
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        )}

        {info.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[11px] text-muted-foreground uppercase">Suggestions</div>
            <ScrollArea className="max-h-32">
              {info.map((issue) => (
                <div key={issue.id} className="text-xs py-1 border-b border-border/50 last:border-0">
                  <div className="text-blue-500 font-medium flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    {issue.title}
                  </div>
                  {issue.description && (
                    <div className="text-muted-foreground text-[10px] mt-0.5">
                      {issue.description}
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        )}

        {isValid && warnings.length === 0 && info.length === 0 && (
          <div className="text-xs text-muted-foreground">
            Workflow structure is valid. Ready to simulate.
          </div>
        )}
      </div>
    </CustomPanel>
  );
}