import type { Metadata } from "next";

import RetailCart from "@/components/retail/RetailCart";

export const metadata: Metadata = {
  title: "Shopping Cart | Limra Clothing",
  description:
    "Review your selected retail clothing products before checkout.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function RetailCartPage() {
  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      {/* Header */}
      <section className="border-b border-white/10 bg-[#081A4A] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Limra Clothing
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Your Cart
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
            Review your selected products, sizes and
            quantities before continuing to checkout.
          </p>
        </div>
      </section>

      {/* Cart */}
      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-7xl">
          <RetailCart />
        </div>
      </section>
    </main>
  );
}