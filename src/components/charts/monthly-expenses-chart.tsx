"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { format } from "date-fns";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

type ChartData = {
  month: string;
  total: number;
};

export function MonthlyExpensesChart({
  transactions,
}: MonthlyExpensesChartProps) {
  const monthlyData = useMemo(() => {
    const monthlyTotals = new Map<string, number>();

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = format(date, "MMM yyyy");
      const currentTotal = monthlyTotals.get(monthKey) || 0;
      monthlyTotals.set(monthKey, currentTotal + transaction.amount);
    });

    // Convert to array and sort by date
    return Array.from(monthlyTotals.entries())
      .map(([month, total]) => ({
        month,
        total,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
      });
  }, [transactions]);

  if (!monthlyData.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                content={({
                  active,
                  payload,
                }: TooltipProps<number, string>) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0].payload as ChartData;

                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Month
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {data.month}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Total
                          </span>
                          <span className="font-bold">
                            ${data.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="total"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
