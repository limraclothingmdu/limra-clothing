import { createClient } from "@/lib/supabase/server";

export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string | null;
  keywords: string[];
  author: string | null;
  published_at: string | null;
  updated_at: string | null;
  created_at: string;
  is_published: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

export async function getPublishedBlogs(): Promise<Blog[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch blogs:", error);
    return [];
  }

  return data ?? [];
}

export async function getBlogBySlug(
  slug: string
): Promise<Blog | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch blog:", error);
    return null;
  }

  return data;
}