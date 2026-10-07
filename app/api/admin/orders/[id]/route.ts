import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";

const ALLOWED_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, { params }: Props) {
  await requireAdmin();

  const { id } = await params;

  try {
    const body = await request.json();
    const status = body?.status;

    if (
      typeof status !== "string" ||
      !ALLOWED_STATUSES.includes(
        status as (typeof ALLOWED_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Invalid order status." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: existingOrder, error: existingError } =
      await supabase
        .from("orders")
        .select("id, payment_status, status")
        .eq("id", id)
        .single();

    if (existingError || !existingOrder) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    /*
     * Do not allow fulfillment of an unpaid order.
     */
    if (
      ["confirmed", "processing", "shipped", "delivered"].includes(
        status
      ) &&
      existingOrder.payment_status !== "paid"
    ) {
      return NextResponse.json(
        {
          error:
            "A paid order is required before moving this order into fulfillment.",
        },
        { status: 400 }
      );
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, status, payment_status, updated_at"
      )
      .single();

    if (updateError || !updatedOrder) {
      console.error("Admin order update error:", updateError);

      return NextResponse.json(
        { error: "Unable to update order status." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Admin order PATCH error:", error);

    return NextResponse.json(
      { error: "Unable to update order." },
      { status: 500 }
    );
  }
}