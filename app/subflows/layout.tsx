import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sub Flow Editor",
  description: "Create and edit custom subflows",
};

export default function SubFlowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
