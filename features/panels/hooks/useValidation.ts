import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useWorkflowStore } from "@/lib/store";
import { ValidationIssue, selectAllIssues } from "@/features/panels/logic/validation-selectors";

export interface UseValidationResult {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  info: ValidationIssue[];
  all: ValidationIssue[];
  hasErrors: boolean;
  hasWarnings: boolean;
  isValid: boolean;
}

export function useValidation(): UseValidationResult {
  const { nodes, edges } = useWorkflowStore(
    useShallow((state) => ({ nodes: state.nodes, edges: state.edges }))
  );

  return useMemo(() => {
    const issues = selectAllIssues({ nodes, edges });
    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");
    const info = issues.filter((i) => i.severity === "info");

    return {
      errors,
      warnings,
      info,
      all: issues,
      hasErrors: errors.length > 0,
      hasWarnings: warnings.length > 0,
      isValid: errors.length === 0,
    };
  }, [nodes, edges]);
}
