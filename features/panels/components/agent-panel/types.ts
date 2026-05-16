export type AgentFormState = {
  id: string;
  name: string;
  level: "l1" | "l2" | "l3";
  efficiency: number;
  capacity: number;
  skills: string;
};