import dbConnect from "@/lib/db";
import { transactionSchema } from "@/lib/validations";
import { Transaction } from "@/models/transaction";
import { TransactionApiResponse } from "@/types/transaction";
import { NextRequest } from "next/server";

export async function GET(): Promise<Response> {
  try {
    await dbConnect();
    const transactions = await Transaction.find().sort({ date: -1 });

    return Response.json({
      success: true,
      data: { transactions },
    } as TransactionApiResponse);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch transactions",
      } as TransactionApiResponse,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const json = await request.json();

    // Validate request body
    const validatedData = transactionSchema.parse(json);

    await dbConnect();
    const transaction = await Transaction.create(validatedData);

    return Response.json({
      success: true,
      data: { transaction },
    } as TransactionApiResponse);
  } catch (error) {
    console.error("Failed to create transaction:", error);

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
        error: "Failed to create transaction",
      } as TransactionApiResponse,
      { status: 500 }
    );
  }
}
