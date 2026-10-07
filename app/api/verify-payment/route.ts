import crypto from "node:crypto";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    } = body;

    if (
      typeof orderId !== "string" ||
      typeof paymentId !== "string" ||
      typeof signature !== "string" ||
      !orderId ||
      !paymentId ||
      !signature
    ) {
      return NextResponse.json(
        {
          error: "Payment verification fields are required.",
        },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay credentials are not configured.");

      return NextResponse.json(
        { error: "Payment service is not configured." },
        { status: 500 }
      );
    }

    /*
     * Verify Razorpay signature.
     */
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const expectedSignatureBuffer = Buffer.from(
      expectedSignature,
      "utf8"
    );

    const providedSignatureBuffer = Buffer.from(
      signature,
      "utf8"
    );

    const signaturesMatch =
      expectedSignatureBuffer.length ===
        providedSignatureBuffer.length &&
      crypto.timingSafeEqual(
        expectedSignatureBuffer,
        providedSignatureBuffer
      );

    if (!signaturesMatch) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment signature.",
        },
        { status: 400 }
      );
    }

    /*
     * Ask Razorpay for the actual order amount.
     * This prevents the browser from changing the amount.
     */
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const razorpayOrder = await razorpay.orders.fetch(orderId);

    const razorpayAmount = Number(razorpayOrder.amount) / 100;

    /*
     * Confirm the Limra order and atomically update:
     * - payment
     * - order status
     * - payment status
     * - stock
     */
    const { data, error } = await supabase.rpc(
      "confirm_retail_payment",
      {
        p_razorpay_order_id: orderId,
        p_razorpay_payment_id: paymentId,
        p_razorpay_signature: signature,
        p_amount: razorpayAmount,
      }
    );

    if (error) {
      console.error("Payment confirmation RPC error:", error);

      return NextResponse.json(
        {
          success: false,
          error:
            error.message ||
            "Unable to complete the order after payment.",
        },
        { status: 500 }
      );
    }

    if (!data?.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment could not be completed.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully. Thank you for your order.",
      order_id: data.order_id,
    });
  } catch (error) {
    console.error("Verify Razorpay payment error:", error);

    return NextResponse.json(
      {
        error: "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}