import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  MessageCircle,
  ShoppingBag,
  Shirt,
} from "lucide-react";

import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Wholesale & Retail Clothing in Madurai | Limra Clothing",
  description:
    "Choose wholesale clothing for bulk orders or shop our retail collection online from Limra Clothing in Madurai, serving customers across Tamil Nadu.",
  keywords: [
    "wholesale clothing Madurai",
    "retail clothing Madurai",
    "ready made garments Madurai",
    "shop clothes online Madurai",
    "wholesale garments Tamil Nadu",
    "mens clothing Madurai",
    "ladies wear Madurai",
    "clothing distributor Tamil Nadu",
  ],
  alternates: {
    canonical: `${siteConfig.url}/products`,
  },
  openGraph: {
    title: "Wholesale & Retail Clothing | Limra Clothing",
    description:
      "Shop wholesale and retail clothing from Limra Clothing in Madurai, serving customers and businesses across Tamil Nadu.",
    url: `${siteConfig.url}/products`,
    type: "website",
  },
};

export default function ProductsPage() {
  return (
    <main className="bg-[#F8F8F8]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#081A4A]">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#C89B3C]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#C89B3C]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-white/50"
          >
            <Link
              href="/"
              className="transition-colors hover:text-[#C89B3C]"
            >
              Home
            </Link>

            <span className="mx-2">/</span>

            <span className="text-white/80">
              Products
            </span>
          </nav>

          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              <Shirt className="h-4 w-4" />
              Limra Clothing
            </div>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Choose How You Want
              <span className="block text-[#C89B3C]">
                to Shop
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Whether you are buying in bulk for your business
              or shopping for yourself, choose the collection
              that suits your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Shopping Options */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Wholesale */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-[#081A4A]/10 bg-[#081A4A] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9 lg:p-10">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C89B3C]/10 blur-3xl transition-transform duration-500 group-hover:scale-110" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C89B3C]/15 text-[#C89B3C]">
                  <BriefcaseBusiness className="h-7 w-7" />
                </div>

                <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                  For Businesses
                </p>

                <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
                  Wholesale Clothing
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
                  Explore our wholesale collection of ready-made
                  clothing for retailers, resellers, businesses
                  and bulk buyers across Tamil Nadu.
                </p>

                <ul className="mt-7 space-y-3 text-sm text-white/75">
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C89B3C]" />
                    Bulk order enquiries
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C89B3C]" />
                    Wholesale pricing
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C89B3C]" />
                    Business and retailer enquiries
                  </li>
                </ul>

                <Link
                  href="/products"
                  className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A] transition-all hover:-translate-y-0.5 hover:bg-[#D8AD52]"
                >
                  Explore Wholesale Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Retail */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-[#081A4A]/10 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-9 lg:p-10">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C89B3C]/10 blur-3xl transition-transform duration-500 group-hover:scale-110" />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#081A4A]/5 text-[#081A4A]">
                  <ShoppingBag className="h-7 w-7" />
                </div>

                <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                  Shop Online
                </p>

                <h2 className="mt-3 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
                  Retail Clothing
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-[#222]/60 sm:text-base">
                  Shop individual clothing products online with
                  retail pricing, product details, size options
                  and convenient checkout.
                </p>

                <ul className="mt-7 space-y-3 text-sm text-[#222]/70">
                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C89B3C]" />
                    Individual shopping
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C89B3C]" />
                    Retail pricing
                  </li>

                  <li className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C89B3C]" />
                    Online cart and checkout
                  </li>
                </ul>

                <Link
                  href="/retail/products"
                  className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-[#081A4A] px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#102966]"
                >
                  Shop Retail Collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#081A4A] px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C89B3C]/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                  Need Help?
                </p>

                <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
                  Looking for a bulk order?
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  Contact Limra Clothing for wholesale
                  availability, pricing and business enquiries.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                    "Hello, I am interested in Limra Clothing wholesale products."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A] transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Us
                </a>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#C89B3C] hover:text-[#C89B3C]"
                >
                  Contact Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}