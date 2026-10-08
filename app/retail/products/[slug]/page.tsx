import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { notFound } from "next/navigation";

import RetailProductPurchase from "@/components/retail/RetailProductPurchase";
import { getCategoryById } from "@/lib/categories";
import { getProductBySlug } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";
import { createBreadcrumbSchema } from "@/lib/schema";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ProductAttribute = {
  id: string;
  name: string;
  slug: string;
};

type RetailSize = ProductAttribute & {
  stock_quantity: number;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product || !product.retail_enabled) {
    return {
      title: "Product Not Found | Limra Clothing",
      description:
        "The requested retail product could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl =
    `${siteConfig.url}/retail/products/${product.slug}`;

  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${siteConfig.url}${product.image}`
    : undefined;

  const title =
    `${product.name} | Retail Clothing in Madurai | ${siteConfig.name}`;

  const description =
    product.short_description ??
    product.description ??
    `Shop ${product.name} from ${siteConfig.name} in Madurai.`;

  return {
    title,
    description,
    keywords: product.keywords ?? [],

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: siteConfig.name,
      title,
      description,
      url: canonicalUrl,

      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 1500,
                alt: `${product.name} from ${siteConfig.name}`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl
        ? {
            images: [imageUrl],
          }
        : {}),
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RetailProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product || !product.retail_enabled) {
    notFound();
  }

  const supabase = await createClient();

  const [
    sizeRelationsResult,
    styleRelationsResult,
    materialRelationsResult,
    stockResult,
  ] = await Promise.all([
    supabase
      .from("product_size_relations")
      .select("size_id")
      .eq("product_id", product.id),

    supabase
      .from("product_style_relations")
      .select("style_id")
      .eq("product_id", product.id),

    supabase
      .from("product_material_relations")
      .select("material_id")
      .eq("product_id", product.id),

    supabase
      .from("product_size_stock")
      .select(
        "size_id, stock_quantity"
      )
      .eq("product_id", product.id),
  ]);

  if (sizeRelationsResult.error) {
    console.error(
      "Retail product size relationships lookup failed:",
      sizeRelationsResult.error
    );
  }

  if (styleRelationsResult.error) {
    console.error(
      "Retail product style relationships lookup failed:",
      styleRelationsResult.error
    );
  }

  if (materialRelationsResult.error) {
    console.error(
      "Retail product material relationships lookup failed:",
      materialRelationsResult.error
    );
  }

  if (stockResult.error) {
    console.error(
      "Retail product size stock lookup failed:",
      stockResult.error
    );
  }

  const sizeIds =
    sizeRelationsResult.data?.map(
      (relation: { size_id: string }) =>
        relation.size_id
    ) ?? [];

  const styleIds =
    styleRelationsResult.data?.map(
      (relation: { style_id: string }) =>
        relation.style_id
    ) ?? [];

  const materialIds =
    materialRelationsResult.data?.map(
      (relation: { material_id: string }) =>
        relation.material_id
    ) ?? [];

  const stockMap = new Map(
    (stockResult.data ?? []).map(
      (item: {
        size_id: string;
        stock_quantity: number;
      }) => [
        item.size_id,
        item.stock_quantity,
      ]
    )
  );

  const [
    sizesResult,
    stylesResult,
    materialsResult,
  ] = await Promise.all([
    sizeIds.length > 0
      ? supabase
          .from("product_sizes")
          .select("id, name, slug")
          .in("id", sizeIds)
      : Promise.resolve({
          data: [],
          error: null,
        }),

    styleIds.length > 0
      ? supabase
          .from("product_styles")
          .select("id, name, slug")
          .in("id", styleIds)
      : Promise.resolve({
          data: [],
          error: null,
        }),

    materialIds.length > 0
      ? supabase
          .from("product_materials")
          .select("id, name, slug")
          .in("id", materialIds)
      : Promise.resolve({
          data: [],
          error: null,
        }),
  ]);

  const sizes: RetailSize[] =
    (sizesResult.data ?? []).map(
      (size: ProductAttribute) => ({
        ...size,
        stock_quantity:
          stockMap.get(size.id) ?? 0,
      })
    );

  const styles: ProductAttribute[] =
    stylesResult.data ?? [];

  const materials: ProductAttribute[] =
    materialsResult.data ?? [];

  const category = product.category_id
    ? await getCategoryById(
        product.category_id
      )
    : null;

  const productUrl =
    `${siteConfig.url}/retail/products/${product.slug}`;

  const productImage =
    product.image ??
    "/images/products/mens-casual-shirt.jpg";

  const imageUrl = productImage.startsWith(
    "http"
  )
    ? productImage
    : `${siteConfig.url}${productImage}`;

  const sellingPrice =
    product.retail_offer_price ??
    product.retail_price;

  const totalStock = sizes.reduce(
    (total, size) =>
      total + size.stock_quantity,
    0
  );

  const availability =
    totalStock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock";

  const breadcrumbSchema =
    createBreadcrumbSchema([
      {
        name: "Home",
        url: siteConfig.url,
      },
      {
        name: "Retail",
        url: `${siteConfig.url}/retail`,
      },
      {
        name: "Products",
        url: `${siteConfig.url}/retail/products`,
      },
      {
        name: product.name,
        url: productUrl,
      },
    ]);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}/#product`,

    name: product.name,

    description:
      product.description ??
      product.short_description ??
      "",

    image: [imageUrl],

    url: productUrl,

    category:
      category?.name ??
      product.category_id ??
      "Clothing",

    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },

    manufacturer: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },

    ...(product.sku
      ? {
          sku: product.sku,
        }
      : {}),

    ...(sellingPrice !== null
      ? {
          offers: {
            "@type": "Offer",
            url: productUrl,
            priceCurrency: "INR",
            price: sellingPrice,
            availability,
            seller: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
            },
          },
        }
      : {}),
  };

  return (
    <main>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              breadcrumbSchema
            ),
        }}
      />

      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              productSchema
            ),
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 text-sm text-[#222]/50"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[#C89B3C]"
          >
            Home
          </Link>

          <span className="mx-2">/</span>

          <Link
            href="/retail"
            className="transition-colors hover:text-[#C89B3C]"
          >
            Retail
          </Link>

          <span className="mx-2">/</span>

          <Link
            href="/retail/products"
            className="transition-colors hover:text-[#C89B3C]"
          >
            Products
          </Link>

          <span className="mx-2">/</span>

          <span className="text-[#081A4A]">
            {product.name}
          </span>
        </nav>

        {/* Back Link */}
        <Link
          href="/retail/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Retail Products
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
          {/* Product Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#081A4A]/10 bg-white shadow-lg shadow-[#081A4A]/10">
            <Image
              src={productImage}
              alt={`${product.name} retail clothing from Limra Clothing Madurai`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Product Information */}
          <div>
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              <ShoppingBag className="h-4 w-4" />
              Retail Collection
            </p>

            <h1 className="mt-4 font-serif text-4xl font-semibold text-[#081A4A] sm:text-5xl">
              {product.name}
            </h1>

            {/* SKU */}
            {product.sku && (
              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-[#222]/45">
                SKU: {product.sku}
              </p>
            )}

            {/* Pricing */}
            {sellingPrice !== null && (
              <div className="mt-5 flex flex-col gap-1">
                {product.retail_offer_price !==
                  null &&
                  product.retail_price !==
                    null && (
                    <>
                      {product.offer_name && (
                        <span className="text-sm font-bold uppercase tracking-wide text-[#C89B3C]">
                          {product.offer_name}
                        </span>
                      )}

                      <p className="mt-3 text-sm font-semibold text-[#222]/65">
                        {product.retail_free_shipping
                          ? "Free Shipping"
                          : `Shipping: ₹${Number(product.retail_shipping_charge ?? 0)}`}
                      </p>

                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-[#081A4A]">
                          ₹
                          {
                            product.retail_offer_price
                          }
                        </span>

                        <span className="text-lg text-[#222]/50 line-through">
                          ₹
                          {
                            product.retail_price
                          }
                        </span>
                      </div>
                    </>
                  )}

                {product.retail_offer_price ===
                  null &&
                  product.retail_price !==
                    null && (
                    <span className="text-2xl font-bold text-[#081A4A]">
                      ₹{product.retail_price}
                    </span>
                  )}
              </div>
            )}

            <p className="mt-6 text-base leading-8 text-[#222]/65">
              {product.description}
            </p>

            {/* Category */}
            {category && (
              <div className="mt-6">
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-sm font-semibold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
                >
                  Category: {category.name}
                </Link>
              </div>
            )}

            {/* Product Attributes */}
            {(styles.length > 0 ||
              materials.length > 0) && (
              <div className="mt-8 space-y-6">
                {/* Styles */}
                {styles.length > 0 && (
                  <div>
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#081A4A]">
                      Style
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {styles.map((style) => (
                        <span
                          key={style.id}
                          className="rounded-full border border-[#081A4A]/15 bg-white px-4 py-2 text-sm font-medium text-[#081A4A]"
                        >
                          {style.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {materials.length > 0 && (
                  <div>
                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#081A4A]"
                    >
                      Material
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {materials.map(
                        (material) => (
                          <span
                            key={material.id}
                            className="rounded-full border border-[#081A4A]/15 bg-white px-4 py-2 text-sm font-medium text-[#081A4A]"
                          >
                            {material.name}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Retail Purchase */}
            <RetailProductPurchase
  productId={product.id}
  productSlug={product.slug}
  productName={product.name}
  productImage={product.image}
  sku={product.sku ?? null}
  sizes={sizes}
  price={product.retail_price ?? null}
  offerPrice={product.retail_offer_price ?? null}
  shippingCharge={
    product.retail_free_shipping
      ? 0
      : Number(product.retail_shipping_charge ?? 0)
  }
  
/>

            {/* Stock Summary */}
            <div className="mt-6 rounded-2xl border border-[#081A4A]/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#081A4A]">
                Availability
              </p>

              <p className="mt-2 text-sm leading-7 text-[#222]/60">
                {totalStock > 0
                  ? "This product is currently available in selected sizes."
                  : "This product is currently out of stock."}
              </p>
            </div>

            {/* Business Coverage */}
            <div className="mt-6 rounded-2xl bg-[#081A4A] p-6 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
                Limra Clothing
              </p>

              <p className="mt-2 text-sm leading-7 text-white/65">
                Retail clothing available from
                Limra Clothing in Madurai.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}