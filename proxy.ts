import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginPage = pathname === "/admin/login";

  const isAccountRoute = pathname.startsWith("/account");

const isPublicAuthPage =
  pathname === "/login" ||
  pathname === "/register" ||
  pathname === "/forgot-password" ||
  pathname === "/reset-password" ||
  pathname === "/auth/callback";

  /*
   * ==========================================
   * ADMIN AUTHORIZATION
   * ==========================================
   */

  if (isAdminRoute && !isAdminLoginPage) {
    if (!user) {
      const url = request.nextUrl.clone();

      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);

      return NextResponse.redirect(url);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin =
      profile?.role === "admin" &&
      profile?.is_active === true;

    if (!isAdmin) {
      const url = request.nextUrl.clone();

      url.pathname = "/account";

      return NextResponse.redirect(url);
    }
  }

  /*
   * ==========================================
   * ADMIN LOGIN PAGE
   * ==========================================
   */

  if (isAdminLoginPage && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin =
      profile?.role === "admin" &&
      profile?.is_active === true;

    const url = request.nextUrl.clone();

    if (isAdmin) {
      url.pathname = "/admin/dashboard";
    } else {
      url.pathname = "/account";
    }

    url.search = "";

    return NextResponse.redirect(url);
  }

  /*
   * ==========================================
   * CUSTOMER ACCOUNT
   * ==========================================
   */

  if (isAccountRoute && !user) {
    const url = request.nextUrl.clone();

    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);

    return NextResponse.redirect(url);
  }

  /*
   * ==========================================
   * PUBLIC AUTH PAGES
   * ==========================================
   */

  if (isPublicAuthPage && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin =
      profile?.role === "admin" &&
      profile?.is_active === true;

    const url = request.nextUrl.clone();

    url.pathname = isAdmin ? "/admin/dashboard" : "/account";
    url.search = "";

    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};