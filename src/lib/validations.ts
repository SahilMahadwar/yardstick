import { TransactionCategory } from "@/types/transaction";
import { z } from "zod";

export const transactionSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(0.01, "Amount must be greater than 0"),
  description: z
    .string({
      required_error: "Description is required",
    })
    .min(3, "Description must be at least 3 characters")
    .max(100, "Description must not exceed 100 characters"),
  date: z.coerce.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),
  category: z.nativeEnum(TransactionCategory, {
    required_error: "Category is required",
    invalid_type_error: "Invalid category",
  }),
});

// Extract the inferred type
export type TransactionFormData = z.infer<typeof transactionSchema>;

export type ValidationError = {
  path: string[];
  message: string;
};

export function formatZodError(error: z.ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    path: err.path.map(String), // Convert all path segments to strings
    message: err.message,
  }));
}

// API Response Types
export type TransactionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string | ValidationError[];
};
