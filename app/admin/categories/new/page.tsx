
"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewCategoryPage() {
  const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    image: "",
    keywords: "",
    is_active: true,
  });

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }
async function handleImageChange(
  file: File | null
) {
  if (!file) return;

  setUploadingImage(true);
  setError("");

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "/api/admin/categories/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to upload image."
      );
    }

    updateField("image", data.url);
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Image upload failed."
    );
  } finally {
    setUploadingImage(false);
  }
}
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            keywords: form.keywords
              .split(",")
              .map((keyword) => keyword.trim())
              .filter(Boolean),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to create category."
        );
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Link>

        <div className="mb-10 mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Limra Clothing
          </p>

          <h1 className="mt-3 font-serif text-4xl font-semibold text-[#081A4A]">
            Add New Category
          </h1>

          <p className="mt-3 text-[#222]/60">
            Create a new clothing category for your products.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8"
        >
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              Category Name *
            </label>

            <input
              id="name"
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              required
              placeholder="Girls' Wear"
              className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              URL Slug
            </label>

            <input
              id="slug"
              value={form.slug}
              onChange={(event) =>
                updateField("slug", event.target.value)
              }
              placeholder="girls-wear"
              className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
            />

            <p className="mt-2 text-xs text-[#222]/50">
              Leave empty to generate automatically.
            </p>
          </div>

          <div>
            <label
              htmlFor="short_description"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              Short Description
            </label>

            <input
              id="short_description"
              value={form.short_description}
              onChange={(event) =>
                updateField(
                  "short_description",
                  event.target.value
                )
              }
              placeholder="Ready-made clothing for girls."
              className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              Description *
            </label>

            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              required
              rows={5}
              placeholder="Describe this clothing category..."
              className="w-full resize-none rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
            />
          </div>

          <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
  <div className="mb-6">
    <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
      Category Image
    </h2>

    <p className="mt-1 text-sm text-[#222]/55">
      Upload an image for this clothing category.
    </p>
  </div>

  <div>
    <label
      htmlFor="imageFile"
      className="mb-2 block text-sm font-semibold text-[#081A4A]"
    >
      Select Image
    </label>

    <input
      id="imageFile"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      onChange={(event) =>
        handleImageChange(
          event.target.files?.[0] || null
        )
      }
      disabled={loading || uploadingImage}
      className="block w-full cursor-pointer rounded-xl border border-[#081A4A]/15 bg-white px-4 py-3 text-sm text-[#081A4A] file:mr-4 file:rounded-full file:border-0 file:bg-[#081A4A] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#0d286b]"
    />

    <p className="mt-2 text-xs text-[#222]/45">
      JPG, PNG or WebP. Maximum size: 5 MB.
    </p>
  </div>

  {uploadingImage && (
    <div className="mt-5 flex items-center gap-2 rounded-xl bg-[#F7F5F0] px-4 py-3 text-sm font-medium text-[#081A4A]">
      <Loader2 className="h-4 w-4 animate-spin" />
      Uploading image...
    </div>
  )}

  {form.image && !uploadingImage && (
    <div className="mt-6">
      <p className="mb-3 text-sm font-semibold text-[#081A4A]">
        Image Preview
      </p>

      <div className="relative aspect-[4/3] max-w-md overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-[#F7F5F0]">
        <img
          src={form.image}
          alt="Category preview"
          className="h-full w-full object-cover"
        />
      </div>

      <p className="mt-3 break-all text-xs text-[#222]/40">
        {form.image}
      </p>
    </div>
  )}
</section>

          <div>
            <label
              htmlFor="keywords"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              Keywords
            </label>

            <input
              id="keywords"
              value={form.keywords}
              onChange={(event) =>
                updateField(
                  "keywords",
                  event.target.value
                )
              }
              placeholder="girls wear, girls clothing, wholesale girls wear"
              className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C]"
            />

            <p className="mt-2 text-xs text-[#222]/50">
              Separate keywords with commas.
            </p>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                updateField(
                  "is_active",
                  event.target.checked
                )
              }
              className="h-4 w-4 rounded"
            />

            <span className="text-sm font-medium text-[#081A4A]">
              Active category
            </span>
          </label>

          <div className="flex flex-col gap-3 border-t border-[#081A4A]/10 pt-6 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#081A4A] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#10265F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Category
                </>
              )}
            </button>

            <Link
              href="/admin/categories"
              className="inline-flex items-center justify-center rounded-full border border-[#081A4A]/15 px-7 py-3 text-sm font-semibold text-[#081A4A] transition hover:border-[#C89B3C] hover:text-[#C89B3C]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}