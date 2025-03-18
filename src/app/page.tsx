"use client";

import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { MonthlyExpensesChart } from "@/components/charts/monthly-expenses-chart";
import {
  AverageExpenseCard,
  FrequentCategoryCard,
  LargestExpenseCard,
  TotalExpensesCard,
} from "@/components/dashboard/summary-cards";
import { TransactionFormDialog } from "@/components/forms/transaction-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";
import {
  CategoryBreakdown,
  Transaction,
  TransactionSummary,
} from "@/types/transaction";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<TransactionSummary | undefined>(
    undefined
  );
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData(true);
  }, []);

  const fetchDashboardData = async (isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }

      const [transactionsRes, summaryRes] = await Promise.all([
        fetch("/api/transactions"),
        fetch("/api/transactions/summary"),
      ]);

      const [transactionsData, summaryData] = await Promise.all([
        transactionsRes.json(),
        summaryRes.json(),
      ]);

      if (!transactionsData.success || !summaryData.success) {
        throw new Error(
          transactionsData.error || summaryData.error || "Failed to fetch data"
        );
      }

      setTransactions(transactionsData.data.transactions);
      setSummary(summaryData.data.summary);
      setCategoryData(summaryData.data.categoryBreakdown);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      if (!isInitialLoad) {
        toast.error("Failed to refresh dashboard data");
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete transaction");
      }

      toast.success("Transaction deleted successfully");
      fetchDashboardData(false);
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete transaction"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="space-y-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <TotalExpensesCard summary={summary} />
            <AverageExpenseCard summary={summary} />
            <LargestExpenseCard summary={summary} />
            <FrequentCategoryCard summary={summary} />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {transactions.length > 0 && (
              <>
                <MonthlyExpensesChart transactions={transactions} />

                {categoryData.length > 0 && (
                  <CategoryPieChart data={categoryData} />
                )}
              </>
            )}
          </div>

          <Card className="backdrop-blur-sm bg-card/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <TransactionFormDialog onSuccess={fetchDashboardData} />
              </div>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No transactions found. Add one to get started!
                </div>
              ) : (
                <div className="space-y-2">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 backdrop-blur-sm hover:bg-accent/5 transition-colors"
                    >
                      <div className="grid gap-1">
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {new Date(transaction.date).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-mono font-medium">
                          ₹{transaction.amount.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2">
                          <TransactionFormDialog
                            transaction={transaction}
                            onSuccess={fetchDashboardData}
                            trigger={
                              <Button
                                size="icon"
                                variant="ghost"
                                className="hover:bg-accent/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-accent/10"
                            onClick={() => handleDelete(transaction._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
