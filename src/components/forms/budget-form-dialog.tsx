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
import { CreateBudgetData } from "@/lib/validations/budget";
import { Budget, CategoryBudget } from "@/types/budget";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BudgetForm } from "./budget-form";

interface BudgetFormDialogProps {
  trigger?: React.ReactNode;
  month?: string;
  onSuccess?: () => void;
}

export function BudgetFormDialog({
  trigger,
  month,
  onSuccess,
}: BudgetFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBudget, setExistingBudget] = useState<Budget | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(
    month || format(new Date(), "yyyy-MM")
  );
  const [isFetching, setIsFetching] = useState(false);

  // Check if budget exists for the month
  const checkExistingBudget = useCallback(async (budgetMonth: string) => {
    setIsFetching(true);
    try {
      console.log("Fetching budget for month:", budgetMonth);
      const response = await fetch(`/api/budgets/${budgetMonth}`);
      const data = await response.json();

      if (data.success && data.data?.budget) {
        console.log("Found existing budget:", data.data.budget);
        setExistingBudget(data.data.budget);
        return true;
      }
      console.log("No existing budget found");
      setExistingBudget(null);
      return false;
    } catch (error) {
      console.error("Error checking budget:", error);
      setExistingBudget(null);
      return false;
    } finally {
      setIsFetching(false);
    }
  }, []);

  // Fetch existing budget when month changes or dialog opens
  useEffect(() => {
    if (isOpen && selectedMonth) {
      checkExistingBudget(selectedMonth);
    }
  }, [selectedMonth, isOpen, checkExistingBudget]);

  const handleSubmit = async (data: CreateBudgetData) => {
    try {
      setIsSubmitting(true);
      setSelectedMonth(data.month);

      // Check if budget exists
      const exists = await checkExistingBudget(data.month);

      const response = await fetch(
        exists ? `/api/budgets/${data.month}` : "/api/budgets",
        {
          method: exists ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(exists ? { categories: data.categories } : data),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          Array.isArray(result.error)
            ? result.error[0].message
            : result.error || "Failed to save budget"
        );
      }

      toast.success(
        exists ? "Budget updated successfully" : "Budget created successfully"
      );
      setIsOpen(false);

      // Call onSuccess if provided, otherwise reload the page
      if (onSuccess) {
        onSuccess();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save budget"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMonthChange = (newMonth: string) => {
    console.log("Month changed to:", newMonth);
    setSelectedMonth(newMonth);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setExistingBudget(null);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button>Set Monthly Budget</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingBudget ? "Update Monthly Budget" : "Set Monthly Budget"}
          </DialogTitle>
          <DialogDescription>
            {existingBudget
              ? "Update budget limits for each spending category. Make adjustments based on your financial goals."
              : "Set budget limits for each spending category. Make adjustments based on your financial goals."}
          </DialogDescription>
        </DialogHeader>
        {isFetching ? (
          <div className="flex items-center justify-center py-8">
            <span className="loading loading-spinner"></span>
            Loading budget data...
          </div>
        ) : (
          <BudgetForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            defaultMonth={selectedMonth}
            defaultValues={existingBudget?.categories}
            onMonthChange={handleMonthChange}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
