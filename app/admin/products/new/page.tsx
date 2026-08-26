import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import AddProductForm from "@/components/admin/AddProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Load categories
  const { data: categories, error: categoriesError } =
    await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("name", { ascending: true });

  // Load sizes
  const { data: sizes, error: sizesError } =
    await supabase
      .from("product_sizes")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("name", { ascending: true });

  // Load styles
  const { data: styles, error: stylesError } =
    await supabase
      .from("product_styles")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("name", { ascending: true });

  // Load materials
  const { data: materials, error: materialsError } =
    await supabase
      .from("product_materials")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("name", { ascending: true });

  const loadingError =
    categoriesError ||
    sizesError ||
    stylesError ||
    materialsError;

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/admin/products"
            className="text-sm font-semibold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
          >
            ← Back to Products
          </Link>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Limra Clothing
          </p>

          <h1 className="mt-2 font-serif text-4xl font-semibold text-[#081A4A]">
            Add Product
          </h1>

          <p className="mt-2 text-sm text-[#222]/60">
            Add a new product to your clothing catalogue.
          </p>
        </div>

        {/* Loading error */}
        {loadingError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
            <p className="font-bold">
              Failed to load product options.
            </p>

            <p className="mt-1">
              {loadingError.message}
            </p>
          </div>
        ) : (
          <AddProductForm
            categories={categories ?? []}
            sizes={sizes ?? []}
            styles={styles ?? []}
            materials={materials ?? []}
          />
        )}
      </div>
    </main>
  );
}