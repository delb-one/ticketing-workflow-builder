import { CustomPanel } from "@/components/molecules/CustomPanel";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
  ArrowRight,
  Bot,
  CheckCircle2,
  GitBranch,
  Play,
  Sparkles,
  SquareMousePointer,
  SquareTerminal,
  Workflow,
} from "lucide-react";

export function GettingStartedPanel() {
  const workflowSteps = [
    {
      title: "Drag Blocks",
      description:
        "Drag workflow blocks from the left sidebar onto the canvas.",
      icon: <SquareMousePointer className="w-4 h-4 text-primary" />,
    },

    {
      title: "Connect Nodes",
      description:
        "Create connections by dragging from output handles to input handles.",
      icon: <GitBranch className="w-4 h-4 text-primary" />,
    },

    {
      title: "Configure Nodes",
      description:
        "Select a node to edit its properties inside the right inspector sidebar.",
      icon: <Bot className="w-4 h-4 text-primary" />,
    },

    {
      title: "Setup and Run",
      description:
        "Configure Ticket Factory and Agent Pool, then start simulation.",
      icon: <Play className="w-4 h-4 text-primary" />,
    },
  ];

  const nodeTypes = [
    {
      name: "Start",
      description: "Entry point of the workflow",
    },

    {
      name: "End",
      description: "Termination point",
    },

    {
      name: "Actor",
      description: "Represents roles like L1, L2, L3 or supervisors",
    },

    {
      name: "Action",
      description: "Ticket actions such as resolve, validate or close",
    },

    {
      name: "Automation",
      description: "Automated processes like SLA or escalations",
    },

    {
      name: "Decision",
      description: "Manual or rule-based branching",
    },

    {
      name: "Condition",
      description: "Conditional logic evaluation",
    },

    // {
    //   name: "Status",
    //   description: "Ticket state changes",
    // },

    {
      name: "Event",
      description: "Custom event triggers",
    },
  ];

  return (
    <CustomPanel
      title="Getting Started"
      value="getting-started"
      icon={Sparkles}
      defaultExpanded
    >
      <ScrollArea className="h-162.5 w-full">
        <div className="flex flex-col gap-3 p-1 pr-3">
          {/* HEADER */}
          <div className="rounded-xl border bg-background/40 p-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Workflow className="w-3.5 h-3.5 text-primary" />

              <span className="text-xs font-semibold tracking-wide">
                ITSM Workflow Builder
              </span>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Build, simulate, and inspect ITSM workflows directly on the
              canvas with real-time execution and monitoring.
            </p>
          </div>

          {/* QUICK START */}
          <div className="rounded-xl border bg-background/40 p-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRight className="w-3.5 h-3.5 text-primary" />

              <span className="text-xs font-semibold tracking-wide">
                Quick Start
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-start gap-2.5 rounded-lg border bg-background/30 p-2.5"
                >
                  <div className="flex items-center justify-center rounded-md bg-primary/10 p-1.5 shrink-0">
                    {step.icon}
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="h-1 w-1 rounded-full bg-border" />

                      <span className="text-[11px] text-primary font-medium">
                        {step.title}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
 {/* SIMULATION SETUP V2 */}
          <div className="rounded-xl border bg-background/40 p-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2.5">
              <Bot className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-wide">
                Simulation Setup
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-[11px] text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <span>
                  Add at least one template in Ticket Factory (`id`,
                  `priority`, `impact`, `autoSpawnCount`)
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <span>
                  Add at least one agent in Agent Pool (`level`, `efficiency`,
                  `capacity`)
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <span>
                  Configure Actor, Decision, and Action nodes
                </span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                <span>
                  Start from Controls and monitor State, Priority, Impact, and
                  Category in Ticket Monitor
                </span>
              </div>
            </div>
          </div>
          {/* SIMULATION */}
          <div className="rounded-xl border bg-background/40 p-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-2.5">
              <Play className="w-3.5 h-3.5 text-primary" />

              <span className="text-xs font-semibold tracking-wide">
                Simulation Flow
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-[11px] text-muted-foreground leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />

                <span>Start the simulation from the Controls Panel</span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />

                <span>Observe workflow execution step-by-step</span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />

                <span>Interact with decision nodes when prompted</span>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />

                <span>Inspect logs and runtime activity in real time</span>
              </div>
            </div>
          </div>

         

          {/* NODE TYPES */}
          <div className="rounded-xl border bg-background/40 p-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-3">
              <SquareTerminal className="w-3.5 h-3.5 text-primary" />

              <span className="text-xs font-semibold tracking-wide">
                Workflow Node Types
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {nodeTypes.map((node) => (
                <div
                  key={node.name}
                  className="flex flex-col gap-0.5 rounded-lg border bg-background/30 p-2.5"
                >
                  <span className="text-[11px] font-medium text-primary">
                    {node.name}
                  </span>

                  <span className="text-[11px] text-muted-foreground leading-relaxed">
                    {node.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </CustomPanel>
  );
}
