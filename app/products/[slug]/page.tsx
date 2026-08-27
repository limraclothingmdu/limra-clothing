import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { createBreadcrumbSchema } from "@/lib/schema";
import { getProductBySlug } from "@/lib/products";
import { getCategoryById } from "@/lib/categories";
import { siteConfig } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

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

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  // Prevent search engines from indexing invalid product URLs
  if (!product) {
    return {
      title: "Product Not Found | Limra Clothing",
      description: "The requested product could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${siteConfig.url}/products/${product.slug}`;
const imageUrl = product.image
  ? product.image.startsWith("http")
    ? product.image
    : `${siteConfig.url}${product.image}`
  : undefined;

  const title = `${product.name} Wholesale in Madurai | ${siteConfig.name}`;

  const description =
    `${product.description} ` +
    `Wholesale and retail clothing distribution from Madurai across Tamil Nadu.`;

  return {
    title,
    description,

    keywords: product.keywords,

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
                alt: `${product.name} wholesale from ${siteConfig.name}`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const supabase = await createClient();

  const [sizeRelationsResult, styleRelationsResult, materialRelationsResult] =
    await Promise.all([
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
    ]);

  if (sizeRelationsResult.error) {
    console.error(
      "Product size relationships lookup failed:",
      sizeRelationsResult.error
    );
  }

  if (styleRelationsResult.error) {
    console.error(
      "Product style relationships lookup failed:",
      styleRelationsResult.error
    );
  }

  if (materialRelationsResult.error) {
    console.error(
      "Product material relationships lookup failed:",
      materialRelationsResult.error
    );
  }

  const sizeIds =
    sizeRelationsResult.data?.map(
      (relation: { size_id: string }) => relation.size_id
    ) ?? [];
  const styleIds =
    styleRelationsResult.data?.map(
      (relation: { style_id: string }) => relation.style_id
    ) ?? [];
  const materialIds =
    materialRelationsResult.data?.map(
      (relation: { material_id: string }) => relation.material_id
    ) ?? [];

  const [sizesResult, stylesResult, materialsResult] = await Promise.all([
    sizeIds.length > 0
      ? supabase
          .from("product_sizes")
          .select("id, name, slug")
          .in("id", sizeIds)
      : Promise.resolve({ data: [], error: null }),
    styleIds.length > 0
      ? supabase
          .from("product_styles")
          .select("id, name, slug")
          .in("id", styleIds)
      : Promise.resolve({ data: [], error: null }),
    materialIds.length > 0
      ? supabase
          .from("product_materials")
          .select("id, name, slug")
          .in("id", materialIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (sizesResult.error) {
    console.error(
      "Product sizes lookup failed:",
      sizesResult.error
    );
  }

  if (stylesResult.error) {
    console.error(
      "Product styles lookup failed:",
      stylesResult.error
    );
  }

  if (materialsResult.error) {
    console.error(
      "Product materials lookup failed:",
      materialsResult.error
    );
  }

  const sizes: ProductAttribute[] = sizesResult.error
    ? []
    : (sizesResult.data ?? []);
  const styles: ProductAttribute[] = stylesResult.error
    ? []
    : (stylesResult.data ?? []);
  const materials: ProductAttribute[] = materialsResult.error
    ? []
    : (materialsResult.data ?? []);

  const category = await getCategoryById(product.category_id);

  const productUrl = `${siteConfig.url}/products/${product.slug}`;
  const productImage =
    product.image ?? "/images/products/mens-casual-shirt.jpg";
const imageUrl = productImage.startsWith("http")
  ? productImage
  : `${siteConfig.url}${productImage}`;

  const breadcrumbSchema = createBreadcrumbSchema([
  {
    name: "Home",
    url: siteConfig.url,
  },
  {
    name: "Products",
    url: `${siteConfig.url}/products`,
  },
  {
    name: product.name,
    url: productUrl,
  },
]);

  const sellingPrice = product.offer_price ?? product.price;

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": `${productUrl}/#product`,

  name: product.name,

  description: product.description,

  image: [imageUrl],

  url: productUrl,

  category: category?.name ?? product.category_id,

  brand: {
    "@type": "Brand",
    name: siteConfig.name,
  },

  manufacturer: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },

  ...(sellingPrice !== null
    ? {
        offers: {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "INR",
          price: sellingPrice,
          availability: "https://schema.org/InStock",

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
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />

      {/* Product Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Breadcrumb Navigation */}
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
            href="/products"
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
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Product Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#EDEDED]">
            <Image
              src={productImage}
              alt={`${product.name} wholesale from Limra Clothing Madurai`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Product Information */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Wholesale Collection
            </p>

            <h1 className="mt-4 font-serif text-4xl font-semibold text-[#081A4A] sm:text-5xl">
              {product.name}
            </h1>

            {/* Pricing */}
            <div className="mt-4 flex flex-col gap-1">
              {product.offer_price && product.price ? (
                <>
                  {product.offer_name && (
                    <span className="text-sm font-bold text-[#C89B3C] uppercase tracking-wide">
                      {product.offer_name}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#081A4A]">
                      ₹{product.offer_price}
                    </span>
                    <span className="text-lg text-[#222]/50 line-through">
                      ₹{product.price}
                    </span>
                  </div>
                </>
              ) : product.price ? (
                <span className="text-2xl font-bold text-[#081A4A]">
                  ₹{product.price}
                </span>
              ) : null}
            </div>

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
            <p className="text-xs text-red-500">
  ATTRIBUTES VERSION 2
            </p>
            <div className="text-xs text-red-500">
  Sizes: {sizes.length} | Styles: {styles.length} | Materials: {materials.length}
</div>
            
            {/* Product Attributes */}
{(sizes.length > 0 ||
  styles.length > 0 ||
  materials.length > 0) && (
  <div className="mt-8 space-y-6">

    {/* Sizes */}
    {sizes.length > 0 && (
      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#081A4A]">
          Available Sizes
        </p>

        <div className="flex flex-wrap gap-2">
          {sizes.map((size: ProductAttribute) => (
            <span
              key={size.id}
              className="rounded-full border border-[#081A4A]/15 bg-white px-4 py-2 text-sm font-medium text-[#081A4A]"
            >
              {size.name}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Styles */}
    {styles.length > 0 && (
      <div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#081A4A]">
          Style
        </p>

        <div className="flex flex-wrap gap-2">
          {styles.map((style: ProductAttribute) => (
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
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-[#081A4A]">
          Material
        </p>

        <div className="flex flex-wrap gap-2">
          {materials.map((material: ProductAttribute) => (
            <span
              key={material.id}
              className="rounded-full border border-[#081A4A]/15 bg-white px-4 py-2 text-sm font-medium text-[#081A4A]"
            >
              {material.name}
            </span>
          ))}
        </div>
      </div>
    )}

  </div>
)}

            {/* Wholesale Enquiry */}
            <div className="mt-8 rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-[#081A4A]">
                Interested in this product?
              </p>

              <p className="mt-2 text-sm leading-6 text-[#222]/60">
                Contact Limra Clothing for wholesale availability,
                pricing, distribution and product details.
              </p>

              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                  `Hello, I'm interested in ${product.name} from Limra Clothing. Please share wholesale availability and pricing.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3 text-sm font-bold text-[#081A4A] transition-transform hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                Enquire on WhatsApp
              </a>
            </div>

            {/* Business Coverage */}
            <div className="mt-6 rounded-2xl bg-[#081A4A] p-6 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
                Distribution
              </p>

              <p className="mt-2 text-sm leading-7 text-white/65">
                Wholesale and retail clothing distribution from
                Madurai across Tamil Nadu.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}