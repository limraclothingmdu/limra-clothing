
"use client";

import { useState } from "react";

type ReviewModerationActionsProps = {
  reviewId: string;
};

export default function ReviewModerationActions({
  reviewId,
}: ReviewModerationActionsProps) {
  const [loading, setLoading] = useState<"approved" | "rejected" | null>(
    null
  );
  const [error, setError] = useState("");

  async function updateReview(status: "approved" | "rejected") {
    setLoading(status);
    setError("");

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update review.");
      }

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => updateReview("approved")}
        disabled={loading !== null}
        className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "approved" ? "Approving..." : "Approve"}
      </button>

      <button
        type="button"
        onClick={() => updateReview("rejected")}
        disabled={loading !== null}
        className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "rejected" ? "Rejecting..." : "Reject"}
      </button>

      {error && (
        <p className="w-full text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
