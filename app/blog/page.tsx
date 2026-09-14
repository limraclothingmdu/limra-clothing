import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getPublishedBlogs } from "@/lib/blog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Clothing & Wholesale Insights | ${siteConfig.name}`,
  description:
    "Read clothing wholesale guides, garment sourcing tips, fashion retail insights and information about wholesale clothing in Madurai and Tamil Nadu.",
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();

  return (
    <main>
      <section className="bg-[#081A4A] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Limra Clothing Blog
          </p>

          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold sm:text-5xl lg:text-6xl">
            Clothing Wholesale & Retail Insights
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:text-lg">
            Practical guides for retailers, resellers and clothing
            businesses looking for wholesale garments in Madurai and
            across Tamil Nadu.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {blogs.length === 0 ? (
            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-10 text-center">
              <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
                Articles coming soon
              </h2>

              <p className="mt-3 text-[#222]/60">
                We are preparing useful clothing wholesale and retail
                guides for retailers and resellers.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <article
                  key={blog.id}
                  className="overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {blog.featured_image && (
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#EDEDED]">
                      <Image
                        src={blog.featured_image}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {blog.category && (
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
                        {blog.category}
                      </p>
                    )}

                    <h2 className="mt-3 font-serif text-2xl font-semibold text-[#081A4A]">
                      {blog.title}
                    </h2>

                    {blog.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#222]/60">
                        {blog.excerpt}
                      </p>
                    )}

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="mt-5 inline-flex font-bold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
                    >
                      Read Article →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}