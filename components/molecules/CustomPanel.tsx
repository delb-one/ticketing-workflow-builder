import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { GripHorizontal, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface CustomPanelProps {
  value: string;
  title: string;
  icon: LucideIcon;
  badge?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function CustomPanel({
  value,
  title,
  icon: Icon,
  badge,
  children,
  className = "w-50",
  contentClassName = "p-2",
}: CustomPanelProps) {
  return (
    <Accordion
      type="single"
      collapsible
      className="h-full pointer-events-auto active:cursor-grabbing"
    >
      <Card
        className={`${className} panel-drag-handle p-0 bg-card/70 rounded-xl border backdrop-blur-md flex flex-col h-full overflow-hidden`}
      >
        <AccordionItem value={value} className="flex flex-col h-full">
          <div className="flex justify-center bg-secondary/50">
            <GripHorizontal className="w-4 h-4 text-primary/70" />
          </div>
          <AccordionTrigger className="p-4 shrink-0 hover:no-underline">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-primary text-sm">{title}</h3>
              {badge}
            </div>
          </AccordionTrigger>
          <AccordionContent className={contentClassName}>
            {children}
          </AccordionContent>
        </AccordionItem>
      </Card>
    </Accordion>
  );
}
