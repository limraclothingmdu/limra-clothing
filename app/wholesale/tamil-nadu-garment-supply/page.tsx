import type { Metadata } from "next";
import Link from "next/link";

const pageUrl =
  "https://www.limraclothing.in/wholesale/tamil-nadu-garment-supply";

const whatsappUrl =
  "https://wa.me/918220523907?text=" +
  encodeURIComponent(
    "Hello Limra Clothing, I am looking for wholesale garment supply in Tamil Nadu. Please share available products, wholesale pricing, and bulk order details."
  );

export const metadata: Metadata = {
  title: "Tamil Nadu Wholesale Garment Supplier | Limra Clothing, Madurai",
  description:
    "Looking for wholesale garment supply in Tamil Nadu? Contact Limra Clothing, Madurai, for men's shirts, ladies wear, nighties, and garment bulk enquiries.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Tamil Nadu Wholesale Garment Supply | Limra Clothing",
    description:
      "Wholesale garment enquiries for retailers and resellers across Tamil Nadu with Limra Clothing, based in Madurai.",
    url: pageUrl,
    siteName: "Limra Clothing",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tamil Nadu Wholesale Garment Supplier | Limra Clothing",
    description:
      "Wholesale garment enquiries for retailers and bulk buyers across Tamil Nadu.",
  },
};

const products = [
  {
    title: "Men's Shirts",
    description:
      "Enquire about men's shirts for clothing shops, retailers, and garment resellers.",
    href: "/wholesale/mens-shirts",
  },
  {
    title: "Ladies Wear",
    description:
      "Explore ladies wear categories, including two-piece and three-piece sets.",
    href: "/wholesale/ladies-wear",
  },
  {
    title: "Ladies Nighties",
    description:
      "Ask about available nighties and options suitable for retail resale.",
    href: "/wholesale/ladies-nighties",
  },
  {
    title: "Two-Piece Sets",
    description:
      "Enquire about two-piece ladies sets and current wholesale availability.",
    href: "/wholesale/two-piece-sets",
  },
  {
    title: "Three-Piece Sets",
    description:
      "Contact us about three-piece ladies suit sets for bulk purchasing.",
    href: "/wholesale/three-piece-suits",
  },
  {
    title: "Men's T-Shirts",
    description:
      "Check current availability and wholesale options for men's T-shirts.",
    href: "/wholesale/mens-tshirts",
  },
];

const faqs = [
  {
    question: "Does Limra Clothing supply garments across Tamil Nadu?",
    answer:
      "Limra Clothing is based in Madurai and welcomes wholesale enquiries from retailers and resellers across Tamil Nadu. Contact us to discuss your location, products, and delivery requirements.",
  },
  {
    question: "What garment categories can I enquire about?",
    answer:
      "You can enquire about men's shirts, men's T-shirts, ladies wear, nighties, two-piece sets, and three-piece sets. Product availability may vary, so confirm current options with our team.",
  },
  {
    question: "Can clothing shops enquire about bulk orders?",
    answer:
      "Yes. Retailers, clothing shops, and resellers can contact Limra Clothing to discuss product selection, quantities, pricing, and order requirements.",
  },
  {
    question: "How do I get wholesale prices?",
    answer:
      "Contact us through WhatsApp with the garment category, required quantity, and delivery location. Our team can discuss current availability and applicable pricing.",
  },
  {
    question: "Do you deliver outside Madurai?",
    answer:
      "Delivery arrangements depend on the order and destination. Contact us with your delivery location to confirm shipping options, charges, and estimated transit time.",
  },
];

