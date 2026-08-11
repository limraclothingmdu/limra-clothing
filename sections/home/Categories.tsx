import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Men's Shirts",
    description:
      "Explore ready-made shirts suitable for everyday wear, business use and retail requirements.",
    href: "/categories/mens-shirts",
  },
  {
    name: "Men's T-Shirts",
    description:
      "Comfortable and versatile T-shirts for everyday clothing needs.",
    href: "/categories/mens-tshirts",
  },
  {
    name: "Men's Trousers",
    description:
      "Ready-made trousers for everyday, formal and business wear.",
    href: "/categories/mens-trousers",
  },
  {
    name: "Boys' Wear",
    description:
      "Ready-made clothing options for boys and growing families.",
    href: "/categories/boys-wear",
  },
];

export default function Categories() {
  return (
    <section
      aria-labelledby="categories-heading"
      className="bg-[#F8F8F8] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Our Collections
            </p>

            <h2
              id="categories-heading"
              className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#081A4A] sm:text-5xl"
            >
              Shop Our Clothing Categories
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#222]/60 sm:text-base">
              Explore ready-made clothing collections available for
              retail customers and wholesale requirements.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#081A4A] transition-colors hover:text-[#C89B3C]"
          >
            View All Categories
            <ArrowUpRight className="h-4 w-4 text-[#C89B3C]" />
          </Link>
        </div>

        {/* Category Cards */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Number */}
              <span className="text-xs font-bold tracking-[0.15em] text-[#C89B3C]">
                0{index + 1}
              </span>

              <h3 className="mt-5 font-serif text-2xl font-semibold text-[#081A4A]">
                {category.name}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[#222]/55">
                {category.description}
              </p>

              <div className="mt-7 flex items-center justify-between">
                <span className="text-sm font-bold text-[#081A4A]">
                  Explore
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081A4A] transition-all duration-300 group-hover:bg-[#C89B3C]">
                  <ArrowUpRight className="h-4 w-4 text-[#C89B3C] transition-colors group-hover:text-[#081A4A]" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Distribution message */}
        <div className="mt-8 rounded-2xl border border-[#C89B3C]/20 bg-[#081A4A] px-6 py-5 sm:px-8">
          <p className="text-center text-sm leading-6 text-white/65">
            <span className="font-semibold text-[#C89B3C]">
              Wholesale & Retail
            </span>{" "}
            clothing from Madurai, with distribution across Tamil Nadu.
          </p>
        </div>
      </div>
    </section>
  );
}