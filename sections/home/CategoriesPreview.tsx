import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";

import { getCategories } from "@/lib/categories";

export default async function CategoriesPreview() {
  const categories = await getCategories();

  const activeCategories = categories
    .filter((category) => category.is_active)
    .slice(0, 4);

  return (
    <section className="bg-[#F8F8F8] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Our Collections
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold text-[#081A4A] sm:text-5xl">
              Shop by Category
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#222]/60">
              Explore our ready-made clothing categories and discover
              products for your wholesale business.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#081A4A]"
          >
            View All Categories
            <ArrowUpRight className="h-4 w-4 text-[#C89B3C]" />
          </Link>
        </div>

        {activeCategories.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activeCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#081A4A]"
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={`${category.name} collection - Limra Clothing Madurai`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Layers3 className="h-12 w-12 text-white/20" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#081A4A] via-[#081A4A]/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C89B3C]">
                    Collection
                  </p>

                  <h3 className="mt-2 font-serif text-2xl font-semibold text-white">
                    {category.name}
                  </h3>

                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80">
                    Explore
                    <ArrowUpRight className="h-4 w-4 text-[#C89B3C] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-2xl border border-[#081A4A]/10 bg-white p-10 text-center">
            <Layers3 className="mx-auto h-10 w-10 text-[#081A4A]/20" />

            <h3 className="mt-4 font-serif text-2xl font-semibold text-[#081A4A]">
              Categories Coming Soon
            </h3>

            <p className="mt-2 text-sm text-[#222]/55">
              Our clothing categories will be available here soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}