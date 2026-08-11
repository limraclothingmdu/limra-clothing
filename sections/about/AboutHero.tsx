import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#081A4A]">
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:50px_50px]" />

      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#C89B3C]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 text-sm text-white/50"
        >
          <Link href="/" className="hover:text-[#C89B3C]">
            Home
          </Link>

          <span className="mx-2">/</span>

          <span className="text-white/80">About</span>
        </nav>

        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            About Limra Clothing
          </p>

          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            A Wholesale Clothing Partner
            <span className="block text-[#C89B3C]">
              Built for Businesses
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            Limra Clothing focuses on ready-made garments and wholesale
            clothing solutions for retailers, businesses, and wholesale buyers.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A]"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:border-[#C89B3C] hover:text-[#C89B3C]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}