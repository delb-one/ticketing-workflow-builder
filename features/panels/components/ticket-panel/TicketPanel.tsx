"use client";

import { Settings2, Tickets, X } from "lucide-react";
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
import { useTicket } from "@/features/panels/hooks/useTicket";

export function TicketPanel() {
  const {
    isSimulating,
    ticketTemplates,
    totalTickets,
    form,
    setForm,
    hasDuplicateId,
    canAdd,
    addTemplate,
    removeTemplate,
  } = useTicket();

  return (
    <CustomPanel
      value="controls"
      title="Ticket Pool"
      icon={Tickets}
      badge={
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 h-5 px-1.5 text-[10px] font-bold min-w-5 flex items-center justify-center rounded-full"
        >
          {totalTickets}
        </Badge>
      }
    >
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-2 mb-3">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium">
            Create Template
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input
            className="h-8 rounded-md border bg-background/60 px-2 text-xs"
            placeholder="Template ID"
            value={form.id}
            disabled={isSimulating}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, id: e.target.value }))
            }
          />
          <input
            className="h-8 rounded-md border bg-background/60 px-2 text-xs"
            placeholder="Category (optional)"
            value={form.category}
            disabled={isSimulating}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value }))
            }
          />
          <Select
            value={form.priority}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                priority: value as "low" | "medium" | "high" | "critical",
              }))
            }
            disabled={isSimulating}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Priority: Low</SelectItem>
              <SelectItem value="medium">Priority: Medium</SelectItem>
              <SelectItem value="high">Priority: High</SelectItem>
              <SelectItem value="critical">Priority: Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={form.impact}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                impact: value as "low" | "medium" | "high",
              }))
            }
            disabled={isSimulating}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Impact" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Impact: Low</SelectItem>
              <SelectItem value="medium">Impact: Medium</SelectItem>
              <SelectItem value="high">Impact: High</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" disabled={!canAdd} onClick={addTemplate}>
            Add Template
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] text-muted-foreground">
            Auto Spawn Count: {form.autoSpawnCount}
          </div>
          <Slider
            value={[form.autoSpawnCount]}
            min={1}
            max={20}
            step={1}
            disabled={isSimulating}
            onValueChange={(value) =>
              setForm((prev) => ({
                ...prev,
                autoSpawnCount: Math.max(1, Math.round(value[0] ?? 1)),
              }))
            }
          />
        </div>

        <textarea
          className="min-h-16 w-full rounded-md border bg-background/60 px-2 py-1.5 text-xs"
          placeholder="Description (optional)"
          value={form.description}
          disabled={isSimulating}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
        />

        {hasDuplicateId && (
          <div className="text-[11px] text-red-400">Template ID must be unique.</div>
        )}

        <div className="pt-1 space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Launch List</div>
          {ticketTemplates.length === 0 ? (
            <div className="text-xs text-muted-foreground">
              No templates configured. Add at least one template to start.
            </div>
          ) : (
            ticketTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-md border bg-background/40 p-2 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold truncate">{template.id}</div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 px-2 text-[11px]"
                    disabled={isSimulating}
                    onClick={() => removeTemplate(template.id)}
                  >
                    <X className=" h-2 w-2" />
                  </Button>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {template.priority.toUpperCase()} | {template.impact.toUpperCase()} |{" "}
                  {template.category ?? "uncategorized"} | x
                  {Math.max(1, template.autoSpawnCount ?? 1)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </CustomPanel>
  );
}
