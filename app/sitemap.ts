import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

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

const categoryRoutes = [
  "/categories/mens-shirts",
  "/categories/mens-tshirts",
  "/categories/mens-trousers",
  "/categories/boys-wear",
];

const productRoutes = [
  "/products/mens-casual-shirt",
  "/products/mens-cotton-tshirt",
  "/products/mens-formal-trouser",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const categoryEntries = categoryRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productEntries = productRoutes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries, ...productEntries];
}