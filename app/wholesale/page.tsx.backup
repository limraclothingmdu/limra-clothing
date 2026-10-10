import type { Metadata } from "next";

import WholesaleHero from "@/sections/wholesale/WholesaleHero";
import WholesaleBenefits from "@/sections/wholesale/WholesaleBenefits";
import WholesaleCTA from "@/sections/wholesale/WholesaleCTA";
import { siteConfig } from "@/lib/site";

const canonicalUrl = `${siteConfig.url}/wholesale`;

export const metadata: Metadata = {
  title: "Textile & Garment Wholesalers in Madurai | Limra Clothing",

  description:
  "Limra Clothing is a leading readymade garment and clothing wholesaler in Madurai, Tamil Nadu, supplying men's shirts, T-shirts, pants and kids wear to retailers, wholesalers and businesses across Tamil Nadu.",
  keywords: [
    "wholesale clothing Madurai",
    "wholesale garments Madurai",
    "clothing supplier Madurai",
    "wholesale clothing Tamil Nadu",
    "garments distributor Tamil Nadu",
    "wholesale shirts Tamil Nadu",
    "wholesale pants Tamil Nadu",
    "ready made garments wholesale",
    "textile wholesale market madurai",
    "readymade garment wholesalers tamil nadu",
    "moththa vilai thuni kadai madurai",
    "mens shirt wholesaler madurai",
    "bulk clothing suppliers erode madurai",
  ],

  alternates: {
    canonical: canonicalUrl,
  },

  openGraph: {
    title: `Wholesale Clothing in Madurai | ${siteConfig.name}`,
    description:
      "Wholesale ready-made garments from Madurai with clothing distribution across Tamil Nadu.",
    url: canonicalUrl,
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
  },

  twitter: {
    card: "summary_large_image",
    title: `Wholesale Clothing in Madurai | ${siteConfig.name}`,
    description:
      "Wholesale ready-made garments from Madurai with clothing distribution across Tamil Nadu.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function WholesalePage() {
  return (
    <main>
      <WholesaleHero />

      <WholesaleBenefits />

      <WholesaleCTA />
    </main>
  );
}