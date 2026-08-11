import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { siteConfig } from "@/lib/site";

export default function RetailHero() {
  return (
    <section className="bg-[#081A4A]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <nav
          aria-label="Breadcrumb"
          className="mb-10 text-sm text-white/50"
        >
          <Link href="/" className="hover:text-[#C89B3C]">
            Home
          </Link>

          <span className="mx-2">/</span>

          <span className="text-white/80">Retail</span>
        </nav>

        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Retail Clothing in Madurai
          </p>

          <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
            Ready-Made Clothing
            <span className="block text-[#C89B3C]">
              for Everyday Style
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
            Explore shirts, pants, T-shirts and other ready-made
            clothing products available from Limra Clothing in Madurai.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A]"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                "Hello, I would like to enquire about Limra Clothing retail products."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:border-[#C89B3C] hover:text-[#C89B3C]"
            >
              <MessageCircle className="h-4 w-4" />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}