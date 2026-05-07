import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Plus, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Header } from "./components/Header";
import { Overview } from "./components/Overview";
import { ActionBar } from "./components/ActionBar";
import { AgentList } from "./components/AgentList";
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

  const resetCustomAgents = () => {
    setCustomAgents([]);
    setSelectedAgents([]);
    setActiveAgentId(null);
    setSingleDraft(null);
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

  const removeSelectedAgents = () => {
    const shouldRemove = window.confirm(
      `Remove ${selectedAgents.length} selected agent(s)?`,
    );
    if (!shouldRemove) return;

    setCustomAgents((prev) =>
      prev.filter((agent) => !selectedAgents.includes(agent.id)),
    );

    setDefaultAgents((prev) =>
      prev.filter((agent) => !selectedAgents.includes(agent.id)),
    );

    setSelectedAgents([]);
    setActiveAgentId(null);
    setSingleDraft(null);
  };

  const removeSingleAgent = () => {
    if (!selectedAgent) return;
    const shouldRemove = window.confirm(
      `Remove agent "${selectedAgent.name}"?`,
    );
    if (!shouldRemove) return;

    const targetId = selectedAgent.id;
    setCustomAgents((prev) => prev.filter((agent) => agent.id !== targetId));
    setDefaultAgents((prev) => prev.filter((agent) => agent.id !== targetId));
    setSelectedAgents([]);
    setActiveAgentId(null);
    setSingleDraft(null);
  };

  const getCurrentCapacity = () => {
    if (isSingleEditMode && selectedAgent) {
      return singleView?.capacity ?? selectedAgent.capacity;
    }

    if (isBulkMode) {
      return capacityDraft ?? 2; // default bulk mock
    }

    return 0;
  };

  const getCurrentBulkSkills = () => {
    if (!isBulkMode) return [];
    return bulkSkillsDraft ?? [];
  };

  const increaseCapacity = () => {
    if (isSingleEditMode && singleView) {
      setSingleDraft({
        name: singleView.name,
        capacity: singleView.capacity + 1,
        skills: singleView.skills,
      });
      return;
    }

    setCapacityDraft((prev) => {
      const base = prev ?? getCurrentCapacity();
      return base + 1;
    });
  };

  const decreaseCapacity = () => {
    if (isSingleEditMode && singleView) {
      setSingleDraft({
        name: singleView.name,
        capacity: Math.max(1, singleView.capacity - 1),
        skills: singleView.skills,
      });
      return;
    }

    setCapacityDraft((prev) => {
      const base = prev ?? getCurrentCapacity();
      return Math.max(1, base - 1);
    });
  };

  const applyBulkCapacity = () => {
    if (!isBulkMode) return;

    const hasCapacityDraft = capacityDraft !== null;
    const hasSkillsDraft = bulkSkillsDraft !== null;
    if (!hasCapacityDraft && !hasSkillsDraft) return;

    setCustomAgents((prevCustom) => {
      const defaultToPromote = defaultAgents
        .filter((agent) => selectedAgents.includes(agent.id))
        .map((agent) => ({
          ...agent,
          type: "custom" as const,
          capacity: hasCapacityDraft ? capacityDraft! : agent.capacity,
          skills: hasSkillsDraft ? bulkSkillsDraft! : agent.skills,
        }));

      const updatedCustom = prevCustom.map((agent) =>
        selectedAgents.includes(agent.id)
          ? {
              ...agent,
              capacity: hasCapacityDraft ? capacityDraft! : agent.capacity,
              skills: hasSkillsDraft ? bulkSkillsDraft! : agent.skills,
            }
          : agent,
      );

      return [...updatedCustom, ...defaultToPromote];
    });

    setDefaultAgents((prevDefault) =>
      prevDefault.filter((agent) => !selectedAgents.includes(agent.id)),
    );

    setCapacityDraft(null);
    setBulkSkillsDraft(null);
  };

  const applyPatchToAgent = (agentId: string, patch: Partial<Agent>) => {
    const defaultAgent = defaultAgents.find((agent) => agent.id === agentId);

    if (defaultAgent) {
      setDefaultAgents((prev) => prev.filter((agent) => agent.id !== agentId));
      setCustomAgents((prev) => {
        const existing = prev.find((agent) => agent.id === agentId);

        if (existing) {
          return prev.map((agent) =>
            agent.id === agentId
              ? { ...agent, ...patch, type: "custom" }
              : agent,
          );
        }

        return [...prev, { ...defaultAgent, ...patch, type: "custom" }];
      });
      return;
    }

    setCustomAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId ? { ...agent, ...patch, type: "custom" } : agent,
      ),
    );
  };

  const handleNameChange = (name: string) => {
    if (!singleView) return;
    setSingleDraft({
      ...singleView,
      name,
    });
  };

  const changeName = () => {};

  const addSkillToSingle = (skill: string) => {
    if (!singleView) return;
    if (singleView.skills.includes(skill)) return;

    setSingleDraft({
      ...singleView,
      skills: [...singleView.skills, skill],
    });
  };

  const removeSkillFromSingle = (skill: string) => {
    if (!singleView) return;

    setSingleDraft({
      ...singleView,
      skills: singleView.skills.filter((s) => s !== skill),
    });
  };

  const toggleSkillForSingle = (skill: string) => {
    if (!selectedAgent) return;

    if ((singleView?.skills ?? []).includes(skill)) {
      removeSkillFromSingle(skill);
      return;
    }

    addSkillToSingle(skill);
  };

  const isSkillActiveInBulk = (skill: string) =>
    getCurrentBulkSkills().includes(skill);

  const toggleSkillForBulk = (skill: string) => {
    if (!isBulkMode) return;
    const current = getCurrentBulkSkills();
    const next = current.includes(skill)
      ? current.filter((s) => s !== skill)
      : [...current, skill];
    setBulkSkillsDraft(next);
  };

  const applySingleChanges = () => {
    if (!selectedAgent || !singleDraft || !hasSingleDraftChanges) return;

    applyPatchToAgent(selectedAgent.id, {
      name: singleDraft.name.trim() || selectedAgent.name,
      capacity: singleDraft.capacity,
      skills: singleDraft.skills,
    });

    setSingleDraft(null);
  };

  const activeSelectionMode = () => {
    setIsSelectionMode((prev) => {
      const nextMode = !prev;
      setSelectedAgents([]);
      setActiveAgentId(null);
      setSingleDraft(null);
      setCapacityDraft(null);
      setBulkSkillsDraft(null);
      return nextMode;
    });
  };

  const stupidFunction = (agent: Agent) => {
    if (!isSelectionMode) {
      setActiveAgentId(agent.id);
      setSelectedAgents([agent.id]);
      setSingleDraft(null);
      setCapacityDraft(null);
      setBulkSkillsDraft(null);
      return;
    }

    setSelectedAgents((prev) => {
      const next = prev.includes(agent.id)
        ? prev.filter((a) => a !== agent.id)
        : [...prev, agent.id];

      if (next.length === 1) {
        setActiveAgentId(next[0]);
      } else {
        setActiveAgentId(null);
        if (capacityDraft === null) {
          const selected = allAgents.filter((a) => next.includes(a.id));
          const allSameCapacity =
            selected.length > 0 &&
            selected.every((a) => a.capacity === selected[0].capacity);
          setCapacityDraft(
            allSameCapacity ? selected[0].capacity : BULK_DEFAULT_CAPACITY,
          );
        }

        if (bulkSkillsDraft === null) {
          const selected = allAgents.filter((a) => next.includes(a.id));
          const intersection = SKILL_POOL.filter(
            (skill) =>
              selected.length > 0 &&
              selected.every((a) => a.skills.includes(skill)),
          );
          setBulkSkillsDraft(intersection);
        }
      }

      return next;
    });
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
        <AgentList
          customAgents={customAgents}
          defaultAgents={defaultAgents}
          selectedAgents={selectedAgents}
          activeAgentId={activeAgentId}
          isSelectionMode={isSelectionMode}
          stupidFunction={stupidFunction}
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
