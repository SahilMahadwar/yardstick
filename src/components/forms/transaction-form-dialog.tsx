"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateTransactionRequest, Transaction } from "@/types/transaction";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TransactionForm } from "./transaction-form";

interface TransactionFormDialogProps {
  transaction?: Transaction;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
}

export function TransactionFormDialog({
  transaction,
  trigger,
  title = transaction ? "Edit Transaction" : "Add Transaction",
  description = transaction
    ? "Edit your transaction details below."
    : "Add a new transaction to track your finances.",
}: TransactionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: CreateTransactionRequest) => {
    try {
      setIsSubmitting(true);
      const url = transaction
        ? `/api/transactions/${transaction._id}`
        : "/api/transactions";
      const method = transaction ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save transaction");
      }

      toast.success(
        transaction
          ? "Transaction updated successfully"
          : "Transaction added successfully"
      );
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("Error saving transaction:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant={transaction ? "outline" : "default"}>
            {transaction ? "Edit" : "Add Transaction"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <TransactionForm
          transaction={transaction}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
