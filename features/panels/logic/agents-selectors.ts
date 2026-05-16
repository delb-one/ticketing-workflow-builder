import type { Agent } from "@/lib/simulation/types";
import type { WorkflowStore } from "@/lib/store";
import type { AgentFormState } from "@/features/panels/components/agent-panel/types";

const EMPTY_AGENTS: Agent[] = [];

export const createInitialAgentForm = (): AgentFormState => ({
  id: "",
  name: "",
  level: "l1",
  efficiency: 1,
  capacity: 1,
  skills: "",
});

export const selectEngineAgents = (state: WorkflowStore): Agent[] =>
  state.engineState?.agents ?? EMPTY_AGENTS;

export const selectConfiguredAgentPool = (state: WorkflowStore): Agent[] =>
  state.simulationConfig.agentPool;

export const selectConfiguredAgentsCount = (state: WorkflowStore): number =>
  state.simulationConfig.agentPool.length;

export const selectHasDuplicateAgentId = (
  agentPool: Agent[],
  agentId: string,
): boolean => {
  const normalizedId = agentId.trim().toLowerCase();
  if (!normalizedId) return false;

  return agentPool.some(
    (agent) => agent.id.trim().toLowerCase() === normalizedId,
  );
};

export const parseAgentSkills = (skills: string): string[] =>
  skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

export const buildAgentFromForm = (form: AgentFormState): Agent => {
  const parsedSkills = parseAgentSkills(form.skills);

  return {
    id: form.id.trim(),
    name: form.name.trim() || undefined,
    level: form.level,
    efficiency: form.efficiency,
    capacity: form.capacity,
    skills: parsedSkills.length > 0 ? parsedSkills : undefined,
    status: "available",
    type: "custom",
  };
};

export const selectCanAddAgent = (
  agentPool: Agent[],
  isSimulating: boolean,
  form: AgentFormState,
): boolean => {
  const hasId = form.id.trim().length > 0;
  const hasDuplicateId = selectHasDuplicateAgentId(agentPool, form.id);
  return hasId && !hasDuplicateId && !isSimulating;
};

export const buildAgentPoolWithNewAgent = (
  agentPool: Agent[],
  form: AgentFormState,
): Agent[] => [...agentPool, buildAgentFromForm(form)];

export const buildAgentPoolWithoutAgent = (
  agentPool: Agent[],
  agentId: string,
): Agent[] => agentPool.filter((agent) => agent.id !== agentId);
