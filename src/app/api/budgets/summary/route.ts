import dbConnect from "@/lib/db";
import { Budget } from "@/models/budget";
import { Transaction } from "@/models/transaction";
import {
  BudgetApiResponse,
  BudgetInsight,
  CategoryBudget,
} from "@/types/budget";
import { TransactionCategory } from "@/types/transaction";
import { format } from "date-fns";
import { NextRequest } from "next/server";

const NEAR_LIMIT_THRESHOLD = 0.8;

export async function GET(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const month = searchParams.get("month") || format(new Date(), "yyyy-MM");

    const budget = await Budget.findOne({ month });

    if (!budget) {
      return Response.json(
        {
          success: false,
          error: "Budget not found for the specified month",
        } as BudgetApiResponse,
        { status: 404 }
      );
    }

    // Update spent amounts before generating summary
    const startOfMonth = new Date(month + "-01");
    const endOfMonth = new Date(
      new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1)
    );

    const transactions = await Transaction.find({
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    await budget.updateSpentAmounts(transactions);

    // Identify over-budget and near-limit categories
    const overBudgetCategories = budget.categories.filter(
      (cat: CategoryBudget) => cat.spent > cat.amount
    );

    const nearLimitCategories = budget.categories.filter(
      (cat: CategoryBudget) =>
        cat.spent <= cat.amount &&
        cat.spent >= cat.amount * NEAR_LIMIT_THRESHOLD
    );

    const insights: BudgetInsight[] = [];

    // Over budget warnings
    overBudgetCategories.forEach((cat: CategoryBudget) => {
      insights.push({
        type: "warning",
        message: `${cat.category} spending is over budget`,
        category: cat.category,
        details: {
          current: cat.spent,
          limit: cat.amount,
          remaining: cat.remaining,
        },
      });
    });

    // Near limit warnings
    nearLimitCategories.forEach((cat: CategoryBudget) => {
      insights.push({
        type: "info",
        message: `${cat.category} spending is near budget limit`,
        category: cat.category,
        details: {
          current: cat.spent,
          limit: cat.amount,
          remaining: cat.remaining,
        },
      });
    });

    // Top spending categories
    const topCategories = [...budget.categories]
      .sort((a: CategoryBudget, b: CategoryBudget) => b.spent - a.spent)
      .slice(0, 3);

    insights.push({
      type: "info",
      message: `Top spending categories: ${topCategories
        .map((cat) => cat.category)
        .join(", ")}`,
    });

    // Budget utilization insight
    const totalUtilization = (budget.totalSpent / budget.totalBudget) * 100;
    insights.push({
      type: totalUtilization > 90 ? "warning" : "info",
      message:
        totalUtilization > 90
          ? "Overall budget utilization is very high"
          : `Overall budget utilization is ${totalUtilization.toFixed(1)}%`,
      details: {
        current: budget.totalSpent,
        limit: budget.totalBudget,
        remaining: budget.totalBudget - budget.totalSpent,
      },
    });

    // Prepare summary response
    const summary = {
      totalBudget: budget.totalBudget,
      totalSpent: budget.totalSpent,
      remainingBudget: budget.totalBudget - budget.totalSpent,
      overBudgetCategories,
      nearLimitCategories,
      insights,
    };

    return Response.json({
      success: true,
      data: { summary },
    } as BudgetApiResponse);
  } catch (error) {
    console.error("Failed to fetch budget summary:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch budget summary",
      } as BudgetApiResponse,
      { status: 500 }
    );
  }
}
