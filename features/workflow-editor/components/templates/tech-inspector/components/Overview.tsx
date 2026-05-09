"use client";
interface OverviewProps {
  totalAgents: number;
  totalCapacity: number;
  busyAgents: number;
  availableAgents: number;
}


export const Overview = ({ totalAgents, totalCapacity, busyAgents, availableAgents }: OverviewProps) => {
  return (
    <div className="p-3 space-y-2">
      <div className="grid grid-cols-4 gap-2 text-center">
        {/* AGENTS */}
        <div className="rounded border p-2">
          <p className="text-[10px] text-muted-foreground uppercase">Agents</p>

          <p className="text-sm font-semibold">{totalAgents}</p>
        </div>

        {/* CAPACITY */}
        <div className="rounded border p-2">
          <p className="text-[10px] text-muted-foreground uppercase">
            Capacity
          </p>

          <p className="text-sm font-semibold">{totalCapacity}</p>
        </div>

        {/* BUSY */}
        <div className="rounded border p-2">
          <p className="text-[10px] text-muted-foreground uppercase">Busy</p>

          <p className="text-sm font-semibold text-orange-500">{busyAgents}</p>
        </div>

        {/* AVAILABLE */}
        <div className="rounded border p-2">
          <p className="text-[10px] text-muted-foreground uppercase">
            Available
          </p>

          <p className="text-sm font-semibold text-green-500">
            {availableAgents}
          </p>
        </div>
      </div>
    </div>
  );
};