export default function TamilNaduGarmentSupplyPage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <section className="bg-[#081A4A] px-5 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
            Limra Clothing · Madurai, Tamil Nadu
          </p>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
            Tamil Nadu Wholesale Garment Supply for Retailers and Bulk Buyers
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
            Looking for a wholesale garment supplier in Tamil Nadu?
            Limra Clothing, based in Madurai, welcomes enquiries from
            clothing shops, retailers, resellers, and businesses looking
            to source men's shirts, ladies wear, nighties, and other
            available garment categories.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-[#C89B3C] px-6 py-3 font-semibold text-[#081A4A] transition hover:bg-yellow-400"
            >
              Enquire About Wholesale Supply
            </a>

            <Link
              href="/wholesale"
              className="inline-flex rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Explore Wholesale
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-[#081A4A] sm:text-3xl">
              Wholesale Garments from Madurai, Tamil Nadu
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Finding suitable garment products and a reliable supply
              arrangement matters to every retailer. Limra Clothing
              provides a point of contact for businesses looking to
              enquire about garment categories, bulk purchasing, current
              product availability, and delivery requirements.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Whether your shop is in Madurai or another part of Tamil
              Nadu, share your requirements with us. We can discuss the
              products you need, available styles, order quantities,
              applicable wholesale pricing, and shipping arrangements.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Product availability, order conditions, and delivery
              options should be confirmed before placing an order.
              Contact our team for details relevant to your business.
            </p>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-[#081A4A]">
              Who Can Contact Us?
            </h2>

            <ul className="mt-5 space-y-3 text-slate-600">
              <li>• Clothing shop owners</li>
              <li>• Garment retailers and resellers</li>
              <li>• Small and growing fashion businesses</li>
              <li>• Buyers enquiring about bulk garment orders</li>
              <li>• Businesses sourcing garments within Tamil Nadu</li>
            </ul>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex font-semibold text-[#081A4A] underline decoration-[#C89B3C] decoration-2 underline-offset-4"
            >
              Discuss your requirements
            </a>
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-[#081A4A] sm:text-3xl">
            Garment Categories for Wholesale Enquiries
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            Browse our category pages to identify products relevant to
            your shop. Contact us to confirm current stock, styles,
            pricing, and bulk order requirements.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.href}
                className="rounded-xl border border-slate-200 bg-white p-6 transition hover:border-[#C89B3C] hover:shadow-md"
              >
                <h3 className="text-lg font-bold text-[#081A4A]">
                  {product.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {product.description}
                </p>

                <Link
                  href={product.href}
                  className="mt-5 inline-flex font-semibold text-[#081A4A] underline decoration-[#C89B3C] underline-offset-4"
                >
                  Explore category
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-[#081A4A] sm:text-3xl">
            How to Enquire About Wholesale Garment Supply
          </h2>

          <ol className="mt-7 space-y-5">
            <li className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#081A4A] font-bold text-white">
                1
              </span>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Tell us which garments you need
                </h3>
                <p className="mt-1 leading-7 text-slate-600">
                  Mention the category, preferred styles, and any
                  specific product requirements.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#081A4A] font-bold text-white">
                2
              </span>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Share quantity and destination
                </h3>
                <p className="mt-1 leading-7 text-slate-600">
                  Tell us the quantity you are considering and the town
                  or city where the order needs to be delivered.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#081A4A] font-bold text-white">
                3
              </span>
              <div>
                <h3 className="font-semibold text-slate-800">
                  Confirm pricing and delivery
                </h3>
                <p className="mt-1 leading-7 text-slate-600">
                  Check availability, applicable pricing, order terms,
                  shipping charges, and estimated delivery before
                  confirming your purchase.
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-8">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-[#081A4A] px-6 py-3 font-semibold text-white transition hover:bg-blue-950"
            >
              Contact Limra Clothing on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-[#081A4A] sm:text-3xl">
            Frequently Asked Questions
          </h2>

          <div className="mt-7 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer list-none font-semibold text-[#081A4A]">
                  {faq.question}
                  <span className="float-right ml-4 text-[#C89B3C] group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14">
        <div className="mx-auto max-w-6xl rounded-2xl bg-[#081A4A] px-6 py-10 text-center text-white sm:px-12 sm:py-14">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Looking for a Wholesale Garment Supplier in Tamil Nadu?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-200">
            Contact Limra Clothing in Madurai to discuss your garment
            requirements, current product availability, wholesale
            pricing, and delivery options.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex rounded-lg bg-[#C89B3C] px-6 py-3 font-semibold text-[#081A4A] transition hover:bg-yellow-400"
          >
            Send a Wholesale Enquiry
          </a>
        </div>
      </section>
    </main>
  );
}
