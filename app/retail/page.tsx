import type { Metadata } from "next";

import RetailHero from "@/sections/retail/RetailHero";
import RetailCategories from "@/sections/retail/RetailCategories";
import RetailCTA from "@/sections/retail/RetailCTA";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Retail Clothing in Madurai",
  description:
  "Shop shirts, pants, T-shirts and ready-made clothing from Limra Clothing, a wholesale and retail clothing business in Madurai, Tamil Nadu.",
  keywords: [
    "retail clothing Madurai",
    "clothing shop Madurai",
    "textile shop Madurai",
    "ready made clothes Madurai",
    "mens clothing Madurai",
    "shirts Madurai",
    "pants Madurai",
    "readymade dress shop in madurai",
    "budget mens wear shop madurai",
    "gents dress collection madurai",
    "boys wear store near me",
  ],
  alternates: {
    canonical: `${siteConfig.url}/retail`,
  },
  openGraph: {
    title: `Retail Clothing in Madurai | ${siteConfig.name}`,
    description:
      "Explore ready-made clothing products from Limra Clothing in Madurai.",
    url: `${siteConfig.url}/retail`,
    type: "website",
  },
};

export default function RetailPage() {
  return (
    <main>
      <RetailHero />
      <RetailCategories />
      <RetailCTA />
    </main>
  );
}