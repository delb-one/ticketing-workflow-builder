import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Plus, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

type Agent = {
  id: string;
  name: string;
  status: "busy" | "available";
  type: "default" | "custom";
  efficiency: number;
  capacity: number;
  skills: string[];
};

const BULK_DEFAULT_CAPACITY = 2;
const SKILL_POOL = [
  "network",
  "hardware",
  "security",
  "cloud",
  "database",
  "linux",
];

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
      efficiency: 0.7,
      capacity: 1,
      skills: ["network"],
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
        efficiency: 0.7,
        capacity: 2,
        skills: ["network"],
      },
    ]);
  };

  const normalizeAgents = () => {
    setCustomAgents((prev) =>
      prev.map((agent) => ({
        ...agent,
        skills: ['network', 'hardware'],
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
  return (
    <div className="flex h-full w-80 flex-col overflow-hidden border-l bg-card">
      <div className="flex flex-1 min-h-0 flex-col">
        {/* HEADER */}
        <div className="p-3 space-y-2">
          <div>
            <h2 className="font-semibold text-sm">🎧 L1 Support Node</h2>
            <p className="text-xs text-muted-foreground">Node ID: 4134133</p>
          </div>

          {/* LABEL */}
          <div className="text-xs text-muted-foreground">Node load</div>

          {/* PROGRESS BAR */}
          <div className="h-2 w-full bg-muted rounded overflow-hidden">
            <div
              className={`h-2 rounded transition-all ${loadColor}`}
              style={{ width: `${loadPercentage}%` }}
            />
          </div>

          {/* PERCENTAGE */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Load</span>

            {loadPercentage > 0 && (
              <span className="text-xs text-muted-foreground">
                {loadPercentage}%
              </span>
            )}
          </div>
        </div>

        {/* OVERVIEW */}
        <div className="p-3 space-y-2">
          <div className="grid grid-cols-4 gap-2 text-center">
            {/* AGENTS */}
            <div className="rounded border p-2">
              <p className="text-[10px] text-muted-foreground uppercase">
                Agents
              </p>

              <p className="text-sm font-semibold">{totalAgents}</p>
            </div>

            {/* CAPACITY */}
            <div className="rounded border p-2">
              <p className="text-[10px] text-muted-foreground uppercase">
                Capacity
              </p>

              <p className="text-sm font-semibold">{totalCapacity}</p>
            </div>

            {/* BUSY */}
            <div className="rounded border p-2">
              <p className="text-[10px] text-muted-foreground uppercase">
                Busy
              </p>

              <p className="text-sm font-semibold text-orange-500">
                {busyAgents}
              </p>
            </div>

            {/* AVAILABLE */}
            <div className="rounded border p-2">
              <p className="text-[10px] text-muted-foreground uppercase">
                Available
              </p>

              <p className="text-sm font-semibold text-green-500">
                {availableAgents}
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BAR */}
        <div className="p-2 flex items-center justify-between ">
          <div className="flex items-center bg-primary gap-2 p-2 rounded-md border-none shadow-none ">
            <button
              onClick={addDefaultAgent}
              className="font-semibold text-xs text-secondary flex items-center gap-2"
            >
              <span>Add Agent</span>
              <Plus className="h-4 w-4 text-secondary" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsSelectionMode((prev) => {
                  const nextMode = !prev;
                  setSelectedAgents([]);
                  setActiveAgentId(null);
                  setSingleDraft(null);
                  setCapacityDraft(null);
                  setBulkSkillsDraft(null);
                  return nextMode;
                });
              }}
              className={`p-2 rounded-md transition-colors
  ${isSelectionMode ? "bg-primary text-secondary" : "hover:bg-muted/60"}
  `}
            >
              <Edit className="h-4 w-4" />
            </button>

            <button
              onClick={normalizeAgents}
              className="p-2 rounded-md bg-transparent border-none shadow-none hover:bg-muted/60 cursor-pointer transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            <button
              onClick={resetCustomAgents}
              className="p-2 rounded-md bg-transparent border-none shadow-none hover:bg-muted/60 cursor-pointer transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* LIST */}
        <div className="flex min-h-0 flex-1 flex-col p-2">


          <ScrollArea className="h-full min-h-0 pr-1">



          {/* CUSTOM AGENTS */}

          <p className="mb-2 text-xs text-muted-foreground">Custom Agents ({customAgents.length})</p>
          <hr />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {customAgents.map((agent) => {
              const isSelected = selectedAgents.includes(agent.id);

              const isActive = activeAgentId === agent.id && !isSelectionMode;
              const isSelectionActive = isSelectionMode && isSelected;

              return (
                <div
                  key={agent.id}
                  onClick={() => {
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
                          const selected = allAgents.filter((a) =>
                            next.includes(a.id),
                          );
                          const allSameCapacity =
                            selected.length > 0 &&
                            selected.every(
                              (a) => a.capacity === selected[0].capacity,
                            );
                          setCapacityDraft(
                            allSameCapacity
                              ? selected[0].capacity
                              : BULK_DEFAULT_CAPACITY,
                          );
                        }

                        if (bulkSkillsDraft === null) {
                          const selected = allAgents.filter((a) =>
                            next.includes(a.id),
                          );
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
                  }}
                  className={`
                    flex items-center gap-2 p-1 rounded cursor-pointer border transition-colors
                    ${
                      isSelectionActive
                        ? "bg-primary/10 border-primary/30"
                        : isActive
                          ? "bg-primary/10 border-primary/30"
                          : "border-transparent hover:bg-muted"
                    }
                  `}
                >
                  {/* STATUS */}
                  <div
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      agent.status === "busy" ? "bg-orange-500" : "bg-green-500"
                    }`}
                  />

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{agent.name}</p>

                    <p className="text-[10px] text-muted-foreground">Custom</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* DEFAULT AGENTS */}

          <p className="mb-2 mt-3 text-xs text-muted-foreground">Default Agents ({defaultAgents.length})</p>
          <hr />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {defaultAgents.map((agent) => {
              const isSelected = selectedAgents.includes(agent.id);

              const isActive = activeAgentId === agent.id && !isSelectionMode;
              const isSelectionActive = isSelectionMode && isSelected;

              return (
                <div
                  key={agent.id}
                  onClick={() => {
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
                          const selected = allAgents.filter((a) =>
                            next.includes(a.id),
                          );
                          const allSameCapacity =
                            selected.length > 0 &&
                            selected.every(
                              (a) => a.capacity === selected[0].capacity,
                            );
                          setCapacityDraft(
                            allSameCapacity
                              ? selected[0].capacity
                              : BULK_DEFAULT_CAPACITY,
                          );
                        }

                        if (bulkSkillsDraft === null) {
                          const selected = allAgents.filter((a) =>
                            next.includes(a.id),
                          );
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
                  }}
                  className={`
                    flex items-center gap-2 p-1 rounded cursor-pointer border transition-colors
                    ${
                      isSelectionActive
                        ? "bg-primary/10 border-primary/30"
                        : isActive
                          ? "bg-primary/10 border-primary/30"
                          : "border-transparent hover:bg-muted"
                    }
                  `}
                >
                  {/* STATUS */}
                  <div
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      agent.status === "busy" ? "bg-orange-500" : "bg-green-500"
                    }`}
                  />

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{agent.name}</p>

                    <p className="text-[10px] text-muted-foreground">Default</p>
                  </div>
                </div>
              );
            })}
          </div>


          </ScrollArea>
        </div>
      </div>

      <div className="border-t p-3 space-y-3 bg-card">
        {/* IDLE MODE */}
        {isIdleMode && (
          <div className="flex items-center justify-center py-8">
            <p className="text-xs text-muted-foreground">
              Select an agent to edit
            </p>
          </div>
        )}

        {/* SINGLE EDIT MODE */}
        {isSingleEditMode && selectedAgent && (
          <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div>
                <input
                  value={singleView?.name ?? selectedAgent.name}
                  onChange={(event) => handleNameChange(event.target.value)}
                  className="text-sm font-semibold bg-transparent border rounded px-2 py-1 w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    selectedAgent.status === "busy"
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                />

                <span className="text-[10px] text-muted-foreground capitalize">
                  {selectedAgent.status}
                </span>
              </div>
            </div>
            {/* <p className="text-[10px] uppercase text-muted-foreground">
                  {selectedAgent.type}
                </p> */}

            {/* EFFICIENCY */}
            {/* <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs">Efficiency</p>
                <span className="text-[10px] text-muted-foreground">
                  {selectedAgent.efficiency}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={selectedAgent.efficiency}
                className="w-full"
              />
            </div> */}

            {/* CAPACITY (FIXED) */}
            <div className="space-y-2">
              <p className="text-xs">Capacity</p>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseCapacity}
                    className="px-2 border rounded hover:bg-muted"
                  >
                    -
                  </button>

                  <span className="text-xs font-medium">
                    {getCurrentCapacity()}
                  </span>

                  <button
                    onClick={increaseCapacity}
                    className="px-2 border rounded hover:bg-muted"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* SKILLS */}
            <div className="space-y-2">
              <p className="text-xs">Skills</p>

              <div className="flex gap-1 flex-wrap">
                {SKILL_POOL.map((skill) => {
                  const isActive = (singleView?.skills ?? []).includes(skill);

                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkillForSingle(skill)}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                        isActive
                          ? "bg-primary text-secondary border-primary"
                          : "bg-muted hover:bg-muted/80 border-transparent"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* ACTION */}
            {/* {selectedAgent.type === "custom" && (
              <button className="w-full text-xs border rounded py-1 hover:bg-muted">
                Reset to Default
              </button>
            )} */}
<div className="flex items-center gap-2">

            <button
              onClick={applySingleChanges}
              disabled={!hasSingleDraftChanges}
              className="w-full text-xs bg-primary text-secondary rounded py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Changes
            </button>

            <button
              onClick={removeSingleAgent}
              className="w-full text-xs border border-red-500 text-red-500 rounded py-1 hover:bg-red-500/10"
            >
              Remove Agent
            </button>
</div>
          </div>
        )}

        {/* BULK MODE */}
        {isBulkMode && (
          <div className="space-y-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Bulk Edit</p>

              <span className="text-[10px] text-muted-foreground">
                {selectedAgents.length} selected
              </span>
            </div>

            {/* EFFICIENCY */}
            {/* <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs">Efficiency</p>
                <span className="text-[10px] text-muted-foreground">Mixed</span>
              </div>

              <input type="range" className="w-full" />
            </div> */}

            {/* CAPACITY (SHARED LOGIC) */}
            <div className="space-y-2">
              <p className="text-xs">Capacity</p>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseCapacity}
                    className="px-2 border rounded hover:bg-muted"
                  >
                    -
                  </button>

                  <span className="text-xs font-medium">
                    {getCurrentCapacity()}
                  </span>

                  <button
                    onClick={increaseCapacity}
                    className="px-2 border rounded hover:bg-muted"
                  >
                    +
                  </button>
                </div>

                {/* {capacityDraft !== null && (
                  <button
                    onClick={applyBulkCapacity}
                    className="text-[10px] px-2 py-1 rounded border bg-primary text-secondary"
                  >
                    Apply
                  </button>
                )} */}
              </div>
            </div>

            {/* SKILLS */}
            <div className="space-y-2">
              <p className="text-xs">Skills</p>

              <div className="flex gap-1 flex-wrap">
                {SKILL_POOL.map((skill) => {
                  const isActive = isSkillActiveInBulk(skill);

                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkillForBulk(skill)}
                      className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                        isActive
                          ? "bg-primary text-secondary border-primary"
                          : "bg-muted hover:bg-muted/80 border-transparent"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">


            <button
              onClick={applyBulkCapacity}
              disabled={capacityDraft === null && bulkSkillsDraft === null}
              className="w-full text-xs bg-primary text-secondary rounded py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Changes
            </button>

            {/* REMOVE */}
            <button
              onClick={removeSelectedAgents}
              className="w-full text-xs border border-red-500 text-red-500 rounded py-1 hover:bg-red-500/10"
            >
              Remove  Agents
            </button>

            </div>
          </div>
        )}
        {/* FOOTER STATUS */}
      </div>
        <div className="p-2 border-t">
          {isIdleMode ? (
            <div className="text-xs text-muted-foreground">No selection</div>
          ) : isBulkMode ? (
            <div className="text-xs text-muted-foreground">
              Bulk editing {selectedAgents.length} agents
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              Editing {selectedAgent?.name}
            </div>
          )}
        </div>
    </div>
  );
}
