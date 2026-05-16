"use client";

import { Briefcase, Settings2, Users, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgent } from "@/features/panels/hooks/useAgent";

export function AgentPanel() {
  const {
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
  } = useAgent();

  return (
    <CustomPanel
      value="agent-pool"
      title="Agent Pool"
      icon={Users}
      defaultExpanded
      badge={
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 h-5 px-1.5 text-[10px] font-bold min-w-5 flex items-center justify-center rounded-full"
        >
          {totalAgents}
        </Badge>
      }
    >
      {!isSimulating ? (
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 mb-3">
            <Settings2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              Pool Configuration
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              className="h-8 rounded-md border bg-background/60 px-2 text-xs"
              placeholder="Agent ID"
              value={form.id}
              disabled={isSimulating}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, id: e.target.value }))
              }
            />
            <input
              className="h-8 rounded-md border bg-background/60 px-2 text-xs"
              placeholder="Name (optional)"
              value={form.name}
              disabled={isSimulating}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <Select
              value={form.level}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  level: value as "l1" | "l2" | "l3",
                }))
              }
              disabled={isSimulating}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="l1">Level: L1</SelectItem>
                <SelectItem value="l2">Level: L2</SelectItem>
                <SelectItem value="l3">Level: L3</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" disabled={!canAdd} onClick={addAgent}>
              Add Agent
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-muted-foreground">
              Efficiency: {form.efficiency.toFixed(1)}
            </div>
            <Slider
              value={[form.efficiency]}
              min={0.1}
              max={2}
              step={0.1}
              disabled={isSimulating}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, efficiency: value[0] ?? 1 }))
              }
            />
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-muted-foreground">
              Capacity: {form.capacity}
            </div>
            <Slider
              value={[form.capacity]}
              min={1}
              max={5}
              step={1}
              disabled={isSimulating}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  capacity: Math.max(1, Math.round(value[0] ?? 1)),
                }))
              }
            />
          </div>

          <input
            className="h-8 w-full rounded-md border bg-background/60 px-2 text-xs"
            placeholder="Skills (comma separated)"
            value={form.skills}
            disabled={isSimulating}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, skills: e.target.value }))
            }
          />

          {hasDuplicateId && (
            <div className="text-[11px] text-red-400">Agent ID must be unique.</div>
          )}

          <div className="space-y-2">
            {agentPool.length === 0 ? (
              <div className="text-xs text-muted-foreground">No agents configured</div>
            ) : (
              agentPool.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-md border bg-background/40 p-2 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold truncate">{agent.name ?? agent.id}</div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 px-2 text-[11px] "
                      disabled={isSimulating}
                      onClick={() => removeAgent(agent.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground uppercase">
                    {agent.level} | eff {agent.efficiency} | cap {agent.capacity}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <ScrollArea className="w-full pr-2">
          <div className="max-h-80 space-y-2">
            {agents.length === 0 ? (
              <div className="text-xs text-primary-500 text-center py-4">No agents active</div>
            ) : (
              agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex flex-col p-3 rounded-lg bg-card-800/60 border border-card-700/60 backdrop-blur-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-primary-300">
                      {agent.name ?? agent.id}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${agent.status === "available" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)] animate-pulse"}`}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-primary-400">
                    <Briefcase className="w-3 h-3" />
                    <span className="truncate">
                      {agent.currentTicketId ? agent.currentTicketId : "Idle"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </CustomPanel>
  );
}
