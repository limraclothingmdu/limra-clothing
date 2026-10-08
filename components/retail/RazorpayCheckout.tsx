"use client";

import Script from "next/script";
import { useState } from "react";

import {
  clearCart,
  type RetailCartItem,
} from "@/lib/retail/cart";

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayOptions
    ) => {
      open: () => void;
    };
  }
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

type RazorpayCheckoutProps = {
  items: RetailCartItem[];
  subtotal: number;
  shipping: number;
  customerName: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
};

export default function RazorpayCheckout({
  items,
  subtotal,
  shipping,
  customerName,
  customerPhone,
  addressLine1,
  addressLine2,
  city,
  state,
  postalCode,
}: RazorpayCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccessful, setIsSuccessful] = useState(false);

  async function verifyPayment(
    response: RazorpayResponse
  ) {
    try {
      const verificationResponse = await fetch(
        "/api/verify-payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(response),
        }
      );

      const result = await verificationResponse.json();

      if (
        !verificationResponse.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ||
            "Payment verification failed."
        );
      }

      /*
       * Only clear the cart after:
       * - signature verification
       * - order verification
       * - payment record creation
       * - order confirmation
       * - stock update
       */
      clearCart();

      setIsSuccessful(true);

      setMessage(
        "Payment verified successfully. Thank you for your order."
      );

      /*
       * Give the user a clear path to the order.
       */
      if (result.order_id) {
        window.setTimeout(() => {
          window.location.href = `/account/orders/${result.order_id}`;
        }, 1200);
      }
    } catch (error) {
      setIsLoading(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Payment verification failed."
      );
    }
  }

  async function handleCheckout() {
    setMessage(null);

    if (!customerName.trim()) {
      setMessage("Please enter your full name.");
      return;
    }

    if (!customerPhone.trim()) {
      setMessage("Please enter your phone number.");
      return;
    }

    if (!addressLine1.trim()) {
      setMessage("Please enter your delivery address.");
      return;
    }

    if (!city.trim()) {
      setMessage("Please enter your city.");
      return;
    }

    if (!state.trim()) {
      setMessage("Please enter your state.");
      return;
    }

    if (!postalCode.trim()) {
      setMessage("Please enter your postal code.");
      return;
    }

    setIsLoading(true);

    try {
      if (!window.Razorpay) {
        throw new Error(
          "Payment checkout is still loading. Please try again."
        );
      }

      const orderResponse = await fetch(
        "/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              sizeId: item.sizeId,
              sizeName: item.sizeName,
              quantity: item.quantity,
            })),

            customerName,
            customerPhone,
            addressLine1,
            addressLine2,
            city,
            state,
            postalCode,
          }),
        }
      );

      const order = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(
          order.error ||
            "Unable to create payment order."
        );
      }

      const razorpay = new window.Razorpay({
        key:
          order.key_id ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
          "",
        amount: order.amount,
        currency: order.currency,
        name: "Limra Clothing",
        description: `${items.length} retail cart item${
          items.length === 1 ? "" : "s"
        }`,
        order_id: order.order_id,

        handler: (response) => {
          void verifyPayment(response);
        },

        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setMessage("Payment was cancelled.");
          },
        },

        theme: {
          color: "#081A4A",
        },
      });

      razorpay.open();

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to start payment."
      );
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading || isSuccessful}
        className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#081A4A] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#0d286b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSuccessful
          ? "Payment Complete"
          : isLoading
            ? "Starting Secure Checkout..."
            : `Pay ${formatPrice(subtotal + shipping)}`}
      </button>

      {message && (
        <p
          role={isSuccessful ? "status" : "alert"}
          className={`mt-3 text-sm leading-6 ${
            isSuccessful
              ? "text-green-700"
              : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </>
  );
}