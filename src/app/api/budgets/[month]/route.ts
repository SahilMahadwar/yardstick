import dbConnect from "@/lib/db";
import { formatZodError, updateBudgetSchema } from "@/lib/validations/budget";
import { Budget } from "@/models/budget";
import { Transaction } from "@/models/transaction";
import { BudgetApiResponse } from "@/types/budget";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

interface RouteParams {
  params: {
    month: string;
  };
}

// GET /api/budgets/[month] - Get a specific month's budget
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  try {
    await dbConnect();

    const budget = await Budget.findOne({
      month: params.month,
    });

    if (!budget) {
      return Response.json(
        {
          success: false,
          error: "Budget not found",
        } as BudgetApiResponse,
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: { budget },
    } as BudgetApiResponse);
  } catch (error) {
    console.error("Failed to fetch budget:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch budget",
      } as BudgetApiResponse,
      { status: 500 }
    );
  }
}

// PUT /api/budgets/[month] - Update a month's budget
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  try {
    await dbConnect();

    const budget = await Budget.findOne({
      month: params.month,
    });

    if (!budget) {
      return Response.json(
        {
          success: false,
          error: "Budget not found",
        } as BudgetApiResponse,
        { status: 404 }
      );
    }

    const json = await request.json();
    const data = updateBudgetSchema.parse(json);

    // Update budget categories
    budget.categories = data.categories;

    // Recalculate spent amounts based on transactions
    const startOfMonth = new Date(params.month + "-01");
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
    console.error("Failed to update budget:", error);

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
        error: "Failed to update budget",
      } as BudgetApiResponse,
      { status: 500 }
    );
  }
}

// DELETE /api/budgets/[month] - Delete a month's budget
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<Response> {
  try {
    await dbConnect();

    const budget = await Budget.findOne({
      month: params.month,
    });

    if (!budget) {
      return Response.json(
        {
          success: false,
          error: "Budget not found",
        } as BudgetApiResponse,
        { status: 404 }
      );
    }

    await budget.deleteOne();

    return Response.json({
      success: true,
      data: {},
    } as BudgetApiResponse);
  } catch (error) {
    console.error("Failed to delete budget:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to delete budget",
      } as BudgetApiResponse,
      { status: 500 }
    );
  }
}
