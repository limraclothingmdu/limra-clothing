"use client";

import { FormEvent, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type AttributeOption = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  keywords: string[] | null;
  image: string | null;
  is_active: boolean;
  category_id: string | null;
  price: number | null;
offer_name: string | null;
offer_price: number | null;
};

type EditProductFormProps = {
  product: Product;
  categories: Category[];
  sizes: AttributeOption[];
  styles: AttributeOption[];
  materials: AttributeOption[];
  initialSizeIds: string[];
  initialStyleIds: string[];
  initialMaterialIds: string[];
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EditProductForm({
  product,
  categories,
  sizes,
  styles,
  materials,
  initialSizeIds,
  initialStyleIds,
  initialMaterialIds,
}: EditProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [slug, setSlug] = useState(product.slug);
  const [categoryId, setCategoryId] = useState(
    product.category_id ?? ""
  );
  const [selectedSizeIds, setSelectedSizeIds] = useState<string[]>(
    initialSizeIds
  );
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>(
    initialStyleIds
  );
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>(
    initialMaterialIds
  );
  const [shortDescription, setShortDescription] = useState(
    product.short_description ?? ""
  );
  const [description, setDescription] = useState(
    product.description ?? ""
  );
  const [keywords, setKeywords] = useState(
    product.keywords?.join(", ") ?? ""
  );
  const [image, setImage] = useState(product.image ?? "");
  const [isActive, setIsActive] = useState(product.is_active);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSelection = (
    id: string,
    setter: Dispatch<SetStateAction<string[]>>
  ) => {
    setter((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };
  const [price, setPrice] = useState(
  product.price?.toString() ?? ""
);

const [offerName, setOfferName] = useState(
  product.offer_name ?? ""
);

const [offerPrice, setOfferPrice] = useState(
  product.offer_price?.toString() ?? ""
);

  function handleNameChange(value: string) {
    setName(value);

    if (!slug || slug === createSlug(product.name)) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (!name.trim()) {
        throw new Error("Product name is required.");
      }

      if (!categoryId) {
        throw new Error("Please select a category.");
      }

      if (!description.trim()) {
        throw new Error("Product description is required.");
      }
     const numericPrice = price ? Number(price) : null;
const numericOfferPrice = offerPrice
  ? Number(offerPrice)
  : null;

if (
  numericPrice !== null &&
  (!Number.isFinite(numericPrice) || numericPrice < 0)
) {
  throw new Error("Price cannot be negative.");
}

if (
  numericOfferPrice !== null &&
  (!Number.isFinite(numericOfferPrice) ||
    numericOfferPrice < 0)
) {
  throw new Error("Offer price cannot be negative.");
}

if (
  numericPrice !== null &&
  numericOfferPrice !== null &&
  numericOfferPrice >= numericPrice
) {
  throw new Error(
    "Offer price must be lower than the regular price."
  );
}
      const keywordArray = keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      const response = await fetch(
        `/api/admin/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            slug: createSlug(slug || name),
            category_id: categoryId,
            short_description:
              shortDescription.trim(),
            description: description.trim(),
            keywords: keywordArray,
            image: image.trim() || null,
            is_active: isActive,
              price: price ? Number(price) : null,
  offer_name: offerName.trim() || null,
  offer_price: offerPrice ? Number(offerPrice) : null,
            size_ids: selectedSizeIds,
            style_ids: selectedStyleIds,
            material_ids: selectedMaterialIds,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to update product."
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* Basic Information */}
      <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-[#222]/55">
            Update the main product information.
          </p>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              Product Name *
            </label>

            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(event) =>
                handleNameChange(event.target.value)
              }
              className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              URL Slug *
            </label>

            <input
              id="slug"
              type="text"
              required
              value={slug}
              onChange={(event) =>
                setSlug(createSlug(event.target.value))
              }
              className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
            />

            <p className="mt-2 text-xs text-[#222]/45">
              Product URL:
              {" /products/"}
              {slug}
            </p>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              Category *
            </label>

            <select
              id="category"
              required
              value={categoryId}
              onChange={(event) =>
                setCategoryId(event.target.value)
              }
              className="w-full rounded-xl border border-[#081A4A]/15 bg-white px-4 py-3 outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
            >
              <option value="">
                Select a category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Short Description */}
          <div>
            <label
              htmlFor="shortDescription"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              Short Description
            </label>

            <textarea
              id="shortDescription"
              rows={3}
              value={shortDescription}
              onChange={(event) =>
                setShortDescription(event.target.value)
              }
              className="w-full resize-none rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              Product Description *
            </label>

            <textarea
              id="description"
              rows={6}
              required
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              className="w-full resize-y rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
            />
          </div>
        </div>
      </section>
      {/* Pricing & Offers */}
<section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
  <div className="mb-6">
    <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
      Pricing & Offers
    </h2>

    <p className="mt-1 text-sm text-[#222]/55">
      Set the product price and any special offer.
    </p>
  </div>

  <div className="grid gap-6 sm:grid-cols-2">
    {/* Price */}
    <div>
      <label
        htmlFor="price"
        className="mb-2 block text-sm font-semibold text-[#081A4A]"
      >
        Price (₹)
      </label>

      <input
        id="price"
        type="number"
        min="0"
        step="0.01"
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        placeholder="599"
        className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
      />
    </div>

    {/* Offer Name */}
    <div>
      <label
        htmlFor="offerName"
        className="mb-2 block text-sm font-semibold text-[#081A4A]"
      >
        Special Offer Name
      </label>

      <input
        id="offerName"
        type="text"
        value={offerName}
        onChange={(event) => setOfferName(event.target.value)}
        placeholder="Festival Offer"
        className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
      />
    </div>

    {/* Offer Price */}
    <div>
      <label
        htmlFor="offerPrice"
        className="mb-2 block text-sm font-semibold text-[#081A4A]"
      >
        Offer Price (₹)
      </label>

      <input
        id="offerPrice"
        type="number"
        min="0"
        step="0.01"
        value={offerPrice}
        onChange={(event) => setOfferPrice(event.target.value)}
        placeholder="499"
        className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
      />
    </div>
  </div>
</section>

      {/* Product Attributes */}
      <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
            Product Attributes
          </h2>

          <p className="mt-1 text-sm text-[#222]/55">
            Select the available sizes, styles and materials for this product.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold text-[#081A4A]">Sizes</h3>

          {sizes.length === 0 ? (
            <p className="text-sm text-[#222]/50">No sizes available.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {sizes.map((size: AttributeOption) => {
                const checked = selectedSizeIds.includes(size.id);

                return (
                  <label
                    key={size.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                      checked
                        ? "border-[#C89B3C] bg-[#C89B3C]/5"
                        : "border-[#081A4A]/10 hover:border-[#C89B3C]/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleSelection(size.id, setSelectedSizeIds)
                      }
                      className="h-4 w-4 accent-[#081A4A]"
                    />
                    <span className="text-sm font-semibold text-[#081A4A]">
                      {size.name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-sm font-bold text-[#081A4A]">Styles</h3>

          {styles.length === 0 ? (
            <p className="text-sm text-[#222]/50">No styles available.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {styles.map((style: AttributeOption) => {
                const checked = selectedStyleIds.includes(style.id);

                return (
                  <label
                    key={style.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                      checked
                        ? "border-[#C89B3C] bg-[#C89B3C]/5"
                        : "border-[#081A4A]/10 hover:border-[#C89B3C]/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleSelection(style.id, setSelectedStyleIds)
                      }
                      className="h-4 w-4 accent-[#081A4A]"
                    />
                    <span className="text-sm font-semibold text-[#081A4A]">
                      {style.name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="mb-3 text-sm font-bold text-[#081A4A]">Materials</h3>

          {materials.length === 0 ? (
            <p className="text-sm text-[#222]/50">No materials available.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {materials.map((material: AttributeOption) => {
                const checked = selectedMaterialIds.includes(material.id);

                return (
                  <label
                    key={material.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                      checked
                        ? "border-[#C89B3C] bg-[#C89B3C]/5"
                        : "border-[#081A4A]/10 hover:border-[#C89B3C]/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleSelection(material.id, setSelectedMaterialIds)
                      }
                      className="h-4 w-4 accent-[#081A4A]"
                    />
                    <span className="text-sm font-semibold text-[#081A4A]">
                      {material.name}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SEO */}
      <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
            SEO
          </h2>

          <p className="mt-1 text-sm text-[#222]/55">
            Update keywords for search engines.
          </p>
        </div>

        <label
          htmlFor="keywords"
          className="mb-2 block text-sm font-semibold text-[#081A4A]"
        >
          Keywords
        </label>

        <input
          id="keywords"
          type="text"
          value={keywords}
          onChange={(event) =>
            setKeywords(event.target.value)
          }
          placeholder="mens shirts wholesale, shirts Madurai"
          className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
        />

        <p className="mt-2 text-xs text-[#222]/45">
          Separate keywords with commas.
        </p>
      </section>

      {/* Image */}
      <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
          Product Image
        </h2>

        <p className="mt-1 text-sm text-[#222]/55">
          Image upload will be connected to Supabase Storage later.
        </p>

        <div className="mt-6">
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-semibold text-[#081A4A]"
          >
            Image Path / URL
          </label>

          <input
            id="image"
            type="text"
            value={image}
            onChange={(event) =>
              setImage(event.target.value)
            }
            placeholder="/images/products/product.jpg"
            className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
          />
        </div>
      </section>

      {/* Status */}
      <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
              Product Status
            </h2>

            <p className="mt-1 text-sm text-[#222]/55">
              Inactive products will not be displayed publicly.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsActive((value) => !value)
            }
            className={`relative h-7 w-12 shrink-0 rounded-full transition ${
              isActive
                ? "bg-[#081A4A]"
                : "bg-gray-300"
            }`}
            aria-label="Toggle product status"
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
                isActive ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>

        <p className="mt-4 text-sm font-semibold text-[#081A4A]">
          {isActive ? "Active" : "Inactive"}
        </p>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          <p className="font-bold">
            Could not update product
          </p>

          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/products")
          }
          disabled={loading}
          className="rounded-full border border-[#081A4A]/15 px-6 py-3 text-sm font-bold text-[#081A4A] transition hover:border-[#C89B3C] hover:text-[#C89B3C] disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#081A4A] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#0d286b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}