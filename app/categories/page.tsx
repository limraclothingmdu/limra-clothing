import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Layers3 } from "lucide-react";

import { getCategories } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clothing Categories",
  description:
    "Browse Limra Clothing's ready-made clothing categories for wholesale buyers and retailers in Madurai, with clothing distribution across Tamil Nadu.",
  keywords: [
    "wholesale clothing categories Madurai",
    "ready made garments categories",
    "mens clothing wholesale Madurai",
  ],
  alternates: {
    canonical: `${siteConfig.url}/categories`,
  },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  // Only show active categories publicly.
  const activeCategories = categories.filter(
    (category) => category.is_active
  );

  return (
    <main className="bg-[#F8F8F8]">
      <section className="bg-[#081A4A]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
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

            <span className="text-white/80">Categories</span>
          </nav>

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              <Layers3 className="h-4 w-4" />
              Clothing Categories
            </div>

            <h1 className="mt-5 font-serif text-4xl font-semibold text-white sm:text-5xl">
              Explore Our
              <span className="block text-[#C89B3C]">
                Clothing Categories
              </span>
            </h1>

            <p className="mt-6 text-base leading-8 text-white/65">
              Browse our clothing categories and discover products available
              for wholesale buyers and retailers.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {activeCategories.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {activeCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#EDEDED]">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={`${category.name} wholesale clothing from Limra Clothing`}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#EDEDED]">
                        <Layers3 className="h-12 w-12 text-[#081A4A]/20" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#081A4A]/80 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="font-serif text-2xl font-semibold text-white">
                        {category.name}
                      </h2>
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="text-sm leading-6 text-[#222]/60">
                      {category.short_description ||
                        `Explore our ${category.name.toLowerCase()} collection.`}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#081A4A]">
                      View Category
                      <ArrowRight className="h-4 w-4 text-[#C89B3C] transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-10 text-center">
              <Layers3 className="mx-auto h-12 w-12 text-[#081A4A]/20" />

              <h2 className="mt-5 font-serif text-2xl font-semibold text-[#081A4A]">
                Categories Coming Soon
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#222]/55">
                Our clothing categories will be available here soon.
                Please contact us for current wholesale collections.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
