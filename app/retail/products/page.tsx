import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Shirt,
} from "lucide-react";

import ProductCard from "@/components/products/ProductCard";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

type RetailProduct = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  image: string | null;
  keywords: string[] | null;
  is_active: boolean;
  price: number | null;
  offer_name: string | null;
  offer_price: number | null;
  retail_enabled: boolean;
  retail_price: number | null;
  retail_offer_price: number | null;
  retail_shipping_charge: number | string | null;
  retail_free_shipping: boolean;
  retail_stock: number | string | null;
  sku: string | null;
  is_featured: boolean;
};

export const metadata: Metadata = {
  title: "Shop Ready-Made Clothing Online in Madurai",
  description:
    "Shop ready-made shirts, T-shirts, trousers and other clothing from Limra Clothing in Madurai. Explore our retail collection and shop available products.",
  keywords: [
    "shop clothes online Madurai",
    "retail clothing Madurai",
    "ready made clothes Madurai",
    "mens clothing Madurai",
    "shirts Madurai",
    "T-shirts Madurai",
    "pants Madurai",
    "trousers Madurai",
    "gents dress collection Madurai",
    "Limra Clothing retail",
  ],
  alternates: {
    canonical: `${siteConfig.url}/retail/products`,
  },
  openGraph: {
    title: `Shop Ready-Made Clothing | ${siteConfig.name}`,
    description:
      "Explore and shop Limra Clothing's retail collection of ready-made garments in Madurai.",
    url: `${siteConfig.url}/retail/products`,
    type: "website",
  },
};

export default async function RetailProductsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
        id,
        slug,
        name,
        category_id,
        short_description,
        description,
        image,
        keywords,
        is_active,
        price,
        offer_name,
        offer_price,
        retail_enabled,
        retail_price,
        retail_offer_price,
        retail_shipping_charge,
        retail_free_shipping,
        retail_stock,
        sku,
        is_featured
      `
    )
    .eq("is_active", true)
    .eq("retail_enabled", true)
    
    .order("is_featured", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch retail products:",
      error
    );
  }

  const products: RetailProduct[] = data ?? [];

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

            <Link
              href="/retail"
              className="transition-colors hover:text-[#C89B3C]"
            >
              Retail
            </Link>

            <span className="mx-2">/</span>

            <span className="text-white/80">
              Products
            </span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              <ShoppingBag className="h-4 w-4" />
              Retail Collection
            </div>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Shop Ready-Made
              <span className="block text-[#C89B3C]">
                Clothing
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Explore Limra Clothing&apos;s retail collection
              of shirts, T-shirts, trousers and other
              ready-made garments available in Madurai.
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                <Shirt className="h-4 w-4" />
                Our Retail Collection
              </div>

              <h2 className="mt-2 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
                Shop Our Products
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
    key={product.id}
    hrefPrefix="/retail/products"
    priceType="retail"
    product={{
      id: product.id,
      slug: product.slug,
      name: product.name,
      category_id: product.category_id ?? "",
      short_description: product.short_description,
      description: product.description ?? "",
      image: product.image,
      keywords: product.keywords ?? [],
      is_active: product.is_active,
      price: product.retail_price,
      offer_name: product.offer_name,
      offer_price: product.retail_offer_price,
      retail_shipping_charge: product.retail_shipping_charge,
      retail_free_shipping: product.retail_free_shipping,
    }}
  />
))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-12 text-center shadow-sm">
              <ShoppingBag className="mx-auto h-10 w-10 text-[#C89B3C]" />

              <h3 className="mt-4 font-serif text-2xl font-semibold text-[#081A4A]">
                Retail products coming soon
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#222]/60">
                We are preparing our retail collection.
                Please check back soon for available
                products.
              </p>

              <Link
                href="/retail"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#10285f]"
              >
                Back to Retail
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
