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

  // --------------------------------------------------
  // PRODUCT
  // --------------------------------------------------

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
      offer_price,
      retail_enabled,
      retail_price,
      retail_offer_price,
      sku,
      is_featured
    `)
    .eq("id", id)
    .single();

  if (productError || !product) {
    notFound();
  }

  // --------------------------------------------------
  // PRODUCT OPTIONS
  // --------------------------------------------------

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name", { ascending: true });

  const { data: sizes, error: sizesError } = await supabase
    .from("product_sizes")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const { data: styles, error: stylesError } = await supabase
    .from("product_styles")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const { data: materials, error: materialsError } = await supabase
    .from("product_materials")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  // --------------------------------------------------
  // PRODUCT ATTRIBUTE RELATIONS
  // --------------------------------------------------

  const { data: sizeRelations, error: sizeRelationsError } =
    await supabase
      .from("product_size_relations")
      .select("size_id")
      .eq("product_id", id);

  const { data: styleRelations, error: styleRelationsError } =
    await supabase
      .from("product_style_relations")
      .select("style_id")
      .eq("product_id", id);

  const { data: materialRelations, error: materialRelationsError } =
    await supabase
      .from("product_material_relations")
      .select("material_id")
      .eq("product_id", id);

  // --------------------------------------------------
  // SIZE-WISE STOCK
  // --------------------------------------------------

  const { data: sizeStocks, error: sizeStocksError } = await supabase
    .from("product_size_stock")
    .select("size_id, stock_quantity")
    .eq("product_id", id);

  // --------------------------------------------------
  // CHECK FOR LOADING ERRORS
  // --------------------------------------------------

  const optionsError =
    categoriesError ||
    sizesError ||
    stylesError ||
    materialsError ||
    sizeRelationsError ||
    styleRelationsError ||
    materialRelationsError ||
    sizeStocksError;

  if (optionsError) {
    return (
      <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            Failed to load product options: {optionsError.message}
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

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
          sizes={sizes ?? []}
          styles={styles ?? []}
          materials={materials ?? []}
          initialSizeIds={
            sizeRelations?.map((item) => item.size_id) ?? []
          }
          initialStyleIds={
            styleRelations?.map((item) => item.style_id) ?? []
          }
          initialMaterialIds={
            materialRelations?.map((item) => item.material_id) ?? []
          }
          initialSizeStocks={
            sizeStocks?.map((item) => ({
              size_id: item.size_id,
              stock_quantity: item.stock_quantity,
            })) ?? []
          }
        />
      </div>
    </main>
  );
}