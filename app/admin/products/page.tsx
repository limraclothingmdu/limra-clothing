import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { createClient } from "@/lib/supabase/server";

export default async function AdminProductsPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch products with their categories
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
              className="text-sm font-semibold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Limra Clothing
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-[#081A4A]">
              Products
            </h1>

            <p className="mt-2 text-sm text-[#222]/60">
              Manage your clothing catalogue.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-full bg-[#081A4A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0d286b]"
          >
            + Add Product
          </Link>
        </div>

        {/* Database Error */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            <p className="font-bold">
              Failed to load products
            </p>

            <p className="mt-1">
              {error.message}
            </p>
          </div>
        )}

        {/* Products Table */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              
              {/* Table Header */}
              <thead className="border-b border-[#081A4A]/10 bg-[#F7F5F0]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#081A4A]/60">
                    Product
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#081A4A]/60">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#081A4A]/60">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#081A4A]/60">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-[#081A4A]/10">
                {products?.map((product) => {
                  
                  // Supabase may return the relationship as an array.
                  const category = Array.isArray(product.categories)
                    ? product.categories[0]
                    : product.categories;

                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-[#F7F5F0]/60"
                    >

                      {/* Product */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">

                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={64}
                              height={64}
                              className="h-16 w-16 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#EDEDED] text-xs text-[#222]/40">
                              No image
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-[#081A4A]">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-[#222]/50">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-5">
                        <span className="text-sm text-[#222]/70">
                          {category?.name ?? "Uncategorized"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        {product.is_active ? (
                          <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
  <Link
    href={`/admin/products/${product.id}/edit`}
    className="text-sm font-bold text-[#081A4A] hover:text-[#C89B3C]"
  >
    Edit
  </Link>

  <DeleteProductButton
    productId={product.id}
    productName={product.name}
  />
</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {(!products || products.length === 0) && !error && (
            <div className="px-6 py-16 text-center">
              <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
                No products yet
              </h2>

              <p className="mt-2 text-sm text-[#222]/55">
                Add your first product to the catalogue.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-6 inline-flex rounded-full bg-[#081A4A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0d286b]"
              >
                Add Product
              </Link>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}