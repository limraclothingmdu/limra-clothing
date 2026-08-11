import Link from "next/link";
import { ArrowRight, MessageCircle, Truck } from "lucide-react";

import { siteConfig } from "@/lib/site";

export default function WholesaleHero() {
  return (
    <section className="bg-[#081A4A]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-10 text-sm text-white/50"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[#C89B3C]"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <span className="text-white/80">Wholesale</span>
        </nav>

        <div className="grid items-end gap-12 lg:grid-cols-[1fr_0.55fr]">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Wholesale Clothing · Madurai
            </p>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Wholesale Clothing
              <span className="block text-[#C89B3C]">
                in Madurai
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Limra Clothing supplies shirts, pants, T-shirts and other
              ready-made garments for wholesale requirements. Based in
              Madurai, we provide clothing distribution across Tamil Nadu.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${
                  siteConfig.contact.whatsapp
                }?text=${encodeURIComponent(
                  "Hello, I would like to make a wholesale clothing enquiry."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A]"
              >
                <MessageCircle className="h-4 w-4" />
                Make Wholesale Enquiry
              </a>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#C89B3C] hover:text-[#C89B3C]"
              >
                View Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
            <Truck className="h-8 w-8 text-[#C89B3C]" />

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-[#C89B3C]">
              Tamil Nadu Distribution
            </p>

            <h2 className="mt-3 font-serif text-2xl font-semibold text-white">
              Serving Businesses Across Tamil Nadu
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/50">
              Contact Limra Clothing to discuss your wholesale clothing
              requirements, product availability and distribution needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}