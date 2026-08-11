import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import GalleryGrid from "@/sections/gallery/GalleryGrid";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery | Limra Clothing Madurai",
  description:
    "View Limra Clothing's store, clothing collections and ready-made garments in Madurai. Wholesale and retail clothing distributed across Tamil Nadu.",
  keywords: [
    "Limra Clothing Madurai",
    "clothing shop Madurai",
    "wholesale clothing Madurai",
    "ready made garments Madurai",
    "textile shop Madurai",
  ],
  alternates: {
    canonical: `${siteConfig.url}/gallery`,
  },
  openGraph: {
    title: `Gallery | ${siteConfig.name}`,
    description:
      "Explore Limra Clothing's clothing collections and store in Madurai.",
    url: `${siteConfig.url}/gallery`,
    type: "website",
  },
};

export default function GalleryPage() {
  return (
    <main>
      <section className="bg-[#081A4A]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-white/50"
          >
            <Link href="/" className="hover:text-[#C89B3C]">
              Home
            </Link>

            <span className="mx-2">/</span>

            <span className="text-white/80">Gallery</span>
          </nav>

          <div className="mt-10 max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Limra Clothing
            </p>

            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Our Clothing & Store Gallery
            </h1>

            <p className="mt-6 text-base leading-8 text-white/60 sm:text-lg">
              Explore Limra Clothing's store and ready-made clothing
              collections from Madurai.
            </p>
          </div>
        </div>
      </section>

      <GalleryGrid />

      <section className="bg-[#F8F8F8] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
            Looking for Wholesale Clothing?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#222]/60">
            Limra Clothing is based in Madurai and distributes
            ready-made garments across Tamil Nadu.
          </p>

          <Link
            href="/wholesale"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-6 py-3.5 text-sm font-bold text-white"
          >
            Explore Wholesale
            <ArrowRight className="h-4 w-4 text-[#C89B3C]" />
          </Link>
        </div>
      </section>
    </main>
  );
}