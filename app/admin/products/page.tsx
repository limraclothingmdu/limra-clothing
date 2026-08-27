import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Package,
  Plus,
} from "lucide-react";

import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      short_description,
      image,
      is_active,
      created_at,
      price,
      offer_name,
      offer_price,
      category_id,
      categories (
        id,
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <div className="mt-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#081A4A]/5 p-3">
                <Package className="h-6 w-6 text-[#081A4A]" />
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C89B3C]">
                  Limra Clothing
                </p>

                <h1 className="mt-1 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
                  Products
                </h1>
              </div>
            </div>

            <p className="mt-3 text-sm text-[#222]/55">
              Create, edit, activate, deactivate and delete your products.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#081A4A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0d286b]"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            <p className="font-bold">
              Could not load products
            </p>

            <p className="mt-1">
              {error.message}
            </p>
          </div>
        )}

        {/* Products */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm">

          <div className="border-b border-[#081A4A]/10 px-6 py-5">
            <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
              All Products
            </h2>

            <p className="mt-1 text-sm text-[#222]/50">
              {products?.length ?? 0} product
              {(products?.length ?? 0) === 1 ? "" : "s"} in your catalogue.
            </p>
          </div>

          {!products || products.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#081A4A]/5">
                <Package className="h-7 w-7 text-[#081A4A]" />
              </div>

              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#081A4A]">
                No products yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-[#222]/50">
                Start building your catalogue by adding your first product.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-6 py-3 text-sm font-bold text-white hover:bg-[#0d286b]"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full">
                  <thead className="border-b border-[#081A4A]/10 bg-[#F7F5F0]/60">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#222]/45">
                        Product
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#222]/45">
                        Category
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#222]/45">
                        Price
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#222]/45">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#222]/45">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#081A4A]/10">
                    {products.map((product) => {
                      const category = Array.isArray(product.categories)
                        ? product.categories[0]
                        : product.categories;

                      return (
                        <tr
                          key={product.id}
                          className="transition-colors hover:bg-[#F7F5F0]/50"
                        >
                          {/* Product */}
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F7F5F0]">
                                {product.image ? (
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <Package className="h-6 w-6 text-[#081A4A]/30" />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-xs truncate font-semibold text-[#081A4A]">
                                  {product.name}
                                </p>

                                <p className="mt-1 max-w-xs truncate text-xs text-[#222]/45">
                                  /products/{product.slug}
                                </p>

                                {product.short_description && (
                                  <p className="mt-1 max-w-sm truncate text-xs text-[#222]/50">
                                    {product.short_description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="px-6 py-5">
                            <span className="rounded-full bg-[#081A4A]/5 px-3 py-1 text-xs font-semibold text-[#081A4A]">
                              {category?.name ?? "Uncategorized"}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="px-6 py-5">
                            {product.price !== null ? (
                              <div>
                                <p className="font-semibold text-[#081A4A]">
                                  ₹{Number(product.price).toLocaleString("en-IN")}
                                </p>

                                {product.offer_price !== null && (
                                  <p className="mt-1 text-xs text-[#C89B3C]">
                                    Offer: ₹
                                    {Number(product.offer_price).toLocaleString(
                                      "en-IN"
                                    )}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm text-[#222]/40">
                                Not set
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                product.is_active
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {product.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-4">
                              <Link
                                href={`/admin/products/${product.id}/edit`}
                                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#081A4A] transition hover:text-[#C89B3C]"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>

                              <DeleteProductButton
                                productId={product.id}
                                productName={product.name}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

             {/* Mobile / Tablet Cards */}
<div className="divide-y divide-[#081A4A]/10 lg:hidden">
  {products.map((product) => {
    const category = Array.isArray(product.categories)
      ? product.categories[0]
      : product.categories;

    const hasOffer =
      product.offer_price !== null &&
      product.offer_price !== undefined &&
      product.price !== null &&
      product.price !== undefined;

    return (
      <div
        key={product.id}
        className="p-5 sm:p-6"
      >
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F7F5F0]">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-7 w-7 text-[#081A4A]/30" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-[#081A4A]">
                  {product.name}
                </h3>

                <p className="mt-1 truncate text-xs text-[#222]/45">
                  /products/{product.slug}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  product.is_active
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {product.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Category */}
            <p className="mt-3 text-xs text-[#222]/50">
              Category:{" "}
              <span className="font-semibold text-[#081A4A]">
                {category?.name ?? "Uncategorized"}
              </span>
            </p>

            {/* Pricing */}
            {hasOffer ? (
              <div className="mt-2">
                {product.offer_name && (
                  <p className="text-xs font-bold uppercase tracking-wide text-[#C89B3C]">
                    {product.offer_name}
                  </p>
                )}

                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-[#081A4A]">
                    ₹{Number(product.offer_price).toLocaleString("en-IN")}
                  </span>

                  <span className="text-sm text-[#222]/40 line-through">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ) : product.price !== null &&
              product.price !== undefined ? (
              <p className="mt-2 font-semibold text-[#081A4A]">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </p>
            ) : null}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center justify-end gap-4 border-t border-[#081A4A]/10 pt-4">
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#081A4A] hover:text-[#C89B3C]"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Link>

          <DeleteProductButton
            productId={product.id}
            productName={product.name}
          />
        </div>
      </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}