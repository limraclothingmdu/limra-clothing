
import { Star, MessageSquareText } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import ReviewModerationActions from "@/components/admin/ReviewModerationActions";

export const dynamic = "force-dynamic";

type Review = {
  id: string;
  product_id: string;
  product_type: "retail" | "wholesale";
  user_id: string;
  rating: number;
  title: string | null;
  review_text: string;
  status: string;
  verified_purchase: boolean;
  created_at: string;
};

type Product = {
  id: string;
  name: string;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminReviewsPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: reviewsData, error: reviewsError } = await supabase
    .from("product_reviews")
    .select(
      "id, product_id, product_type, user_id, rating, title, review_text, status, verified_purchase, created_at"
    )
    .order("created_at", { ascending: false });

  if (reviewsError) {
    console.error("Admin reviews fetch error:", reviewsError);

    return (
      <main className="min-h-screen bg-[#F7F5F0] p-6">
        <h1 className="text-2xl font-bold text-[#081A4A]">
          Review Moderation
        </h1>
        <p className="mt-4 text-red-600">
          Unable to load reviews. Please try again.
        </p>
      </main>
    );
  }

  const reviews = (reviewsData ?? []) as Review[];

  const productIds = [...new Set(reviews.map((review) => review.product_id))];

  let products: Product[] = [];

  if (productIds.length > 0) {
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("id, name")
      .in("id", productIds);

    if (productsError) {
      console.error("Admin review product lookup error:", productsError);
    } else {
      products = (productsData ?? []) as Product[];
    }
  }

  const productNames = new Map(
    products.map((product) => [product.id, product.name])
  );

  const pendingReviews = reviews.filter(
    (review) => review.status === "pending"
  );

  const approvedReviews = reviews.filter(
    (review) => review.status === "approved"
  );

  const rejectedReviews = reviews.filter(
    (review) => review.status === "rejected"
  );

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      <section className="border-b border-[#081A4A]/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C89B3C]">
            Limra Clothing Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#081A4A]">
            Review Moderation
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Review customer feedback before publishing it on product pages.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-amber-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">
              Pending Reviews
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {pendingReviews.length}
            </p>
          </div>

          <div className="rounded-2xl border border-green-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">
              Approved Reviews
            </p>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {approvedReviews.length}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-5">
            <p className="text-sm font-medium text-gray-500">
              Rejected Reviews
            </p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {rejectedReviews.length}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center gap-3">
            <MessageSquareText className="h-5 w-5 text-[#C89B3C]" />
            <h2 className="text-xl font-bold text-[#081A4A]">
              Pending Reviews
            </h2>
          </div>

          {pendingReviews.length === 0 ? (
            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-8 text-center">
              <p className="font-semibold text-[#081A4A]">
                No pending reviews
              </p>
              <p className="mt-2 text-sm text-gray-500">
                New customer reviews will appear here for moderation.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {pendingReviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-bold text-[#081A4A]">
                        {productNames.get(review.product_id) ??
                          "Product unavailable"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {review.product_type === "retail"
                          ? "Retail product"
                          : "Wholesale product"}
                      </p>
                    </div>

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Pending
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <div
                      className="flex items-center gap-1 text-amber-500"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-current"
                        />
                      ))}
                    </div>

                    <span className="text-sm text-gray-500">
                      {review.rating}/5
                    </span>

                    {review.verified_purchase && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        Verified Purchase
                      </span>
                    )}
                  </div>

                  {review.title && (
                    <h3 className="mt-4 font-semibold text-[#081A4A]">
                      {review.title}
                    </h3>
                  )}

                  <p className="mt-2 whitespace-pre-line leading-7 text-gray-600">
                    {review.review_text}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-500">
                      Submitted {formatDate(review.created_at)}
                    </p>

                    <ReviewModerationActions reviewId={review.id} />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
