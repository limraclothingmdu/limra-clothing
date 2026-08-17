import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import EditProductForm from "@/components/admin/EditProductForm";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      short_description,
      description,
      keywords,
      image,
      is_active,
      category_id,
  price,
  offer_name,
  offer_price
    `)
    .eq("id", id)
    .single();

  if (productError || !product) {
    notFound();
  }

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  if (categoriesError) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            Failed to load categories: {categoriesError.message}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
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
            Edit Product
          </h1>

          <p className="mt-2 text-sm text-[#222]/60">
            Update your clothing catalogue product.
          </p>
        </div>

        <EditProductForm
          product={product}
          categories={categories ?? []}
        />
      </div>
    </main>
  );
}