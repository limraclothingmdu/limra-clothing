"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function NewBlogPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("Limra Clothing");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] =
    useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(slugify(value));
    }
  }

  async function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        "/api/admin/blogs/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Image upload failed"
        );
      }

      setFeaturedImage(data.url);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Image upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }

    if (!slug.trim()) {
      alert("Please enter a slug.");
      return;
    }

    if (!content.trim()) {
      alert("Please enter the article content.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          featured_image: featuredImage,
          category,
          keywords: keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          author,
          is_published: isPublished,
          published_at: isPublished
            ? new Date().toISOString()
            : null,
          seo_title: seoTitle,
          seo_description: seoDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create blog"
        );
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create blog"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/admin/blogs"
            className="text-sm font-semibold text-[#081A4A] hover:text-[#C89B3C]"
          >
            ← Back to Blogs
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-[#081A4A]">
            Add Blog
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#081A4A]">
              Article Details
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Title *
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    handleTitleChange(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                  placeholder="Wholesale Clothing in Madurai: A Retailer's Guide"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Slug *
                </label>

                <input
                  value={slug}
                  onChange={(e) =>
                    setSlug(slugify(e.target.value))
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                  placeholder="wholesale-clothing-in-madurai"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Excerpt
                </label>

                <textarea
                  value={excerpt}
                  onChange={(e) =>
                    setExcerpt(e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                  placeholder="Short description shown on the blog listing page and search results."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Content *
                </label>

                <textarea
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  rows={20}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm leading-7 outline-none focus:border-[#081A4A]"
                  placeholder="Write the complete article here..."
                />

                <p className="mt-2 text-xs text-[#222]/45">
                  Plain text is supported. Line breaks will be
                  preserved on the public article page.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#081A4A]">
              SEO
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <input
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                  placeholder="Wholesale Clothing"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Keywords
                </label>

                <input
                  value={keywords}
                  onChange={(e) =>
                    setKeywords(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                  placeholder="wholesale clothing Madurai, garment wholesalers, clothing supplier"
                />

                <p className="mt-2 text-xs text-[#222]/45">
                  Separate keywords with commas.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  SEO Title
                </label>

                <input
                  value={seoTitle}
                  onChange={(e) =>
                    setSeoTitle(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                  placeholder="Wholesale Clothing in Madurai | Limra Clothing"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  SEO Description
                </label>

                <textarea
                  value={seoDescription}
                  onChange={(e) =>
                    setSeoDescription(e.target.value)
                  }
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                  placeholder="Learn how retailers can source wholesale clothing in Madurai..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#081A4A]">
              Featured Image
            </h2>

            <div className="mt-6">
              <input
                type="file"
                accept="image/*"
                onChange={uploadImage}
                disabled={uploading}
                className="block w-full text-sm"
              />

              {uploading && (
                <p className="mt-3 text-sm text-[#222]/50">
                  Uploading image...
                </p>
              )}

              {featuredImage && (
                <div className="mt-4 overflow-hidden rounded-xl border">
                  <img
                    src={featuredImage}
                    alt="Featured preview"
                    className="max-h-80 w-full object-cover"
                  />
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#081A4A]">
              Publishing
            </h2>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Author
                </label>

                <input
                  value={author}
                  onChange={(e) =>
                    setAuthor(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) =>
                    setIsPublished(e.target.checked)
                  }
                  className="h-5 w-5"
                />

                <span className="text-sm font-semibold">
                  Publish this article
                </span>
              </label>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/blogs"
              className="rounded-xl border border-[#081A4A]/10 px-6 py-3 text-center text-sm font-bold text-[#081A4A]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-xl bg-[#081A4A] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create Blog"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}