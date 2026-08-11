import { createClient } from "@/lib/supabase/server";

export type Category = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string;
  image: string | null;
  keywords: string[];
  is_active: boolean;
};

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      slug,
      name,
      short_description,
      description,
      image,
      keywords,
      is_active
    `)
    .order("name", { ascending: true });

  if (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }

  return data ?? [];
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      slug,
      name,
      short_description,
      description,
      image,
      keywords,
      is_active
    `)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }

  return data;
}

export async function getCategoryById(
  id: string
): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(`
      id,
      slug,
      name,
      short_description,
      description,
      image,
      keywords,
      is_active
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }

  return data;
}