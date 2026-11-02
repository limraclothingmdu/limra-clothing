
"use client";

import { useState } from "react";
import { Star } from "lucide-react";

type ProductReviewFormProps = {
  productId: string;
  productType: "retail" | "wholesale";
};

export default function ProductReviewForm({
  productId,
  productType,
}: ProductReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (reviewText.trim().length < 10) {
      setError(
        "Please write at least 10 characters about your experience."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productType,
          rating,
          title: title.trim(),
          reviewText: reviewText.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.error ??
            "Unable to submit your review. Please try again."
        );
        return;
      }

      setMessage(
        "Thank you! Your review has been submitted and is awaiting approval."
      );

      setTitle("");
      setReviewText("");
      setRating(5);
    } catch {
      setError(
        "Unable to connect. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-[#081A4A]">
        Write a Customer Review
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#222]/60">
        Share your experience with this product. Reviews are checked
        before they appear publicly.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-semibold text-[#081A4A]">
            Your Rating
          </label>

          <div
            className="mt-2 flex items-center gap-1"
            role="group"
            aria-label="Select your rating"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                aria-pressed={rating === value}
                className="rounded p-1 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#C89B3C]"
              >
                <Star
                  className={`h-7 w-7 ${
                    value <= rating
                      ? "fill-[#C89B3C] text-[#C89B3C]"
                      : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="review-title"
            className="block text-sm font-semibold text-[#081A4A]"
          >
            Review Title (Optional)
          </label>

          <input
            id="review-title"
            type="text"
            maxLength={120}
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Give your review a title"
            className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
          />
        </div>

        <div>
          <label
            htmlFor="review-text"
            className="block text-sm font-semibold text-[#081A4A]"
          >
            Your Review
          </label>

          <textarea
            id="review-text"
            rows={5}
            minLength={10}
            maxLength={2000}
            required
            value={reviewText}
            onChange={(event) =>
              setReviewText(event.target.value)
            }
            placeholder="What did you think about this product?"
            className="mt-2 w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#C89B3C] focus:ring-1 focus:ring-[#C89B3C]"
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {reviewText.length}/2000
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-[#081A4A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </section>
  );
}
