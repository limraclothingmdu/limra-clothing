import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogContent from "@/components/blog/BlogContent";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/blog";
import { getRetailProducts } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";
import { siteConfig } from "@/lib/site";
import { safeJsonLdStringify } from "@/lib/schema";

type BlogPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Article Not Found | Limra Clothing",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${siteConfig.url}/blog/${blog.slug}`;

  return {
   title:
  blog.seo_title ||
  `${blog.title} | ${siteConfig.name}`,

description:
  blog.seo_description ||
  blog.excerpt ||
  `Read ${blog.title} from ${siteConfig.name}.`,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "article",
      title: blog.title,
      description:
  blog.seo_description ||
  blog.excerpt ||
  `Read ${blog.title} from ${siteConfig.name}.`,

      ...(blog.featured_image
        ? {
            images: [
              {
                url: blog.featured_image,
                alt: blog.title,
              },
            ],
          }
        : {}),
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogArticlePage({
  params,
}: BlogPageProps) {
  const { slug } = await params;

  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const [retailProducts, publishedBlogs] = await Promise.all([
    getRetailProducts(),
    getPublishedBlogs(),
  ]);

  const featuredProducts = retailProducts.slice(0, 4);
  const recentBlogs = publishedBlogs
    .filter((item) => item.slug !== blog.slug)
    .slice(0, 3);

  const articleUrl = `${siteConfig.url}/blog/${blog.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",

    "@id": `${articleUrl}/#article`,

    headline: blog.title,

    description:
      blog.excerpt ??
      blog.title,

    url: articleUrl,

    datePublished: blog.published_at,
    dateModified: blog.updated_at ?? blog.published_at,

    author: {
      "@type": "Organization",
      name: blog.author ?? siteConfig.name,
      url: siteConfig.url,
    },

    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },

    ...(blog.featured_image
      ? {
          image: [blog.featured_image],
        }
      : {}),
  };

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
        name: "Blog",
        item: `${siteConfig.url}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(articleSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(breadcrumbSchema),
        }}
      />

      <article className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-[#222]/50"
          >
            <Link
              href="/"
              className="hover:text-[#C89B3C]"
            >
              Home
            </Link>

            <span className="mx-2">/</span>

            <Link
              href="/blog"
              className="hover:text-[#C89B3C]"
            >
              Blog
            </Link>

            <span className="mx-2">/</span>

            <span className="text-[#081A4A]">
              {blog.title}
            </span>
          </nav>

          {blog.category && (
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              {blog.category}
            </p>
          )}

          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#081A4A] sm:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-6 text-lg leading-8 text-[#222]/60">
              {blog.excerpt}
            </p>
          )}

          {blog.published_at && (
            <p className="mt-5 text-sm text-[#222]/45">
              Published{" "}
              {new Date(blog.published_at).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
          )}

          {blog.featured_image && (
            <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl bg-[#EDEDED]">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <section
            aria-labelledby="wholesale-enquiry-heading"
            className="my-10 rounded-3xl border border-[#C89B3C]/30 bg-[#081A4A] p-6 text-white sm:p-8"
          >
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C89B3C]">
              For Retailers & Bulk Buyers
            </p>

            <h2
              id="wholesale-enquiry-heading"
              className="mt-3 font-serif text-2xl font-semibold leading-tight sm:text-3xl"
            >
              Looking for Wholesale Garments in Madurai?
            </h2>

            <p className="mt-4 leading-7 text-white/80">
              Explore men's shirts and ladies' wear for your shop. Contact
              Limra Clothing to enquire about available designs, sizes,
              wholesale pricing, and bulk-order options.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                  `Hello Limra Clothing, I read your blog "${blog.title}" and would like to enquire about wholesale garments. Blog: ${articleUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#C89B3C] px-6 py-3 text-center font-bold text-[#081A4A] transition hover:bg-[#D8B45D]"
              >
                Enquire on WhatsApp
              </a>

              <Link
                href="/products/wholesale"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Explore Wholesale
              </Link>
            </div>

            <p className="mt-4 text-xs leading-5 text-white/60">
              Mention your product requirements and approximate quantity
              to help us guide your enquiry.
            </p>
          </section>
          <div className="mt-12 whitespace-pre-line text-base leading-8 text-[#222]/75 sm:text-lg">
            <BlogContent content={blog.content ?? ""} />
          </div>

          <div className="mt-12 border-t border-[#081A4A]/10 pt-8">
            <Link
              href="/blog"
              className="font-bold text-[#081A4A] hover:text-[#C89B3C]"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </article>
      <section
        aria-labelledby="related-products-heading"
        className="bg-[#F8F6F1] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                Shop Limra Clothing
              </p>
              <h2
                id="related-products-heading"
                className="mt-2 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl"
              >
                Products You May Like
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-[#222]/65">
                Explore our available clothing collection for your wardrobe,
                family, or business.
              </p>
            </div>
            <Link
              href="/retail/products"
              className="font-bold text-[#081A4A] hover:text-[#C89B3C]"
            >
              View All Products →
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  hrefPrefix="/retail/products"
                  priceType="retail"
                />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 text-[#222]/65">
              Our retail collection is being updated. Visit the retail page
              to explore Limra Clothing.
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/retail"
              className="rounded-full bg-[#081A4A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#C89B3C]"
            >
              Shop Retail
            </Link>
            <Link
              href="/wholesale"
              className="rounded-full border border-[#081A4A]/20 px-6 py-3 text-sm font-semibold text-[#081A4A] transition hover:border-[#C89B3C]"
            >
              Wholesale Enquiries
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="recent-blogs-heading"
        className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Keep Exploring
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <h2
              id="recent-blogs-heading"
              className="font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl"
            >
              Recent Blogs
            </h2>
            <Link
              href="/blog"
              className="font-bold text-[#081A4A] hover:text-[#C89B3C]"
            >
              Explore All Articles →
            </Link>
          </div>

          {recentBlogs.length > 0 ? (
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {recentBlogs.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link
                    href={`/blog/${item.slug}`}
                    className="block h-full"
                  >
                    {item.featured_image && (
                      <div className="aspect-[16/9] overflow-hidden bg-[#EDEDED]">
                        <img
                          src={item.featured_image}
                          alt={item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {item.category && (
                        <p className="text-xs font-bold uppercase tracking-wider text-[#C89B3C]">
                          {item.category}
                        </p>
                      )}
                      <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-[#081A4A]">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#222]/65">
                          {item.excerpt}
                        </p>
                      )}
                      <span className="mt-4 inline-block text-sm font-bold text-[#081A4A]">
                        Read Article →
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-[#222]/65">
              More articles are coming soon. Visit our blog for the latest posts.
            </p>
          )}
        </div>
      </section>

      <section className="bg-[#081A4A] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
              Get to Know Limra Clothing
            </h2>
            <p className="mt-2 max-w-2xl leading-7 text-white/75">
              Discover our clothing business, explore our collection, or contact
              us about your retail and bulk garment requirements.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/about"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#081A4A] hover:bg-[#F8F6F1]"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/50 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}