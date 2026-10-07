import { createClient } from "@/lib/supabase/server";

export async function requireAdminApi() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      authorized: false as const,
      status: 401,
      error: "Authentication required",
    };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  if (
    error ||
    !profile ||
    profile.role !== "admin" ||
    !profile.is_active
  ) {
    return {
      authorized: false as const,
      status: 403,
      error: "Admin access required",
    };
  }

  return {
    authorized: true as const,
    user,
    profile,
  };
}