import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useWorkflowStore } from "@/lib/store";
import type { TicketFormState } from "@/features/panels/components/ticket-panel/types";
import {
  buildTemplateFromForm,
  buildTicketTemplatesWithoutId,
  createInitialTicketForm,
  selectCanAddTemplate,
  selectConfiguredTicketTemplates,
  selectHasDuplicateTemplateId,
  selectTotalTickets,
} from "@/features/panels/logic/ticket-selectors";

export function useTicket() {
  const { isSimulating, ticketTemplates, addTicketTemplate, updateSimulationConfig } =
    useWorkflowStore(
      useShallow((state) => ({
        isSimulating: state.isSimulating,
        ticketTemplates: selectConfiguredTicketTemplates(state),
        addTicketTemplate: state.addTicketTemplate,
        updateSimulationConfig: state.updateSimulationConfig,
      })),
    );

  const [form, setForm] = useState<TicketFormState>(createInitialTicketForm);

  const totalTickets = useMemo(
    () => selectTotalTickets(ticketTemplates),
    [ticketTemplates],
  );

  const hasDuplicateId = useMemo(
    () => selectHasDuplicateTemplateId(ticketTemplates, form.id),
    [ticketTemplates, form.id],
  );

  const canAdd = useMemo(
    () => selectCanAddTemplate(ticketTemplates, isSimulating, form),
    [ticketTemplates, isSimulating, form],
  );

  const resetForm = () => setForm(createInitialTicketForm());

  const addTemplate = () => {
    addTicketTemplate(buildTemplateFromForm(form));
    resetForm();
  };

  const removeTemplate = (ticketId: string) => {
    updateSimulationConfig({
      ticketTemplates: buildTicketTemplatesWithoutId(ticketTemplates, ticketId),
    });
  };

  return {
    isSimulating,
    ticketTemplates,
    totalTickets,
    form,
    setForm,
    hasDuplicateId,
    canAdd,
    addTemplate,
    removeTemplate,
  };
}
