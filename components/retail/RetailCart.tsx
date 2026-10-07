"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getCart,
  getCartSubtotal,
  removeFromCart,
  updateCartItemQuantity,
  type RetailCartItem,
} from "@/lib/retail/cart";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RetailCart() {
  const [items, setItems] = useState<RetailCartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(getCart());
    setLoaded(true);

    function handleCartUpdated() {
      setItems(getCart());
    }

    window.addEventListener(
      "limra-cart-updated",
      handleCartUpdated
    );

    return () => {
      window.removeEventListener(
        "limra-cart-updated",
        handleCartUpdated
      );
    };
  }, []);

  function handleQuantityChange(
    item: RetailCartItem,
    quantity: number
  ) {
    const updated = updateCartItemQuantity(
      item.productId,
      item.sizeId,
      quantity
    );

    setItems(updated);
  }

  function handleRemove(item: RetailCartItem) {
    const updated = removeFromCart(
      item.productId,
      item.sizeId
    );

    setItems(updated);
  }

  const subtotal = items.reduce(
    (total, item) =>
      total + item.unitPrice * item.quantity,
    0
  );

  if (!loaded) {
    return (
      <div className="py-20 text-center text-sm text-[#222]/50">
        Loading cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-[#081A4A]/10 bg-white px-6 py-16 text-center shadow-sm">
        <ShoppingBag className="mx-auto h-12 w-12 text-[#081A4A]/30" />

        <h2 className="mt-5 text-2xl font-bold text-[#081A4A]">
          Your cart is empty
        </h2>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#222]/55">
          Browse our retail collection and add products
          to your cart.
        </p>

        <Link
          href="/retail/products"
          className="mt-7 inline-flex rounded-full bg-[#081A4A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0d286b]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.sizeId}`}
            className="rounded-2xl border border-[#081A4A]/10 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F7F5F0]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.productName}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#222]/35">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/retail/products/${item.productSlug}`}
                      className="font-bold text-[#081A4A] hover:text-[#C89B3C]"
                    >
                      {item.productName}
                    </Link>

                    <p className="mt-1 text-sm text-[#222]/55">
                      Size:{" "}
                      <span className="font-semibold text-[#222]/75">
                        {item.sizeName}
                      </span>
                    </p>

                    {item.sku && (
                      <p className="mt-1 text-xs text-[#222]/40">
                        SKU: {item.sku}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="rounded-lg p-2 text-[#222]/35 transition hover:bg-red-50 hover:text-red-500"
                    aria-label={`Remove ${item.productName}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  {/* Quantity */}
                  <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#081A4A]/15">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          item,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="flex h-9 w-9 items-center justify-center text-[#081A4A] hover:bg-[#F7F5F0] disabled:opacity-30"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <span className="flex h-9 min-w-10 items-center justify-center border-x border-[#081A4A]/10 px-2 text-sm font-bold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          item,
                          item.quantity + 1
                        )
                      }
                      disabled={
                        item.quantity >= item.maxStock
                      }
                      className="flex h-9 w-9 items-center justify-center text-[#081A4A] hover:bg-[#F7F5F0] disabled:opacity-30"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#081A4A]">
                      {formatPrice(
                        item.unitPrice * item.quantity
                      )}
                    </p>

                    <p className="text-xs text-[#222]/45">
                      {formatPrice(item.unitPrice)} each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="text-xl font-bold text-[#081A4A]">
          Order Summary
        </h2>

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-[#222]/60">
            Items
          </span>

          <span className="font-semibold text-[#222]">
            {items.reduce(
              (total, item) => total + item.quantity,
              0
            )}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-[#222]/60">
            Subtotal
          </span>

          <span className="font-semibold text-[#222]">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="my-6 border-t border-[#081A4A]/10" />

        <div className="flex items-center justify-between">
          <span className="font-bold text-[#081A4A]">
            Total
          </span>

          <span className="text-2xl font-bold text-[#081A4A]">
            {formatPrice(subtotal)}
          </span>
        </div>

        <Link
          href="/checkout"
          className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#081A4A] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#0d286b]"
        >
          Proceed to Checkout
        </Link>

        <Link
          href="/retail/products"
          className="mt-3 flex w-full items-center justify-center rounded-xl border border-[#081A4A]/15 px-6 py-3 text-sm font-semibold text-[#081A4A] transition hover:border-[#C89B3C] hover:text-[#C89B3C]"
        >
          Continue Shopping
        </Link>
      </aside>
    </div>
  );
}