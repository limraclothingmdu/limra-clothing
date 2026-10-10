import Link from "next/link";

import { getCategoryBySlug } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { siteConfig } from "@/lib/site";
import ProductCard from "@/components/products/ProductCard";

export default async function WholesaleLadiesWear() {
  const category = await getCategoryBySlug("ladies-wear");

  const products = category
    ? await getProductsByCategory(category.id)
    : [];

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Hello Limra Clothing, I am interested in wholesale kurtis and ladies wear. Please share the available designs and wholesale details."
  )}`;

  return (
    <section
      aria-labelledby="wholesale-ladies-wear-title"
      className="bg-[#FAF7F2] px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9B7840]">
            Ladies Wear Wholesale
          </p>

          <h2
            id="wholesale-ladies-wear-title"
            className="mt-3 font-serif text-3xl font-bold text-[#081A4A] sm:text-4xl"
          >
            Wholesale Kurtis &amp; Ladies Wear in Madurai
          </h2>

          <p className="mt-5 text-base leading-7 text-[#444] sm:text-lg">
            Explore available ladies wear at Limra Clothing in Madurai.
            Retailers and bulk buyers across Tamil Nadu can contact us to
            enquire about current designs, sizes, availability and wholesale
            order details.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                hrefPrefix="/products"
                priceType="wholesale"
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-[#081A4A]/10 bg-white p-6 text-center">
            <p className="text-[#444]">
              Contact us to enquire about current ladies wear designs and
              wholesale availability.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#081A4A] px-7 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#132963]"
          >
            Enquire on WhatsApp
          </a>

          <Link
            href="/products/wholesale"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#081A4A]/20 px-7 py-3 text-center text-sm font-semibold text-[#081A4A] transition hover:bg-white"
          >
            View All Wholesale Products
          </Link>
        </div>
      </div>
    </section>
  );
}
