"use client";
import { Card } from "@/components/ui/card";

interface PropertyCardProps {
  label: string;
  children: React.ReactNode;
}

export function PropertyCard({ label, children }: PropertyCardProps) {
  return (
    <Card className="p-4 mb-4">
      <label className="block text-sm font-semibold text-foreground">
        {label}
      </label>
      {children}
    </Card>
  );
}
