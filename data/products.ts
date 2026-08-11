export type Product = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  keywords: string[];
};

export const products: Product[] = [
  {
    slug: "mens-casual-shirt",
    name: "Men's Casual Shirt",
    category: "mens-shirts",
    shortDescription:
      "Ready-made casual shirts suitable for wholesale clothing businesses and retailers.",
    description:
      "Explore men's casual shirts from Limra Clothing, suitable for retailers, wholesale buyers and clothing businesses in Madurai and across Tamil Nadu.",
    image: "/images/products/mens-casual-shirt.jpg",
    keywords: [
      "mens casual shirt wholesale",
      "mens shirts Madurai",
      "wholesale shirts Tamil Nadu",
      "ready made mens shirts",
    ],
  },

  {
    slug: "mens-cotton-tshirt",
    name: "Men's Cotton T-Shirt",
    category: "mens-tshirts",
    shortDescription:
      "Comfortable ready-made cotton T-shirts for wholesale buyers and retailers.",
    description:
      "Men's cotton T-shirts suitable for retailers, wholesale buyers and clothing businesses in Madurai and across Tamil Nadu.",
    image: "/images/products/mens-cotton-tshirt.webp",
    keywords: [
      "mens cotton tshirt wholesale",
      "cotton tshirts Madurai",
      "wholesale tshirts Tamil Nadu",
      "ready made tshirts",
    ],
  },

  {
    slug: "mens-formal-trouser",
    name: "Men's Formal Trouser",
    category: "mens-trousers",
    shortDescription:
      "Ready-made formal trousers for wholesale clothing businesses and retailers.",
    description:
      "Men's formal trousers suitable for retailers, wholesale buyers and clothing businesses in Madurai and across Tamil Nadu.",
    image: "/images/products/mens-formal-trouser.jpg",
    keywords: [
      "mens formal trousers wholesale",
      "mens trousers Madurai",
      "wholesale trousers Tamil Nadu",
      "ready made trousers",
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter(
    (product) => product.category === categorySlug
  );
}