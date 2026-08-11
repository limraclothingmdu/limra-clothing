import type { Metadata } from "next";

import About from "@/sections/home/About";
import CategoriesPreview from "@/sections/home/CategoriesPreview";
import Hero from "@/sections/home/Hero";
import Products from "@/sections/home/Products";
import WhyChooseUs from "@/sections/home/WhyChooseUs";
import FAQ from "@/sections/home/FAQ";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Clothing Wholesale in Madurai | Limra Clothing",

  description:
    "Limra Clothing is a clothing wholesale and retail supplier in Madurai, Tamil Nadu, offering quality ready-made garments and distribution services across Tamil Nadu.",

  keywords: [
    "clothing wholesale in Madurai",
    "wholesale clothing Madurai",
    "clothing supplier Madurai",
    "garment wholesale Tamil Nadu",
    "clothing distributor Tamil Nadu",
    "wholesale garments Tamil Nadu",
    "Limra Clothing",
    "limra clothing madurai",
    "best clothing shop in madurai",
    "menswear wholesale madurai",
    "family textile store tamil nadu",
    "readymade garments supplier madurai",
    "readymade dress shop in madurai",
    "budget mens wear shop madurai",
    "gents dress collection madurai",
    "boys wear store near me",
  ],

  alternates: {
    canonical: siteConfig.url,
  },

  openGraph: {
    title: "Limra Clothing | Wholesale & Retail Menswear Madurai",
    description: "Quality men's shirts, t-shirts, trousers & boys' wear at unbeatable factory prices.",
    url: siteConfig.url,
    siteName: "Limra Clothing",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Clothing Wholesale in Madurai | Limra Clothing",
    description:
      "Quality clothing wholesale and retail distribution from Madurai across Tamil Nadu.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <CategoriesPreview />
      <Products />
      <WhyChooseUs />
      <FAQ />
    </main>
  );
}