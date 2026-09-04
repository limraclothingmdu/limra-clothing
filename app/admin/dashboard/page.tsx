import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  FolderOpen,
  LayoutDashboard,
  Plus,
  Shirt,
  Tags,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/admin/LogoutButton";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Fetch dashboard statistics
  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalCategories },
    { data: recentProducts },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),

    supabase
      .from("categories")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("products")
      .select(
        "id, name, slug, image, is_active, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <main className="min-h-screen bg-[#F7F5F0]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              <LayoutDashboard className="h-4 w-4" />
              Limra Clothing
            </div>

            <h1 className="mt-3 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#222]/60">
              Welcome back, {user.email}
            </p>
          </div>

          <LogoutButton />
        </div>

        {/* Stats */}
        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Products */}
          <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#222]/50">
                  Total Products
                </p>

                <p className="mt-3 text-4xl font-semibold text-[#081A4A]">
                  {totalProducts ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-[#081A4A]/5 p-3">
                <Boxes className="h-6 w-6 text-[#081A4A]" />
              </div>
            </div>

            <Link
              href="/admin/products"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#081A4A] hover:text-[#C89B3C]"
            >
              Manage Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Active Products */}
          <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#222]/50">
                  Active Products
                </p>

                <p className="mt-3 text-4xl font-semibold text-[#081A4A]">
                  {activeProducts ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-[#C89B3C]/10 p-3">
                <Shirt className="h-6 w-6 text-[#C89B3C]" />
              </div>
            </div>

            <p className="mt-5 text-sm text-[#222]/50">
              Currently visible on the public website
            </p>
          </div>

          {/* Categories */}
          <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#222]/50">
                  Categories
                </p>

                <p className="mt-3 text-4xl font-semibold text-[#081A4A]">
                  {totalCategories ?? 0}
                </p>
              </div>

              <div className="rounded-xl bg-[#081A4A]/5 p-3">
                <FolderOpen className="h-6 w-6 text-[#081A4A]" />
              </div>
            </div>

            <Link
              href="/categories"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#081A4A] hover:text-[#C89B3C]"
            >
              View Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8 rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C89B3C]">
              Quick Actions
            </p>

            <h2 className="mt-2 font-serif text-2xl font-semibold text-[#081A4A]">
              Manage Your Store
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <Link
              href="/admin/products/new"
              className="group flex items-center justify-between rounded-xl bg-[#081A4A] p-5 text-white transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-[#C89B3C] p-2.5">
                  <Plus className="h-5 w-5 text-[#081A4A]" />
                </div>

                <div>
                  <p className="font-semibold">
                    Add New Product
                  </p>

                  <p className="mt-1 text-sm text-white/50">
                    Add a product to your collection
                  </p>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-[#C89B3C] transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/admin/products"
              className="group flex items-center justify-between rounded-xl border border-[#081A4A]/10 p-5 transition-all hover:border-[#C89B3C]/40 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-[#081A4A]/5 p-2.5">
                  <Boxes className="h-5 w-5 text-[#081A4A]" />
                </div>

                <div>
                  <p className="font-semibold text-[#081A4A]">
                    Manage Products
                  </p>

                  <p className="mt-1 text-sm text-[#222]/50">
                    Edit, deactivate or delete products
                  </p>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-[#C89B3C] transition-transform group-hover:translate-x-1" />
                      </Link>
                      <Link
  href="/admin/categories"
  className="group flex items-center justify-between rounded-xl border border-[#081A4A]/10 p-5 transition-all hover:border-[#C89B3C]/40 hover:shadow-md"
>
  <div>
    <p className="font-semibold text-[#081A4A]">
      Manage Categories
    </p>

    <p className="mt-1 text-sm text-[#222]/50">
      Add and manage clothing categories
    </p>
  </div>

  <ArrowRight className="h-5 w-5 text-[#C89B3C] transition-transform group-hover:translate-x-1" />
</Link>
          </div>
          <Link
  href="/admin/attributes"
  className="group flex items-center justify-between rounded-xl border border-[#081A4A]/10 p-5 transition-all hover:border-[#C89B3C]/40 hover:shadow-md"
>
  <div className="flex items-center gap-4">
    <div className="rounded-lg bg-[#081A4A]/5 p-2.5">
      <Tags className="h-5 w-5 text-[#081A4A]" />
    </div>

    <div>
      <p className="font-semibold text-[#081A4A]">
        Manage Attributes
      </p>

      <p className="mt-1 text-sm text-[#222]/50">
        Manage sizes, styles and materials
      </p>
    </div>
  </div>

  <ArrowRight className="h-5 w-5 text-[#C89B3C] transition-transform group-hover:translate-x-1" />
</Link>
        </section>

        {/* Recent Products */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-[#081A4A]/10 p-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C89B3C]">
                Latest
              </p>

              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#081A4A]">
                Recent Products
              </h2>
            </div>

            <Link
              href="/admin/products"
              className="hidden items-center gap-2 text-sm font-bold text-[#081A4A] hover:text-[#C89B3C] sm:inline-flex"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentProducts && recentProducts.length > 0 ? (
            <div className="divide-y divide-[#081A4A]/10">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-[#F7F5F0]"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-[#081A4A]">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-[#222]/45">
                      /products/{product.slug}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {product.is_active
                        ? "Active"
                        : "Inactive"}
                    </span>

                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="hidden text-sm font-bold text-[#081A4A] hover:text-[#C89B3C] sm:block"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="text-sm text-[#222]/50">
                No products have been added yet.
              </p>

              <Link
                href="/admin/products/new"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-5 py-2.5 text-sm font-bold text-white"
              >
                <Plus className="h-4 w-4" />
                Add Your First Product
              </Link>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}