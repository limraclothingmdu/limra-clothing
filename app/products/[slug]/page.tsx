import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { createBreadcrumbSchema } from "@/lib/schema";
import { getProductBySlug } from "@/lib/products";
import { getCategoryById } from "@/lib/categories";
import { siteConfig } from "@/lib/site";


type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
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