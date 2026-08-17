import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#EDEDED]">
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.name} wholesale from Limra Clothing`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#222]/40">
            No image available
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold text-[#081A4A]">
          {product.name}
        </h3>

        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#222]/60">
            {product.short_description}
          </p>
        )}

        <div className="mt-4 flex flex-col gap-1">
          {product.offer_price && product.price ? (
            <>
              {product.offer_name && (
                <span className="text-xs font-bold text-[#C89B3C] uppercase tracking-wide">
                  {product.offer_name}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#081A4A]">
                  ₹{product.offer_price}
                </span>
                <span className="text-sm text-[#222]/50 line-through">
                  ₹{product.price}
                </span>
              </div>
            </>
          ) : product.price ? (
            <span className="text-lg font-bold text-[#081A4A]">
              ₹{product.price}
            </span>
          ) : null}
        </div>

        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#081A4A]">
          View Product
          <ArrowRight className="h-4 w-4 text-[#C89B3C] transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}