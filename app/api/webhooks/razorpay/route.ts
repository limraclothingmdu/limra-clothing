import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function safeCompare(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (receivedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase service-role environment variables are missing"
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!webhookSecret || !keyId || !keySecret) {
      console.error(
        "Razorpay webhook environment variables are missing"
      );

      return NextResponse.json(
        { error: "Webhook configuration error" },
        { status: 500 }
      );
    }

    /*
     * IMPORTANT:
     * Read the raw body before JSON parsing.
     * Razorpay's webhook signature is calculated from
     * the exact raw request body.
     */
    const rawBody = await request.text();

    if (!rawBody) {
      return NextResponse.json(
        { error: "Empty webhook body" },
        { status: 400 }
      );
    }

    const receivedSignature = request.headers.get(
      "x-razorpay-signature"
    );

    if (!receivedSignature) {
      return NextResponse.json(
        { error: "Missing Razorpay webhook signature" },
        { status: 401 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (!safeCompare(receivedSignature, expectedSignature)) {
      console.error("Invalid Razorpay webhook signature");

      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    let payload: {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            amount?: number;
            currency?: string;
            status?: string;
          };
        };
      };
    };

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const eventType =
      typeof payload.event === "string"
        ? payload.event
        : "";

    /*
     * Razorpay sends a unique event ID in this header.
     * We use it for webhook idempotency.
     */
    const eventId = request.headers.get(
      "x-razorpay-event-id"
    );

    if (!eventId) {
      return NextResponse.json(
        { error: "Missing Razorpay event ID" },
        { status: 400 }
      );
    }

    /*
     * We currently subscribed only to payment.captured.
     */
    if (eventType !== "payment.captured") {
      return NextResponse.json({
        success: true,
        ignored: true,
        event: eventType,
      });
    }

    const payment = payload.payload?.payment?.entity;

    const paymentId = payment?.id;
    const orderId = payment?.order_id;

    if (!paymentId || !orderId) {
      return NextResponse.json(
        {
          error:
            "Missing Razorpay payment/order ID",
        },
        { status: 400 }
      );
    }

    /*
     * Fetch the payment directly from Razorpay.
     * This gives us a trusted backend-side payment state
     * and amount.
     */
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const razorpayPayment =
      await razorpay.payments.fetch(paymentId);

    if (razorpayPayment.status !== "captured") {
      console.error(
        "Razorpay payment is not captured:",
        razorpayPayment.status
      );

      return NextResponse.json(
        { error: "Payment is not captured" },
        { status: 400 }
      );
    }

    if (razorpayPayment.order_id !== orderId) {
      console.error(
        "Razorpay payment/order mismatch"
      );

      return NextResponse.json(
        {
          error:
            "Payment does not belong to the supplied order",
        },
        { status: 400 }
      );
    }

    const amount =
      Number(razorpayPayment.amount) / 100;

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid Razorpay payment amount" },
        { status: 400 }
      );
    }

    /*
     * Use the service-role client only on the server.
     */
    const supabase =
      createServiceRoleClient();

    const { data, error } =
      await supabase.rpc(
        "confirm_retail_payment_webhook",
        {
          p_razorpay_order_id: orderId,
          p_razorpay_payment_id: paymentId,
          p_amount: amount,
          p_event_id: eventId,
          p_event_type: eventType,
        }
      );

    if (error) {
      console.error(
        "Webhook payment confirmation failed:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Could not confirm payment",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      event: eventType,
      result: data,
    });
  } catch (error) {
    console.error(
      "Razorpay webhook error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}