import Link from "next/link";

const wholesaleCategories = [
  {
    title: "Ladies Wear Wholesale",
    description:
      "Enquire about ladies' wear, including available sets and nightwear categories.",
    href: "/wholesale/ladies-wear",
  },
  {
    title: "Ladies Nighties Wholesale",
    description:
      "Ask about ladies' nighties, nightwear styles, sizes and wholesale requirements.",
    href: "/wholesale/ladies-nighties",
  },
  {
    title: "Two-Piece Ladies Sets",
    description:
      "Enquire about available two-piece ladies' sets and wholesale order details.",
    href: "/wholesale/two-piece-sets",
  },
  {
    title: "Three-Piece Ladies Sets",
    description:
      "Ask about available three-piece ladies' sets, quantities and wholesale terms.",
    href: "/wholesale/three-piece-suits",
  },
  {
    title: "Men's Shirts Wholesale",
    description:
      "Enquire about men's shirt styles, bulk quantities and wholesale availability.",
    href: "/wholesale/mens-shirts",
  },
];

export default function WholesaleCategoryLinks() {
  return (
    <section
      aria-labelledby="wholesale-category-links-title"
      className="bg-white px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#9B7840]">
            Wholesale Categories
          </p>

          <h2
            id="wholesale-category-links-title"
            className="mt-3 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl"
          >
            Explore Wholesale Clothing Categories
          </h2>

          <p className="mt-5 text-base leading-7 text-[#444]">
            Limra Clothing welcomes enquiries from retailers, clothing shops
            and bulk buyers in Madurai and across Tamil Nadu. Explore the
            category pages below to discuss available products, quantities,
            pricing and delivery arrangements.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wholesaleCategories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group rounded-2xl border border-[#081A4A]/10 bg-[#FAF7F2] p-6 transition hover:border-[#C89B3C] hover:bg-white"
            >
              <h3 className="font-serif text-xl font-semibold text-[#081A4A]">
                {category.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#444]">
                {category.description}
              </p>

              <span className="mt-5 inline-flex font-semibold text-[#081A4A] group-hover:text-[#9B7840]">
                Explore category →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
