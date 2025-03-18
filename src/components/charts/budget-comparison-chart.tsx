"use client";

import { Card } from "@/components/ui/card";
import { CategoryBudget } from "@/types/budget";
import { TransactionCategory } from "@/types/transaction";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface BudgetComparisonChartProps {
  categories: CategoryBudget[];
}

export function BudgetComparisonChart({
  categories,
}: BudgetComparisonChartProps) {
  const data = categories.map((cat) => ({
    category: cat.category,
    Budgeted: cat.amount,
    Spent: cat.spent,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis
            dataKey="category"
            stroke="#888888"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `₹${value.toFixed(2)}`}
          />
          <Tooltip
            formatter={(value: number) => [`₹${value.toFixed(2)}`, ""]}
            cursor={{ fill: "transparent" }}
          />
          <Legend />
          <Bar dataKey="Budgeted" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Spent" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
