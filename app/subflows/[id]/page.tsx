import React from "react";
import { SubFlowEditor } from "@/features/subflow-editor/components/SubFlowEditor";

export default async function EditSubFlowPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <SubFlowEditor subflowId={resolvedParams.id} />;
}
