import Link from "next/link";
import {
  BarChart3,
  Boxes,
  FileText,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  Settings2,
  ShoppingCart,
  Store,
  Users,
} from "lucide-react";

import { requireAdmin } from "@/lib/auth/require-admin";
import LogoutButton from "@/components/admin/LogoutButton";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    name: "Attributes",
    href: "/admin/attributes",
    icon: Settings2,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
  },
];

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[#081A4A]/10 bg-[#081A4A] text-white lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-7">
            <Link href="/admin/dashboard" className="block">
              <div className="font-serif text-2xl font-bold tracking-tight">
                LIMRA
              </div>

              <div className="-mt-1 text-[9px] font-bold uppercase tracking-[0.32em] text-[#C89B3C]">
                Clothing Admin
              </div>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}

            <div className="my-5 border-t border-white/10" />

            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Store className="h-5 w-5" />
              View Website
            </Link>

            <Link
              href="/account"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Users className="h-5 w-5" />
              My Account
            </Link>
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-4 rounded-xl bg-white/5 p-4">
              <p className="truncate text-sm font-semibold text-white">
                {profile.role === "admin"
                  ? "Administrator"
                  : "Admin"}
              </p>

              <p className="mt-1 truncate text-xs text-white/50">
                {user.email}
              </p>
            </div>

            <LogoutButton />
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <header className="border-b border-[#081A4A]/10 bg-white lg:hidden">
            <div className="flex items-center justify-between px-4 py-4">
              <Link href="/admin/dashboard">
                <div className="font-serif text-xl font-bold text-[#081A4A]">
                  LIMRA
                </div>
                <div className="-mt-1 text-[8px] font-bold uppercase tracking-[0.25em] text-[#C89B3C]">
                  Admin
                </div>
              </Link>

              <Link
                href="/"
                className="rounded-full border border-[#081A4A]/10 px-4 py-2 text-xs font-semibold text-[#081A4A]"
              >
                Website
              </Link>
            </div>

            <nav className="flex gap-2 overflow-x-auto border-t border-[#081A4A]/10 px-4 py-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-full bg-[#081A4A]/5 px-4 py-2 text-xs font-semibold text-[#081A4A]"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </header>

          {children}
        </div>
      </div>
    </div>
  );
}