import { TransactionCategory } from "@/types/transaction";
import { Schema, model, models } from "mongoose";

interface ICategoryBudget {
  category: TransactionCategory;
  amount: number;
  spent: number;
  remaining: number;
}

export interface IBudget {
  month: string;
  categories: ICategoryBudget[];
  totalBudget: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const categoryBudgetSchema = new Schema<ICategoryBudget>(
  {
    category: {
      type: String,
      enum: Object.values(TransactionCategory),
      required: [true, "Category is required"],
    },
    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: [0, "Budget amount must be positive"],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, "Spent amount must be positive"],
    },
    remaining: {
      type: Number,
      default: function (this: ICategoryBudget) {
        return this.amount - (this.spent || 0);
      },
    },
  },
  { _id: false }
);

const budgetSchema = new Schema<IBudget>(
  {
    month: {
      type: String,
      required: [true, "Month is required"],
      validate: {
        validator: (v: string) => /^\d{4}-\d{2}$/.test(v),
        message: "Month must be in YYYY-MM format",
      },
      index: true,
    },
    categories: {
      type: [categoryBudgetSchema],
      required: [true, "Categories are required"],
      validate: {
        validator: function (categories: ICategoryBudget[]) {
          // Ensure all categories are unique
          const uniqueCategories = new Set(categories.map((c) => c.category));
          return uniqueCategories.size === categories.length;
        },
        message: "Each category can only have one budget entry",
      },
    },
    totalBudget: {
      type: Number,
      default: function (this: IBudget) {
        return this.categories.reduce((sum, cat) => sum + cat.amount, 0);
      },
    },
    totalSpent: {
      type: Number,
      default: function (this: IBudget) {
        return this.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0);
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual for remaining total budget
budgetSchema.virtual("remainingTotal").get(function (this: IBudget) {
  return this.totalBudget - this.totalSpent;
});

// Add index for efficient querying
budgetSchema.index({ month: 1 }, { unique: true });

interface Transaction {
  category: TransactionCategory;
  amount: number;
}

// Method to update spent amounts based on transactions
budgetSchema.methods.updateSpentAmounts = async function (
  transactions: Transaction[]
) {
  const spentByCategory = transactions.reduce(
    (acc: Record<string, number>, t: Transaction) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    },
    {}
  );

  this.categories.forEach((cat: ICategoryBudget) => {
    cat.spent = spentByCategory[cat.category] || 0;
    cat.remaining = cat.amount - cat.spent;
  });

  this.totalSpent = this.categories.reduce(
    (sum: number, cat: ICategoryBudget) => sum + cat.spent,
    0
  );
  await this.save();
};

// Create and export the Budget model
export const Budget = models.Budget || model<IBudget>("Budget", budgetSchema);
