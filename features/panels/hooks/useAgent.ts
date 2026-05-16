import { useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useWorkflowStore } from "@/lib/store";
import type { AgentFormState } from "@/features/panels/components/agent-panel/types";
import {
  buildAgentPoolWithNewAgent,
  buildAgentPoolWithoutAgent,
  createInitialAgentForm,
  selectCanAddAgent,
  selectConfiguredAgentPool,
  selectConfiguredAgentsCount,
  selectEngineAgents,
  selectHasDuplicateAgentId,
} from "@/features/panels/logic/agents-selectors";

export function useAgent() {
  const { isSimulating, agents, agentPool, totalAgents, updateSimulationConfig } =
    useWorkflowStore(
      useShallow((state) => ({
        isSimulating: state.isSimulating,
        agents: selectEngineAgents(state),
        agentPool: selectConfiguredAgentPool(state),
        totalAgents: selectConfiguredAgentsCount(state),
        updateSimulationConfig: state.updateSimulationConfig,
      })),
    );

  const [form, setForm] = useState<AgentFormState>(createInitialAgentForm);

  const hasDuplicateId = useMemo(
    () => selectHasDuplicateAgentId(agentPool, form.id),
    [agentPool, form.id],
  );

  const canAdd = useMemo(
    () => selectCanAddAgent(agentPool, isSimulating, form),
    [agentPool, form, isSimulating],
  );

  const addAgent = () => {
    updateSimulationConfig({
      agentPool: buildAgentPoolWithNewAgent(agentPool, form),
    });
    setForm(createInitialAgentForm());
  };

  const removeAgent = (agentId: string) => {
    updateSimulationConfig({
      agentPool: buildAgentPoolWithoutAgent(agentPool, agentId),
    });
  };

  return {
    isSimulating,
    agents,
    agentPool,
    totalAgents,
    form,
    setForm,
    hasDuplicateId,
    canAdd,
    addAgent,
    removeAgent,
  };
}
