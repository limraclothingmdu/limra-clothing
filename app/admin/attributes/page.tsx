"use client";

import { useEffect, useState } from "react";

type Attribute = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type AttributeType = "sizes" | "styles" | "materials";

const attributeConfig: {
  key: AttributeType;
  label: string;
  singular: string;
}[] = [
  {
    key: "sizes",
    label: "Sizes",
    singular: "Size",
  },
  {
    key: "styles",
    label: "Styles",
    singular: "Style",
  },
  {
    key: "materials",
    label: "Materials",
    singular: "Material",
  },
];

export default function AttributesPage() {
  const [activeType, setActiveType] =
    useState<AttributeType>("sizes");

  const [items, setItems] = useState<
    Record<AttributeType, Attribute[]>
  >({
    sizes: [],
    styles: [],
    materials: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Attribute | null>(null);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const currentConfig = attributeConfig.find(
    (item) => item.key === activeType
  )!;

  async function loadAttributes(
    type: AttributeType = activeType
  ) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/attributes/${type}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to load ${type}.`
        );
      }

      const list =
        data[type] ??
        data.items ??
        [];

      setItems((previous) => ({
        ...previous,
        [type]: list,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAttributes(activeType);
  }, [activeType]);

  function resetForm() {
    setEditing(null);
    setName("");
    setIsActive(true);
  }

  function startEdit(item: Attribute) {
    setEditing(item);
    setName(item.name);
    setIsActive(item.is_active);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      setError(
        `${currentConfig.singular} name is required.`
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/admin/attributes/${activeType}`,
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(editing ? { id: editing.id } : {}),
            name: name.trim(),
            is_active: isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to save ${currentConfig.singular}.`
        );
      }

      resetForm();
      await loadAttributes(activeType);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: Attribute) {
    try {
      setError("");

      const response = await fetch(
        `/api/admin/attributes/${activeType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
            name: item.name,
            is_active: !item.is_active,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to update ${currentConfig.singular}.`
        );
      }

      await loadAttributes(activeType);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    }
  }

  async function handleDelete(item: Attribute) {
    const confirmed = window.confirm(
      `Delete ${item.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `/api/admin/attributes/${activeType}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: item.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Failed to delete ${currentConfig.singular}.`
        );
      }

      if (editing?.id === item.id) {
        resetForm();
      }

      await loadAttributes(activeType);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F8F8] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Product Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-[#081A4A]">
            Product Attributes
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Manage sizes, styles and materials used by
            your products.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-3">
          {attributeConfig.map((config) => (
            <button
              key={config.key}
              type="button"
              onClick={() => {
                setActiveType(config.key);
                resetForm();
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                activeType === config.key
                  ? "bg-[#081A4A] text-white"
                  : "border border-[#081A4A]/10 bg-white text-[#081A4A] hover:border-[#C89B3C]"
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <section className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-[#081A4A]">
                {editing
                  ? `Edit ${currentConfig.singular}`
                  : `Add ${currentConfig.singular}`}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add a new {currentConfig.singular.toLowerCase()} or
                update an existing one.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="attribute-name"
                  className="mb-2 block text-sm font-semibold text-[#081A4A]"
                >
                  {currentConfig.singular} Name
                </label>

                <input
                  id="attribute-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder={`e.g. ${
                    activeType === "sizes"
                      ? "XL"
                      : activeType === "styles"
                      ? "Regular Fit"
                      : "Cotton"
                  }`}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/10"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) =>
                    setIsActive(event.target.checked)
                  }
                  className="h-4 w-4 rounded"
                />

                <span className="text-sm font-medium text-gray-700">
                  Active
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#081A4A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#10265f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editing
                    ? "Update"
                    : "Add"}
                </button>

                {editing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-[#081A4A]">
                  {currentConfig.label}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {items[activeType].length}{" "}
                  {items[activeType].length === 1
                    ? currentConfig.singular.toLowerCase()
                    : `${currentConfig.singular.toLowerCase()}s`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => loadAttributes(activeType)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="px-6 py-12 text-center text-sm text-gray-500">
                Loading {currentConfig.label.toLowerCase()}...
              </div>
            ) : items[activeType].length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="font-semibold text-[#081A4A]">
                  No {currentConfig.label.toLowerCase()} found.
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Add your first{" "}
                  {currentConfig.singular.toLowerCase()} using
                  the form.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items[activeType].map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-[#081A4A]">
                          {item.name}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            item.is_active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        Slug: {item.slug}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-[#081A4A] hover:bg-gray-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleActive(item)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                      >
                        {item.is_active
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
