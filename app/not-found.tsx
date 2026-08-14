import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F8F8] px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
          404 Error
        </p>

        <h1 className="mt-4 font-serif text-5xl font-semibold text-[#081A4A] sm:text-6xl">
          Page Not Found
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-[#222]/60">
          Sorry, the page you are looking for does not exist or may have
          been moved.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3 text-sm font-bold text-[#081A4A] transition-transform hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#081A4A]/15 px-6 py-3 text-sm font-semibold text-[#081A4A] transition-colors hover:border-[#C89B3C] hover:text-[#C89B3C]"
          >
            <Search className="h-4 w-4" />
            Browse Products
          </Link>

          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#081A4A]/15 px-6 py-3 text-sm font-semibold text-[#081A4A] transition-colors hover:border-[#C89B3C] hover:text-[#C89B3C]"
          >
            <ArrowLeft className="h-4 w-4" />
            Categories
          </Link>
        </div>
      </div>
    </main>
  );
}