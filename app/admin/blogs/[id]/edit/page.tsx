"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string | null;
  keywords: string[];
  author: string | null;
  is_published: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function loadBlog() {
      try {
        const response = await fetch(
          `/api/admin/blogs/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load blog"
          );
        }

        setBlog(data);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Failed to load blog"
        );
      } finally {
        setLoading(false);
      }
    }

    loadBlog();
  }, [id]);

  async function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !blog) return;

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

      setBlog({
        ...blog,
        featured_image: data.url,
      });
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

  async function saveBlog(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!blog) return;

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/blogs/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: blog.title,
            slug: slugify(blog.slug),
            excerpt: blog.excerpt,
            content: blog.content,
            featured_image: blog.featured_image,
            category: blog.category,
            keywords: blog.keywords,
            author: blog.author,
            is_published: blog.is_published,
            published_at: blog.is_published
              ? blog.published_at ||
                new Date().toISOString()
              : null,
            seo_title: blog.seo_title,
            seo_description: blog.seo_description,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update blog"
        );
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update blog"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          Loading blog...
        </div>
      </main>
    );
  }

  if (!blog) {
    return (
      <main className="p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          Blog not found.
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/blogs"
          className="text-sm font-semibold text-[#081A4A] hover:text-[#C89B3C]"
        >
          ← Back to Blogs
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-[#081A4A]">
          Edit Blog
        </h1>

        <form onSubmit={saveBlog} className="mt-8 space-y-6">
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
                  value={blog.title}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Slug *
                </label>

                <input
                  value={blog.slug}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      slug: slugify(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Excerpt
                </label>

                <textarea
                  value={blog.excerpt || ""}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      excerpt: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Content *
                </label>

                <textarea
                  value={blog.content}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      content: e.target.value,
                    })
                  }
                  rows={20}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm leading-7 outline-none focus:border-[#081A4A]"
                />
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
                  value={blog.category || ""}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Keywords
                </label>

                <input
                  value={blog.keywords.join(", ")}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      keywords: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  SEO Title
                </label>

                <input
                  value={blog.seo_title || ""}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      seo_title: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  SEO Description
                </label>

                <textarea
                  value={blog.seo_description || ""}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      seo_description: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
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
              />

              {uploading && (
                <p className="mt-3 text-sm text-[#222]/50">
                  Uploading...
                </p>
              )}

              {blog.featured_image && (
                <div className="mt-4 overflow-hidden rounded-xl border">
                  <img
                    src={blog.featured_image}
                    alt={blog.title}
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
                  value={blog.author || ""}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      author: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#081A4A]"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={blog.is_published}
                  onChange={(e) =>
                    setBlog({
                      ...blog,
                      is_published: e.target.checked,
                    })
                  }
                  className="h-5 w-5"
                />

                <span className="text-sm font-semibold">
                  Published
                </span>
              </label>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link
              href="/admin/blogs"
              className="rounded-xl border border-[#081A4A]/10 px-6 py-3 text-sm font-bold text-[#081A4A]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-xl bg-[#081A4A] px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}