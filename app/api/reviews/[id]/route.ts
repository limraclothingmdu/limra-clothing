
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const ALLOWED_REVIEW_STATUSES = ["approved", "rejected"] as const;

type ReviewStatus = (typeof ALLOWED_REVIEW_STATUSES)[number];

function isValidReviewStatus(value: unknown): value is ReviewStatus {
  return (
    typeof value === "string" &&
    ALLOWED_REVIEW_STATUSES.includes(value as ReviewStatus)
  );
}

export async function PATCH(request: Request, { params }: Props) {
  const admin = await requireAdminApi();

  if (!admin.authorized) {
    return NextResponse.json(
      { error: admin.error },
      { status: admin.status }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const status = body?.status;

    if (!isValidReviewStatus(status)) {
      return NextResponse.json(
        { error: "Status must be approved or rejected." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: existingReview, error: fetchError } = await supabase
      .from("product_reviews")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !existingReview) {
      return NextResponse.json(
        { error: "Review not found." },
        { status: 404 }
      );
    }

    if (existingReview.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending reviews can be moderated." },
        { status: 409 }
      );
    }

    const { data: updatedReview, error: updateError } = await supabase
      .from("product_reviews")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("status", "pending")
      .select("id, status, updated_at")
      .single();

    if (updateError || !updatedReview) {
      console.error("Admin review update error:", updateError);

      return NextResponse.json(
        { error: "Unable to update review." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      review: updatedReview,
    });
  } catch (error) {
    console.error("Admin review PATCH error:", error);

    return NextResponse.json(
      { error: "Unable to process review." },
      { status: 500 }
    );
  }
}
