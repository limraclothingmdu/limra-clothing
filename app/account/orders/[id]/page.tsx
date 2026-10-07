import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import EditDeliveryAddressForm from "@/components/account/EditDeliveryAddressForm";

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

function canEditAddress(status: OrderStatus) {
  return ["pending", "confirmed", "processing"].includes(status);
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

  const status = order.status as OrderStatus;

  const statusSteps: OrderStatus[] = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentIndex = statusSteps.indexOf(status);
  const addressEditable = canEditAddress(status);

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account/orders"
          className="text-sm font-semibold text-[#C89B3C] hover:underline"
        >
          ← Back to Orders
        </Link>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">Order #{order.id}</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#1F2937]">
              Order Details
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Placed on {formatDate(order.created_at)}
            </p>
          </div>

          <div className="rounded-full bg-[#C89B3C]/10 px-4 py-2 text-sm font-semibold text-[#9A7424]">
            {getStatusLabel(status)}
          </div>
        </div>

        {/* Order progress */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1F2937]">
            Order Status
          </h2>

          <div className="mt-6 overflow-x-auto">
            <div className="flex min-w-[600px] items-start">
              {statusSteps.map((step, index) => {
                const completed =
                  currentIndex >= 0 && index <= currentIndex;

                return (
                  <div
                    key={step}
                    className="relative flex flex-1 flex-col items-center"
                  >
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute left-1/2 top-4 h-0.5 w-full ${
                          currentIndex > index
                            ? "bg-[#C89B3C]"
                            : "bg-gray-200"
                        }`}
                      />
                    )}

                    <div
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        completed
                          ? "bg-[#C89B3C] text-white"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {index + 1}
                    </div>

                    <p
                      className={`mt-3 text-center text-xs font-medium ${
                        completed
                          ? "text-[#1F2937]"
                          : "text-gray-400"
                      }`}
                    >
                      {getStatusLabel(step)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {status === "cancelled" && (
            <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              This order has been cancelled.
            </div>
          )}
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Items */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1F2937]">
              Items
            </h2>

            <div className="mt-5 divide-y divide-gray-100">
              {order.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <h3 className="font-medium text-[#1F2937]">
                      {item.product_name}
                    </h3>

                    {item.product_sku && (
                      <p className="mt-1 text-xs text-gray-500">
                        SKU: {item.product_sku}
                      </p>
                    )}

                    {item.size_name && (
                      <p className="mt-1 text-sm text-gray-500">
                        Size: {item.size_name}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-[#1F2937]">
                      {formatPrice(
                        Number(item.total_price),
                        order.currency
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {formatPrice(
                        Number(item.unit_price),
                        order.currency
                      )}{" "}
                      each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order summary */}
          <section className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1F2937]">
              Order Summary
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">
                  {formatPrice(
                    Number(order.subtotal),
                    order.currency
                  )}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">
                  {formatPrice(
                    Number(order.shipping_amount),
                    order.currency
                  )}
                </span>
              </div>

              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-green-600">
                    -{" "}
                    {formatPrice(
                      Number(order.discount_amount),
                      order.currency
                    )}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between gap-4 text-base font-bold">
                  <span>Total</span>
                  <span className="text-[#C89B3C]">
                    {formatPrice(
                      Number(order.total_amount),
                      order.currency
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Payment
                </span>

                <span
                  className={`text-sm font-semibold ${
                    order.payment_status === "paid"
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}
                >
                  {order.payment_status === "paid"
                    ? "Paid"
                    : order.payment_status}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Delivery Address */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1F2937]">
                Delivery Address
              </h2>

              {addressEditable ? (
                <p className="mt-1 text-sm text-gray-500">
                  You can update your delivery address until the
                  order is shipped.
                </p>
              ) : (
                <p className="mt-1 text-sm text-gray-500">
                  This delivery address is locked because the order
                  has been shipped or completed.
                </p>
              )}
            </div>

            {!addressEditable && (
              <span className="inline-flex w-fit items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                Address Locked
              </span>
            )}
          </div>

          <div className="mt-6">
            <EditDeliveryAddressForm
              orderId={order.id}
              editable={addressEditable}
              initialValues={{
                customerName: order.customer_name ?? "",
                customerPhone: order.customer_phone ?? "",
                addressLine1: order.shipping_address_line1 ?? "",
                addressLine2: order.shipping_address_line2 ?? "",
                city: order.shipping_city ?? "",
                state: order.shipping_state ?? "",
                postalCode: order.shipping_postal_code ?? "",
              }}
            />
          </div>
        </section>

        {/* Customer information */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1F2937]">
            Customer Information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Name
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {order.customer_name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Phone
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {order.customer_phone}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </p>
              <p className="mt-1 text-sm text-gray-700">
                {order.customer_email}
              </p>
            </div>
          </div>
        </section>

        {order.notes && (
          <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1F2937]">
              Order Notes
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">
              {order.notes}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}