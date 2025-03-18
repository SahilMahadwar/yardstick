import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Budgets | Yardstick",
  description: "Manage your monthly budgets and spending limits",
};

export default function BudgetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1 overflow-auto">{children}</main>;
}
