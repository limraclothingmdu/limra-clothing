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

type OrderStatus = (typeof ALLOWED_STATUSES)[number];

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/*
 * Allowed fulfillment flow:
 *
 * pending
 *   ↓
 * confirmed
 *   ↓
 * processing
 *   ↓
 * shipped
 *   ↓
 * delivered
 *
 * Cancellation is allowed only before payment is completed.
 *
 * Terminal states:
 * - delivered
 * - cancelled
 */

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["pending", "confirmed", "cancelled"],
  confirmed: ["confirmed", "processing"],
  processing: ["processing", "shipped"],
  shipped: ["shipped", "delivered"],
  delivered: ["delivered"],
  cancelled: ["cancelled"],
};

function isValidStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    ALLOWED_STATUSES.includes(value as OrderStatus)
  );
}

export async function PATCH(request: Request, { params }: Props) {
  await requireAdmin();

  const { id } = await params;

  try {
    const body = await request.json();
    const status = body?.status;

    if (!isValidStatus(status)) {
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

    const currentStatus = existingOrder.status as OrderStatus;

    /*
     * Do not allow invalid backward transitions.
     */
    if (!ALLOWED_TRANSITIONS[currentStatus].includes(status)) {
      return NextResponse.json(
        {
          error: `Order cannot be moved from "${currentStatus}" to "${status}".`,
        },
        { status: 400 }
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

    /*
     * Cancellation currently has no refund operation attached to it.
     *
     * Therefore, do not allow an already-paid order to be marked
     * as cancelled until a proper refund workflow is implemented.
     */
    if (
      status === "cancelled" &&
      existingOrder.payment_status === "paid"
    ) {
      return NextResponse.json(
        {
          error:
            "Paid orders cannot be cancelled until the refund workflow is implemented.",
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
      .select("id, status, payment_status, updated_at")
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