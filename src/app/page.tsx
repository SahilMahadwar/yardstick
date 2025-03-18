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
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
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
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
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
      fetchDashboardData();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete transaction"
      );
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        Error loading dashboard: {error}
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Personal Finance Tracker</h1>
        <p className="text-muted-foreground">
          Track and manage your personal finances
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summary && (
            <>
              <TotalExpensesCard summary={summary} />
              <AverageExpenseCard summary={summary} />
              <LargestExpenseCard summary={summary} />
              <FrequentCategoryCard summary={summary} />
            </>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {transactions.length > 0 && (
            <>
              <MonthlyExpensesChart transactions={transactions} />
              {categoryData.length > 0 && (
                <CategoryPieChart data={categoryData} />
              )}
            </>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transactions</CardTitle>
              <TransactionFormDialog />
            </div>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                No transactions found. Add one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
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
                        ${transaction.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <TransactionFormDialog
                          transaction={transaction}
                          trigger={
                            <Button size="icon" variant="ghost">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          size="icon"
                          variant="ghost"
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
  );
}
