import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { getProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";

export default async function Products() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const featuredProducts = products.slice(0, 3);

  const categoryMap = new Map(
    categories.map((category) => [
      category.id,
      category.name,
    ])
  );

  return (
    <section
      aria-labelledby="products-heading"
      className="bg-[#F7F5F0] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Featured Products
            </p>

            <h2
              id="products-heading"
              className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#081A4A] sm:text-5xl"
            >
              Explore Our Products
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#222]/60 sm:text-base">
              Browse ready-made clothing products available from Limra
              Clothing for retail and wholesale requirements.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
          >
            View All Products
            <ArrowUpRight className="h-4 w-4 text-[#C89B3C]" />
          </Link>
        </div>

        {/* Products */}
        {featuredProducts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => {
              const categoryName =
                categoryMap.get(product.category_id) ??
                "Clothing";

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#EDEDED]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={`${product.name} from Limra Clothing`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-[#081A4A]/30">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
                      {categoryName}
                    </p>

                    <h3 className="mt-2 font-serif text-2xl font-semibold text-[#081A4A]">
                      {product.name}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#222]/55">
                      {product.short_description ||
                        `Explore our ${product.name.toLowerCase()} collection.`}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#081A4A]">
                      View Product
                      <ArrowRight className="h-4 w-4 text-[#C89B3C] transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-[#081A4A]/10 bg-white p-10 text-center">
            <h3 className="font-serif text-2xl font-semibold text-[#081A4A]">
              Products Coming Soon
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#222]/55">
              Our clothing products will be added to the collection soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}