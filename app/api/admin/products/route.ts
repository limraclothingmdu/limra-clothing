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
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
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
          error: "Product name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          error: "Product slug is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!categoryId) {
      return NextResponse.json(
        {
          error: "Product category is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          error: "Product description is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Check duplicate slug
    const { data: existingProduct, error: existingError } =
      await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();

    if (existingError) {
      console.error(
        "Duplicate slug check failed:",
        existingError
      );
      

      return NextResponse.json(
        {
          error: "Could not validate the product slug.",
        },
        {
          status: 500,
        }
      );
    }

    if (existingProduct) {
      return NextResponse.json(
        {
          error:
            "A product with this URL slug already exists.",
        },
        {
          status: 409,
        }
      );
    }
    if (price !== null && price < 0) {
  return NextResponse.json(
    { error: "Price cannot be negative." },
    { status: 400 }
  );
}

if (offerPrice !== null && offerPrice < 0) {
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
    // Verify category exists
    const { data: category, error: categoryError } =
      await supabase
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
          error: "Could not validate the selected category.",
        },
        {
          status: 500,
        }
      );
    }

    if (!category) {
      return NextResponse.json(
        {
          error: "Selected category does not exist.",
        },
        {
          status: 400,
        }
      );
    }

    // Insert product
    const { data: product, error: insertError } =
      await supabase
        .from("products")
        .insert({
            name,
  slug,
  category_id: categoryId,
  short_description: shortDescription || null,
  description,
  image,
  keywords,
  is_active: isActive,
  price,
  offer_name: offerName,
  offer_price: offerPrice,
        })
        .select()
        .single();

    if (insertError) {
      console.error(
        "Product insert failed:",
        insertError
      );

      return NextResponse.json(
        {
          error: insertError.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    return NextResponse.json(
      {
        error: "Something went wrong while creating the product.",
      },
      {
        status: 500,
      }
    );
  }
}