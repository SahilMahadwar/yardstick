import dbConnect from "@/lib/db";
import { transactionSchema } from "@/lib/validations";
import { Transaction } from "@/models/transaction";
import { TransactionApiResponse } from "@/types/transaction";
import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return Response.json(
        {
          success: false,
          error: "Invalid transaction ID",
        } as TransactionApiResponse,
        { status: 400 }
      );
    }

    await dbConnect();
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return Response.json(
        {
          success: false,
          error: "Transaction not found",
        } as TransactionApiResponse,
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: { transaction },
    } as TransactionApiResponse);
  } catch (error) {
    console.error("Failed to fetch transaction:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch transaction",
      } as TransactionApiResponse,
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return Response.json(
        {
          success: false,
          error: "Invalid transaction ID",
        } as TransactionApiResponse,
        { status: 400 }
      );
    }

    const json = await request.json();
    const validatedData = transactionSchema.partial().parse(json);

    await dbConnect();
    const transaction = await Transaction.findByIdAndUpdate(id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!transaction) {
      return Response.json(
        {
          success: false,
          error: "Transaction not found",
        } as TransactionApiResponse,
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: { transaction },
    } as TransactionApiResponse);
  } catch (error) {
    console.error("Failed to update transaction:", error);

    if (error instanceof Error) {
      return Response.json(
        {
          success: false,
          error: error.message,
        } as TransactionApiResponse,
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: false,
        error: "Failed to update transaction",
      } as TransactionApiResponse,
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const { id } = params;

    if (!isValidObjectId(id)) {
      return Response.json(
        {
          success: false,
          error: "Invalid transaction ID",
        } as TransactionApiResponse,
        { status: 400 }
      );
    }

    await dbConnect();
    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return Response.json(
        {
          success: false,
          error: "Transaction not found",
        } as TransactionApiResponse,
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      data: { transaction },
    } as TransactionApiResponse);
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to delete transaction",
      } as TransactionApiResponse,
      { status: 500 }
    );
  }
}
