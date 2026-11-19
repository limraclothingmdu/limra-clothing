import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { createClient } from "@/lib/supabase/server";
import { publishBlogToGoogle } from "@/lib/google-business/publish-blog";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

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
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Blog not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}


export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

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

    // Read the previous publication status before updating.
    const { data: previousBlog, error: previousError } = await supabase
      .from("blogs")
      .select("id, is_published")
      .eq("id", id)
      .maybeSingle();

    if (previousError) {
      console.error("PUT blog previous status error:", previousError);

      return NextResponse.json(
        { error: "Unable to check the existing blog." },
        { status: 500 }
      );
    }

    if (!previousBlog) {
      return NextResponse.json(
        { error: "Blog not found." },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("PUT blog error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Blog not found." },
        { status: 404 }
      );
    }

    // Publish only when the blog changes from draft to published.
    // Editing an already-published blog will not create another Google post.
    const googlePublish =
      !previousBlog.is_published && data.is_published
        ? await publishBlogToGoogle(data.id)
        : null;

    return NextResponse.json({
      ...data,
      googlePublish,
    });
  } catch (error) {
    console.error("PUT blog exception:", error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}



export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const admin = await requireAdminApi();

  if (!admin.authorized) {
    return NextResponse.json(
      { error: admin.error },
      { status: admin.status }
    );
  }

  const supabase = await createClient();

  // Protect blogs that are linked to a Google Business Profile post.
  const { data: googlePost, error: googlePostError } = await supabase
    .from("google_business_posts")
    .select("id, sync_status")
    .eq("blog_id", id)
    .maybeSingle();

  if (googlePostError) {
    console.error("DELETE blog Google post check error:", googlePostError);

    return NextResponse.json(
      { error: "Unable to verify Google Business Profile post status." },
      { status: 500 }
    );
  }

  if (googlePost) {
    return NextResponse.json(
      {
        error:
          "This blog is linked to a Google Business Profile post. Resolve the linked post before deleting this blog.",
        googlePostStatus: googlePost.sync_status,
      },
      { status: 409 }
    );
  }

  // Delete only the requested blog.
  const { data, error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("DELETE blog error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Blog not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Blog deleted successfully.",
  });
}
