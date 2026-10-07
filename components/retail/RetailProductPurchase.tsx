"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";

import { addToCart } from "@/lib/retail/cart";

type RetailSize = {
  id: string;
  name: string;
  slug: string;
  stock_quantity: number;
};

type RetailProductPurchaseProps = {
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string | null;
  sku: string | null;
  sizes: RetailSize[];
  price: number | null;
  offerPrice: number | null;
};

export default function RetailProductPurchase({
  productId,
  productSlug,
  productName,
  productImage,
  sku,
  sizes,
  price,
  offerPrice,
}: RetailProductPurchaseProps) {
  const router = useRouter();

  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const selectedSize = sizes.find(
    (size) => size.id === selectedSizeId
  );

  const unitPrice = offerPrice ?? price;

  function handleSizeChange(sizeId: string) {
    setSelectedSizeId(sizeId);
    setQuantity(1);
  }

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    if (!selectedSize) {
      return;
    }

    setQuantity((current) =>
      Math.min(current + 1, selectedSize.stock_quantity)
    );
  }

  function handleAddToCart() {
    if (!selectedSize) {
      return;
    }

    if (selectedSize.stock_quantity <= 0) {
      return;
    }

    if (unitPrice === null) {
      return;
    }

    setAdding(true);

    addToCart({
      productId,
      productSlug,
      productName,
      image: productImage,
      sizeId: selectedSize.id,
      sizeName: selectedSize.name,
      sku,
      quantity,
      unitPrice,
      maxStock: selectedSize.stock_quantity,
    });

    router.push("/retail/cart");
  }

  return (
    <div className="mt-8 rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
      {/* Size */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#081A4A]">
            Select Size
          </p>

          {selectedSize && (
            <span className="text-sm text-[#222]/55">
              {selectedSize.stock_quantity} available
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {sizes.map((size) => {
            const isSelected = selectedSizeId === size.id;
            const isOutOfStock = size.stock_quantity <= 0;

            return (
              <button
                key={size.id}
                type="button"
                disabled={isOutOfStock}
                onClick={() => handleSizeChange(size.id)}
                className={`min-w-16 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                  isOutOfStock
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through"
                    : isSelected
                      ? "border-[#081A4A] bg-[#081A4A] text-white"
                      : "border-[#081A4A]/15 bg-white text-[#081A4A] hover:border-[#C89B3C] hover:text-[#C89B3C]"
                }`}
              >
                {size.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div className="mt-7">
        <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#081A4A]">
          Quantity
        </p>

        <div className="mt-4 inline-flex items-center overflow-hidden rounded-xl border border-[#081A4A]/15">
          <button
            type="button"
            onClick={decreaseQuantity}
            disabled={!selectedSize || quantity <= 1}
            className="flex h-12 w-12 items-center justify-center text-[#081A4A] transition hover:bg-[#F7F5F0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="flex h-12 min-w-14 items-center justify-center border-x border-[#081A4A]/10 px-4 text-sm font-bold text-[#081A4A]">
            {quantity}
          </div>

          <button
            type="button"
            onClick={increaseQuantity}
            disabled={
              !selectedSize ||
              quantity >= selectedSize.stock_quantity
            }
            className="flex h-12 w-12 items-center justify-center text-[#081A4A] transition hover:bg-[#F7F5F0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={
          adding ||
          !selectedSize ||
          selectedSize.stock_quantity <= 0 ||
          unitPrice === null
        }
        className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#081A4A] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#0d286b] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShoppingCart className="h-5 w-5" />

        {adding
          ? "Adding to Cart..."
          : !selectedSize
            ? "Select a Size"
            : selectedSize.stock_quantity <= 0
              ? "Out of Stock"
              : "Add to Cart"}
      </button>

      <p className="mt-3 text-center text-xs text-[#222]/50">
        Stock is tracked separately for each size.
      </p>
    </div>
  );
}