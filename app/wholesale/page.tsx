import type { Metadata } from "next";

import WholesaleHero from "@/sections/wholesale/WholesaleHero";
import WholesaleBenefits from "@/sections/wholesale/WholesaleBenefits";
import WholesaleLadiesWear from "@/sections/wholesale/WholesaleLadiesWear";
import WholesaleCTA from "@/sections/wholesale/WholesaleCTA";
import { siteConfig } from "@/lib/site";

const canonicalUrl = `${siteConfig.url}/wholesale`;

export const metadata: Metadata = {
  title: "Wholesale Clothing & Ladies Wear in Madurai",

  description:
    "Explore wholesale clothing and ladies wear at Limra Clothing in Madurai, Tamil Nadu. Enquire about available kurtis, garments, bulk orders and distribution across Tamil Nadu.",

  keywords: [
    "wholesale clothing Madurai",
    "wholesale garments Madurai",
    "ladies wear wholesale Madurai",
    "wholesale kurtis Tamil Nadu",
    "kurti wholesale supplier",
    "ladies garments wholesale Tamil Nadu",
    "clothing supplier Madurai",
    "wholesale clothing Tamil Nadu",
    "garments distributor Tamil Nadu",
    "wholesale shirts Tamil Nadu",
    "wholesale pants Tamil Nadu",
    "ready made garments wholesale",
    "textile wholesale market Madurai",
    "moththa vilai thuni kadai madurai",
    "mens shirt wholesaler madurai",
  ],

  alternates: {
    canonical: canonicalUrl,
  },

  openGraph: {
    title: `Wholesale Clothing & Ladies Wear in Madurai | ${siteConfig.name}`,
    description:
      "Enquire about wholesale clothing and ladies wear from Limra Clothing in Madurai, with distribution across Tamil Nadu.",
    url: canonicalUrl,
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
  },

  twitter: {
    card: "summary_large_image",
    title: `Wholesale Clothing & Ladies Wear in Madurai | ${siteConfig.name}`,
    description:
      "Discover wholesale clothing and ladies wear from Limra Clothing in Madurai, Tamil Nadu.",
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
      <WholesaleLadiesWear />
      <WholesaleCTA />
    </main>
  );
}

