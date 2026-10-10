import type { Metadata } from "next";

import WholesaleHero from "@/sections/wholesale/WholesaleHero";
import WholesaleBenefits from "@/sections/wholesale/WholesaleBenefits";
import WholesaleLadiesWear from "@/sections/wholesale/WholesaleLadiesWear";
import WholesaleCTA from "@/sections/wholesale/WholesaleCTA";
import { siteConfig } from "@/lib/site";

const canonicalUrl = `${siteConfig.url}/wholesale`;

const pageTitle = "Wholesale Clothing Supplier in Madurai";
const pageDescription =
  "Looking for wholesale clothing in Madurai? Limra Clothing supplies garments and ladies wear for retailers and bulk buyers, with distribution across Tamil Nadu.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,

  keywords: [
    "wholesale clothing supplier Madurai",
    "wholesale clothing Madurai",
    "wholesale garments Madurai",
    "ladies wear wholesale Madurai",
    "kurti wholesale supplier Tamil Nadu",
    "ladies garments wholesale Tamil Nadu",
    "clothing wholesaler Madurai",
    "wholesale clothing Tamil Nadu",
    "garments distributor Tamil Nadu",
    "ready made garments wholesale",
    "wholesale shirts Tamil Nadu",
    "wholesale pants Tamil Nadu",
    "mens clothing wholesale Madurai",
    "textile wholesale market Madurai",
    "moththa vilai thuni kadai Madurai",
  ],

  alternates: {
    canonical: canonicalUrl,
  },

  openGraph: {
    title: `${pageTitle} | ${siteConfig.name}`,
    description:
      "Source garments and ladies wear in bulk from Limra Clothing in Madurai. Enquire about wholesale orders and distribution across Tamil Nadu.",
    url: canonicalUrl,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: `${pageTitle} | ${siteConfig.name}`,
    description:
      "Wholesale garments and ladies wear from Madurai, with distribution across Tamil Nadu. Contact Limra Clothing for bulk enquiries.",
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
      <WholesaleLadiesWear />
      <WholesaleCTA />
    </main>
  );
}