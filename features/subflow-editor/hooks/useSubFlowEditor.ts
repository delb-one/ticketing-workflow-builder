import { useState, useEffect, useCallback } from "react";
import { useWorkflowStore } from "@/lib/store";
import { subflowRepository } from "@/lib/db/subflowRepository";
import { useRouter } from "next/navigation";

export function useSubFlowEditor(subflowId?: string) {
  const router = useRouter();
  const [subflowName, setSubflowName] = useState("New Subflow");
  const [subflowDescription, setSubflowDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const nodes = useWorkflowStore((state) => state.nodes);
  const edges = useWorkflowStore((state) => state.edges);
  const setNodes = useWorkflowStore((state) => state.setNodes);
  const setEdges = useWorkflowStore((state) => state.setEdges);

  useEffect(() => {
    async function loadSubFlow() {
      setIsLoading(true);
      if (subflowId) {
        const data = await subflowRepository.getSubFlow(subflowId);
        if (data) {
          setSubflowName(data.name);
          setSubflowDescription(data.description || "");
          setNodes(data.nodes);
          setEdges(data.edges);
        } else {
          // not found
          router.push("/subflows/new");
        }
      } else {
        // new subflow
        setSubflowName("New Subflow");
        setSubflowDescription("");
        setNodes([]);
        setEdges([]);
      }
      setIsLoading(false);
    }
    loadSubFlow();
  }, [subflowId, setNodes, setEdges, router]);

  const saveSubFlow = useCallback(async () => {
    const idToSave = subflowId || crypto.randomUUID();
    await subflowRepository.saveSubFlow(idToSave, subflowName, nodes, edges, subflowDescription);
    if (!subflowId) {
      router.replace(`/subflows/${idToSave}`);
    }
  }, [subflowId, subflowName, subflowDescription, nodes, edges, router]);

  return {
    subflowName,
    setSubflowName,
    subflowDescription,
    setSubflowDescription,
    isLoading,
    saveSubFlow,
    nodes,
    edges
  };
}
