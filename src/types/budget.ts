import { ValidationError } from "@/lib/validations/budget";
import { TransactionCategory } from "./transaction";

export interface CategoryBudget {
  category: TransactionCategory;
  amount: number;
  spent: number;
  remaining: number;
}

export interface Budget {
  _id: string;
  month: string; // YYYY-MM format
  categories: CategoryBudget[];
  totalBudget: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBudgetRequest = {
  month: string;
  categories: {
    category: TransactionCategory;
    amount: number;
  }[];
};

export type UpdateBudgetRequest = {
  categories: {
    category: TransactionCategory;
    amount: number;
  }[];
};

export type BudgetApiResponse = {
  success: boolean;
  data?: {
    budget?: Budget;
    budgets?: Budget[];
    summary?: BudgetSummary;
  };
  error?: string | ValidationError[];
};

export type BudgetSummary = {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  overBudgetCategories: CategoryBudget[];
  nearLimitCategories: CategoryBudget[];
};

export type BudgetProgress = {
  category: TransactionCategory;
  budgeted: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: "under" | "near" | "over";
};

export type BudgetInsight = {
  type: "warning" | "info" | "success";
  message: string;
  category?: TransactionCategory;
  details?: {
    current: number;
    limit: number;
    remaining: number;
  };
};
