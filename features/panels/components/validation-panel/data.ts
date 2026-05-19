import { ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";

export const statusConfig = {
  valid: {
    label: "Valid",
    color: "text-emerald-500",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/5",
    icon: ShieldCheck,
  },
  warning: {
    label: "Warnings",
    color: "text-amber-500",
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    icon: ShieldAlert,
  },
  invalid: {
    label: "Invalid",
    color: "text-red-500",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    icon: ShieldX,
  },
};
