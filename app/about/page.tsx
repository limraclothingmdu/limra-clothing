import type { Metadata } from "next";

import AboutHero from "@/sections/about/AboutHero";
import AboutStory from "@/sections/about/AboutStory";
import AboutValues from "@/sections/about/AboutValues";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Limra Clothing | Madurai Garment Business",
  description:
  "Learn about Limra Clothing, a ready-made clothing business in Madurai serving wholesale buyers, retailers and clothing businesses across Tamil Nadu.",
  keywords: [
    "about Limra Clothing",
    "wholesale clothing Madurai",
    "ready made garments Madurai",
    "clothing wholesale business",
  ],
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: `About Limra Clothing | Madurai Garment Business`,
    description:
      "Discover Limra Clothing, a ready-made garment business in Madurai serving wholesale buyers and retailers across Tamil Nadu.",
    url: `${siteConfig.url}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <AboutStory />
      <AboutValues />
    </main>
  );
}
