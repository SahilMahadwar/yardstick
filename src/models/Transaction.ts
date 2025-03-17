import { Schema, model, models } from "mongoose";

export interface ITransaction {
  amount: number;
  description: string;
  date: Date;
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
  },
  {
    timestamps: true,
  }
);

export const Transaction =
  models.Transaction || model<ITransaction>("Transaction", transactionSchema);
