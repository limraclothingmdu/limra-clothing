import type { Metadata } from "next";

export const siteConfig = {
  name: "Limra Clothing",
  shortName: "Limra",

  description:
    "Limra Clothing is a wholesale and retail textile business based in Madurai, offering shirts, pants, T-shirts and other ready-made garments, with distribution across Tamil Nadu.",

  url: "https://www.limraclothing.in",

  contact: {
    phone: "8220523907",
    whatsapp: "918220523907",
  },

  address: {
    street: "No. 25/3, 1st Floor, Solaiyalagupuram Main Road",
    city: "Madurai",
    postalCode: "625011",
    country: "IN",
  },

  gstin: "33CYFPV1813H1ZG",

  keywords: [
    "wholesale clothing Madurai",
    "retail clothing Madurai",
    "textile business Madurai",
    "ready made garments Madurai",
    "wholesale garments Tamil Nadu",
    "clothing distributor Tamil Nadu",
    "garments distributor Tamil Nadu",
    "wholesale shirts Tamil Nadu",
    "wholesale pants Tamil Nadu",
    "mens clothing Madurai",
  ] as string[],
};

export function createMetadata({
  title,
  description,
  path = "",
}: {
  title: string;
  description?: string;
  path?: string;
}): Metadata {
  const pageDescription =
    description ?? siteConfig.description;

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
