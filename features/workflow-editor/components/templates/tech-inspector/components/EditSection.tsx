import { Agent } from "../TechInspectorTemplate";

export const SKILL_POOL = [
  "network",
  "hardware",
  "security",
  "cloud",
  "database",
  "linux",
];


type SingleView = {
  name: string;
  capacity: number;
  skills: string[]
}

interface EditSectionProps {
  isIdleMode: boolean;
  isBulkMode: boolean;
  isSingleEditMode: boolean;
  hasSingleDraftChanges: boolean;
  selectedAgents: string[];
  selectedAgent: Agent | null;
  singleView: SingleView | null;
  capacityDraft: number | null;
  bulkSkillsDraft: string[] | null;
  decreaseCapacity: () => void;
  increaseCapacity: () => void;
  removeSingleAgent: () => void;
  removeSelectedAgents: () => void;
  handleNameChange: (name: string) => void;
  applySingleChanges: () => void;
  getCurrentCapacity: () => number;
  applyBulkCapacity: () => void;
  toggleSkillForSingle: (skill: string) => void;
  isSkillActiveInBulk: (skill: string) => boolean;
  toggleSkillForBulk: (skill: string) => void;
}

export const EditSection = ({
  isIdleMode,
  isBulkMode,
  isSingleEditMode,
  selectedAgents,
  selectedAgent,
  hasSingleDraftChanges,
  singleView,
  decreaseCapacity,
  increaseCapacity,
  removeSingleAgent,
  handleNameChange,
  applySingleChanges,
  getCurrentCapacity,
  applyBulkCapacity,
  removeSelectedAgents,
  capacityDraft,
  bulkSkillsDraft,
  toggleSkillForSingle,
  isSkillActiveInBulk,
  toggleSkillForBulk,
}: EditSectionProps) => {
  return (
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
              Remove Agents
            </button>
          </div>
        </div>
      )}
      {/* FOOTER STATUS */}
    </div>
  );
};
