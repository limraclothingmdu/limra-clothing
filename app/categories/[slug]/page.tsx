import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";

import {
  getCategoryBySlug,
} from "@/lib/categories";

import {
  getProductsByCategory,
} from "@/lib/products";

import ProductCard from "@/components/products/ProductCard";
import { siteConfig } from "@/lib/site";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const canonicalUrl = `${siteConfig.url}/categories/${category.slug}`;
  const openGraphImages = category.image
    ? [
        {
          url: category.image,
          alt: category.name,
        },
      ]
    : undefined;

  return {
    title: `${category.name} Wholesale in Madurai`,
    description: `${category.description} Wholesale and retail distribution across Tamil Nadu.`,
    keywords: category.keywords,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title: `${category.name} Wholesale | ${siteConfig.name}`,
      description: category.description,
      url: canonicalUrl,
      type: "website",
      ...(openGraphImages ? { images: openGraphImages } : {}),
    },
  };
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = await getProductsByCategory(
  category.id
);

  const categoryUrl = `${siteConfig.url}/categories/${category.slug}`;
  const categoryImage =
    category.image ?? "/images/categories/mens-shirts.jpg";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Categories",
        item: `${siteConfig.url}/categories`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: categoryUrl,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${categoryUrl}/#collection`,
    name: `${category.name} Wholesale`,
    description: category.description,
    url: categoryUrl,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      "@type": "Thing",
      name: category.name,
    },
  };

  return (
    <main className="bg-[#F8F8F8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      <section className="bg-[#081A4A]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-white/50"
          >
            <Link
              href="/"
              className="transition-colors hover:text-[#C89B3C]"
            >
              Home
            </Link>

            <span className="mx-2">/</span>

            <Link
              href="/categories"
              className="transition-colors hover:text-[#C89B3C]"
            >
              Categories
            </Link>

            <span className="mx-2">/</span>

            <span className="text-white/80">
              {category.name}
            </span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                Wholesale Collection
              </p>

              <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                {category.name}
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                {category.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                    `Hello, I'm interested in your ${category.name} wholesale collection.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3 text-sm font-bold text-[#081A4A]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enquire on WhatsApp
                </a>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[#C89B3C] hover:text-[#C89B3C]"
                >
                  All Products
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
              <Image
                src={categoryImage}
                alt={`${category.name} at Limra Clothing`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              {category.name}
            </p>

            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
              Products in This Category
            </h2>

            <p className="mt-3 text-sm text-[#222]/55">
              {categoryProducts.length}{" "}
              {categoryProducts.length === 1
                ? "product"
                : "products"}{" "}
              currently listed.
            </p>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-10 text-center">
              <h3 className="font-serif text-2xl font-semibold text-[#081A4A]">
                Products Coming Soon
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#222]/55">
                Products in this category will be added to the
                collection soon. Contact us for current wholesale
                availability.
              </p>

              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3 text-sm font-bold text-[#081A4A]"
              >
                <MessageCircle className="h-4 w-4" />
                Contact Us
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-[#081A4A]/10 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#081A4A]"
          >
            <ArrowLeft className="h-4 w-4 text-[#C89B3C]" />
            Browse All Categories
          </Link>
        </div>
      </section>
    </main>
  );
}