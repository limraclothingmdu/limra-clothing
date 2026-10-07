import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

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
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "Order Pending";
    case "confirmed":
      return "Order Confirmed";
    case "processing":
      return "Processing";
    case "shipped":
      return "Shipped";
    case "delivered":
      return "Delivered";
    case "cancelled":
      return "Cancelled";
  }
}

export default async function AccountOrderDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
        id,
        status,
        payment_status,
        subtotal,
        shipping_amount,
        discount_amount,
        total_amount,
        currency,
        customer_name,
        customer_phone,
        customer_email,
        shipping_address_line1,
        shipping_address_line2,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,
        notes,
        created_at,
        order_items (
          id,
          product_name,
          product_sku,
          size_name,
          quantity,
          unit_price,
          total_price
        )
      `
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load customer order:", error);
  }

  if (!order) {
    notFound();
  }

  const statusSteps: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentIndex = statusSteps.indexOf(order.status as OrderStatus);

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account/orders"
          className="text-sm font-semibold text-[#C89B3C] hover:underline"
        >
          ← Back to My Orders
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Limra Clothing
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#081A4A] sm:text-4xl">
              Order Details
            </h1>

            <p className="mt-2 break-all font-mono text-sm text-[#222]/50">
              #{order.id}
            </p>
          </div>

          <p className="text-sm text-[#222]/50">
            {formatDate(order.created_at)}
          </p>
        </div>

        {order.status === "cancelled" ? (
          <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-700">Order Cancelled</h2>
            <p className="mt-2 text-sm leading-6 text-red-700/80">
              This order has been cancelled. Please contact Limra Clothing if
              you need assistance.
            </p>
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#081A4A]">
              Order Status
            </h2>

            <div className="mt-8 space-y-6">
              {statusSteps.map((step, index) => {
                const active = index <= currentIndex;
                const current = step === order.status;

                return (
                  <div key={step} className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        active
                          ? "bg-[#C89B3C] text-[#081A4A]"
                          : "bg-[#081A4A]/10 text-[#081A4A]/40"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <div>
                      <p
                        className={`font-semibold ${
                          active
                            ? "text-[#081A4A]"
                            : "text-[#222]/40"
                        }`}
                      >
                        {getStatusLabel(step)}
                      </p>

                      {current && (
                        <p className="mt-1 text-sm text-[#C89B3C]">
                          Current status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#081A4A]">
              Items
            </h2>

            <div className="mt-6 divide-y divide-[#081A4A]/10">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 py-5 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold text-[#081A4A]">
                      {item.product_name}
                    </p>

                    {item.product_sku && (
                      <p className="mt-1 text-xs text-[#222]/40">
                        SKU: {item.product_sku}
                      </p>
                    )}

                    {item.size_name && (
                      <p className="mt-1 text-sm text-[#222]/55">
                        Size: {item.size_name}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-[#222]/55">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 font-bold text-[#081A4A]">
                    {formatPrice(item.total_price, order.currency)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#081A4A]">
              Payment Summary
            </h2>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#222]/55">Subtotal</span>
                <span>
                  {formatPrice(order.subtotal, order.currency)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#222]/55">Shipping</span>
                <span>
                  {formatPrice(order.shipping_amount, order.currency)}
                </span>
              </div>

              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Discount</span>
                  <span>
                    -{formatPrice(order.discount_amount, order.currency)}
                  </span>
                </div>
              )}

              <div className="border-t border-[#081A4A]/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#081A4A]">
                    Total
                  </span>

                  <span className="text-xl font-bold text-[#081A4A]">
                    {formatPrice(order.total_amount, order.currency)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#F7F5F0] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#222]/40">
                Payment
              </p>

              <p className="mt-1 font-semibold capitalize text-[#081A4A]">
                {order.payment_status.replace("_", " ")}
              </p>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-[#081A4A]">
            Delivery Address
          </h2>

          <div className="mt-5 text-sm leading-7 text-[#222]/70">
            <p className="font-semibold text-[#081A4A]">
              {order.customer_name}
            </p>

            <p>{order.customer_phone}</p>

            {order.customer_email && <p>{order.customer_email}</p>}

            <div className="mt-3">
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
        </section>
      </div>
    </main>
  );
}