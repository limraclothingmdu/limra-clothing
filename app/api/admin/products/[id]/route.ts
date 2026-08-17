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

// UPDATE PRODUCT
export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

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

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const slug =
      typeof body.slug === "string"
        ? createSlug(body.slug)
        : "";

    const categoryId =
      typeof body.category_id === "string"
        ? body.category_id
        : "";

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
    const price =
      body.price === null ||
      body.price === undefined ||
      body.price === ""
        ? null
        : Number(body.price);

    const offerName =
      typeof body.offer_name === "string" &&
      body.offer_name.trim()
        ? body.offer_name.trim()
        : null;

    const offerPrice =
      body.offer_price === null ||
      body.offer_price === undefined ||
      body.offer_price === ""
        ? null
        : Number(body.offer_price);

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: "Product name is required." },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required." },
        { status: 400 }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        { error: "Product category is required." },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Product description is required." },
        { status: 400 }
      );
    }

    // Check whether product exists
    const {
      data: existingProduct,
      error: existingProductError,
    } = await supabase
      .from("products")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existingProductError) {
      console.error(
        "Product lookup failed:",
        existingProductError
      );

      return NextResponse.json(
        {
          error: "Could not find the product.",
        },
        { status: 500 }
      );
    }

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        { status: 404 }
      );
    }
    if (price !== null && (!Number.isFinite(price) || price < 0)) {
  return NextResponse.json(
    { error: "Price cannot be negative." },
    { status: 400 }
  );
}

if (
  offerPrice !== null &&
  (!Number.isFinite(offerPrice) || offerPrice < 0)
) {
  return NextResponse.json(
    { error: "Offer price cannot be negative." },
    { status: 400 }
  );
}

if (
  price !== null &&
  offerPrice !== null &&
  offerPrice >= price
) {
  return NextResponse.json(
    {
      error:
        "Offer price must be lower than the regular price.",
    },
    { status: 400 }
  );
}
    // Check duplicate slug
    const {
      data: duplicateProduct,
      error: duplicateError,
    } = await supabase
      .from("products")
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
          error: "Could not validate the product slug.",
        },
        { status: 500 }
      );
    }

    if (duplicateProduct) {
      return NextResponse.json(
        {
          error:
            "Another product already uses this URL slug.",
        },
        { status: 409 }
      );
    }

    // Verify category
    const {
      data: category,
      error: categoryError,
    } = await supabase
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .maybeSingle();

    if (categoryError) {
      console.error(
        "Category validation failed:",
        categoryError
      );

      return NextResponse.json(
        {
          error:
            "Could not validate the selected category.",
        },
        { status: 500 }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          error: "Selected category does not exist.",
        },
        { status: 400 }
      );
    }

    // Update product
    const {
      data: product,
      error: updateError,
    } = await supabase
      .from("products")
      .update({
        name,
        slug,
        category_id: categoryId,
        short_description:
          shortDescription || null,
        description,
        image,
        keywords,
        is_active: isActive,
        price,
  offer_name: offerName,
  offer_price: offerPrice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error(
        "Product update failed:",
        updateError
      );

      return NextResponse.json(
        {
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(
      "Update product error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the product.",
      },
      { status: 500 }
    );
  }
}

// DELETE PRODUCT
export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

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

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    // Check product exists
    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .select("id, name")
      .eq("id", id)
      .maybeSingle();

    if (productError) {
      console.error(
        "Product lookup failed:",
        productError
      );

      return NextResponse.json(
        {
          error: "Could not find the product.",
        },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    // Delete product
    const { error: deleteError } =
      await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (deleteError) {
      console.error(
        "Product deletion failed:",
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
      message: `Product "${product.name}" deleted successfully.`,
    });
  } catch (error) {
    console.error(
      "Delete product error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while deleting the product.",
      },
      { status: 500 }
    );
  }
}