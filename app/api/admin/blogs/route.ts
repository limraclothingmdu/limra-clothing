import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const admin = await requireAdminApi();

  if (!admin.authorized) {
    return NextResponse.json(
      { error: admin.error },
      { status: admin.status }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET blogs error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();

if (!admin.authorized) {
  return NextResponse.json(
    { error: admin.error },
    { status: admin.status }
  );
}
  const supabase = await createClient();


  try {
    const body = await request.json();

    const {
      title,
      slug,
      excerpt,
      content,
      featured_image,
      category,
      keywords,
      author,
      published_at,
      is_published,
      seo_title,
      seo_description,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!slug?.trim()) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("blogs")
      .insert({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        featured_image: featured_image || null,
        category: category?.trim() || null,
        keywords: Array.isArray(keywords) ? keywords : [],
        author: author?.trim() || "Limra Clothing",
        published_at:
          is_published
            ? published_at || new Date().toISOString()
            : null,
        is_published: Boolean(is_published),
        seo_title: seo_title?.trim() || null,
        seo_description: seo_description?.trim() || null,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error("POST blog error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST blog exception:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}