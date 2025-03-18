"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBudget } from "@/types/budget";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SpendingTrendsProps {
  data: {
    month: string;
    categories: CategoryBudget[];
  }[];
  className?: string;
}

type ChartData = {
  month: string;
  [key: string]: number | string;
};

export function SpendingTrends({ data, className }: SpendingTrendsProps) {
  // Transform data for the chart
  const chartData: ChartData[] = data.map(({ month, categories }) => {
    const dataPoint: ChartData = { month };
    categories.forEach((cat) => {
      dataPoint[cat.category] = cat.spent;
    });
    return dataPoint;
  });

  // Get unique categories across all months
  const categories = Array.from(
    new Set(data.flatMap((d) => d.categories.map((c) => c.category)))
  );

  // Generate unique colors for each category
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--accent))",
    "hsl(var(--destructive))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip
                formatter={(value: number) => [`₹${value.toFixed(2)}`, ""]}
              />
              <Legend />
              {categories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  name={category}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Summary */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {categories.map((category, index) => {
            const currentSpent =
              data[data.length - 1]?.categories.find(
                (c) => c.category === category
              )?.spent || 0;
            const previousSpent =
              data[data.length - 2]?.categories.find(
                (c) => c.category === category
              )?.spent || 0;
            const change =
              ((currentSpent - previousSpent) / previousSpent) * 100;

            return (
              <div
                key={category}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <p className="font-medium">{category}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{currentSpent.toFixed(2)} this month
                  </p>
                </div>
                <div
                  className={`text-sm font-medium ${
                    change >= 0 ? "text-destructive" : "text-success"
                  }`}
                >
                  {change.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
