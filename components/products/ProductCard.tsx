import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  hrefPrefix?: string;
  priceType?: "wholesale" | "retail";
};

export default function ProductCard({
  product,
  hrefPrefix = "/products",
  priceType = "wholesale",
}: ProductCardProps) {
  const productHref = `${hrefPrefix}/${product.slug}`;

  const displayPrice =
    priceType === "retail"
      ? product.retail_price ?? null
      : product.price;

  const displayOfferPrice =
    priceType === "retail"
      ? product.retail_offer_price ?? null
      : product.offer_price;

  const shipping =
    priceType === "retail" &&
    product.retail_free_shipping
      ? 0
      : Number(product.retail_shipping_charge ?? 0);

  return (
    <Link
      href={productHref}
      className="group block overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EDEDED]">
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.name} ${
              priceType === "retail"
                ? "retail"
                : "wholesale"
            } from Limra Clothing`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[#222]/40">
            No image available
          </div>

        )}
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5">
        <h3 className="line-clamp-2 font-serif text-lg font-semibold leading-tight text-[#081A4A] sm:text-xl">
          {product.name}
        </h3>

        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#222]/60 sm:text-sm sm:leading-6">
            {product.short_description}
          </p>
        )}

        {/* Pricing */}
        <div className="mt-3 flex flex-col gap-1 sm:mt-4">
          {displayOfferPrice !== null &&
          displayPrice !== null ? (
            <>
              {product.offer_name && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-[#C89B3C] sm:text-xs">
                  {product.offer_name}
                </span>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-bold text-[#081A4A] sm:text-lg">
                  ₹{displayOfferPrice}
                </span>

                <span className="text-xs text-[#222]/50 line-through sm:text-sm">
                  ₹{displayPrice}
                </span>
              </div>

              {priceType === "retail" && (
                <p className="mt-2 text-xs text-[#222]/55">
                  {shipping === 0
                    ? "Free Shipping"
                    : `Shipping: ₹${shipping}`}
                </p>
              )}
            </>
          ) : displayPrice !== null ? (
            <span className="text-base font-bold text-[#081A4A] sm:text-lg">
              ₹{displayPrice}
            </span>
          ) : null}
        </div>

        {/* View Product */}
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#081A4A] sm:mt-4 sm:gap-2 sm:text-sm">
          View Product
          <ArrowRight className="h-3.5 w-3.5 text-[#C89B3C] transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
        </span>
      </div>
    </Link>
  );
}