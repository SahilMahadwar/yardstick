"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryBreakdown, TransactionSummary } from "@/types/transaction";
import { BarChart3, DollarSign, TrendingUp, Wallet } from "lucide-react";

interface SummaryCardsProps {
  summary: TransactionSummary;
}

export function TotalExpensesCard({ summary }: SummaryCardsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${summary.totalAmount.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground">
          {summary.totalTransactions} transactions
        </p>
      </CardContent>
    </Card>
  );
}

export function AverageExpenseCard({ summary }: SummaryCardsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${summary.averageAmount.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground">Per transaction</p>
      </CardContent>
    </Card>
  );
}

export function LargestExpenseCard({ summary }: SummaryCardsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Largest Expense</CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${summary.largestTransaction.amount.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground">
          {summary.largestTransaction.category}
        </p>
      </CardContent>
    </Card>
  );
}

export function FrequentCategoryCard({ summary }: SummaryCardsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Most Frequent Category
        </CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{summary.mostFrequentCategory}</div>
        <p className="text-xs text-muted-foreground">
          Most transactions in this category
        </p>
      </CardContent>
    </Card>
  );
}
