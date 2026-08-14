import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { getCategories } from "@/lib/categories";

export default async function RetailCategories() {
  const categories = await getCategories();

  const activeCategories = categories.filter(
    (category) => category.is_active
  );

  return (
    <section className="bg-[#F8F8F8] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Our Clothing
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#081A4A]">
            Explore Our Categories
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#222]/60">
            Browse the clothing categories available from Limra Clothing.
          </p>
        </div>

        {activeCategories.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activeCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group rounded-2xl border border-[#081A4A]/10 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
                  Collection
                </p>

                <h3 className="mt-3 font-serif text-2xl font-semibold text-[#081A4A]">
                  {category.name}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#222]/55">
                  {category.short_description ||
                    `Explore our ${category.name.toLowerCase()} collection.`}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#081A4A]">
                  View Collection
                  <ArrowUpRight className="h-4 w-4 text-[#C89B3C] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-[#081A4A]/10 bg-white p-10 text-center">
            <p className="text-sm text-[#222]/55">
              Categories will be available here soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}