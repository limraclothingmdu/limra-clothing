export type Category = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  keywords: string[];
};

export const categories: Category[] = [
  {
    slug: "mens-shirts",
    name: "Men's Shirts",
    shortDescription: "Ready-made shirts for wholesale buyers and retailers.",
    description:
      "Explore our men's shirt collection designed for wholesale clothing buyers and retailers.",
    image: "/images/categories/mens-shirts.jpg",
    keywords: [
      "mens shirts wholesale",
      "wholesale shirts Madurai",
      "ready made mens shirts",
    ],
  },

  {
    slug: "mens-tshirts",
    name: "Men's T-Shirts",
    shortDescription: "Everyday ready-made T-shirts for wholesale businesses.",
    description:
      "Discover men's ready-made T-shirts suitable for retailers and wholesale clothing businesses.",
    image: "/images/categories/mens-tshirts.webp",
    keywords: [
      "mens tshirts wholesale",
      "wholesale tshirts Madurai",
      "ready made tshirts",
    ],
  },

  {
    slug: "mens-trousers",
    name: "Men's Trousers",
    shortDescription: "Wholesale-ready trousers for men's clothing businesses.",
    description:
      "Browse men's trousers suitable for retailers and wholesale buyers.",
    image: "/images/categories/mens-trousers.jpg",
    keywords: [
      "mens trousers wholesale",
      "wholesale trousers Madurai",
      "ready made trousers",
    ],
  },

  {
    slug: "boys-wear",
    name: "Boys' Wear",
    shortDescription: "Ready-made clothing options for boys.",
    description:
      "Explore boys' ready-made clothing options for wholesale buyers and retailers.",
    image: "/images/categories/boys-wear.webp",
    keywords: [
      "boys wear wholesale",
      "kids clothing wholesale Madurai",
      "boys garments",
    ],
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}