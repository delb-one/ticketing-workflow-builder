export type TicketFormState = {
  id: string;
  priority: "low" | "medium" | "high" | "critical";
  impact: "low" | "medium" | "high";
  category: string;
  description: string;
  autoSpawnCount: number;
};