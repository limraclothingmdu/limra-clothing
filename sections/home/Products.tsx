import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Truck,
} from "lucide-react";

import {
  getRetailProducts,
  type Product,
} from "@/lib/products";

function formatPrice(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getRetailPrice(product: Product) {
  const offerPrice = Number(product.retail_offer_price ?? 0);
  const retailPrice = Number(product.retail_price ?? 0);

  if (offerPrice > 0 && retailPrice > 0) {
    return {
      current: offerPrice,
      original: retailPrice,
    };
  }

  return {
    current: retailPrice,
    original: null,
  };
}

export default async function Products() {
  const products = await getRetailProducts();

  const featuredProducts = products.slice(0, 4);

  return (
    <section
      aria-labelledby="retail-products-heading"
      className="bg-[#F7F5F0] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Shop Retail
            </p>

            <h2
              id="retail-products-heading"
              className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#081A4A] sm:text-5xl"
            >
              Shop Our Latest Retail Collection
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#222]/60 sm:text-base">
              Discover ready-made shirts, T-shirts, pants, ladies wear and
              more from Limra Clothing. Shop online with secure checkout and
              delivery across Tamil Nadu.
            </p>
          </div>

          <Link
            href="/retail/products"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
          >
            View All Retail Products
            <ArrowUpRight className="h-4 w-4 text-[#C89B3C]" />
          </Link>
        </div>

        {/* Products */}
        {featuredProducts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => {
              const pricing = getRetailPrice(product);
              const shipping =
                product.retail_free_shipping
                  ? "Free shipping"
                  : Number(product.retail_shipping_charge ?? 0) > 0
                    ? `Shipping ₹${Number(
                        product.retail_shipping_charge
                      ).toFixed(0)}`
                    : "Shipping available";

              return (
                <Link
                  key={product.id}
                  href={`/retail/products/${product.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Product Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#EDEDED]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={`${product.name} from Limra Clothing`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-[#081A4A]/30">
                          No image available
                        </span>
                      </div>
                    )}

                    {/* Retail Badge */}
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#081A4A] px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      Retail
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
                      {product.is_featured
                        ? "Featured Collection"
                        : "Retail Collection"}
                    </p>

                    <h3 className="mt-2 line-clamp-2 min-h-[3.5rem] font-serif text-xl font-semibold leading-7 text-[#081A4A]">
                      {product.name}
                    </h3>

                    {/* Price */}
                    {pricing.current > 0 && (
                      <div className="mt-4 flex items-center gap-2">
                        <span className="text-xl font-bold text-[#081A4A]">
                          {formatPrice(pricing.current)}
                        </span>

                        {pricing.original && (
                          <span className="text-sm text-[#222]/40 line-through">
                            {formatPrice(pricing.original)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Shipping */}
                    <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#222]/55">
                      <Truck className="h-4 w-4 text-[#C89B3C]" />
                      {shipping}
                    </div>

                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#081A4A]">
                      Shop Now
                      <ArrowRight className="h-4 w-4 text-[#C89B3C] transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-[#081A4A]/10 bg-white p-10 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-[#C89B3C]" />

            <h3 className="mt-4 font-serif text-2xl font-semibold text-[#081A4A]">
              Retail Collection Coming Soon
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#222]/55">
              Our latest retail clothing collection will be available here
              soon.
            </p>

            <Link
              href="/retail/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d286b]"
            >
              Explore Retail
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Bottom CTA */}
        {featuredProducts.length > 0 && (
          <div className="mt-10 text-center">
            <Link
              href="/retail/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0d286b]"
            >
              Shop All Retail Products
              <ArrowRight className="h-4 w-4 text-[#C89B3C]" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}