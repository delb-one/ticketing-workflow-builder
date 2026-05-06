import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Plus, RotateCcw, SlidersHorizontal } from "lucide-react";

export  function InspectorPanelTemplate () {
  return (
    <div className="flex h-full w-80 flex-col bg-card border-l">
      {/* HEADER */}
      <div className="p-3 ">
        <h2 className="font-semibold text-sm">🎧 L1 Support Node</h2>
        <p className="text-xs text-muted-foreground">Node ID: 4134133</p>
        <div className="text-xs text-muted-foreground">Node load</div>
        <div className="h-2 w-full bg-muted rounded">
          <div className="h-2 w-[60%] bg-primary rounded" />
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="p-3 space-y-2">
        <div className="flex text-xs">
          <div className="border">Agents: 6</div>
          <div className="border">Capacity: 12</div>
          <div className="border">Busy: 3</div>
          <div className="border">Available: 3</div>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="p-2 flex items-center justify-between ">
        <div className="flex items-center bg-primary gap-2 p-2 rounded-md border-none shadow-none cursor-pointer ">
          <span className=" font-semibold text-xs text-secondary">
            Add Agent
          </span>
          <Plus className="h-4 w-4 text-secondary" />
        </div>
        <div className="flex gap-2">
          <div className="p-2 rounded-md bg-transparent border-none shadow-none hover:bg-muted/60 cursor-pointer">
            <Edit className="h-4 w-4" />
          </div>

          <div className="p-2 rounded-md bg-transparent border-none shadow-none hover:bg-muted/60 cursor-pointer">
            <SlidersHorizontal className="h-4 w-4" />
          </div>

          <div className="p-2 rounded-md bg-transparent border-none shadow-none hover:bg-muted/60 cursor-pointer ">
            <RotateCcw className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="flex p-2  flex-col min-h-0">
        {/* CUSTOM */}
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="custom" className="border-none">
            <AccordionTrigger className="text-[11px] uppercase text-muted-foreground py-2 hover:no-underline">
              Custom Agents (2)
            </AccordionTrigger>

            <AccordionContent className="py-2">
              <ScrollArea className="pr-2">
                <div className="max-h-50">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                      <input type="checkbox" className="h-3 w-3" />
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <div className="flex-1">
                        <p className="text-xs font-medium">Mario Rossi</p>
                        <p className="text-[10px] text-muted-foreground">
                          Custom
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
                      <input type="checkbox" className="h-3 w-3" />
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      <div className="flex-1">
                        <p className="text-xs font-medium">Luigi Rossi</p>
                        <p className="text-[10px] text-muted-foreground">
                          Custom
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="default" className="border-none">
            <AccordionTrigger className="text-[11px] uppercase text-muted-foreground py-2 hover:no-underline">
              Default Agents (4)
            </AccordionTrigger>

            <AccordionContent className="py-2">
              <ScrollArea className="pr-2">
                <div className="max-h-40">
                  <div className="space-y-1">
                    {["L1-1", "L1-2", "L1-3", "L1-4", "L1-5", "L1-6"].map(
                      (name, i) => (
                        <div
                          key={name}
                          className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer"
                        >
                          <input type="checkbox" className="h-3 w-3" />

                          <div
                            className={`h-2 w-2 rounded-full ${
                              i % 2 === 0 ? "bg-green-500" : "bg-orange-500"
                            }`}
                          />

                          <div className="flex-1">
                            <p className="text-xs font-medium">{name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              Default
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* DETAIL / BULK PANEL */}
      <div className="border-t p-3 space-y-3 bg-card">
        <div className="text-xs text-muted-foreground">3 selected</div>

        <div className="space-y-2">
          <div className="text-xs">Efficiency</div>
          <input type="range" className="w-full" />

          <div className="text-xs">Capacity</div>
          <div className="flex items-center gap-2">
            <button className="px-2 border rounded">-</button>
            <span className="text-xs">2</span>
            <button className="px-2 border rounded">+</button>
          </div>

          <div className="text-xs">Skills</div>
          <div className="flex gap-1 flex-wrap">
            <span className="text-[10px] px-2 py-1 rounded bg-muted">
              network
            </span>
            <span className="text-[10px] px-2 py-1 rounded bg-muted">
              hardware
            </span>
            <button className="text-[10px] px-2 py-1 border rounded">+</button>
          </div>
        </div>

        <button className="w-full text-xs bg-primary text-secondary rounded py-1">
          Apply
        </button>
      </div>
    </div>
  );
}
