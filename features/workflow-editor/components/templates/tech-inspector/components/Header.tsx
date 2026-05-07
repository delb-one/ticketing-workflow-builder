interface HeaderProps {
  loadPercentage: number;
  loadColor: string;
}

export const Header = ({ loadPercentage, loadColor }: HeaderProps) => {
  return (
    <div className="p-3 space-y-2">
      <div>
        <h2 className="font-semibold text-sm">🎧 L1 Support Node</h2>
        <p className="text-xs text-muted-foreground">Node ID: 4134133</p>
      </div>

      {/* LABEL */}
      <div className="text-xs text-muted-foreground">Node load</div>

      {/* PROGRESS BAR */}
      <div className="h-2 w-full bg-muted rounded overflow-hidden">
        <div
          className={`h-2 rounded transition-all ${loadColor}`}
          style={{ width: `${loadPercentage}%` }}
        />
      </div>

      {/* PERCENTAGE */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Load</span>

        {loadPercentage > 0 && (
          <span className="text-xs text-muted-foreground">
            {loadPercentage}%
          </span>
        )}
      </div>
    </div>
  );
};
