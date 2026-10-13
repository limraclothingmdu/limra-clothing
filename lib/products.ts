import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  short_description: string | null;
  description: string;
  image: string | null;
  keywords: string[];
  is_active: boolean;

  // Wholesale pricing
  price: number | null;
  offer_name: string | null;
  offer_price: number | null;

  // Retail pricing
  retail_enabled?: boolean;
  retail_price?: number | null;
  retail_offer_price?: number | null;
  retail_shipping_charge?: number | string | null;
  retail_free_shipping?: boolean;
  retail_stock?: number | string | null;

  // Retail information
  sku?: string | null;
  is_featured?: boolean;
};

const productSelect = `
  id,
  slug,
  name,
  category_id,
  short_description,
  description,
  image,
  keywords,
  is_active,
  price,
  offer_name,
  offer_price,
  retail_enabled,
  retail_price,
  retail_offer_price,
  retail_shipping_charge,
  retail_free_shipping,
  retail_stock,
  sku,
  is_featured
`;

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }

  return data ?? [];
}
export async function getRetailProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .eq("retail_enabled", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch retail products:", error);
    return [];
  }

  return data ?? [];
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }

  return data;
}

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch category products:", error);
    return [];
  }

  return data ?? [];
}

export async function getProductRecommendations(
  currentProductId: string,
  categoryId: string | null
): Promise<{
  relatedProducts: Product[];
  moreProducts: Product[];
}> {
  const supabase = await createClient();

  let relatedProducts: Product[] = [];

  // First, find other active products in the same category.
  if (categoryId) {
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("is_active", true)
      .eq("category_id", categoryId)
      .neq("id", currentProductId)
      .order("created_at", { ascending: false })
      .limit(4);

    if (error) {
      console.error("Failed to fetch related products:", error);
    } else {
      relatedProducts = data ?? [];
    }
  }

  // Then, find active products from other categories.
  let moreQuery = supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .neq("id", currentProductId)
    .order("created_at", { ascending: false })
    .limit(4);

  if (categoryId) {
    moreQuery = moreQuery.neq("category_id", categoryId);
  }

  const { data: moreData, error: moreError } = await moreQuery;

  if (moreError) {
    console.error("Failed to fetch more products:", moreError);
  }

  const relatedIds = new Set(relatedProducts.map((item) => item.id));

  const moreProducts = (moreData ?? [])
    .filter((item) => !relatedIds.has(item.id))
    .slice(0, 4);

  return {
    relatedProducts,
    moreProducts,
  };
}

export async function getRetailProductRecommendations(
  currentProductId: string,
  categoryId: string | null
): Promise<{
  relatedProducts: Product[];
  moreProducts: Product[];
}> {
  const supabase = await createClient();

  let relatedProducts: Product[] = [];

  // Fetch retail-enabled products from the same category.
  if (categoryId) {
    const { data, error } = await supabase
      .from("products")
      .select(productSelect)
      .eq("is_active", true)
      .eq("retail_enabled", true)
      .eq("category_id", categoryId)
      .neq("id", currentProductId)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(4);

    if (error) {
      console.error(
        "Failed to fetch related retail products:",
        error
      );
    } else {
      relatedProducts = data ?? [];
    }
  }

  // Fetch retail-enabled products from other categories.
  let moreQuery = supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .eq("retail_enabled", true)
    .neq("id", currentProductId)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(4);

  if (categoryId) {
    moreQuery = moreQuery.neq("category_id", categoryId);
  }

  const { data: moreData, error: moreError } =
    await moreQuery;

  if (moreError) {
    console.error(
      "Failed to fetch more retail products:",
      moreError
    );
  }

  const relatedIds = new Set(
    relatedProducts.map((item) => item.id)
  );

  const moreProducts = (moreData ?? [])
    .filter(
      (item) =>
        !relatedIds.has(item.id) &&
        item.id !== currentProductId
    )
    .slice(0, 4);

  return {
    relatedProducts,
    moreProducts,
  };
}
