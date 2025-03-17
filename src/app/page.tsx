"use client";

import { MonthlyExpensesChart } from "@/components/charts/monthly-expenses-chart";
import { TransactionFormDialog } from "@/components/forms/transaction-form-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/transaction";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TestPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/transactions");
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch transactions");
      }

      setTransactions(data.data.transactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      toast.error("Failed to load transactions");
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
      fetchTransactions();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to delete transaction"
      );
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Personal Finance Tracker</h1>
        <p className="text-muted-foreground">
          Track and manage your personal finances
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add Transaction</CardTitle>
              <TransactionFormDialog />
            </div>
          </CardHeader>
        </Card>

        {!loading && !error && transactions.length > 0 && (
          <MonthlyExpensesChart transactions={transactions} />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center p-4">Loading transactions...</div>
            ) : error ? (
              <div className="text-center p-4 text-red-500">{error}</div>
            ) : transactions.length === 0 ? (
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
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
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
