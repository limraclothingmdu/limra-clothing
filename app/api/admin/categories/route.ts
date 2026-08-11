import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const slugInput =
      typeof body.slug === "string"
        ? body.slug.trim()
        : "";

    const slug = createSlug(slugInput || name);

    const shortDescription =
      typeof body.short_description === "string"
        ? body.short_description.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const image =
      typeof body.image === "string" &&
      body.image.trim()
        ? body.image.trim()
        : null;

    const isActive =
      typeof body.is_active === "boolean"
        ? body.is_active
        : true;

    const keywords = Array.isArray(body.keywords)
      ? body.keywords.filter(
          (keyword: unknown): keyword is string =>
            typeof keyword === "string" &&
            keyword.trim().length > 0
        )
      : [];

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required." },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Category slug is required." },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Category description is required." },
        { status: 400 }
      );
    }

    // Check duplicate slug
    const {
      data: existingCategory,
      error: existingError,
    } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (existingError) {
      console.error(
        "Category slug check failed:",
        existingError
      );

      return NextResponse.json(
        {
          error:
            "Could not validate the category slug.",
        },
        { status: 500 }
      );
    }

    if (existingCategory) {
      return NextResponse.json(
        {
          error:
            "A category with this URL slug already exists.",
        },
        { status: 409 }
      );
    }

    // Create category
    const {
      data: category,
      error: insertError,
    } = await supabase
      .from("categories")
      .insert({
        name,
        slug,
        short_description:
          shortDescription || null,
        description,
        image,
        keywords,
        is_active: isActive,
      })
      .select()
      .single();

    if (insertError) {
      console.error(
        "Category insert failed:",
        insertError
      );

      return NextResponse.json(
        {
          error: insertError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create category error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while creating the category.",
      },
      { status: 500 }
    );
  }
}