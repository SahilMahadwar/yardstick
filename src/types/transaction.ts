import { transactionSchema } from "@/lib/validations";
import { z } from "zod";

//  Zod schema
export type Transaction = z.infer<typeof transactionSchema> & {
  _id: string;
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
