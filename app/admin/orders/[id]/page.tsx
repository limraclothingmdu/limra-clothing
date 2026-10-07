import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import AdminOrderStatus from "@/components/admin/AdminOrderStatus";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
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

function label(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;

  const supabase = await createClient();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (orderError || !order) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-100 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-[#081A4A]">
            Order Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            This order does not exist or is no longer available.
          </p>

          <Link
            href="/admin/orders"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  if (itemsError) {
    console.error("Admin order items error:", itemsError);
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      <section className="border-b border-[#081A4A]/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#081A4A] hover:text-[#C89B3C]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C89B3C]">
                Order Management
              </p>

              <h1 className="mt-2 font-serif text-3xl font-bold text-[#081A4A]">
                Customer Order
              </h1>

              <p className="mt-2 break-all text-xs text-gray-400">
                {order.id}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusClasses(
                  order.status
                )}`}
              >
                {label(order.status)}
              </span>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  order.payment_status === "paid"
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                Payment: {label(order.payment_status)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />

              <h2 className="font-bold text-[#081A4A]">
                Customer Information
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="mt-1 font-semibold text-[#081A4A]">
                  {order.customer_name || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="mt-1 font-semibold text-[#081A4A]">
                  {order.customer_phone || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="mt-1 break-all font-semibold text-[#081A4A]">
                  {order.customer_email || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">Order Date</p>
                <p className="mt-1 font-semibold text-[#081A4A]">
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#081A4A]/10 bg-[#081A4A] p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-wider text-white/50">
              Order Total
            </p>

            <p className="mt-2 text-3xl font-bold">
              {formatPrice(Number(order.total_amount || 0))}
            </p>

            <p className="mt-3 text-xs text-white/50">
              Payment: {label(order.payment_status)}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6">
          <h2 className="font-bold text-[#081A4A]">
            Update Order Status
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Change the fulfillment status visible to the customer.
          </p>

          <div className="mt-5">
            <AdminOrderStatus
              orderId={order.id}
              currentStatus={order.status}
              paymentStatus={order.payment_status}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6">
          <h2 className="font-bold text-[#081A4A]">
            Items
          </h2>

          <div className="mt-5 divide-y divide-[#081A4A]/5">
            {(items ?? []).map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-[#081A4A]">
                    {item.product_name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    SKU: {item.product_sku || "—"}
                    {" • "}
                    Size: {item.size_name || "—"}
                    {" • "}
                    Qty: {item.quantity}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-bold text-[#081A4A]">
                    {formatPrice(Number(item.total_price || 0))}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {formatPrice(Number(item.unit_price || 0))} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-6">
            <h2 className="font-bold text-[#081A4A]">
              Delivery Address
            </h2>

            <div className="mt-4 text-sm leading-6 text-gray-600">
              <p>{order.customer_name}</p>
              <p>{order.customer_phone}</p>
              <p>{order.shipping_address_line1}</p>

              {order.shipping_address_line2 && (
                <p>{order.shipping_address_line2}</p>
              )}

              <p>
                {order.shipping_city}, {order.shipping_state}
              </p>

              <p>{order.shipping_postal_code}</p>
              <p>{order.shipping_country}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-6">
            <h2 className="font-bold text-[#081A4A]">
              Payment Summary
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(Number(order.subtotal || 0))}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-semibold">
                  {formatPrice(Number(order.shipping_amount || 0))}
                </span>
              </div>

              <div className="border-t border-[#081A4A]/10 pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-[#081A4A]">
                    Total
                  </span>

                  <span className="text-lg font-bold text-[#081A4A]">
                    {formatPrice(Number(order.total_amount || 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}