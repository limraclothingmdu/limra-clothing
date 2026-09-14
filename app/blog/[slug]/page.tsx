import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getBlogBySlug } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

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
          __html: JSON.stringify(articleSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
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

          <div className="mt-12 whitespace-pre-line text-base leading-8 text-[#222]/75 sm:text-lg">
            {blog.content}
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
    </main>
  );
}