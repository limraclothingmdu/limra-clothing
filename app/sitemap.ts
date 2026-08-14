import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/products";

const staticRoutes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/wholesale", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/retail", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/categories", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/products", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const categoryEntries = categories
    .filter((category) => category.is_active)
    .map((category) => ({
      url: `${siteConfig.url}/categories/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const productEntries = products
    .filter((product) => product.is_active)
    .map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
  ];
}