import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET CATEGORY
export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required." },
        { status: 400 }
      );
    }

    const {
      data: category,
      error,
    } = await supabase
      .from("categories")
      .select(
        "id, name, slug, short_description, description, image, keywords, is_active"
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(
        "Category fetch failed:",
        error
      );

      return NextResponse.json(
        {
          error: "Could not load the category.",
        },
        { status: 500 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error(
      "Get category error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while loading the category.",
      },
      { status: 500 }
    );
  }
}

// UPDATE CATEGORY
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required." },
        { status: 400 }
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

    const slug = createSlug(
      slugInput || name
    );

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
        {
          error: "Category name is required.",
        },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          error: "Category slug is required.",
        },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          error:
            "Category description is required.",
        },
        { status: 400 }
      );
    }

    // Check category exists
    const {
      data: existingCategory,
      error: existingCategoryError,
    } = await supabase
      .from("categories")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existingCategoryError) {
      console.error(
        "Category lookup failed:",
        existingCategoryError
      );

      return NextResponse.json(
        {
          error:
            "Could not find the category.",
        },
        { status: 500 }
      );
    }

    if (!existingCategory) {
      return NextResponse.json(
        {
          error: "Category not found.",
        },
        { status: 404 }
      );
    }

    // Check duplicate slug
    const {
      data: duplicateCategory,
      error: duplicateError,
    } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .maybeSingle();

    if (duplicateError) {
      console.error(
        "Duplicate slug check failed:",
        duplicateError
      );

      return NextResponse.json(
        {
          error:
            "Could not validate the category slug.",
        },
        { status: 500 }
      );
    }

    if (duplicateCategory) {
      return NextResponse.json(
        {
          error:
            "Another category already uses this URL slug.",
        },
        { status: 409 }
      );
    }

    // Update category
    const { error: updateError } =
      await supabase
        .from("categories")
        .update({
          name,
          slug,
          short_description:
            shortDescription || null,
          description,
          image,
          keywords,
          is_active: isActive,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", id);

    if (updateError) {
      console.error(
        "Category update failed:",
        updateError
      );

      return NextResponse.json(
        {
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    // Fetch updated category
    const {
      data: updatedCategory,
      error: fetchError,
    } = await supabase
      .from("categories")
      .select(
        "id, name, slug, short_description, description, image, keywords, is_active"
      )
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error(
        "Updated category fetch failed:",
        fetchError
      );

      return NextResponse.json({
        success: true,
        message:
          "Category updated successfully.",
      });
    }

    return NextResponse.json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.error(
      "Update category error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the category.",
      },
      { status: 500 }
    );
  }
}

// DELETE CATEGORY
export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required." },
        { status: 400 }
      );
    }

    // Check category
    const {
      data: category,
      error: categoryError,
    } = await supabase
      .from("categories")
      .select("id, name")
      .eq("id", id)
      .maybeSingle();

    if (categoryError) {
      console.error(
        "Category lookup failed:",
        categoryError
      );

      return NextResponse.json(
        {
          error:
            "Could not find the category.",
        },
        { status: 500 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found.",
        },
        { status: 404 }
      );
    }

    // Check whether products use this category
    const {
      count: productCount,
      error: productCountError,
    } = await supabase
      .from("products")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("category_id", id);

    if (productCountError) {
      console.error(
        "Product count check failed:",
        productCountError
      );

      return NextResponse.json(
        {
          error:
            "Could not check products in this category.",
        },
        { status: 500 }
      );
    }

    if ((productCount ?? 0) > 0) {
      return NextResponse.json(
        {
          error:
            "This category contains products. Deactivate it instead of deleting it.",
        },
        { status: 409 }
      );
    }

    // Delete category
    const { error: deleteError } =
      await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (deleteError) {
      console.error(
        "Category deletion failed:",
        deleteError
      );

      return NextResponse.json(
        {
          error: deleteError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Category "${category.name}" deleted successfully.`,
    });
  } catch (error) {
    console.error(
      "Delete category error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while deleting the category.",
      },
      { status: 500 }
    );
  }
}