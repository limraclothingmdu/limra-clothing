"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const nextPath = searchParams.get("next");

  const redirectPath =
    nextPath &&
    nextPath.startsWith("/") &&
    !nextPath.startsWith("//")
      ? nextPath
      : "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const supabase = createClient();

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError || !data.user) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError || !profile || !profile.is_active) {
      await supabase.auth.signOut();

      setError(
        "Your account profile is unavailable or inactive. Please contact Limra Clothing."
      );
      setLoading(false);
      return;
    }

    if (profile.role === "admin") {
      router.push("/admin/dashboard");
      router.refresh();
      return;
    }

    router.push(redirectPath);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Limra Clothing
          </p>

          <h1 className="mt-3 font-serif text-3xl font-semibold text-[#081A4A]">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-[#222]/60">
            Sign in to access your Limra Clothing account.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-[#081A4A]"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#081A4A]"
              >
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#C89B3C] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#081A4A]/15 px-4 py-3 outline-none transition focus:border-[#C89B3C]"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#081A4A] px-6 py-3 font-bold text-white transition hover:bg-[#0d286b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#222]/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#C89B3C] hover:underline"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-6 border-t border-[#081A4A]/10 pt-5 text-center">
          <Link
            href="/admin/login"
            className="text-xs font-semibold text-[#081A4A]/60 hover:text-[#C89B3C]"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-4">
          <div className="text-sm font-semibold text-[#081A4A]">
            Loading...
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}