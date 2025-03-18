"use client";

import { BudgetComparisonChart } from "@/components/charts/budget-comparison-chart";
import { BudgetFormDialog } from "@/components/forms/budget-form-dialog";
import { SpendingInsights } from "@/components/insights/spending-insights";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetInsight, CategoryBudget } from "@/types/budget";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function InsightsPage() {
  const [categories, setCategories] = useState<CategoryBudget[]>([]);
  const [insights, setInsights] = useState<BudgetInsight[]>([]);

  // Fetch budget data and insights
  const fetchBudgetData = useCallback(async () => {
    try {
      const response = await fetch("/api/budgets/summary");
      const data = await response.json();

      if (data.success && data.data?.summary) {
        setCategories(
          data.data.summary.overBudgetCategories.concat(
            data.data.summary.nearLimitCategories
          )
        );
        setInsights(data.data.summary.insights);
      }
    } catch (error) {
      console.error("Failed to fetch budget data:", error);
      toast.error("Failed to fetch budget data");
    }
  }, []);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Insights</h1>
        <BudgetFormDialog onSuccess={fetchBudgetData} />
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comparison">Budget vs Actual</TabsTrigger>
          <TabsTrigger value="insights">Spending Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Budget vs Actual Comparison
            </h2>
            <BudgetComparisonChart categories={categories} />
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Spending Analysis</h2>
            <SpendingInsights insights={insights} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
