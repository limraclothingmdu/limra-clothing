
import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";
import { getCategories } from "@/lib/categories";
import { getProducts, getRetailProducts } from "@/lib/products";
import { getPublishedBlogs } from "@/lib/blog";

const staticRoutes = [
  {
    path: "",
    priority: 1.0,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/wholesale",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/wholesale/mens-shirts",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/wholesale/ladies-wear",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/wholesale/ladies-nighties",
    priority: 0.85,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/wholesale-clothing-madurai",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/tamil-nadu-wholesale-clothing",
    priority: 0.8,
    changeFrequency: "monthly" as const,
  },
  {
  path: "/wholesale/three-piece-suits",
  priority: 0.85,
  changeFrequency: "monthly" as const,
},
  {
    path: "/retail",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/retail/products",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/categories",
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/products",
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/blog",
    priority: 0.8,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/about",
    priority: 0.5,
    changeFrequency: "monthly" as const,
  },
  {
    path: "/contact",
    priority: 0.7,
    changeFrequency: "monthly" as const,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [categories, products, retailProducts, blogs] = await Promise.all([
    getCategories(),
    getProducts(),
    getRetailProducts(),
    getPublishedBlogs(),
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

  const retailProductEntries = retailProducts
    .filter((product) => product.is_active && product.retail_enabled)
    .map((product) => ({
      url: `${siteConfig.url}/retail/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const blogEntries = blogs.map((blog) => ({
    url: `${siteConfig.url}/blog/${blog.slug}`,
    lastModified: new Date(
      blog.updated_at || blog.published_at || blog.created_at
    ),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticEntries,
    ...categoryEntries,
    ...productEntries,
    ...retailProductEntries,
    ...blogEntries,
  ];
}
