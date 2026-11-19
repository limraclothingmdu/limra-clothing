import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { createClient } from "@/lib/supabase/server";
import { publishBlogToGoogle } from "@/lib/google-business/publish-blog";

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

    const { data: googlePosts, error: googlePostsError } =
    await supabase
      .from("google_business_posts")
      .select(
        "blog_id, sync_status, last_synced_at, last_attempt_at, last_error"
      );

  if (googlePostsError) {
    console.error("GET Google blog sync status error:", googlePostsError);

    return NextResponse.json(
      { error: "Failed to load Google publishing statuses." },
      { status: 500 }
    );
  }

  const googleStatusMap = new Map(
    (googlePosts ?? []).map((post) => [
      post.blog_id,
      {
        sync_status: post.sync_status,
        last_synced_at: post.last_synced_at,
        last_attempt_at: post.last_attempt_at,
        last_error: post.last_error,
      },
    ])
  );

  const blogsWithGoogleStatus = (data ?? []).map((blog) => ({
    ...blog,
    google_business_post:
      googleStatusMap.get(blog.id) ?? null,
  }));

  return NextResponse.json(blogsWithGoogleStatus);
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
        published_at: is_published
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

    if (!data) {
      return NextResponse.json(
        { error: "Blog could not be created." },
        { status: 500 }
      );
    }

    // Publish to Google only when the newly created blog is published.
    // A Google publishing failure does not undo the saved blog.
    const googlePublish = data.is_published
      ? await publishBlogToGoogle(data.id)
      : null;

    return NextResponse.json(
      {
        ...data,
        googlePublish,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST blog exception:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
