import Link from "next/link";
import { Plus, Pencil, FolderOpen } from "lucide-react";
import { redirect } from "next/navigation";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select(
      "id, name, slug, short_description, image, is_active, created_at"
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Failed to fetch categories:",
      error
    );
  }

  const categoryList = categories ?? [];

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-sm font-semibold text-[#081A4A] transition hover:text-[#C89B3C]"
            >
              ← Dashboard
            </Link>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Limra Clothing
            </p>

            <h1 className="mt-3 font-serif text-4xl font-semibold text-[#081A4A]">
              Categories
            </h1>

            <p className="mt-3 text-[#222]/60">
              Manage your clothing categories.
            </p>
          </div>

          <Link
            href="/admin/categories/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#081A4A] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#10265F]"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-6">
            <p className="text-sm text-[#222]/50">
              Total Categories
            </p>

            <p className="mt-2 text-3xl font-bold text-[#081A4A]">
              {categoryList.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-6">
            <p className="text-sm text-[#222]/50">
              Active Categories
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {
                categoryList.filter(
                  (category) => category.is_active
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-6">
            <p className="text-sm text-[#222]/50">
              Inactive Categories
            </p>

            <p className="mt-2 text-3xl font-bold text-red-500">
              {
                categoryList.filter(
                  (category) => !category.is_active
                ).length
              }
            </p>
          </div>
        </div>

        {/* Categories */}
        {categoryList.length === 0 ? (
          <div className="rounded-3xl border border-[#081A4A]/10 bg-white px-6 py-16 text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-[#C89B3C]" />

            <h2 className="mt-5 font-serif text-2xl font-semibold text-[#081A4A]">
              No Categories Yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#222]/55">
              Create your first clothing category to start
              organizing your products.
            </p>

            <Link
              href="/admin/categories/new"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-6 py-3 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" />
              Add First Category
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-[#081A4A]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="border-b border-[#081A4A]/10 bg-[#F7F5F0]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#222]/50">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#222]/50">
                      Slug
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#222]/50">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-[#222]/50">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {categoryList.map((category) => (
                    <tr
                      key={category.id}
                      className="border-b border-[#081A4A]/10 last:border-0"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F7F5F0]">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <FolderOpen className="h-5 w-5 text-[#C89B3C]" />
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-[#081A4A]">
                              {category.name}
                            </p>

                            {category.short_description && (
                              <p className="mt-1 max-w-md text-sm text-[#222]/50">
                                {category.short_description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <code className="rounded-lg bg-[#F7F5F0] px-3 py-1 text-xs text-[#222]/60">
                          /{category.slug}
                        </code>
                      </td>

                      <td className="px-6 py-5">
                        {category.is_active ? (
                          <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5 text-right">
                         <div className="flex items-center justify-end gap-2">
    <Link
      href={`/admin/categories/${category.id}/edit`}
      className="inline-flex items-center gap-2 rounded-full border border-[#081A4A]/15 px-4 py-2 text-sm font-semibold text-[#081A4A] transition hover:border-[#C89B3C] hover:text-[#C89B3C]"
    >
      <Pencil className="h-4 w-4" />
      Edit
    </Link>

    <DeleteCategoryButton
      categoryId={category.id}
      categoryName={category.name}
    />
  </div>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}