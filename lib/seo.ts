import type { Metadata } from "next";
import { siteConfig } from "./site";

export function createMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const pageDescription = description ?? siteConfig.description;
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description: pageDescription,

    keywords: siteConfig.keywords,

    metadataBase: new URL(siteConfig.url),

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description: pageDescription,
      url,
      siteName: siteConfig.name,
      locale: "en_IN",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description: pageDescription,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}