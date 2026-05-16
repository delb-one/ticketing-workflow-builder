import type { TicketTemplate } from "@/lib/simulation/types";
import type { WorkflowStore } from "@/lib/store";
import type { TicketFormState } from "@/features/panels/components/ticket-panel/types";

const EMPTY_TICKET_TEMPLATES: TicketTemplate[] = [];

export const createInitialTicketForm = (): TicketFormState => ({
  id: "",
  priority: "medium",
  impact: "medium",
  category: "",
  description: "",
  autoSpawnCount: 1,
});

export const selectConfiguredTicketTemplates = (
  state: WorkflowStore,
): TicketTemplate[] => state.simulationConfig.ticketTemplates ?? EMPTY_TICKET_TEMPLATES;

export const selectTotalTickets = (templates: TicketTemplate[]): number =>
  templates.reduce(
    (sum, template) => sum + Math.max(1, template.autoSpawnCount ?? 1),
    0,
  );

export const selectHasDuplicateTemplateId = (
  templates: TicketTemplate[],
  ticketId: string,
): boolean => {
  const normalizedId = ticketId.trim().toLowerCase();
  if (!normalizedId) return false;

  return templates.some(
    (template) => template.id.trim().toLowerCase() === normalizedId,
  );
};

export const selectCanAddTemplate = (
  templates: TicketTemplate[],
  isSimulating: boolean,
  form: TicketFormState,
): boolean => {
  const hasId = form.id.trim().length > 0;
  const hasDuplicateId = selectHasDuplicateTemplateId(templates, form.id);
  return hasId && !hasDuplicateId && !isSimulating;
};

export const buildTemplateFromForm = (form: TicketFormState): TicketTemplate => ({
  id: form.id.trim(),
  priority: form.priority,
  impact: form.impact,
  category: form.category.trim() || undefined,
  description: form.description.trim() || undefined,
  autoSpawnCount: form.autoSpawnCount,
});

export const buildTicketTemplatesWithoutId = (
  templates: TicketTemplate[],
  ticketId: string,
): TicketTemplate[] => templates.filter((template) => template.id !== ticketId);
