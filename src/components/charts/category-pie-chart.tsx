"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBreakdown, TransactionCategory } from "@/types/transaction";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  [TransactionCategory.HOUSING]: "#FF8042",
  [TransactionCategory.TRANSPORTATION]: "#00C49F",
  [TransactionCategory.FOOD]: "#FFBB28",
  [TransactionCategory.UTILITIES]: "#0088FE",
  [TransactionCategory.ENTERTAINMENT]: "#FF69B4",
  [TransactionCategory.HEALTHCARE]: "#BA55D3",
  [TransactionCategory.SHOPPING]: "#40E0D0",
  [TransactionCategory.OTHER]: "#A9A9A9",
};

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.totalAmount,
    percentage: item.percentage,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.name as TransactionCategory]}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;

                  const data = payload[0].payload;
                  const category = data.name as TransactionCategory;
                  const amount = data.value as number;

                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: CATEGORY_COLORS[category],
                            }}
                          />
                          <span className="font-medium">{category}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Amount
                            </p>
                            <p className="font-medium">₹{amount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Percentage
                            </p>
                            <p className="font-medium">
                              {data.percentage.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                formatter={(value) => value as string}
                iconType="circle"
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
