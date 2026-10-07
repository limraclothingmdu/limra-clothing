"use client";

import Link from "next/link";
import {
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { siteConfig } from "@/lib/site";
import {
  clearCartForLogout,
  getCartUserId,
  setCartUserId,
} from "@/lib/retail/cart";
import { navigation } from "@/data/navigation";
import { createClient } from "@/lib/supabase/client";

type CartItem = {
  quantity?: number;
};

type UserInfo = {
  email?: string | null;
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const whatsappUrl = `https://wa.me/${
    siteConfig.contact.whatsapp
  }?text=${encodeURIComponent(
    "Hello, I would like to enquire about Limra Clothing products."
  )}`;

  /*
   * ------------------------------------------------------------
   * Cart
   * ------------------------------------------------------------
   */

  const updateCartCount = () => {
    try {
      const stored = localStorage.getItem("limra-retail-cart");

      if (!stored) {
        setCartCount(0);
        return;
      }

      const cart = JSON.parse(stored);

      if (!Array.isArray(cart)) {
        setCartCount(0);
        return;
      }

      const total = cart.reduce(
        (sum: number, item: CartItem) =>
          sum + Math.max(0, Number(item?.quantity ?? 0)),
        0
      );

      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  /*
   * ------------------------------------------------------------
   * Authentication
   * ------------------------------------------------------------
   */

useEffect(() => {
  const supabase = createClient();

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUser(null);
      return;
    }

    const storedCartUserId = getCartUserId();

    if (storedCartUserId && storedCartUserId !== user.id) {
      clearCartForLogout();
    }

    setCartUserId(user.id);
    setUser(user);
  };

  loadUser();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    const nextUser = session?.user ?? null;

    if (!nextUser) {
      clearCartForLogout();
      setUser(null);
      setAccountOpen(false);
      return;
    }

    const storedCartUserId = getCartUserId();

    if (storedCartUserId && storedCartUserId !== nextUser.id) {
      clearCartForLogout();
    }

    setCartUserId(nextUser.id);
    setUser(nextUser);
  });

  return () => {
    subscription.unsubscribe();
  };
}, []);

  /*
   * ------------------------------------------------------------
   * Cart listeners
   * ------------------------------------------------------------
   */

  useEffect(() => {
    const handleCartUpdate = () => {
      updateCartCount();
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "limra-retail-cart") {
        updateCartCount();
      }
    };

    const frame = window.requestAnimationFrame(() => {
      updateCartCount();
    });

    window.addEventListener(
      "limra-cart-updated",
      handleCartUpdate
    );

    window.addEventListener("storage", handleStorage);

    return () => {
      window.cancelAnimationFrame(frame);

      window.removeEventListener(
        "limra-cart-updated",
        handleCartUpdate
      );

      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  /*
   * ------------------------------------------------------------
   * Logout
   * ------------------------------------------------------------
   */

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const supabase = createClient();

      await supabase.auth.signOut();

      setUser(null);
      setAccountOpen(false);
      setOpen(false);
    } finally {
      setLoggingOut(false);
    }
  };

  /*
   * ------------------------------------------------------------
   * Navigation
   * ------------------------------------------------------------
   */

  const hasRetailNavigation = navigation.some(
    (item) =>
      item.href === "/retail" ||
      item.href === "/retail/products"
  );

  const navItems = hasRetailNavigation
    ? navigation
    : [
        ...navigation,
        {
          name: "Retail",
          href: "/retail/products",
        },
      ];

  const accountLabel = user?.email
    ? user.email.split("@")[0]
    : "Account";

  return (
    <header className="sticky top-0 z-50 border-b border-[#081A4A]/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center"
          aria-label="Limra Clothing Home"
        >
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-[#081A4A]">
              LIMRA
            </div>

            <div className="-mt-1 text-[9px] font-bold uppercase tracking-[0.32em] text-[#C89B3C]">
              Clothing
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[#081A4A]/70 transition-colors hover:text-[#C89B3C]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Customer Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Cart */}
          <Link
            href="/retail/cart"
            aria-label={`Shopping cart${
              cartCount > 0 ? `, ${cartCount} items` : ""
            }`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#081A4A]/10 text-[#081A4A] transition hover:border-[#C89B3C] hover:text-[#C89B3C]"
          >
            <ShoppingBag className="h-5 w-5" />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C89B3C] px-1 text-[10px] font-bold text-[#081A4A]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Account / Login */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                className="inline-flex items-center gap-2 rounded-full border border-[#081A4A]/10 px-4 py-2.5 text-sm font-semibold text-[#081A4A] transition hover:border-[#C89B3C]"
                aria-expanded={accountOpen}
              >
                <User className="h-4 w-4" />
                <span className="max-w-28 truncate capitalize">
                  {accountLabel}
                </span>
              </button>

              {accountOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white p-2 shadow-xl">
                  <Link
                    href="/account"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#081A4A] hover:bg-[#081A4A]/5"
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>

                  <Link
                    href="/account/orders"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#081A4A] hover:bg-[#081A4A]/5"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    My Orders
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Signing out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full border border-[#081A4A]/10 px-4 py-2.5 text-sm font-semibold text-[#081A4A] transition hover:border-[#C89B3C] hover:text-[#C89B3C]"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}

          {/* WhatsApp CTA */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C89B3C] hover:text-[#081A4A]"
          >
            <MessageCircle className="h-4 w-4" />
            Enquire
          </a>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Mobile Cart */}
          <Link
            href="/retail/cart"
            aria-label={`Shopping cart${
              cartCount > 0 ? `, ${cartCount} items` : ""
            }`}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#081A4A]/10 text-[#081A4A]"
          >
            <ShoppingBag className="h-5 w-5" />

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C89B3C] px-1 text-[10px] font-bold text-[#081A4A]">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#081A4A]/10 text-[#081A4A]"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-[#081A4A]/10 bg-white lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#081A4A]/5 py-3 text-sm font-semibold text-[#081A4A]"
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Account */}
            {user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 border-b border-[#081A4A]/5 py-3 text-sm font-semibold text-[#081A4A]"
                >
                  <User className="h-4 w-4" />
                  My Account
                </Link>

                <Link
                  href="/account/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 border-b border-[#081A4A]/5 py-3 text-sm font-semibold text-[#081A4A]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  My Orders
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-3 border-b border-[#081A4A]/5 py-3 text-left text-sm font-semibold text-red-600 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {loggingOut ? "Signing out..." : "Logout"}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 border-b border-[#081A4A]/5 py-3 text-sm font-semibold text-[#081A4A]"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}

            <Link
              href="/retail/cart"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-full border border-[#081A4A]/10 px-5 py-3 text-sm font-bold text-[#081A4A]"
            >
              <ShoppingBag className="h-4 w-4" />
              Cart
              {cartCount > 0 && ` (${cartCount})`}
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-[#C89B3C] px-5 py-3 text-sm font-bold text-[#081A4A]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Enquiry
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}