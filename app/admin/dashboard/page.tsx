import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  FolderTree,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import AdminDashboardRealtime from "@/components/admin/AdminDashboardRealtime";

export const dynamic = "force-dynamic";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function statusClasses(status: string) {
  switch (status) {
    case "delivered":
      return "bg-green-50 text-green-700";

    case "shipped":
      return "bg-blue-50 text-blue-700";

    case "processing":
      return "bg-purple-50 text-purple-700";

    case "confirmed":
      return "bg-emerald-50 text-emerald-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

function statusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

type DashboardStats = {
  totalProducts: number;
  activeProducts: number;
  retailProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  activeCategories: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  paidRevenue: number;
};

type RecentOrder = {
  id: string;
  customer_name: string | null;
  total_amount: number | string;
  status: string;
  payment_status: string;
  created_at: string;
};

type RecentProduct = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  retail_enabled: boolean;
  retail_price: number | string | null;
  stock_quantity: number | null;
  created_at: string;
};

export default async function AdminDashboardPage() {
  const { user } = await requireAdmin();

  const supabase = await createClient();

  const { data: stats, error: statsError } = await supabase.rpc(
    "get_admin_dashboard_stats"
  );

  if (statsError) {
    console.error("Dashboard stats error:", statsError);
  }

  const dashboardStats: DashboardStats = {
    totalProducts: Number(stats?.totalProducts ?? 0),
    activeProducts: Number(stats?.activeProducts ?? 0),
    retailProducts: Number(stats?.retailProducts ?? 0),
    outOfStockProducts: Number(stats?.outOfStockProducts ?? 0),
    totalCategories: Number(stats?.totalCategories ?? 0),
    activeCategories: Number(stats?.activeCategories ?? 0),
    totalCustomers: Number(stats?.totalCustomers ?? 0),
    totalOrders: Number(stats?.totalOrders ?? 0),
    pendingOrders: Number(stats?.pendingOrders ?? 0),
    confirmedOrders: Number(stats?.confirmedOrders ?? 0),
    processingOrders: Number(stats?.processingOrders ?? 0),
    shippedOrders: Number(stats?.shippedOrders ?? 0),
    deliveredOrders: Number(stats?.deliveredOrders ?? 0),
    cancelledOrders: Number(stats?.cancelledOrders ?? 0),
    paidRevenue: Number(stats?.paidRevenue ?? 0),
  };

  const { data: recentOrdersData, error: recentOrdersError } = await supabase
    .from("orders")
    .select(
      "id, customer_name, total_amount, status, payment_status, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(6);

  if (recentOrdersError) {
    console.error("Recent orders error:", recentOrdersError);
  }

  const { data: recentProductsData, error: recentProductsError } =
    await supabase
      .from("products")
      .select(
        "id, name, slug, image, retail_enabled, retail_price, stock_quantity, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(6);

  if (recentProductsError) {
    console.error("Recent products error:", recentProductsError);
  }

  const recentOrders: RecentOrder[] = recentOrdersData ?? [];
  const recentProducts: RecentProduct[] = recentProductsData ?? [];

  const statsCards = [
    {
      title: "Total Products",
      value: dashboardStats.totalProducts,
      description: `${dashboardStats.activeProducts} active`,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Categories",
      value: dashboardStats.totalCategories,
      description: `${dashboardStats.activeCategories} active`,
      icon: FolderTree,
      href: "/admin/categories",
    },
    {
      title: "Customers",
      value: dashboardStats.totalCustomers,
      description: "Registered customers",
      icon: Users,
      href: "/admin/customers",
    },
    {
      title: "Total Orders",
      value: dashboardStats.totalOrders,
      description: `${dashboardStats.pendingOrders} pending`,
      icon: ShoppingCart,
      href: "/admin/orders",
    },
    {
      title: "Retail Products",
      value: dashboardStats.retailProducts,
      description: "Available for retail",
      icon: Boxes,
      href: "/admin/products",
    },
    {
      title: "Out of Stock",
      value: dashboardStats.outOfStockProducts,
      description: "Retail products",
      icon: BarChart3,
      href: "/admin/products",
    },
  ];

  const orderStatuses = [
    {
      label: "Pending",
      value: dashboardStats.pendingOrders,
      className: "bg-amber-50 text-amber-700",
    },
    {
      label: "Confirmed",
      value: dashboardStats.confirmedOrders,
      className: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Processing",
      value: dashboardStats.processingOrders,
      className: "bg-purple-50 text-purple-700",
    },
    {
      label: "Shipped",
      value: dashboardStats.shippedOrders,
      className: "bg-blue-50 text-blue-700",
    },
    {
      label: "Delivered",
      value: dashboardStats.deliveredOrders,
      className: "bg-green-50 text-green-700",
    },
    {
      label: "Cancelled",
      value: dashboardStats.cancelledOrders,
      className: "bg-red-50 text-red-700",
    },
  ];

  return (
    <>
      <AdminDashboardRealtime />

      <main className="min-h-screen bg-[#F7F5F0]">
        {/* Header */}
        <section className="border-b border-[#081A4A]/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C89B3C]">
                  Admin Dashboard
                </p>

                <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#081A4A] sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  {user.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d286b]"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </Link>

                <Link
                  href="/admin/orders"
                  className="inline-flex items-center gap-2 rounded-full border border-[#081A4A]/15 bg-white px-5 py-3 text-sm font-semibold text-[#081A4A] transition hover:border-[#C89B3C]"
                >
                  <ShoppingCart className="h-4 w-4" />
                  View Orders
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          {/* Main statistics */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#081A4A]">
                  Business Overview
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Live information from your Limra database.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Live
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {statsCards.map((card) => {
                const Icon = card.icon;

                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group rounded-2xl border border-[#081A4A]/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#C89B3C]/50 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="rounded-xl bg-[#081A4A]/5 p-3 text-[#081A4A]">
                        <Icon className="h-5 w-5" />
                      </div>

                      <ArrowRight className="h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#C89B3C]" />
                    </div>

                    <p className="mt-5 text-sm font-medium text-gray-500">
                      {card.title}
                    </p>

                    <p className="mt-1 text-3xl font-bold text-[#081A4A]">
                      {card.value.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {card.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Revenue + Order summary */}
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-[#081A4A]/10 bg-[#081A4A] p-6 text-white shadow-sm lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <TrendingUp className="h-5 w-5 text-[#C89B3C]" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                    Paid Revenue
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {formatPrice(dashboardStats.paidRevenue)}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-xs text-white/50">
                  Revenue from orders marked as paid.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-6 shadow-sm lg:col-span-2">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#081A4A]">
                    Order Status
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Current order pipeline
                  </p>
                </div>

                <Link
                  href="/admin/orders"
                  className="text-xs font-semibold text-[#081A4A] hover:text-[#C89B3C]"
                >
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {orderStatuses.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-[#081A4A]/5 p-4"
                  >
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${item.className}`}
                    >
                      {item.label}
                    </span>

                    <p className="mt-3 text-2xl font-bold text-[#081A4A]">
                      {item.value.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recent activity */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* Recent orders */}
            <div className="overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#081A4A]/10 px-5 py-5">
                <div>
                  <h2 className="font-bold text-[#081A4A]">
                    Recent Orders
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Latest customer orders
                  </p>
                </div>

                <Link
                  href="/admin/orders"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#081A4A] hover:text-[#C89B3C]"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <ShoppingCart className="mx-auto h-8 w-8 text-gray-300" />

                  <p className="mt-3 text-sm font-semibold text-gray-600">
                    No orders yet
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Customer orders will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#081A4A]/5">
                  {recentOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#F7F5F0]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#081A4A]">
                          {order.customer_name || "Customer"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-[#081A4A]">
                          {formatPrice(Number(order.total_amount || 0))}
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${statusClasses(
                            order.status
                          )}`}
                        >
                          {statusLabel(order.status)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent products */}
            <div className="overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#081A4A]/10 px-5 py-5">
                <div>
                  <h2 className="font-bold text-[#081A4A]">
                    Recently Added Products
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Latest products in your catalog
                  </p>
                </div>

                <Link
                  href="/admin/products"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#081A4A] hover:text-[#C89B3C]"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {recentProducts.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <Package className="mx-auto h-8 w-8 text-gray-300" />

                  <p className="mt-3 text-sm font-semibold text-gray-600">
                    No products yet
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Add your first product to get started.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#081A4A]/5">
                  {recentProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/admin/products/${product.id}/edit`}
                      className="flex items-center gap-4 px-5 py-4 transition hover:bg-[#F7F5F0]"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F7F5F0]">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-300">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#081A4A]">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatDate(product.created_at)}
                        </p>
                      </div>

                      <div className="text-right">
                        {product.retail_enabled ? (
                          <p className="text-sm font-bold text-[#081A4A]">
                            {product.retail_price != null
                              ? formatPrice(Number(product.retail_price))
                              : "Price not set"}
                          </p>
                        ) : (
                          <p className="text-xs font-semibold text-gray-400">
                            Wholesale
                          </p>
                        )}

                        <p className="mt-1 text-[10px] text-gray-400">
                          Stock:{" "}
                          {product.stock_quantity != null
                            ? product.stock_quantity
                            : "—"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-[#081A4A]">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage the most important parts of your store.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/admin/products/new"
                className="group rounded-2xl border border-[#081A4A]/10 bg-white p-5 transition hover:border-[#C89B3C]/50 hover:shadow-md"
              >
                <Package className="h-6 w-6 text-[#081A4A]" />

                <h3 className="mt-4 font-bold text-[#081A4A]">
                  Add Product
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Add a new product to your catalog.
                </p>

                <ArrowRight className="mt-4 h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#C89B3C]" />
              </Link>

              <Link
                href="/admin/categories/new"
                className="group rounded-2xl border border-[#081A4A]/10 bg-white p-5 transition hover:border-[#C89B3C]/50 hover:shadow-md"
              >
                <FolderTree className="h-6 w-6 text-[#081A4A]" />

                <h3 className="mt-4 font-bold text-[#081A4A]">
                  Add Category
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Create and manage product categories.
                </p>

                <ArrowRight className="mt-4 h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#C89B3C]" />
              </Link>

              <Link
                href="/admin/attributes"
                className="group rounded-2xl border border-[#081A4A]/10 bg-white p-5 transition hover:border-[#C89B3C]/50 hover:shadow-md"
              >
                <Boxes className="h-6 w-6 text-[#081A4A]" />

                <h3 className="mt-4 font-bold text-[#081A4A]">
                  Attributes
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Manage sizes, styles and materials.
                </p>

                <ArrowRight className="mt-4 h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#C89B3C]" />
              </Link>

              <Link
                href="/admin/blogs"
                className="group rounded-2xl border border-[#081A4A]/10 bg-white p-5 transition hover:border-[#C89B3C]/50 hover:shadow-md"
              >
                <BarChart3 className="h-6 w-6 text-[#081A4A]" />

                <h3 className="mt-4 font-bold text-[#081A4A]">
                  Manage Blogs
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Publish and manage website articles.
                </p>

                <ArrowRight className="mt-4 h-4 w-4 text-gray-300 transition group-hover:translate-x-1 group-hover:text-[#C89B3C]" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}