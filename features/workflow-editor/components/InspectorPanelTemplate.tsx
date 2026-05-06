export default function () {
  return (
    <div className="flex h-full w-80 flex-col bg-card border-l">
      {/* HEADER */}
      <div className="p-3 border-b">
        <h2 className="font-semibold text-sm">🎧 L1 Support Node</h2>
        <p className="text-xs text-muted-foreground">Node ID: 4134133</p>
      </div>

      {/* OVERVIEW */}
      <div className="p-3 space-y-2 border-b">
        <div className="flex justify-between text-xs">
          <span>Agents: 6</span>
          <span>Capacity: 12</span>
        </div>

        <div className="flex justify-between text-xs">
          <span>Busy: 3</span>
          <span>Available: 3</span>
        </div>

        <div className="text-xs text-muted-foreground">Load</div>
        <div className="h-2 w-full bg-muted rounded">
          <div className="h-2 w-[60%] bg-primary rounded" />
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="p-2 grid grid-cols-2 gap-2 border-b">
        <button className="text-xs px-2 py-1 rounded bg-primary text-secondary">
          + Add Agent
        </button>
        <button className="text-xs px-2 py-1 rounded border">Bulk Edit</button>
        <button className="text-xs px-2 py-1 rounded border">Normalize</button>
        <button className="text-xs px-2 py-1 rounded border text-red-500">
          Reset
        </button>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* CUSTOM AGENTS */}
        <div>
          <p className="text-[11px] uppercase text-muted-foreground mb-2">
            Custom Agents (2)
          </p>

          <div className="space-y-1">
            <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
              <input type="checkbox" className="h-3 w-3" />
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              <div className="flex-1">
                <p className="text-xs font-medium">Mario Rossi</p>
                <p className="text-[10px] text-muted-foreground">Custom</p>
              </div>
              <span className="text-[10px] px-1 rounded border text-orange-500">
                custom
              </span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded hover:bg-muted cursor-pointer">
              <input type="checkbox" className="h-3 w-3" />
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-xs font-medium">Anna Bianchi</p>
                <p className="text-[10px] text-muted-foreground">Custom</p>
              </div>
              <span className="text-[10px] px-1 rounded border text-orange-500">
                custom
              </span>
            </div>
          </div>
        </div>

        {/* DEFAULT AGENTS */}
        <div>
          <p className="text-[11px] uppercase text-muted-foreground mb-2">
            Default Agents (4)
          </p>

          <div className="space-y-1">
            {["L1-1", "L1-2", "L1-3", "L1-4"].map((name, i) => (
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
                  <p className="text-[10px] text-muted-foreground">Default</p>
                </div>

                <span className="text-[10px] px-1 rounded border text-green-600">
                  default
                </span>
              </div>
            ))}
          </div>
        </div>
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
