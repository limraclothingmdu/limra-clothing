"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Blog = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;

  google_business_post: {
    sync_status: "pending" | "synced" | "failed" | "deleted";
    last_synced_at: string | null;
    last_attempt_at: string | null;
    last_error: string | null;
  } | null;
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [publishing, setPublishing] = useState<string | null>(null);
    function getGoogleStatus(blog: Blog) {
    if (!blog.is_published) {
      return {
        label: "Not published",
        className: "bg-gray-100 text-gray-600",
      };
    }

    const status = blog.google_business_post?.sync_status;

    switch (status) {
      case "synced":
        return {
          label: "Google Synced",
          className: "bg-green-100 text-green-700",
        };

      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-100 text-yellow-700",
        };

      case "failed":
        return {
          label: "Failed",
          className: "bg-red-100 text-red-700",
        };

      case "deleted":
        return {
          label: "Deleted on Google",
          className: "bg-gray-100 text-gray-600",
        };

      default:
        return {
          label: "Not submitted",
          className: "bg-gray-100 text-gray-600",
        };
    }
  }

  async function loadBlogs() {
    const response = await fetch("/api/admin/blogs", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to load blogs");
    }

    return response.json();
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchBlogs() {
      try {
        const data = await loadBlogs();

        if (cancelled) return;

        setBlogs(data);
      } catch (error) {
        if (cancelled) return;

        console.error(error);
        alert("Failed to load blogs.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchBlogs();

    return () => {
      cancelled = true;
    };
  }, []);

  async function deleteBlog(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmed) return;

    setDeleting(id);

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete blog");
      }

      setBlogs((current) =>
        current.filter((blog) => blog.id !== id)
      );
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete blog."
      );
    } finally {
      setDeleting(null);
    }
  }
async function publishToGoogle(id: string) {
  const confirmed = window.confirm(
    "Publish this article to Google Business Profile?"
  );

  if (!confirmed) return;

  setPublishing(id);

  try {
    const response = await fetch(
      `/api/admin/blogs/${id}/publish-google`,
      {
        method: "POST",
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || data.error || "Google publishing failed."
      );
    }

    alert(data.message || "Successfully published to Google.");

    const updatedBlogs = await loadBlogs();
    setBlogs(updatedBlogs);
  } catch (error) {
    console.error("Google publishing error:", error);

    alert(
      error instanceof Error
        ? error.message
        : "Unable to publish to Google."
    );

    // Refresh even after failure because a tracking record
    // may have been created.
    try {
      const updatedBlogs = await loadBlogs();
      setBlogs(updatedBlogs);
    } catch (refreshError) {
      console.error("Blog refresh error:", refreshError);
    }
  } finally {
    setPublishing(null);
  }
}
  return (
    <main className="p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#081A4A]">
              Blogs
            </h1>

            <p className="mt-1 text-sm text-[#222]/60">
              Manage SEO articles and clothing insights.
            </p>
          </div>

          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#081A4A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d286b]"
          >
            <Plus className="h-4 w-4" />
            Add Blog
          </Link>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-center text-sm text-[#222]/50">
              Loading blogs...
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-xl font-semibold text-[#081A4A]">
                No blogs yet
              </h2>

              <p className="mt-2 text-sm text-[#222]/50">
                Create your first SEO article.
              </p>

              <Link
                href="/admin/blogs/new"
                className="mt-5 inline-flex rounded-xl bg-[#081A4A] px-5 py-3 text-sm font-bold text-white"
              >
                Create Blog
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#081A4A]/10 bg-[#F8F9FC] text-left text-xs uppercase tracking-wide text-[#222]/50">
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Google Business</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {blogs.map((blog) => (
                      <tr
                        key={blog.id}
                        className="border-b border-[#081A4A]/5 last:border-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold text-[#081A4A]">
                            {blog.title}
                          </p>

                          <p className="mt-1 text-xs text-[#222]/40">
                            /blog/{blog.slug}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-sm text-[#222]/60">
                          {blog.category || "—"}
                        </td>

                        <td className="px-6 py-5">
  <span
    className={`rounded-full px-3 py-1 text-xs font-bold ${
      blog.is_published
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-600"
    }`}
  >
    {blog.is_published ? "Published" : "Draft"}
  </span>
</td>
                        <td className="px-6 py-5">
  {(() => {
    const googleStatus = getGoogleStatus(blog);

    return (
      <div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${googleStatus.className}`}
        >
          {googleStatus.label}
        </span>

        {blog.google_business_post?.last_error && (
          <p className="mt-2 max-w-xs text-xs text-red-600">
            {blog.google_business_post.last_error}
          </p>
        )}
      </div>
    );
  })()}
</td>

                        <td className="px-6 py-5 text-sm text-[#222]/50">
                          {blog.published_at
                            ? new Date(
                                blog.published_at
                              ).toLocaleDateString("en-IN")
                            : "—"}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            {blog.is_published && !blog.google_business_post && (
  <button
    type="button"
    disabled={publishing === blog.id}
    onClick={() => publishToGoogle(blog.id)}
    className="rounded-lg bg-[#081A4A] px-3 py-2 text-xs font-bold text-white hover:bg-[#0d286b] disabled:opacity-50"
  >
    {publishing === blog.id ? "Publishing..." : "Publish to Google"}
  </button>
)}
                            <Link
                              href={`/admin/blogs/${blog.id}/edit`}
                              className="rounded-lg border border-[#081A4A]/10 p-2 text-[#081A4A] hover:bg-[#F8F9FC]"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              disabled={deleting === blog.id}
                              onClick={() =>
                                deleteBlog(blog.id)
                              }
                              className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-[#081A4A]/5 md:hidden">
                {blogs.map((blog) => (
                  <div key={blog.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="font-semibold text-[#081A4A]">
                          {blog.title}
                        </h2>

                        <p className="mt-1 break-all text-xs text-[#222]/40">
                          /blog/{blog.slug}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                          blog.is_published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {blog.is_published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>
                      <div className="mt-4">
  {(() => {
    const googleStatus = getGoogleStatus(blog);

    return (
      <div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${googleStatus.className}`}
        >
          Google: {googleStatus.label}
        </span>

        {blog.google_business_post?.last_error && (
          <p className="mt-2 text-xs text-red-600">
            {blog.google_business_post.last_error}
          </p>
        )}
      </div>
    );
  })()}
</div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-[#222]/50">
                        {blog.category || "Uncategorized"}
                      </div>

                      <div className="flex gap-2">
                        {blog.is_published && !blog.google_business_post && (
  <button
    type="button"
    disabled={publishing === blog.id}
    onClick={() => publishToGoogle(blog.id)}
    className="rounded-lg bg-[#081A4A] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
  >
    {publishing === blog.id ? "Publishing..." : "Publish to Google"}
  </button>
)}
                        <Link
                          href={`/admin/blogs/${blog.id}/edit`}
                          className="rounded-lg border border-[#081A4A]/10 p-2"
                        >
                          <Pencil className="h-4 w-4 text-[#081A4A]" />
                        </Link>

                        <button
                          type="button"
                          disabled={deleting === blog.id}
                          onClick={() =>
                            deleteBlog(blog.id)
                          }
                          className="rounded-lg border border-red-200 p-2 text-red-600 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}