import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type SizeStockInput = {
  size_id: string;
  stock_quantity: number;
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

const admin = await requireAdminApi();

if (!admin.authorized) {
  return NextResponse.json(
    { error: admin.error },
    { status: admin.status }
  );
}

const supabase = await createClient();

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // REQUEST BODY
    // --------------------------------------------------

    const body = await request.json();

    // --------------------------------------------------
    // ATTRIBUTE IDS
    // --------------------------------------------------

    const sizeIds: string[] = Array.isArray(body.size_ids)
      ? body.size_ids.filter(
          (id: unknown): id is string =>
            typeof id === "string" && id.trim().length > 0
        )
      : [];

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

    // --------------------------------------------------
    // SIZE-WISE STOCK
    // --------------------------------------------------

    const sizeStocks: SizeStockInput[] = Array.isArray(
  body.size_stocks
)
  ? body.size_stocks
      .filter(
        (item: unknown): item is {
          size_id: string;
          stock_quantity: number;
        } =>
          typeof item === "object" &&
          item !== null &&
          typeof (item as { size_id?: unknown }).size_id ===
            "string"
      )
      .map(
        (item: {
          size_id: string;
          stock_quantity: number;
        }) => ({
          size_id: item.size_id,
          stock_quantity: Number(item.stock_quantity),
        })
      )
  : [];

    // --------------------------------------------------
    // BASIC PRODUCT FIELDS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // WHOLESALE PRICING
    // --------------------------------------------------

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

    // --------------------------------------------------
    // RETAIL FIELDS
    // --------------------------------------------------

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

    const retailShippingCharge = Number(
      body.retail_shipping_charge ?? 0
    );
    const retailFreeShipping =
      typeof body.retail_free_shipping === "boolean"
        ? body.retail_free_shipping
        : false;
    const retailStock = Number(body.retail_stock ?? 0);

    const sku =
      typeof body.sku === "string" &&
      body.sku.trim()
        ? body.sku.trim().toUpperCase()
        : null;

    const isFeatured =
      retailEnabled &&
      typeof body.is_featured === "boolean"
        ? body.is_featured
        : false;

    // --------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------

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

    // --------------------------------------------------
    // WHOLESALE PRICE VALIDATION
    // --------------------------------------------------

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

    // --------------------------------------------------
    // RETAIL PRICE VALIDATION
    // --------------------------------------------------

    if (
      retailEnabled &&
      retailPrice === null
    ) {
      return NextResponse.json(
        {
          error:
            "Retail price is required when retail selling is enabled.",
        },
        { status: 400 }
      );
    }

    if (
      retailPrice !== null &&
      (!Number.isFinite(retailPrice) ||
        retailPrice < 0)
    ) {
      return NextResponse.json(
        {
          error: "Retail price cannot be negative.",
        },
        { status: 400 }
      );
    }

    if (
      retailOfferPrice !== null &&
      (!Number.isFinite(retailOfferPrice) ||
        retailOfferPrice < 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Retail offer price cannot be negative.",
        },
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
      retailEnabled &&
      (retailPrice === null ||
        !Number.isFinite(retailPrice) ||
        Number(retailPrice) <= 0)
    ) {
      return NextResponse.json(
        { error: "Retail price must be greater than zero." },
        { status: 400 }
      );
    }
    if (!Number.isFinite(retailShippingCharge) || retailShippingCharge < 0) {
      return NextResponse.json(
        { error: "Shipping charge must be zero or greater." },
        { status: 400 }
      );
    }
    if (!Number.isInteger(retailStock) || retailStock < 0) {
      return NextResponse.json(
        { error: "Retail stock must be a non-negative whole number." },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // RETAIL SIZE VALIDATION
    // --------------------------------------------------

    if (retailEnabled && sizeIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "At least one size is required for a retail product.",
        },
        { status: 400 }
      );
    }

    if (retailEnabled) {
      const uniqueSizeIds = new Set(
        sizeIds
      );

      if (
        uniqueSizeIds.size !== sizeIds.length
      ) {
        return NextResponse.json(
          {
            error:
              "Duplicate product sizes are not allowed.",
          },
          { status: 400 }
        );
      }

      const uniqueStockSizeIds = new Set(
        sizeStocks.map(
          (item) => item.size_id
        )
      );

      if (
        uniqueStockSizeIds.size !==
        sizeStocks.length
      ) {
        return NextResponse.json(
          {
            error:
              "Duplicate size stock entries are not allowed.",
          },
          { status: 400 }
        );
      }

      if (
        sizeStocks.length !==
        sizeIds.length
      ) {
        return NextResponse.json(
          {
            error:
              "Stock must be provided for every selected size.",
          },
          { status: 400 }
        );
      }

      for (const item of sizeStocks) {
        if (
          !sizeIds.includes(
            item.size_id
          )
        ) {
          return NextResponse.json(
            {
              error:
                "Size stock contains a size that is not selected.",
            },
            { status: 400 }
          );
        }

        if (
          !Number.isInteger(
            item.stock_quantity
          ) ||
          item.stock_quantity < 0
        ) {
          return NextResponse.json(
            {
              error:
                "Size stock must be a whole number greater than or equal to 0.",
            },
            { status: 400 }
          );
        }
      }
    }

    // --------------------------------------------------
    // CHECK PRODUCT EXISTS
    // --------------------------------------------------

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
          error:
            "Could not find the product.",
        },
        { status: 500 }
      );
    }

    if (!existingProduct) {
      return NextResponse.json(
        {
          error:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // CHECK DUPLICATE SLUG
    // --------------------------------------------------

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
          error:
            "Could not validate the product slug.",
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

    // --------------------------------------------------
    // VERIFY CATEGORY
    // --------------------------------------------------

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

    // --------------------------------------------------
    // UPDATE PRODUCT
    // --------------------------------------------------

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

        // Wholesale
        price,
        offer_name: offerName,
        offer_price: offerPrice,

        // Retail
        retail_enabled: retailEnabled,
        retail_price: retailEnabled
          ? retailPrice
          : null,
        retail_offer_price: retailEnabled
          ? retailOfferPrice
          : null,
        retail_shipping_charge:
          retailEnabled && !retailFreeShipping
            ? retailShippingCharge
            : 0,
        retail_free_shipping: retailEnabled
          ? retailFreeShipping
          : false,
        retail_stock: retailEnabled ? retailStock : 0,
        sku: retailEnabled
          ? sku
          : null,
        is_featured: retailEnabled
          ? isFeatured
          : false,

        updated_at:
          new Date().toISOString(),
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

    // --------------------------------------------------
    // UPDATE SIZE RELATIONS
    // --------------------------------------------------

    const {
      error: sizeDeleteError,
    } = await supabase
      .from("product_size_relations")
      .delete()
      .eq("product_id", product.id);

    if (sizeDeleteError) {
      console.error(
        "Product size relationships deletion failed:",
        sizeDeleteError
      );

      return NextResponse.json(
        {
          error:
            sizeDeleteError.message,
        },
        { status: 500 }
      );
    }

    if (sizeIds.length > 0) {
      const {
        error: sizeInsertError,
      } = await supabase
        .from("product_size_relations")
        .insert(
          sizeIds.map(
            (sizeId: string) => ({
              product_id:
                product.id,
              size_id: sizeId,
            })
          )
        );

      if (sizeInsertError) {
        console.error(
          "Product size relationships insertion failed:",
          sizeInsertError
        );

        return NextResponse.json(
          {
            error:
              sizeInsertError.message,
          },
          { status: 500 }
        );
      }
    }

    // --------------------------------------------------
    // UPDATE STYLE RELATIONS
    // --------------------------------------------------

    const {
      error: styleDeleteError,
    } = await supabase
      .from("product_style_relations")
      .delete()
      .eq("product_id", product.id);

    if (styleDeleteError) {
      console.error(
        "Product style relationships deletion failed:",
        styleDeleteError
      );

      return NextResponse.json(
        {
          error:
            styleDeleteError.message,
        },
        { status: 500 }
      );
    }

    if (styleIds.length > 0) {
      const {
        error: styleInsertError,
      } = await supabase
        .from("product_style_relations")
        .insert(
          styleIds.map(
            (styleId: string) => ({
              product_id:
                product.id,
              style_id: styleId,
            })
          )
        );

      if (styleInsertError) {
        console.error(
          "Product style relationships insertion failed:",
          styleInsertError
        );

        return NextResponse.json(
          {
            error:
              styleInsertError.message,
          },
          { status: 500 }
        );
      }
    }

    // --------------------------------------------------
    // UPDATE MATERIAL RELATIONS
    // --------------------------------------------------

    const {
      error: materialDeleteError,
    } = await supabase
      .from("product_material_relations")
      .delete()
      .eq("product_id", product.id);

    if (materialDeleteError) {
      console.error(
        "Product material relationships deletion failed:",
        materialDeleteError
      );

      return NextResponse.json(
        {
          error:
            materialDeleteError.message,
        },
        { status: 500 }
      );
    }

    if (materialIds.length > 0) {
      const {
        error: materialInsertError,
      } = await supabase
        .from("product_material_relations")
        .insert(
          materialIds.map(
            (materialId: string) => ({
              product_id:
                product.id,
              material_id:
                materialId,
            })
          )
        );

      if (materialInsertError) {
        console.error(
          "Product material relationships insertion failed:",
          materialInsertError
        );

        return NextResponse.json(
          {
            error:
              materialInsertError.message,
          },
          { status: 500 }
        );
      }
    }

    // --------------------------------------------------
    // UPDATE SIZE-WISE STOCK
    // --------------------------------------------------
    //
    // product_size_stock is the retail inventory
    // source of truth.
    //
    // We replace the existing rows with the
    // current selected sizes and stock values.
    //
    // If retail is disabled, all size stock rows
    // are removed to prevent stale inventory.
    // --------------------------------------------------

    const {
      error: sizeStockDeleteError,
    } = await supabase
      .from("product_size_stock")
      .delete()
      .eq("product_id", product.id);

    if (sizeStockDeleteError) {
      console.error(
        "Existing size stock deletion failed:",
        sizeStockDeleteError
      );

      return NextResponse.json(
        {
          error:
            sizeStockDeleteError.message,
        },
        { status: 500 }
      );
    }

    if (
      retailEnabled &&
      sizeStocks.length > 0
    ) {
      const sizeStockRows =
        sizeStocks.map((item) => ({
          product_id:
            product.id,
          size_id:
            item.size_id,
          stock_quantity:
            item.stock_quantity,
          updated_at:
            new Date().toISOString(),
        }));

      const {
        error: sizeStockInsertError,
      } = await supabase
        .from("product_size_stock")
        .insert(sizeStockRows);

      if (sizeStockInsertError) {
        console.error(
          "Size-wise stock insertion failed:",
          sizeStockInsertError
        );

        return NextResponse.json(
          {
            error:
              "Product was updated, but size-wise stock could not be saved.",
            details:
              sizeStockInsertError.message,
          },
          { status: 500 }
        );
      }
    }

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

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

    const admin = await requireAdminApi();

if (!admin.authorized) {
  return NextResponse.json(
    { error: admin.error },
    { status: admin.status }
  );
}

const supabase = await createClient();

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // CHECK PRODUCT EXISTS
    // --------------------------------------------------

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
          error:
            "Could not find the product.",
        },
        { status: 500 }
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          error:
            "Product not found.",
        },
        { status: 404 }
      );
    }

    // --------------------------------------------------
    // DELETE PRODUCT
    // --------------------------------------------------

    const {
      error: deleteError,
    } = await supabase
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
          error:
            deleteError.message,
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