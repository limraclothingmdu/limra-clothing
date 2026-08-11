import { siteConfig } from "@/lib/site";

type BreadcrumbItem = {
  name: string;
  url: string;
};

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${items[items.length - 1]?.url ?? siteConfig.url}/#breadcrumb`,

    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}