import { TransactionCategory } from "@/types/transaction";
import { z } from "zod";

const categoryBudgetSchema = z.object({
  category: z.nativeEnum(TransactionCategory, {
    required_error: "Category is required",
    invalid_type_error: "Invalid category",
  }),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(0, "Budget amount must be positive"),
});

export const createBudgetSchema = z.object({
  month: z
    .string({
      required_error: "Month is required",
    })
    .regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"),
  categories: z
    .array(categoryBudgetSchema)
    .min(1, "At least one category budget is required")
    .refine(
      (categories) => {
        const uniqueCategories = new Set(categories.map((c) => c.category));
        return uniqueCategories.size === categories.length;
      },
      {
        message: "Each category can only have one budget entry",
      }
    ),
});

export const updateBudgetSchema = z.object({
  categories: z
    .array(categoryBudgetSchema)
    .min(1, "At least one category budget is required")
    .refine(
      (categories) => {
        const uniqueCategories = new Set(categories.map((c) => c.category));
        return uniqueCategories.size === categories.length;
      },
      {
        message: "Each category can only have one budget entry",
      }
    ),
});

export type CreateBudgetData = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetData = z.infer<typeof updateBudgetSchema>;

export type ValidationError = {
  path: string[];
  message: string;
};

export function formatZodError(error: z.ZodError): ValidationError[] {
  return error.errors.map((err) => ({
    path: err.path.map(String),
    message: err.message,
  }));
}
