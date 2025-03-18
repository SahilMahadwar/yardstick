import { transactionSchema } from "@/lib/validations";
import { z } from "zod";

export enum TransactionCategory {
  HOUSING = "Housing",
  TRANSPORTATION = "Transportation",
  FOOD = "Food & Dining",
  UTILITIES = "Utilities",
  ENTERTAINMENT = "Entertainment",
  HEALTHCARE = "Healthcare",
  SHOPPING = "Shopping",
  OTHER = "Other",
}

// Extended schema
export type Transaction = z.infer<typeof transactionSchema> & {
  _id: string;
  category: TransactionCategory;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateTransactionRequest = z.infer<typeof transactionSchema>;

export type UpdateTransactionRequest = Partial<CreateTransactionRequest>;

export type TransactionApiResponse = {
  success: boolean;
  data?: {
    transaction?: Transaction;
    transactions?: Transaction[];
    summary?: TransactionSummary;
    categoryBreakdown?: CategoryBreakdown[];
  };
  error?: string;
};

export type TransactionCardProps = {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
};

export type TransactionListProps = {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
};

export type TransactionFormProps = {
  transaction?: Transaction;
  onSubmit: (data: CreateTransactionRequest) => Promise<void>;
  isSubmitting?: boolean;
};

// Dashboard Types
export type TransactionSummary = {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  mostFrequentCategory: TransactionCategory;
  largestTransaction: Transaction;
};

export type CategoryBreakdown = {
  category: TransactionCategory;
  totalAmount: number;
  count: number;
  percentage: number;
};

export type CategoryChartData = {
  name: string;
  value: number;
  color?: string;
};
