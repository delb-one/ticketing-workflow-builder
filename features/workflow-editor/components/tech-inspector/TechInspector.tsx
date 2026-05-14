"use client";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Overview } from "./components/Overview";
import { ActionBar } from "./components/ActionBar";
import { AgentTabs } from "./components/AgentTabs";
import { Footer } from "./components/Footer";
import { EditSection, SKILL_POOL } from "./components/EditSection";
import { CustomNode, useWorkflowStore } from "@/lib/store";
import type { Agent as SimulationAgent } from "@/lib/simulation/types";

export type Agent = SimulationAgent;

interface TechInspectorProps {
  selectedNode: CustomNode;

}

const BULK_DEFAULT_CAPACITY = 2;
type SingleDraft = {
  name: string;
  capacity: number;
  efficiency: number;
  skills: string[];
};

export function TechInspector({ selectedNode }: TechInspectorProps) {
  const {
    simulationConfig,
    engineState,
    addAgentProfile,
    removeAgentProfiles,
    replaceAgentPool,
    isSimulating,
  } = useWorkflowStore();
  const [activeTab, setActiveTab] = useState<string>("custom-agents");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);

  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [capacityDraft, setCapacityDraft] = useState<number | null>(null);
  const [efficiencyDraft, setEfficiencyDraft] = useState<number | null>(null);
  const [bulkSkillsDraft, setBulkSkillsDraft] = useState<string[] | null>(null);
  const [singleDraft, setSingleDraft] = useState<SingleDraft | null>(null);

  const liveAgents = engineState?.agents ?? [];
  const allAgents = isSimulating
    ? simulationConfig.agentPool.map((agent) => {
      const live = liveAgents.find((a) => a.id === agent.id);
      return live ? { ...agent, status: live.status, currentTicketId: live.currentTicketId } : agent;
    })
    : simulationConfig.agentPool;
  const customAgents = allAgents.filter((agent) => agent.type === "custom");
  const defaultAgents = allAgents.filter((agent) => agent.type === "default");

  const getNextDefaultAgentId = () => {
    const used = new Set(
      allAgents.map((agent) => agent.id),
    );

    let index = 0;
    while (used.has(`d-${index}`)) {
      index += 1;
    }

    return `d-${index}`;
  };

  useEffect(() => {
    const validIds = new Set(allAgents.map((agent) => agent.id));
    setSelectedAgents((prev) => {
      const next = prev.filter((id) => validIds.has(id));
      if (next.length === prev.length && next.every((id, index) => id === prev[index])) {
        return prev;
      }
      return next;
    });
    setActiveAgentId((prev) => {
      const next = prev && validIds.has(prev) ? prev : null;
      return next === prev ? prev : next;
    });
  }, [allAgents]);

  useEffect(() => {
    if (selectedAgents.length === 0) {
      setSingleDraft(null);
      setCapacityDraft(null);
      setEfficiencyDraft(null);
      setBulkSkillsDraft(null);
      return;
    }

    if (selectedAgents.length === 1) {
      setCapacityDraft(null);
      setEfficiencyDraft(null);
      setBulkSkillsDraft(null);
      return;
    }

    setSingleDraft(null);
  }, [selectedAgents.length]);

  const selectedAgent =
    allAgents.find((agent) => agent.id === activeAgentId) ?? null;
  const singleView =
    selectedAgent === null
      ? null
      : {
        name: singleDraft?.name ?? selectedAgent.name ?? selectedAgent.id,
        capacity: singleDraft?.capacity ?? selectedAgent.capacity,
        efficiency: singleDraft?.efficiency ?? selectedAgent.efficiency,
        skills: singleDraft?.skills ?? selectedAgent.skills ?? [],
      };

  const isBulkMode = selectedAgents.length > 1;

  const isSingleEditMode = selectedAgents.length === 1 && !!selectedAgent;

  const isIdleMode = selectedAgents.length === 0;
  const hasSingleDraftChanges =
    !!selectedAgent &&
    !!singleDraft &&
    (singleDraft.name !== (selectedAgent.name ?? selectedAgent.id) ||
      singleDraft.capacity !== selectedAgent.capacity ||
      singleDraft.efficiency !== selectedAgent.efficiency ||
      JSON.stringify(singleDraft.skills) !==
      JSON.stringify(selectedAgent.skills ?? []));

  const addDefaultAgent = () => {
    if (isSimulating) return;
    const nextId = getNextDefaultAgentId();
    addAgentProfile({
      id: nextId,
      name: `L1-${defaultAgents.length + 1}`,
      status: "available",
      type: "default",
      efficiency: 1,
      capacity: 1,
      skills: [],
      level: "l1",
    });
  };

  const normalizeAgents = () => {
    if (isSimulating) return;
    const normalized = allAgents.map((agent) =>
      agent.type === "custom"
        ? {
        ...agent,
        skills: ["network", "hardware"],
        efficiency: 0.8,
        capacity: 2,
          }
        : agent,
    );
    replaceAgentPool(normalized);
  };

  const clearSelection = () => {
    setSelectedAgents([]);
    setActiveAgentId(null);
    setSingleDraft(null);
    setCapacityDraft(null);
    setEfficiencyDraft(null);
    setBulkSkillsDraft(null);
  };

  const resetCustomAgents = () => {
    if (isSimulating) return;
    removeAgentProfiles(customAgents.map((agent) => agent.id));
    clearSelection();
  };

  const totalAgents = allAgents.length;

  const totalCapacity = allAgents.reduce(
    (acc, agent) => acc + agent.capacity,
    0,
  );

  const busyAgents = allAgents.filter(
    (agent) => agent.status === "busy",
  ).length;

  const availableAgents = allAgents.filter(
    (agent) => agent.status === "available",
  ).length;

  const loadPercentage =
    totalCapacity > 0 ? Math.round((busyAgents / totalCapacity) * 100) : 0;

  const loadColor =
    loadPercentage <= 40
      ? "bg-green-500"
      : loadPercentage <= 70
        ? "bg-orange-500"
        : "bg-red-500";

  const removeAgents = (ids: string[]) => {
    if (isSimulating) return;
    if (ids.length === 0) return;
    const shouldRemove = window.confirm(`Remove ${ids.length} agent(s)?`);
    if (!shouldRemove) return;

    removeAgentProfiles(ids);
    clearSelection();
  };

  const removeSelectedAgents = () => removeAgents(selectedAgents);
  const removeSingleAgent = () => selectedAgent && removeAgents([selectedAgent.id]);

  const getCurrentCapacity = () => {
    if (isSingleEditMode && selectedAgent) {
      return singleView?.capacity ?? selectedAgent.capacity;
    }
    if (isBulkMode) return capacityDraft ?? BULK_DEFAULT_CAPACITY;
    return 0;
  };

  const getCurrentBulkSkills = () => {
    if (!isBulkMode) return [];
    return bulkSkillsDraft ?? [];
  };

  const getCurrentEfficiency = () => {
    if (isSingleEditMode && selectedAgent) {
      return singleView?.efficiency ?? selectedAgent.efficiency;
    }
    if (isBulkMode) return efficiencyDraft ?? 1;
    return 1;
  };

  const updateEfficiencyDraft = (value: number) => {
    const next = Math.max(0.1, Math.min(2, Number(value.toFixed(1))));
    if (isSingleEditMode && singleView) {
      setSingleDraft({
        ...singleView,
        efficiency: next,
      });
      return;
    }
    setEfficiencyDraft(next);
  };

  const updateCapacityDraftFromSlider = (value: number) => {
    const next = Math.max(1, Math.round(value));
    if (isSingleEditMode && singleView) {
      setSingleDraft({
        ...singleView,
        capacity: next,
      });
      return;
    }
    setCapacityDraft(next);
  };

  const updateAgents = (ids: string[], patch: Partial<Agent>) => {
    if (isSimulating) return;
    if (ids.length === 0) return;

    const next = allAgents.map((agent) =>
      ids.includes(agent.id)
        ? { ...agent, ...patch, type: "custom" as const }
        : agent,
    );
    replaceAgentPool(next);
  };

  const applyBulkCapacity = () => {
    if (isSimulating) return;
    if (!isBulkMode) return;
    const hasCapacityDraft = capacityDraft !== null;
    const hasEfficiencyDraft = efficiencyDraft !== null;
    const hasSkillsDraft = bulkSkillsDraft !== null;
    if (!hasCapacityDraft && !hasEfficiencyDraft && !hasSkillsDraft) return;

    const patch: Partial<Agent> = {};
    if (hasCapacityDraft && capacityDraft !== null) patch.capacity = capacityDraft;
    if (hasEfficiencyDraft && efficiencyDraft !== null) patch.efficiency = efficiencyDraft;
    if (hasSkillsDraft && bulkSkillsDraft !== null) patch.skills = bulkSkillsDraft;

    updateAgents(selectedAgents, patch);
    setCapacityDraft(null);
    setEfficiencyDraft(null);
    setBulkSkillsDraft(null);
  };

  const handleNameChange = (name: string) => {
    if (isSimulating) return;
    if (!singleView) return;
    setSingleDraft({ ...singleView, name });
  };


  const toggleSkill = (skill: string) => {
    if (isSimulating) return;
    if (isSingleEditMode && singleView) {
      const skills = singleView.skills;
      const nextSkills = skills.includes(skill)
        ? skills.filter((s) => s !== skill)
        : [...skills, skill];
      setSingleDraft({ ...singleView, skills: nextSkills });
      return;
    }

    if (isBulkMode) {
      const current = getCurrentBulkSkills();
      const next = current.includes(skill)
        ? current.filter((s) => s !== skill)
        : [...current, skill];
      setBulkSkillsDraft(next);
    }
  };

  const toggleSkillForSingle = toggleSkill;
  const toggleSkillForBulk = toggleSkill;

  const isSkillActiveInBulk = (skill: string) =>
    getCurrentBulkSkills().includes(skill);

  const applySingleChanges = () => {
    if (isSimulating) return;
    if (!selectedAgent || !singleDraft || !hasSingleDraftChanges) return;

    updateAgents([selectedAgent.id], {
      name: singleDraft.name.trim() || selectedAgent.name || selectedAgent.id,
      capacity: singleDraft.capacity,
      skills: singleDraft.skills,
      efficiency: singleDraft.efficiency,
    });
    setSingleDraft(null);
  };

  const activeSelectionMode = () => {
    if (isSimulating) return;
    setIsSelectionMode((prev) => !prev);
    clearSelection();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    clearSelection();
  };

  const handleAgentSelection = (agent: Agent) => {
    if (isSimulating) return;
    const expectedType = activeTab === "custom-agents" ? "custom" : "default";
    if (agent.type !== expectedType) return;

    if (!isSelectionMode) {
      setActiveAgentId(agent.id);
      setSelectedAgents([agent.id]);
      setSingleDraft(null);
      setCapacityDraft(null);
      setEfficiencyDraft(null);
      setBulkSkillsDraft(null);
      return;
    }

    const nextSelected = selectedAgents.includes(agent.id)
      ? selectedAgents.filter((a) => a !== agent.id)
      : [...selectedAgents, agent.id];

    setSelectedAgents(nextSelected);

    if (nextSelected.length === 1) {
      setActiveAgentId(nextSelected[0]);
    } else {
      setActiveAgentId(null);

      if (capacityDraft === null) {
        const selected = allAgents.filter((a) => nextSelected.includes(a.id));
        const allSameCapacity =
          selected.length > 0 &&
          selected.every((a) => a.capacity === selected[0].capacity);
        setCapacityDraft(
          allSameCapacity ? selected[0].capacity : BULK_DEFAULT_CAPACITY,
        );
      }

      if (bulkSkillsDraft === null) {
        const selected = allAgents.filter((a) => nextSelected.includes(a.id));
        const intersection = SKILL_POOL.filter(
          (skill) =>
            selected.length > 0 &&
            selected.every((a) => (a.skills ?? []).includes(skill)),
        );
        setBulkSkillsDraft(intersection);
      }
    }
  };

  return (
    <div className="flex h-full w-80 flex-col overflow-hidden bg-transparent">
      <div className="flex flex-1 min-h-0 flex-col">
        {/* HEADER */}
        <Header selectedNode={selectedNode} loadPercentage={loadPercentage} loadColor={loadColor} />

        {/* OVERVIEW */}
        <Overview
          availableAgents={availableAgents}
          busyAgents={busyAgents}
          totalAgents={totalAgents}
          totalCapacity={totalCapacity}
        />

        {/* ACTION BAR */}
        <ActionBar
          addDefaultAgent={addDefaultAgent}
          isSelectionMode={isSelectionMode}
          normalizeAgents={normalizeAgents}
          resetCustomAgents={resetCustomAgents}
          activeSelectionMode={activeSelectionMode}
          disabled={isSimulating}
        />

        {/* LIST */}
        <AgentTabs
          customAgents={customAgents}
          defaultAgents={defaultAgents}
          selectedAgents={selectedAgents}
          activeAgentId={activeAgentId}
          isSelectionMode={isSelectionMode}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          handleAgentSelection={handleAgentSelection}
        />
      </div>

      {/* EDIT SECTION */}
      <EditSection
        isIdleMode={isIdleMode}
        isBulkMode={isBulkMode}
        selectedAgents={selectedAgents}
        selectedAgent={selectedAgent}
        hasSingleDraftChanges={hasSingleDraftChanges}
        singleView={singleView}
        capacityDraft={capacityDraft}
        efficiencyDraft={efficiencyDraft}
        bulkSkillsDraft={bulkSkillsDraft}
        updateCapacityDraftFromSlider={updateCapacityDraftFromSlider}
        getCurrentEfficiency={getCurrentEfficiency}
        updateEfficiencyDraft={updateEfficiencyDraft}
        removeSingleAgent={removeSingleAgent}
        removeSelectedAgents={removeSelectedAgents}
        handleNameChange={handleNameChange}
        applySingleChanges={applySingleChanges}
        getCurrentCapacity={getCurrentCapacity}
        applyBulkCapacity={applyBulkCapacity}
        toggleSkillForSingle={toggleSkillForSingle}
        isSkillActiveInBulk={isSkillActiveInBulk}
        toggleSkillForBulk={toggleSkillForBulk}
        isSingleEditMode={isSingleEditMode}
        disabled={isSimulating}
      />


      {/* FOOTER STATUS */}
      <Footer
        isBulkMode={isBulkMode}
        isIdleMode={isIdleMode}
        selectedAgent={selectedAgent}
        selectedAgents={selectedAgents}
      />
    </div>
  );
}
