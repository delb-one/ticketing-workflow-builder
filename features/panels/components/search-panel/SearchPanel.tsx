"use client";

import { useMemo, useState } from "react";
import { useReactFlow } from "@xyflow/react";
import {  Boxes, Tickets, Activity, XCircle, ScanSearch } from "lucide-react";
import { CustomPanel } from "@/components/molecules/CustomPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSearch } from "@/features/panels/hooks/useSearch";
import { useWorkflowStore } from "@/lib/store";
import type { SearchResult } from "@/features/panels/logic/search-selectors";

const ResultGroup = ({
  title,
  icon: Icon,
  results,
  onResultClick,
}: {
  title: string;
  icon: typeof Boxes;
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
}) => {
  if (results.length === 0) return null;
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-2 py-1 text-xs uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span>{title}</span>
        <span className="ml-auto">{results.length}</span>
      </div>
      {results.map((result) => (
        <button
          key={result.id}
          type="button"
          onClick={() => onResultClick(result)}
          className="w-full rounded-md border border-transparent px-2 py-1.5 text-left transition-colors hover:border-border hover:bg-muted/50"
        >
          <div className="text-xs font-medium text-primary">{result.title}</div>
          {result.subtitle && (
            <div className="text-[11px] text-muted-foreground">{result.subtitle}</div>
          )}
          {result.metadata && (
            <div className="text-[10px] text-muted-foreground/80">{result.metadata}</div>
          )}
        </button>
      ))}
    </div>
  );
};

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const { setSelectedNode } = useWorkflowStore();
  const { fitView } = useReactFlow();
  const { nodes, tickets, events } = useSearch(query);

  const totalResults = useMemo(
    () => nodes.length + tickets.length + events.length,
    [nodes.length, tickets.length, events.length],
  );

  const handleResultClick = (result: SearchResult) => {
    if (!result.targetId) return;
    setSelectedNode(result.targetId);
    fitView({ nodes: [{ id: result.targetId }], duration: 350, padding: 0.2 });
  };

  return (
    <CustomPanel value="search-panel" title="Search" icon={ScanSearch} defaultExpanded>
      <div className="space-y-2 w-90">
        <div className="flex items-center gap-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search nodes, tickets, events..."
            className="h-8 text-xs"
          />
          {query && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => setQuery("")}
              className="h-8 w-8"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ScrollArea className="w-full">
          <div className="space-y-1.5  text-sm p-2 max-h-56">
          {!query.trim() ? (
            <div className="px-2 py-6 text-center text-xs text-muted-foreground ">
              Start typing to search...
            </div>
          ) : totalResults === 0 ? (
            <div className="px-2 py-6 text-center text-xs text-muted-foreground">
              No results found
            </div>
          ) : (
            <div className="space-y-2 pr-2">
              <ResultGroup title="Nodes" icon={Boxes} results={nodes} onResultClick={handleResultClick} />
              <ResultGroup title="Tickets" icon={Tickets} results={tickets} onResultClick={handleResultClick} />
              <ResultGroup title="Events" icon={Activity} results={events} onResultClick={handleResultClick} />
            </div>
          )}

          </div>
        </ScrollArea>
      </div>
    </CustomPanel>
  );
}
