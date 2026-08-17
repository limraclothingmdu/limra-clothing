import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Shirt,
} from "lucide-react";

import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/products";
import { siteConfig } from "@/lib/site";


export const metadata: Metadata = {
  title: "Wholesale Clothing Products in Madurai",
  description:
    "Explore ready-made shirts, T-shirts, trousers and other clothing products from Limra Clothing for wholesale buyers and retailers in Madurai and across Tamil Nadu.",
  keywords: [
    "wholesale clothing products Madurai",
    "ready made garments Madurai",
    "mens clothing wholesale",
    "wholesale garments Tamil Nadu",
    "clothing distributor Tamil Nadu",
  ],
  alternates: {
    canonical: `${siteConfig.url}/products`,
  },
  openGraph: {
    title: "Wholesale Clothing Products | Limra Clothing",
    description:
      "Explore ready-made clothing products for wholesale buyers and retailers in Madurai and across Tamil Nadu.",
    url: `${siteConfig.url}/products`,
    type: "website",
  },
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="bg-[#F8F8F8]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#081A4A]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C89B3C]/10 blur-3xl" />

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

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              <Shirt className="h-4 w-4" />
              Wholesale Collection
            </div>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Ready-Made Clothing
              <span className="block text-[#C89B3C]">
                for Wholesale Buyers
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Explore our collection of ready-made shirts,
              T-shirts, trousers and other clothing products
              for wholesale buyers, retailers and businesses
              across Tamil Nadu.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                Our Collection
              </p>

              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
                Explore Our Products
              </h2>
            </div>

            <p className="text-sm text-[#222]/50">
              {products.length}{" "}
              {products.length === 1
                ? "product"
                : "products"}{" "}
              available
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-12 text-center">
              <p className="text-[#081A4A]">
                Products will be added soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Wholesale CTA */}
      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#081A4A] px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C89B3C]/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                  Wholesale Enquiries
                </p>

                <h2 className="mt-3 font-serif text-3xl font-semibold text-white sm:text-4xl">
                  Looking for wholesale pricing?
                </h2>

                <p className="mt-4 text-sm leading-7 text-white/60">
                  Contact Limra Clothing to discuss product
                  availability, wholesale requirements and
                  enquiries.
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