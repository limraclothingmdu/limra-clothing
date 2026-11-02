import type { Metadata } from "next";

import About from "@/sections/home/About";
import CategoriesPreview from "@/sections/home/CategoriesPreview";
import Hero from "@/sections/home/Hero";
import Products from "@/sections/home/Products";
import WhyChooseUs from "@/sections/home/WhyChooseUs";
import FAQ from "@/sections/home/FAQ";
import { siteConfig } from "@/lib/site";


export const metadata: Metadata = {
  title: { absolute: "Wholesale Garments in Madurai | Limra Clothing" },
  description:
    "Limra Clothing is a wholesale and retail garment business in Madurai, Tamil Nadu. Explore men's shirts, ladies' wear and ready-made clothing, with wholesale enquiries and distribution across Tamil Nadu.",
  keywords: [
    "wholesale garments in Madurai",
    "wholesale clothing Madurai",
    "garment wholesaler Madurai",
    "wholesale garments Tamil Nadu",
    "men's shirts wholesale Madurai",
    "ladies wear wholesale Tamil Nadu",
    "ready-made garments supplier Madurai",
    "à®®à¯Šà®¤à¯à®¤ à®†à®Ÿà¯ˆ à®µà®¿à®±à¯à®ªà®©à¯ˆ à®®à®¤à¯à®°à¯ˆ",
    "à®†à®£à¯à®•à®³à¯ à®šà®Ÿà¯à®Ÿà¯ˆà®•à®³à¯ à®®à¯Šà®¤à¯à®¤ à®µà®¿à®±à¯à®ªà®©à¯ˆ",
    "à®ªà¯†à®£à¯à®•à®³à¯ à®†à®Ÿà¯ˆà®•à®³à¯ à®®à¯Šà®¤à¯à®¤ à®µà®¿à®±à¯à®ªà®©à¯ˆ",
    "Limra Clothing",
    "Limra Clothing Madurai",
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: { absolute: "Wholesale Garments in Madurai | Limra Clothing" },
    description:
      "Explore men's shirts, ladies' wear and ready-made garments from Limra Clothing in Madurai. Contact us for wholesale enquiries across Tamil Nadu.",
    url: siteConfig.url,
    siteName: "Limra Clothing",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: { absolute: "Wholesale Garments in Madurai | Limra Clothing" },
    description:
      "Men's shirts, ladies' wear and ready-made garments. Wholesale enquiries from Madurai, serving Tamil Nadu.",
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
  <Products />
  <About />
  <CategoriesPreview />
  <WhyChooseUs />
  <FAQ />
</main>
  );
}
