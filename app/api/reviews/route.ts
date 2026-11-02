
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ReviewRequest = {
  productId?: string;
  productType?: "retail" | "wholesale";
  rating?: number;
  title?: string;
  reviewText?: string;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please sign in to submit a review." },
        { status: 401 }
      );
    }

    let body: ReviewRequest;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const productId = body.productId?.trim();
    const productType = body.productType;
    const rating = body.rating;
    const title = body.title?.trim() ?? "";
    const reviewText = body.reviewText?.trim();

    if (
      !productId ||
      !UUID_REGEX.test(productId) ||
      (productType !== "retail" &&
        productType !== "wholesale") ||
      !Number.isInteger(rating) ||
      rating! < 1 ||
      rating! > 5 ||
      title.length > 120 ||
      !reviewText ||
      reviewText.length < 10 ||
      reviewText.length > 2000
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid product, rating, and review.",
        },
        { status: 400 }
      );
    }

    // Find order items matching this product.
    const { data: orderItems, error: itemsError } =
      await supabase
        .from("order_items")
        .select("order_id")
        .eq("product_id", productId);

    if (itemsError) {
      console.error(
        "Review purchase lookup failed:",
        itemsError
      );

      return NextResponse.json(
        { error: "Unable to verify purchase." },
        { status: 500 }
      );
    }

    const orderIds = [
      ...new Set(
        (orderItems ?? []).map((item) => item.order_id)
      ),
    ];

    let verifiedPurchase = false;

    if (orderIds.length > 0) {
      const { data: eligibleOrders, error: ordersError } =
        await supabase
          .from("orders")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "delivered")
          .eq("payment_status", "paid")
          .in("id", orderIds);

      if (ordersError) {
        console.error(
          "Review order verification failed:",
          ordersError
        );

        return NextResponse.json(
          { error: "Unable to verify purchase." },
          { status: 500 }
        );
      }

      verifiedPurchase =
        (eligibleOrders?.length ?? 0) > 0;
    }

    const { data: review, error: insertError } =
      await supabase
        .from("product_reviews")
        .insert({
          product_id: productId,
          product_type: productType,
          user_id: user.id,
          rating,
          title: title || null,
          review_text: reviewText,
          status: "pending",
          verified_purchase: verifiedPurchase,
        })
        .select("id")
        .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          {
            error:
              "You have already submitted a review for this product.",
          },
          { status: 409 }
        );
      }

      console.error(
        "Review submission failed:",
        insertError
      );

      return NextResponse.json(
        { error: "Unable to submit your review." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Your review has been submitted and is awaiting approval.",
        reviewId: review.id,
        verifiedPurchase,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review API error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
