import { siteConfig } from "@/lib/site";

type BreadcrumbItem = {
  name: string;
  url: string;
};

export function createBreadcrumbSchema(
  items: BreadcrumbItem[]
) {
  const lastItem = items[items.length - 1];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${
      lastItem?.url ?? siteConfig.url
    }/#breadcrumb`,

    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}