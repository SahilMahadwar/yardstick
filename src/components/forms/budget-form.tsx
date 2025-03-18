"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { CreateBudgetData, createBudgetSchema } from "@/lib/validations/budget";
import { TransactionCategory } from "@/types/transaction";

interface BudgetFormProps {
  onSubmit: (data: CreateBudgetData) => Promise<void>;
  isSubmitting?: boolean;
  defaultMonth?: string;
  defaultValues?: Array<{
    category: TransactionCategory;
    amount: number;
  }>;
  onMonthChange?: (month: string) => void;
}

export function BudgetForm({
  onSubmit,
  isSubmitting = false,
  defaultMonth = format(new Date(), "yyyy-MM"),
  defaultValues,
  onMonthChange,
}: BudgetFormProps) {
  const form = useForm<CreateBudgetData>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      month: defaultMonth,
      categories:
        defaultValues ||
        Object.values(TransactionCategory).map((category) => ({
          category,
          amount: 0,
        })),
    },
  });

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      console.log("Resetting form with values:", defaultValues);
      const categories = Object.values(TransactionCategory).map((category) => {
        const existingBudget = defaultValues.find(
          (b) => b.category === category
        );
        return {
          category,
          amount: existingBudget ? existingBudget.amount : 0,
        };
      });

      form.reset({
        month: defaultMonth,
        categories,
      });
    } else {
      form.reset({
        month: defaultMonth,
        categories: Object.values(TransactionCategory).map((category) => ({
          category,
          amount: 0,
        })),
      });
    }
  }, [defaultValues, defaultMonth, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Month</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value + "-01"), "MMMM yyyy")
                      ) : (
                        <span>Pick a month</span>
                      )}
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={
                      field.value ? new Date(field.value + "-01") : undefined
                    }
                    onSelect={(date) => {
                      const formattedDate = date ? format(date, "yyyy-MM") : "";
                      field.onChange(formattedDate);
                      onMonthChange?.(formattedDate);
                    }}
                    initialFocus
                    disabled={(date) => {
                      // Only enable the first day of each month
                      return date.getDate() > 1;
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Category Budgets</h3>
          {Object.values(TransactionCategory).map((category, index) => (
            <FormField
              key={category}
              control={form.control}
              name={`categories.${index}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <FormLabel>{category}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter budget amount (₹)"
                          value={field.value.amount}
                          onChange={(e) =>
                            field.onChange({
                              ...field.value,
                              amount: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              Saving...
            </>
          ) : (
            "Save Budget"
          )}
        </Button>
      </form>
    </Form>
  );
}
