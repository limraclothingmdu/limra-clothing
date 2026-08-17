import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  short_description: string | null;
  description: string;
  image: string | null;
  keywords: string[];
  is_active: boolean;
  price: number | null;
  offer_name: string | null;
  offer_price: number | null;
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
  offer_price
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