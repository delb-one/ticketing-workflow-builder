import { CustomPanel } from "@/components/molecules/CustomPanel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Sparkles, Workflow } from "lucide-react";
import {
  nodeTypes,
  nodeTypesSection,
  quickStartSection,
  simulationFlowSection,
  simulationSetupSection,
  workFlowSteps,
} from "./data";

export function GettingStartedPanel() {
  return (
    <CustomPanel
      title="Getting Started"
      value="getting-started"
      icon={Sparkles}
      defaultExpanded
    >
      <ScrollArea className="h-162.5 w-full">
        <div className="flex flex-col gap-3 p-1 pr-3">
          <div className="rounded-xl border bg-background/40 p-3 backdrop-blur-xl">
            <div className="mb-1.5 flex items-center gap-2">
              <Workflow className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-wide">
                ITSM Workflow Builder
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Build, simulate, and inspect ITSM workflows directly on the canvas
              with real-time execution and monitoring.
            </p>
          </div>

          <div className="rounded-xl border bg-background/40 p-3 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <quickStartSection.icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-wide">
                {quickStartSection.title}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {workFlowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="flex items-start gap-2.5 rounded-lg border bg-background/30 p-2.5"
                >
                  <div className="shrink-0 rounded-md bg-primary/10 p-1.5">
                    <step.icon className="h-4 w-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-border" />
                      <span className="text-[11px] font-medium text-primary">
                        {step.title}
                      </span>
                    </div>

                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {[simulationSetupSection, simulationFlowSection].map((section) => (
            <div
              key={section.title}
              className="rounded-xl border bg-background/40 p-3 backdrop-blur-xl"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <section.icon className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold tracking-wide">
                  {section.title}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
                {section.items.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-xl border bg-background/40 p-3 backdrop-blur-xl">
            <div className="mb-3 flex items-center gap-2">
              <nodeTypesSection.icon className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold tracking-wide">
                {nodeTypesSection.title}
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
                  <span className="text-[11px] leading-relaxed text-muted-foreground">
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
