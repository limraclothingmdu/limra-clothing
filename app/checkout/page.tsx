"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import RazorpayCheckout from "@/components/retail/RazorpayCheckout";
import {
  getCart,
  type RetailCartItem,
} from "@/lib/retail/cart";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<RetailCartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    email?: string | null;
  } | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("Madurai");
  const [state, setState] = useState("Tamil Nadu");
  const [postalCode, setPostalCode] = useState("");

  /*
   * ------------------------------------------------------------
   * Authentication
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login?next=/checkout");
        return;
      }

      setUser({
        id: user.id,
        email: user.email,
      });

      setAuthLoading(false);
    };

    checkAuth();
  }, [router]);

  /*
   * ------------------------------------------------------------
   * Load cart
   * ------------------------------------------------------------
   */

useEffect(() => {
  if (authLoading || !user) {
    return;
  }

  const loadCart = () => {
    const cart = getCart();

    setItems(cart);
    setLoaded(true);
  };

  const frame = requestAnimationFrame(loadCart);

  return () => cancelAnimationFrame(frame);
}, [authLoading, user]);

  /*
   * ------------------------------------------------------------
   * Calculations
   * ------------------------------------------------------------
   */

  const subtotal = items.reduce(
    (total, item) =>
      total + item.unitPrice * item.quantity,
    0
  );

  const shipping = items.reduce((highest, item) =>
    Math.max(highest, Number(item.shippingCharge ?? 0)), 0);
  const total = subtotal + shipping;

  /*
   * ------------------------------------------------------------
   * Authentication loading
   * ------------------------------------------------------------
   */

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-4">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#081A4A]/20 border-t-[#C89B3C]" />

          <p className="mt-4 text-sm font-medium text-[#081A4A]/70">
            Checking your account...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ------------------------------------------------------------
   * Empty cart
   * ------------------------------------------------------------
   */

  if (loaded && items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-20">
        <div className="mx-auto max-w-xl rounded-3xl border border-[#081A4A]/10 bg-white px-6 py-16 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-[#081A4A]">
            Your cart is empty
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#222]/55">
            Add a retail product before continuing to payment.
          </p>

          <Link
            href="/retail/products"
            className="mt-7 inline-flex rounded-full bg-[#081A4A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0d286b]"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  /*
   * ------------------------------------------------------------
   * Checkout
   * ------------------------------------------------------------
   */

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-20 text-center text-sm text-[#222]/50">
        Loading checkout...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
          Limra Clothing
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#081A4A] sm:text-5xl">
          Secure Checkout
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#222]/60">
          Complete your delivery details and pay securely with Razorpay.
        </p>

        {/* Logged-in customer indicator */}
        {user?.email && (
          <div className="mt-6 rounded-xl border border-[#081A4A]/10 bg-white px-4 py-3 text-sm text-[#222]/60">
            Signed in as{" "}
            <span className="font-semibold text-[#081A4A]">
              {user.email}
            </span>
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* Customer details */}
            <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-[#081A4A]">
                Delivery Details
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-[#081A4A]">
                    Full Name
                  </span>

                  <input
                    type="text"
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(event.target.value)
                    }
                    placeholder="Your full name"
                    className="mt-2 w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
                    required
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-[#081A4A]">
                    Phone
                  </span>

                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(event) =>
                      setCustomerPhone(event.target.value)
                    }
                    placeholder="10-digit mobile number"
                    className="mt-2 w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
                    required
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-[#081A4A]">
                    Postal Code
                  </span>

                  <input
                    type="text"
                    value={postalCode}
                    onChange={(event) =>
                      setPostalCode(event.target.value)
                    }
                    placeholder="Postal code"
                    inputMode="numeric"
                    className="mt-2 w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
                    required
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-[#081A4A]">
                    Address
                  </span>

                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(event) =>
                      setAddressLine1(event.target.value)
                    }
                    placeholder="House number, street, area"
                    className="mt-2 w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
                    required
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-[#081A4A]">
                    Address Line 2
                  </span>

                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(event) =>
                      setAddressLine2(event.target.value)
                    }
                    placeholder="Apartment, landmark, etc. (optional)"
                    className="mt-2 w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-[#081A4A]">
                    City
                  </span>

                  <input
                    type="text"
                    value={city}
                    onChange={(event) =>
                      setCity(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
                    required
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-[#081A4A]">
                    State
                  </span>

                  <input
                    type="text"
                    value={state}
                    onChange={(event) =>
                      setState(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
                    required
                  />
                </label>
              </div>
            </section>

            {/* Items */}
            <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-[#081A4A]">
                Order Items
              </h2>

              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.sizeId}`}
                    className="flex items-center justify-between gap-4 border-b border-[#081A4A]/10 pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-semibold text-[#081A4A]">
                        {item.productName}
                      </p>

                      <p className="mt-1 text-sm text-[#222]/55">
                        Size {item.sizeName} × {item.quantity}
                      </p>
                    </div>

                    <p className="shrink-0 font-bold text-[#081A4A]">
                      {formatPrice(
                        item.unitPrice * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Payment */}
          <aside className="h-fit rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-[#081A4A]">
              Payment Summary
            </h2>

            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-[#222]/60">
                Subtotal
              </span>

              <span className="font-semibold text-[#222]">
                {formatPrice(subtotal)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-[#222]/60">
                Shipping
              </span>

              <span className="font-semibold text-green-700">
              {shipping === 0 ? "Free" : formatPrice(shipping)}
              </span>
            </div>

            <div className="my-6 border-t border-[#081A4A]/10" />

            <div className="flex items-center justify-between">
              <span className="font-bold text-[#081A4A]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#081A4A]">
                {formatPrice(total)}
              </span>
            </div>

            <RazorpayCheckout
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              customerName={customerName}
              customerPhone={customerPhone}
              addressLine1={addressLine1}
              addressLine2={addressLine2}
              city={city}
              state={state}
              postalCode={postalCode}
            />

            <p className="mt-3 text-center text-xs leading-5 text-[#222]/45">
              Your payment is processed securely by Razorpay.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}