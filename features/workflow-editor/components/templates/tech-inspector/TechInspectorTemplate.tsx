"use client";
import { useState } from "react";
import { Header } from "./components/Header";
import { Overview } from "./components/Overview";
import { ActionBar } from "./components/ActionBar";
import { AgentTabs } from "./components/AgentTabs";
import { Footer } from "./components/Footer";
import { EditSection, SKILL_POOL } from "./components/EditSection";

export type Agent = {
  id: string;
  name: string;
  status: "busy" | "available";
  type: "default" | "custom";
  efficiency: number;
  capacity: number;
  skills: string[];
};

const BULK_DEFAULT_CAPACITY = 2;

export function TechInspectorTemplate() {
  const [activeTab, setActiveTab] = useState<string>("custom-agents");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);

  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const [capacityDraft, setCapacityDraft] = useState<number | null>(null);
  const [bulkSkillsDraft, setBulkSkillsDraft] = useState<string[] | null>(null);
  const [singleDraft, setSingleDraft] = useState<{
    name: string;
    capacity: number;
    skills: string[];
  } | null>(null);

  const [customAgents, setCustomAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Mario Rossi",
      status: "busy",
      type: "custom",
      efficiency: 0.8,
      capacity: 2,
      skills: ["network", "hardware"],
    },
    {
      id: "2",
      name: "Luigi Rossi",
      status: "available",
      type: "custom",
      efficiency: 0.9,
      capacity: 1,
      skills: ["security"],
    },
  ]);

  const [defaultAgents, setDefaultAgents] = useState<Agent[]>(
    Array.from({ length: 5 }).map((_, i) => ({
      id: `d-${i}`,
      name: `L1-${i + 1}`,
      status: i % 2 === 0 ? "available" : "busy",
      type: "default",
      efficiency: 1,
      capacity: 1,
      skills: [],
    })),
  );
  const allAgents = [...customAgents, ...defaultAgents];

  const getNextDefaultAgentId = () => {
    const used = new Set(
      [...customAgents, ...defaultAgents].map((agent) => agent.id),
    );

    let index = 0;
    while (used.has(`d-${index}`)) {
      index += 1;
    }

    return `d-${index}`;
  };

  const selectedAgent =
    allAgents.find((agent) => agent.id === activeAgentId) ?? null;
  const singleView =
    selectedAgent === null
      ? null
      : {
        name: singleDraft?.name ?? selectedAgent.name,
        capacity: singleDraft?.capacity ?? selectedAgent.capacity,
        skills: singleDraft?.skills ?? selectedAgent.skills,
      };

  const isBulkMode = selectedAgents.length > 1;

  const isSingleEditMode = selectedAgents.length === 1 && !!selectedAgent;

  const isIdleMode = selectedAgents.length === 0;
  const hasSingleDraftChanges =
    !!selectedAgent &&
    !!singleDraft &&
    (singleDraft.name !== selectedAgent.name ||
      singleDraft.capacity !== selectedAgent.capacity ||
      JSON.stringify(singleDraft.skills) !==
      JSON.stringify(selectedAgent.skills));

  const addDefaultAgent = () => {
    const nextId = getNextDefaultAgentId();

    setDefaultAgents((prev) => [
      ...prev,
      {
        id: nextId,
        name: `L1-${defaultAgents.length + 1}`,
        status: "available",
        type: "default",
        efficiency: 1,
        capacity: 1,
        skills: [],
      },
    ]);
  };

  const normalizeAgents = () => {
    setCustomAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        skills: ["network", "hardware"],
        efficiency: 0.8,
        capacity: 2,
      })),
    );
  };

  const clearSelection = () => {
    setSelectedAgents([]);
    setActiveAgentId(null);
    setSingleDraft(null);
    setCapacityDraft(null);
    setBulkSkillsDraft(null);
  };

  const resetCustomAgents = () => {
    setCustomAgents([]);
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
    if (ids.length === 0) return;
    const shouldRemove = window.confirm(`Remove ${ids.length} agent(s)?`);
    if (!shouldRemove) return;

    setCustomAgents((prev) => prev.filter((a) => !ids.includes(a.id)));
    setDefaultAgents((prev) => prev.filter((a) => !ids.includes(a.id)));
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

  const updateCapacityDraft = (delta: number) => {
    if (isSingleEditMode && singleView) {
      setSingleDraft({
        ...singleView,
        capacity: Math.max(1, singleView.capacity + delta),
      });
      return;
    }
    setCapacityDraft((prev) => Math.max(1, (prev ?? getCurrentCapacity()) + delta));
  };

  const increaseCapacity = () => updateCapacityDraft(1);
  const decreaseCapacity = () => updateCapacityDraft(-1);

  const updateAgents = (ids: string[], patch: Partial<Agent>) => {
    if (ids.length === 0) return;

    setDefaultAgents((prev) => prev.filter((a) => !ids.includes(a.id)));
    setCustomAgents((prevCustom) => {
      const existingCustom = prevCustom.map((a) =>
        ids.includes(a.id) ? { ...a, ...patch, type: "custom" as const } : a
      );
      const promotedDefaults = defaultAgents
        .filter((a) => ids.includes(a.id))
        .map((a) => ({ ...a, ...patch, type: "custom" as const }));

      return [...existingCustom, ...promotedDefaults];
    });
  };

  const applyBulkCapacity = () => {
    if (!isBulkMode) return;
    const hasCapacityDraft = capacityDraft !== null;
    const hasSkillsDraft = bulkSkillsDraft !== null;
    if (!hasCapacityDraft && !hasSkillsDraft) return;

    const patch: Partial<Agent> = {};
    if (hasCapacityDraft) patch.capacity = capacityDraft!;
    if (hasSkillsDraft) patch.skills = bulkSkillsDraft!;

    updateAgents(selectedAgents, patch);
    setCapacityDraft(null);
    setBulkSkillsDraft(null);
  };

  const handleNameChange = (name: string) => {
    if (!singleView) return;
    setSingleDraft({ ...singleView, name });
  };


  const toggleSkill = (skill: string) => {
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
    if (!selectedAgent || !singleDraft || !hasSingleDraftChanges) return;

    updateAgents([selectedAgent.id], {
      name: singleDraft.name.trim() || selectedAgent.name,
      capacity: singleDraft.capacity,
      skills: singleDraft.skills,
    });
    setSingleDraft(null);
  };

  const activeSelectionMode = () => {
    setIsSelectionMode((prev) => !prev);
    clearSelection();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    clearSelection();
  };

  const handleAgentSelection = (agent: Agent) => {
    const expectedType = activeTab === "custom-agents" ? "custom" : "default";
    if (agent.type !== expectedType) return;

    if (!isSelectionMode) {
      setActiveAgentId(agent.id);
      setSelectedAgents([agent.id]);
      setSingleDraft(null);
      setCapacityDraft(null);
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
            selected.every((a) => a.skills.includes(skill)),
        );
        setBulkSkillsDraft(intersection);
      }
    }
  };

  return (
    <div className="flex h-full w-80 flex-col overflow-hidden border-l bg-card">
      <div className="flex flex-1 min-h-0 flex-col">
        {/* HEADER */}
        <Header loadPercentage={loadPercentage} loadColor={loadColor} />

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
        bulkSkillsDraft={bulkSkillsDraft}
        decreaseCapacity={decreaseCapacity}
        increaseCapacity={increaseCapacity}
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
