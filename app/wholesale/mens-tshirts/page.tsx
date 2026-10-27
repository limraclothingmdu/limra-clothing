import type { Metadata } from "next";
import Link from "next/link";

const pageUrl = "https://www.limraclothing.in/wholesale/mens-tshirts";

const whatsappUrl =
  "https://wa.me/918220523907?text=" +
  encodeURIComponent(
    "Hello Limra Clothing, I am interested in wholesale men's T-shirts. Please share available styles, sizes, quantities and wholesale pricing."
  );

export const metadata: Metadata = {
  title: "Men's T-Shirts Wholesale in Madurai | Limra Clothing",
  description:
    "Looking for men's T-shirts wholesale in Madurai? Contact Limra Clothing to enquire about available styles, sizes, bulk orders and delivery across Tamil Nadu.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Men's T-Shirts Wholesale Supplier | Limra Clothing",
    description:
      "Wholesale enquiries for men's T-shirts from Limra Clothing in Madurai. Ask about available products and bulk order options.",
    url: pageUrl,
    type: "website",
    siteName: "Limra Clothing",
  },
  twitter: {
    card: "summary_large_image",
    title: "Men's T-Shirts Wholesale | Limra Clothing",
    description:
      "Enquire about men's T-shirts and bulk garment orders with Limra Clothing, Madurai.",
  },
};

const faqs = [
  {
    question: "Where can I enquire about men's T-shirts wholesale in Madurai?",
    answer:
      "Contact Limra Clothing through WhatsApp or phone to ask about available T-shirt styles, sizes, quantities and wholesale pricing.",
  },
  {
    question: "Can clothing shops enquire about bulk T-shirt orders?",
    answer:
      "Yes. Retailers, garment shops and resellers can contact our team to discuss their requirements and available wholesale options.",
  },
  {
    question: "Which sizes and styles are available?",
    answer:
      "Available styles, colours, sizes and materials depend on current stock. Contact Limra Clothing to confirm product details before ordering.",
  },
  {
    question: "Do you handle enquiries from across Tamil Nadu?",
    answer:
      "Customers across Tamil Nadu and other parts of India can contact us about product availability and shipping. Charges and delivery times depend on the destination and order.",
  },
];

export default function MensTshirtsWholesalePage() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <section className="bg-[#081A4A] px-5 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#C89B3C]">
            Limra Clothing · Madurai, Tamil Nadu
          </p>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-5xl">
            Men's T-Shirts Wholesale Supplier in Madurai
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-200 sm:text-lg">
            Sourcing men's T-shirts for your clothing shop or resale
            business? Contact Limra Clothing to enquire about available
            styles, sizes, bulk quantities and wholesale prices.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#C89B3C] px-6 py-3 font-semibold text-[#081A4A] transition hover:bg-amber-300"
            >
              Enquire on WhatsApp
            </a>
            <a
              href="tel:+918220523907"
              className="rounded-lg border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Call Limra Clothing
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-[#081A4A] sm:text-3xl">
              Wholesale Men's T-Shirts for Retailers
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Men's T-shirts are a common category for clothing retailers
              and resellers. Limra Clothing welcomes enquiries from garment
              shops, retailers and bulk buyers in Madurai and across Tamil
              Nadu who want to discuss their T-shirt sourcing requirements.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Before placing an order, confirm available designs, colours,
              sizes, fabric details, quantities and wholesale rates with
              our team. Stock and order terms may vary.
            </p>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-xl font-bold text-[#081A4A]">
              What to Enquire About
            </h2>

            <ul className="mt-4 space-y-3 text-slate-700">
              <li>• Available men's T-shirt styles</li>
              <li>• Sizes and colour options</li>
              <li>• Fabric and product details</li>
              <li>• Bulk quantities and pricing</li>
              <li>• Shipping and delivery charges</li>
            </ul>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Confirm current availability directly with Limra Clothing.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-[#081A4A] sm:text-3xl">
            Explore More Wholesale Garments
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-600">
            Explore other Limra Clothing wholesale categories and contact
            us about your garment sourcing needs.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/wholesale/mens-shirts"
              className="rounded-xl border border-slate-200 bg-white p-5 font-semibold text-[#081A4A] hover:border-[#C89B3C]"
            >
              Men's Shirts Wholesale →
            </Link>

            <Link
              href="/wholesale/mens-trousers"
              className="rounded-xl border border-slate-200 bg-white p-5 font-semibold text-[#081A4A] hover:border-[#C89B3C]"
            >
              Men's Trousers Wholesale →
            </Link>

            <Link
              href="/wholesale/ladies-wear"
              className="rounded-xl border border-slate-200 bg-white p-5 font-semibold text-[#081A4A] hover:border-[#C89B3C]"
            >
              Ladies Wear Wholesale →
            </Link>

            <Link
              href="/wholesale/ladies-nighties"
              className="rounded-xl border border-slate-200 bg-white p-5 font-semibold text-[#081A4A] hover:border-[#C89B3C]"
            >
              Ladies Nighties Wholesale →
            </Link>

            <Link
              href="/wholesale"
              className="rounded-xl border border-slate-200 bg-white p-5 font-semibold text-[#081A4A] hover:border-[#C89B3C]"
            >
              All Wholesale Enquiries →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <h2 className="text-2xl font-bold text-[#081A4A] sm:text-3xl">
          Frequently Asked Questions
        </h2>

        <div className="mt-7 divide-y divide-slate-200">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="cursor-pointer list-none pr-6 font-semibold text-[#081A4A]">
                {faq.question}
                <span className="float-right text-[#C89B3C]">+</span>
              </summary>
              <p className="mt-3 leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-[#081A4A] px-5 py-12 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Need Men's T-Shirts in Bulk?
          </h2>

          <p className="mt-4 leading-7 text-slate-200">
            Contact Limra Clothing to discuss available products, quantities
            and wholesale pricing for your business.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex rounded-lg bg-[#C89B3C] px-6 py-3 font-semibold text-[#081A4A] hover:bg-amber-300"
          >
            Request Wholesale Details
          </a>
        </div>
      </section>
    </main>
  );
}
