
import { createClient } from "@/lib/supabase/server";

type ProductReviewsProps = {
  productId: string;
  productType: "retail" | "wholesale";
};

export default async function ProductReviews({
  productId,
  productType,
}: ProductReviewsProps) {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("product_reviews")
    .select(
      "id, rating, title, review_text, verified_purchase, created_at"
    )
    .eq("product_id", productId)
    .eq("product_type", productType)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Unable to load product reviews:", error.message);

    return (
      <section className="mt-10">
        <h2 className="text-2xl font-bold text-[#081A4A]">
          Customer Reviews
        </h2>
        <p className="mt-3 text-slate-600">
          Reviews are temporarily unavailable.
        </p>
      </section>
    );
  }

  const reviewList = reviews ?? [];
  const reviewCount = reviewList.length;

  const averageRating =
    reviewCount > 0
      ? reviewList.reduce((total, review) => total + review.rating, 0) /
        reviewCount
      : 0;

  return (
    <section className="mt-10">
      <div className="border-b border-slate-200 pb-6">
        <h2 className="text-2xl font-bold text-[#081A4A]">
          Customer Reviews
        </h2>

        {reviewCount > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-[#081A4A]">
              {averageRating.toFixed(1)}
            </span>

            <div>
              <div
                className="text-xl tracking-wide text-amber-500"
                aria-label={`${averageRating.toFixed(1)} out of 5 stars`}
              >
                {"★".repeat(Math.round(averageRating))}
                {"☆".repeat(5 - Math.round(averageRating))}
              </div>

              <p className="text-sm text-slate-600">
                Based on {reviewCount}{" "}
                {reviewCount === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-slate-600">
            No approved reviews yet. Be the first to share your experience.
          </p>
        )}
      </div>

      {reviewCount > 0 && (
        <div className="mt-6 space-y-5">
          {reviewList.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                  className="text-lg tracking-wide text-amber-500"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>

                {review.verified_purchase && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Verified Purchase
                  </span>
                )}
              </div>

              {review.title && (
                <h3 className="mt-3 font-semibold text-[#081A4A]">
                  {review.title}
                </h3>
              )}

              <p className="mt-2 whitespace-pre-line leading-7 text-slate-600">
                {review.review_text}
              </p>

              <p className="mt-4 text-xs text-slate-500">
                {new Date(review.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
