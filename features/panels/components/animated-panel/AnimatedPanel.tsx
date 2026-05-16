import { cn } from "@/lib/utils";
import { AnimatedPanelProps } from "./types";

export function AnimatedPanel({
  visible,
  children,
  className,
}: AnimatedPanelProps) {
  return (
    <div
      className={cn(
        "will-change-transform will-change-opacity transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0 scale-100 visible"
          : "opacity-0 translate-y-6 scale-95 pointer-events-none invisible",
        className,
      )}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
