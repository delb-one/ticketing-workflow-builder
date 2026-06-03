import { redirect } from "next/navigation";

export default function SubFlowsPage() {
  // Redirect to new subflow page by default
  redirect("/subflows/new");
}
