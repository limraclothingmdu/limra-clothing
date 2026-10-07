import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

type Order = {
  id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  currency: string;
  created_at: string;
};

function formatPrice(value: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "Order Pending";
    case "confirmed":
      return "Confirmed";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

function getStatusClasses(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return "bg-green-50 text-green-700";

    case "shipped":
      return "bg-blue-50 text-blue-700";

    case "processing":
      return "bg-purple-50 text-purple-700";

    case "confirmed":
      return "bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

function getPaymentLabel(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return "Payment Paid";
    case "failed":
      return "Payment Failed";
    case "refunded":
      return "Refunded";
    case "partially_refunded":
      return "Partially Refunded";
    default:
      return "Payment Pending";
  }
}

function getPaymentClasses(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return "text-green-700";

    case "failed":
      return "text-red-600";

    case "refunded":
    case "partially_refunded":
      return "text-purple-700";

    default:
      return "text-amber-700";
  }
}

export default async function AccountOrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        status,
        payment_status,
        total_amount,
        currency,
        created_at
      `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load customer orders:", error);
  }

  const customerOrders = (orders ?? []) as Order[];

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/account"
            className="text-sm font-semibold text-[#C89B3C] hover:underline"
          >
            ← Back to My Account
          </Link>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Limra Clothing
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#081A4A]">
            My Orders
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#222]/60">
            View your orders, payment status and delivery progress.
          </p>
        </div>

        {customerOrders.length === 0 ? (
          <section className="rounded-2xl border border-[#081A4A]/10 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-[#081A4A]">
              No orders yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#222]/55">
              Your retail orders will appear here after you complete a
              purchase.
            </p>

            <Link
              href="/retail/products"
              className="mt-7 inline-flex rounded-full bg-[#081A4A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0d286b]"
            >
              Shop Retail Products
            </Link>
          </section>
        ) : (
          <div className="space-y-5">
            {customerOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm transition hover:border-[#C89B3C]/50 hover:shadow-md sm:p-7"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#222]/40">
                      Order
                    </p>

                    <p className="mt-1 break-all font-mono text-sm font-semibold text-[#081A4A]">
                      #{order.id}
                    </p>

                    <p className="mt-2 text-sm text-[#222]/50">
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#222]/40">
                      Total
                    </p>

                    <p className="mt-1 text-xl font-bold text-[#081A4A]">
                      {formatPrice(order.total_amount, order.currency)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>

                  <span
                    className={`text-xs font-semibold ${getPaymentClasses(
                      order.payment_status
                    )}`}
                  >
                    {getPaymentLabel(order.payment_status)}
                  </span>
                </div>

                {order.status !== "cancelled" && (
                  <div className="mt-6 grid grid-cols-5 gap-1">
                    {[
                      "pending",
                      "confirmed",
                      "processing",
                      "shipped",
                      "delivered",
                    ].map((step) => {
                      const statusOrder = [
                        "pending",
                        "confirmed",
                        "processing",
                        "shipped",
                        "delivered",
                      ];

                      const currentIndex = statusOrder.indexOf(order.status);
                      const stepIndex = statusOrder.indexOf(step);

                      const active = stepIndex <= currentIndex;

                      return (
                        <div
                          key={step}
                          className={`h-1.5 rounded-full ${
                            active ? "bg-[#C89B3C]" : "bg-[#081A4A]/10"
                          }`}
                        />
                      );
                    })}
                  </div>
                )}

                <div className="mt-5 flex items-center justify-end">
                  <span className="text-sm font-semibold text-[#081A4A]">
                    View Order →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}