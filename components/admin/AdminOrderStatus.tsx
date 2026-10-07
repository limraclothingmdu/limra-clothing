"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  orderId: string;
  currentStatus: string;
  paymentStatus: string;
};

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AdminOrderStatus({
  orderId,
  currentStatus,
  paymentStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function updateStatus(nextStatus: string) {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data?.error || "Unable to update order.");
        return;
      }

      setStatus(nextStatus);
      setMessage("Order status updated successfully.");
      router.refresh();
    } catch {
      setMessage("Unable to update order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <select
        value={status}
        disabled={loading}
        onChange={(event) => updateStatus(event.target.value)}
        className="w-full rounded-xl border border-[#081A4A]/15 bg-white px-4 py-3 text-sm font-semibold text-[#081A4A] outline-none focus:border-[#C89B3C] sm:max-w-xs"
      >
        {statuses.map((item) => (
          <option
            key={item}
            value={item}
            disabled={
              ["confirmed", "processing", "shipped", "delivered"].includes(
                item
              ) && paymentStatus !== "paid"
            }
          >
            {label(item)}
          </option>
        ))}
      </select>

      {loading && (
        <p className="text-xs font-semibold text-gray-500">
          Updating...
        </p>
      )}

      {!loading && message && (
        <p className="text-xs font-semibold text-green-600">
          {message}
        </p>
      )}
    </div>
  );
}