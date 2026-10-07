import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import AdminOrdersRealtime from "@/components/admin/AdminOrdersRealtime";

export const dynamic = "force-dynamic";

type Order = {
  id: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
  total_amount: number | string;
  payment_status: string;
  status: string;
  created_at: string;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function statusClasses(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700";

    case "processing":
      return "bg-purple-50 text-purple-700";

    case "shipped":
      return "bg-blue-50 text-blue-700";

    case "delivered":
      return "bg-green-50 text-green-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

function paymentClasses(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-50 text-green-700";

    case "failed":
      return "bg-red-50 text-red-700";

    case "refunded":
      return "bg-purple-50 text-purple-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function AdminOrdersPage() {
  await requireAdmin();

  const supabase = await createClient();

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        customer_name,
        customer_phone,
        customer_email,
        total_amount,
        payment_status,
        status,
        created_at
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin orders error:", error);
  }

  const orderList: Order[] = orders ?? [];

  const pendingCount = orderList.filter(
    (order) => order.status === "pending"
  ).length;

  const paidCount = orderList.filter(
    (order) => order.payment_status === "paid"
  ).length;

  return (
    <>
      <AdminOrdersRealtime />

      <main className="min-h-screen bg-[#F7F5F0]">
        <section className="border-b border-[#081A4A]/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C89B3C]">
                  Admin
                </p>

                <h1 className="mt-2 font-serif text-3xl font-bold text-[#081A4A]">
                  Orders
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Manage customer orders, payments and delivery status.
                </p>
              </div>

              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 self-start rounded-full border border-[#081A4A]/15 bg-white px-5 py-3 text-sm font-semibold text-[#081A4A] transition hover:border-[#C89B3C]"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-5">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="mt-2 text-3xl font-bold text-[#081A4A]">
                {orderList.length}
              </p>
            </div>

            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-5">
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">
                {pendingCount}
              </p>
            </div>

            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-5">
              <p className="text-sm text-gray-500">Paid Orders</p>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {paidCount}
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm">
            <div className="border-b border-[#081A4A]/10 px-5 py-5">
              <h2 className="font-bold text-[#081A4A]">
                Customer Orders
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                New orders appear automatically when realtime updates are connected.
              </p>
            </div>

            {orderList.length === 0 ? (
              <div className="px-5 py-16 text-center">
                <ShoppingCart className="mx-auto h-10 w-10 text-gray-300" />

                <p className="mt-4 font-semibold text-gray-600">
                  No orders yet
                </p>

                <p className="mt-1 text-sm text-gray-400">
                  Customer orders will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#081A4A]/5">
                {orderList.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="block px-5 py-5 transition hover:bg-[#F7F5F0]"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-[#081A4A]">
                            {order.customer_name || "Customer"}
                          </p>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses(
                              order.status
                            )}`}
                          >
                            {label(order.status)}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${paymentClasses(
                              order.payment_status
                            )}`}
                          >
                            Payment: {label(order.payment_status)}
                          </span>
                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                          Order ID: {order.id}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {order.customer_phone || "No phone"}{" "}
                          {order.customer_email
                            ? `• ${order.customer_email}`
                            : ""}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-6 lg:justify-end">
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#081A4A]">
                            {formatPrice(Number(order.total_amount || 0))}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            View order
                          </p>
                        </div>

                        <ArrowRight className="h-5 w-5 text-gray-300" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}