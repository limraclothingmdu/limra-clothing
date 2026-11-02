import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

type ReviewStatus = "approved" | "rejected";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminApi();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.error },
        { status: admin.status }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const status = body.status as ReviewStatus;

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json(
        { error: "Status must be approved or rejected" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: review, error: fetchError } = await supabase
      .from("product_reviews")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    if (review.status !== "pending") {
      return NextResponse.json(
        { error: "This review has already been moderated" },
        { status: 409 }
      );
    }

    const { data: updatedReview, error: updateError } = await supabase
      .from("product_reviews")
      .update({ status })
      .eq("id", id)
      .eq("status", "pending")
      .select("id, status")
      .single();

    if (updateError || !updatedReview) {
      return NextResponse.json(
        { error: updateError?.message || "Unable to update review" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review: updatedReview,
    });
  } catch (error) {
    console.error("Review moderation error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while moderating the review" },
      { status: 500 }
    );
  }
}

