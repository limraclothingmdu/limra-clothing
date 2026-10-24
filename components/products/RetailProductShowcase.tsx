import Link from "next/link";
import { getRetailProducts } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";

type RetailProductShowcaseProps = {
  title?: string;
  description?: string;
  limit?: number;
};

export default async function RetailProductShowcase({
  title = "Explore Our Clothing Collection",
  description = "Discover available clothing from Limra Clothing. Browse our retail collection and find products that suit your needs.",
  limit = 4,
}: RetailProductShowcaseProps) {
  const products = (await getRetailProducts()).slice(0, limit);

  return (
    <section
      aria-labelledby="retail-product-showcase-heading"
      className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Limra Clothing Collection
            </p>
            <h2
              id="retail-product-showcase-heading"
              className="mt-2 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl"
            >
              {title}
            </h2>
            <p className="mt-3 leading-7 text-[#222]/65">
              {description}
            </p>
          </div>

          <Link
            href="/retail/products"
            className="font-bold text-[#081A4A] transition hover:text-[#C89B3C]"
          >
            View All Products →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                hrefPrefix="/retail/products"
                priceType="retail"
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#081A4A]/10 bg-[#F8F6F1] p-6">
            <p className="text-[#222]/70">
              Our retail collection is being updated. Visit the retail products page to explore the collection.
            </p>
            <Link
              href="/retail/products"
              className="mt-4 inline-flex font-bold text-[#081A4A] hover:text-[#C89B3C]"
            >
              Browse Retail Products →
            </Link>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/retail/products"
            className="rounded-full bg-[#081A4A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#10285f]"
          >
            Shop Retail
          </Link>
          <Link
            href="/wholesale"
            className="rounded-full border border-[#081A4A]/20 px-6 py-3 text-sm font-semibold text-[#081A4A] transition hover:border-[#C89B3C]"
          >
            Explore Wholesale
          </Link>
        </div>
      </div>
    </section>
  );
}
