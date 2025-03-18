import { TransactionCategory } from "@/types/transaction";
import { Document, Schema, model, models } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  description: string;
  date: Date;
  category: TransactionCategory;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [3, "Description must be at least 3 characters long"],
      maxlength: [100, "Description must not exceed 100 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: Object.values(TransactionCategory),
        message: "Invalid category",
      },
      default: TransactionCategory.OTHER,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster category-based queries and aggregations
transactionSchema.index({ category: 1, date: -1 });

export const Transaction =
  models.Transaction || model<ITransaction>("Transaction", transactionSchema);
