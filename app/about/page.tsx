import type { Metadata } from "next";

import AboutHero from "@/sections/about/AboutHero";
import AboutStory from "@/sections/about/AboutStory";
import AboutValues from "@/sections/about/AboutValues";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
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
    title: `About Us | ${siteConfig.name}`,
    description:
      "Learn about Limra Clothing and our wholesale clothing business.",
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