import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import "./globals.css";

import { siteConfig } from "@/lib/site";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/seo/StructuredData";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default:
      "Limra Clothing | Wholesale & Retail Clothing in Madurai",
    template: "%s | Limra Clothing",
  },

  description: siteConfig.description,

  keywords: siteConfig.keywords,

  authors: [
    {
      name: siteConfig.name,
    },
  ],

  creator: siteConfig.name,

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
    title:
      "Limra Clothing | Wholesale & Retail Clothing in Madurai",
    description: siteConfig.description,
    url: siteConfig.url,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" data-scroll-behavior="smooth">
    <body
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <StructuredData />
      <Navbar />
      {children}
      <Footer />
    </body>
  </html>
);
}