import dbConnect from "@/lib/db";
import { createBudgetSchema, formatZodError } from "@/lib/validations/budget";
import { Budget } from "@/models/budget";
import { Transaction } from "@/models/transaction";
import { BudgetApiResponse } from "@/types/budget";
import { format } from "date-fns";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

// get all budets or current months budget
export async function GET(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const current = searchParams.get("current");

    let budgets;
    if (current) {
      // Get current month's budget
      const currentMonth = format(new Date(), "yyyy-MM");
      budgets = await Budget.findOne({ month: currentMonth });
    } else {
      // Get all budgets
      budgets = await Budget.find().sort({ month: -1 });
    }

    return Response.json({
      success: true,
      data: {
        budgets: Array.isArray(budgets) ? budgets : [budgets].filter(Boolean),
      },
    } as BudgetApiResponse);
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch budgets",
      } as BudgetApiResponse,
      { status: 500 }
    );
  }
}

// POST /api/budgets - Create a new budget
export async function POST(request: NextRequest): Promise<Response> {
  try {
    await dbConnect();

    const json = await request.json();
    const data = createBudgetSchema.parse(json);

    // Check if budget already exists for this month
    const existingBudget = await Budget.findOne({ month: data.month });
    if (existingBudget) {
      return Response.json(
        {
          success: false,
          error: "Budget already exists for this month",
        } as BudgetApiResponse,
        { status: 400 }
      );
    }

    // Create new budget
    const budget = await Budget.create(data);

    // Update spent amounts based on existing transactions
    const startOfMonth = new Date(data.month + "-01");
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

    return Response.json({
      success: true,
      data: { budget },
    } as BudgetApiResponse);
  } catch (error) {
    console.error("Failed to create budget:", error);

    if (error instanceof ZodError) {
      return Response.json(
        {
          success: false,
          error: formatZodError(error),
        } as BudgetApiResponse,
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Failed to create budget",
      } as BudgetApiResponse,
      { status: 500 }
    );
  }
}
