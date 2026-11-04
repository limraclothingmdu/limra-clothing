import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";
import WholesaleHero from "@/sections/wholesale/WholesaleHero";
import WholesaleBenefits from "@/sections/wholesale/WholesaleBenefits";
import WholesaleCategoryLinks from "@/sections/wholesale/WholesaleCategoryLinks";
import WholesaleLadiesWear from "@/sections/wholesale/WholesaleLadiesWear";
import WholesaleCTA from "@/sections/wholesale/WholesaleCTA";

const canonicalUrl = `${siteConfig.url}/wholesale`;

const pageTitle = "Wholesale Clothing Supplier in Madurai";

const pageDescription =
  "Looking for wholesale clothing in Madurai? Limra Clothing welcomes retailers and bulk buyers enquiring about men's shirts, ladies' 2-piece and 3-piece sets, nightwear and Bombay nighties. Contact us to discuss current availability and wholesale supply across Tamil Nadu.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,

  keywords: [
    "wholesale clothing supplier Madurai",
    "wholesale clothing Madurai",
    "wholesale garments Madurai",
    "clothing wholesaler Madurai",
    "ladies wear wholesale Madurai",
    "ladies garments wholesale Tamil Nadu",
    "mens shirts wholesale Madurai",
    "wholesale shirts Tamil Nadu",
    "wholesale clothing Tamil Nadu",
    "garments distributor Tamil Nadu",
    "ready made garments wholesale",
    "textile wholesale market Madurai",
    "moththa vilai thuni kadai Madurai",
  ],

  alternates: {
    canonical: canonicalUrl,
  },

  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function WholesalePage() {
  return (
    <main>
      <WholesaleHero />
      <WholesaleBenefits />
      <WholesaleCategoryLinks />
      <WholesaleLadiesWear />
      <WholesaleCTA />
    </main>
  );
}
