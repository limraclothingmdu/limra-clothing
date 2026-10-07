import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="min-h-screen bg-[#F7F5F0] px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Limra Clothing
          </p>

          <h1 className="mt-2 font-serif text-4xl font-semibold text-[#081A4A]">
            My Account
          </h1>

          <p className="mt-2 text-[#222]/60">
            Manage your account and orders.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-2xl bg-white p-6 shadow-sm md:col-span-2">
            <h2 className="text-xl font-semibold text-[#081A4A]">
              Profile
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-sm text-[#222]/50">Name</p>
                <p className="font-medium text-[#222]">
                  {profile?.full_name || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#222]/50">Email</p>
                <p className="font-medium text-[#222]">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-[#222]/50">Phone</p>
                <p className="font-medium text-[#222]">
                  {profile?.phone || "Not provided"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#081A4A]">
              Account
            </h2>

            <div className="mt-6 space-y-3">
              <Link
                href="/account/profile"
                className="block rounded-xl border border-[#081A4A]/10 px-4 py-3 text-sm font-semibold text-[#081A4A] hover:border-[#C89B3C]"
              >
                Edit Profile
              </Link>

              <Link
                href="/account/orders"
                className="block rounded-xl border border-[#081A4A]/10 px-4 py-3 text-sm font-semibold text-[#081A4A] hover:border-[#C89B3C]"
              >
                My Orders
                          </Link>
                      <LogoutButton />    
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}