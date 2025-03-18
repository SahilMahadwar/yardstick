"use client";

import { BudgetComparisonChart } from "@/components/charts/budget-comparison-chart";
import { BudgetFormDialog } from "@/components/forms/budget-form-dialog";
import { SpendingInsights } from "@/components/insights/spending-insights";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetInsight, CategoryBudget } from "@/types/budget";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function InsightsPage() {
  const [categories, setCategories] = useState<CategoryBudget[]>([]);
  const [insights, setInsights] = useState<BudgetInsight[]>([]);

  const fetchBudgetData = useCallback(async () => {
    try {
      const response = await fetch("/api/budgets/summary");
      const data = await response.json();

      if (data.success && data.data?.summary) {
        setCategories(data.data.summary.categories);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex justify-end mb-8">
          <BudgetFormDialog onSuccess={fetchBudgetData} />
        </div>

        <Tabs defaultValue="comparison" className="w-full space-y-6">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mx-auto mb-4">
            <TabsTrigger value="comparison" className="text-sm">
              Budget vs Actual
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-sm">
              Spending Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison">
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <h2 className="text-2xl font-semibold mb-6">
                Budget vs Actual Comparison
              </h2>
              <div className="w-full aspect-[2/1] min-h-[400px]">
                <BudgetComparisonChart categories={categories} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="insights">
            <Card className="p-6 backdrop-blur-sm bg-card/50 border-border/50">
              <h2 className="text-2xl font-semibold mb-6">Spending Analysis</h2>
              <SpendingInsights insights={insights} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
