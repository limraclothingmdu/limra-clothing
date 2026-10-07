import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

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
  const admin = await requireAdminApi();

if (!admin.authorized) {
  return NextResponse.json(
    { error: admin.error },
    { status: admin.status }
  );
}

const supabase = await createClient();

    const body = await request.json();

    const sizeIds: string[] = Array.isArray(body.size_ids)
      ? body.size_ids.filter(
          (id: unknown): id is string =>
            typeof id === "string" && id.trim().length > 0
        )
      : [];

    const sizeStocks: Record<string, number> =
      body.size_stocks && typeof body.size_stocks === "object"
        ? Object.fromEntries(
            Object.entries(body.size_stocks).flatMap(
              ([sizeId, quantity]) => {
                const stock = Number(quantity);

                return Number.isInteger(stock) && stock >= 0
                  ? [[sizeId, stock]]
                  : [];
              }
            )
          )
        : {};

    const styleIds: string[] = Array.isArray(body.style_ids)
      ? body.style_ids.filter(
          (id: unknown): id is string =>
            typeof id === "string" && id.trim().length > 0
        )
      : [];

    const materialIds: string[] = Array.isArray(body.material_ids)
      ? body.material_ids.filter(
          (id: unknown): id is string =>
            typeof id === "string" && id.trim().length > 0
        )
      : [];

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

    // Wholesale pricing
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

    // Retail pricing
    const retailEnabled =
      typeof body.retail_enabled === "boolean"
        ? body.retail_enabled
        : false;

    const retailPrice =
      body.retail_price === null ||
      body.retail_price === undefined ||
      body.retail_price === ""
        ? null
        : Number(body.retail_price);

    const retailOfferPrice =
      body.retail_offer_price === null ||
      body.retail_offer_price === undefined ||
      body.retail_offer_price === ""
        ? null
        : Number(body.retail_offer_price);

    // Retail inventory
    const stockQuantity =
      body.stock_quantity === null ||
      body.stock_quantity === undefined ||
      body.stock_quantity === ""
        ? 0
        : Number(body.stock_quantity);

    const sku =
      typeof body.sku === "string" && body.sku.trim()
        ? body.sku.trim()
        : null;

    const isFeatured =
      typeof body.is_featured === "boolean"
        ? body.is_featured
        : false;

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

    // -----------------------------
    // Basic validation
    // -----------------------------

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

    // -----------------------------
    // Wholesale pricing validation
    // -----------------------------

    if (
      price !== null &&
      (!Number.isFinite(price) || price < 0)
    ) {
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

    // -----------------------------
    // Retail validation
    // -----------------------------

    if (
      retailPrice !== null &&
      (!Number.isFinite(retailPrice) || retailPrice < 0)
    ) {
      return NextResponse.json(
        { error: "Retail price cannot be negative." },
        { status: 400 }
      );
    }

    if (
      retailOfferPrice !== null &&
      (!Number.isFinite(retailOfferPrice) ||
        retailOfferPrice < 0)
    ) {
      return NextResponse.json(
        { error: "Retail offer price cannot be negative." },
        { status: 400 }
      );
    }

    if (
      retailPrice !== null &&
      retailOfferPrice !== null &&
      retailOfferPrice >= retailPrice
    ) {
      return NextResponse.json(
        {
          error:
            "Retail offer price must be lower than the retail price.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      return NextResponse.json(
        {
          error:
            "Stock quantity must be a non-negative whole number.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate retail configuration
    // -----------------------------

    if (retailEnabled && retailPrice === null) {
      return NextResponse.json(
        {
          error:
            "Retail price is required when retail selling is enabled.",
        },
        { status: 400 }
      );
    }

    if (retailEnabled) {
      if (sizeIds.length === 0) {
        return NextResponse.json(
          { error: "At least one retail size is required." },
          { status: 400 }
        );
      }

      if (Object.keys(sizeStocks).length !== sizeIds.length) {
        return NextResponse.json(
          {
            error:
              "A valid stock quantity is required for every selected size.",
          },
          { status: 400 }
        );
      }
    }

    // -----------------------------
    // Check duplicate slug
    // -----------------------------

    const {
      data: existingProduct,
      error: existingError,
    } = await supabase
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
          error:
            "Could not validate the product slug.",
        },
        { status: 500 }
      );
    }

    if (existingProduct) {
      return NextResponse.json(
        {
          error:
            "A product with this URL slug already exists.",
        },
        { status: 409 }
      );
    }

    // -----------------------------
    // Validate category
    // -----------------------------

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
          error:
            "Selected category does not exist.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Insert product
    // -----------------------------

    const {
      data: product,
      error: insertError,
    } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        category_id: categoryId,
        short_description:
          shortDescription || null,
        description,
        image,
        keywords,
        is_active: isActive,

        // Wholesale
        price,
        offer_name: offerName,
        offer_price: offerPrice,

        // Retail
        retail_enabled: retailEnabled,
        retail_price: retailPrice,
        retail_offer_price: retailOfferPrice,
        stock_quantity: stockQuantity,
        sku,
        is_featured: isFeatured,
      })
      .select()
      .single();

    if (insertError) {
      console.error(
        "Product insert failed:",
        insertError
      );

      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    // -----------------------------
    // Size relations
    // -----------------------------

    if (sizeIds.length > 0) {
      const { error: sizeInsertError } =
        await supabase
          .from("product_size_relations")
          .insert(
            sizeIds.map((sizeId) => ({
              product_id: product.id,
              size_id: sizeId,
            }))
          );

      if (sizeInsertError) {
        console.error(
          "Product size relationships insertion failed:",
          sizeInsertError
        );

        return NextResponse.json(
          { error: sizeInsertError.message },
          { status: 500 }
        );
      }
    }

    if (retailEnabled && sizeIds.length > 0) {
      const { error: sizeStockInsertError } = await supabase
        .from("product_size_stock")
        .insert(
          sizeIds.map((sizeId) => ({
            product_id: product.id,
            size_id: sizeId,
            stock_quantity: sizeStocks[sizeId],
          }))
        );

      if (sizeStockInsertError) {
        console.error(
          "Product size stock insertion failed:",
          sizeStockInsertError
        );

        return NextResponse.json(
          { error: sizeStockInsertError.message },
          { status: 500 }
        );
      }
    }

    // -----------------------------
    // Style relations
    // -----------------------------

    if (styleIds.length > 0) {
      const { error: styleInsertError } =
        await supabase
          .from("product_style_relations")
          .insert(
            styleIds.map((styleId) => ({
              product_id: product.id,
              style_id: styleId,
            }))
          );

      if (styleInsertError) {
        console.error(
          "Product style relationships insertion failed:",
          styleInsertError
        );

        return NextResponse.json(
          { error: styleInsertError.message },
          { status: 500 }
        );
      }
    }

    // -----------------------------
    // Material relations
    // -----------------------------

    if (materialIds.length > 0) {
      const { error: materialInsertError } =
        await supabase
          .from("product_material_relations")
          .insert(
            materialIds.map((materialId) => ({
              product_id: product.id,
              material_id: materialId,
            }))
          );

      if (materialInsertError) {
        console.error(
          "Product material relationships insertion failed:",
          materialInsertError
        );

        return NextResponse.json(
          { error: materialInsertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create product error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while creating the product.",
      },
      { status: 500 }
    );
  }
}