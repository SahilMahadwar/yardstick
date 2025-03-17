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
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export type ValidationError = {
  path: string[];
  message: string;
};

export function formatZodError(error: z.ZodError) {
  return error.errors.map((err) => ({
    path: err.path,
    message: err.message,
  }));
}

// API Response Types
export type TransactionResponse = {
  success: boolean;
  data?: any;
  error?: string | ValidationError[];
};
