import dbConnect from "@/lib/db";
import { ITransaction, Transaction } from "@/models/transaction";
import {
  CategoryBreakdown,
  TransactionApiResponse,
  TransactionCategory,
  TransactionSummary,
  Transaction as TransactionType,
} from "@/types/transaction";
import { FilterQuery } from "mongoose";
import { NextRequest } from "next/server";

type MongoDoc = {
  _id: string;
  amount: number;
  description: string;
  date: Date;
  category: TransactionCategory;
  createdAt: Date;
  updatedAt: Date;
};

function transformTransaction(doc: any): TransactionType {
  return {
    _id: doc._id.toString(),
    amount: doc.amount,
    description: doc.description,
    date: new Date(doc.date),
    category: doc.category,
    createdAt: new Date(doc.createdAt),
    updatedAt: new Date(doc.updatedAt),
  };
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");

    // Build date filter
    const dateFilter: FilterQuery<ITransaction> = {};
    if (fromDate || toDate) {
      dateFilter.date = {};
      if (fromDate) dateFilter.date.$gte = new Date(fromDate);
      if (toDate) dateFilter.date.$lte = new Date(toDate);
    }

    // Get total transactions and amount
    const [totalStats, categoryBreakdown, recentDocs] = await Promise.all([
      Transaction.aggregate<{
        _id: null;
        totalTransactions: number;
        totalAmount: number;
        averageAmount: number;
      }>([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalTransactions: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
            averageAmount: { $avg: "$amount" },
          },
        },
      ]),
      Transaction.aggregate<{
        category: TransactionCategory;
        totalAmount: number;
        count: number;
      }>([
        { $match: dateFilter },
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            category: "$_id",
            totalAmount: 1,
            count: 1,
            _id: 0,
          },
        },
      ]),
      Transaction.find(dateFilter).sort({ date: -1 }).limit(5).lean(),
    ]);

    // Transform recent transactions
    const recentTransactions = recentDocs.map(transformTransaction);

    // Calculate percentages for category breakdown
    const total = totalStats[0]?.totalAmount || 0;
    const categoryData: CategoryBreakdown[] = categoryBreakdown.map((item) => ({
      ...item,
      percentage: total ? (item.totalAmount / total) * 100 : 0,
    }));

    // Find most frequent category
    const mostFrequentCategory =
      categoryBreakdown.reduce(
        (max, item) => (item.count > max.count ? item : max),
        categoryBreakdown[0]
      )?.category || TransactionCategory.OTHER;

    // Find largest transaction
    const largestDoc = await Transaction.findOne(dateFilter)
      .sort({ amount: -1 })
      .lean();

    const summary: TransactionSummary = {
      totalTransactions: totalStats[0]?.totalTransactions || 0,
      totalAmount: totalStats[0]?.totalAmount || 0,
      averageAmount: totalStats[0]?.averageAmount || 0,
      mostFrequentCategory,
      largestTransaction: largestDoc
        ? transformTransaction(largestDoc)
        : {
            _id: "0",
            amount: 0,
            description: "",
            date: new Date(),
            category: TransactionCategory.OTHER,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
    };

    const response: TransactionApiResponse = {
      success: true,
      data: {
        summary,
        categoryBreakdown: categoryData,
        transactions: recentTransactions,
      },
    };

    return Response.json(response);
  } catch (error) {
    console.error("Failed to fetch transaction summary:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch transaction summary",
      } as TransactionApiResponse,
      { status: 500 }
    );
  }
}
