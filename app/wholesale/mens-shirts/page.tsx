import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";

const canonicalUrl = `${siteConfig.url}/wholesale/mens-shirts`;

const title = "Men's Shirts Wholesale Supplier in Madurai";
const description =
  "Enquire with Limra Clothing in Madurai for men's shirts wholesale. Retailers and bulk buyers can contact us to discuss shirt styles, availability, order quantities and delivery arrangements across Tamil Nadu.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "mens shirts wholesale Madurai",
    "men's shirt wholesale supplier Tamil Nadu",
    "wholesale shirts Madurai",
    "mens garments wholesale Tamil Nadu",
    "bulk shirts for retailers",
    "mens clothing wholesaler Madurai",
  ],
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: `${title} | ${siteConfig.name}`,
    description,
    url: canonicalUrl,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "Where can retailers enquire about men's shirts wholesale in Madurai?",
    answer:
      "Retailers and bulk buyers can contact Limra Clothing in Madurai to ask about available men's shirt styles, pricing, order quantities and fulfilment arrangements.",
  },
  {
    question: "Can retailers outside Madurai enquire?",
    answer:
      "Yes. Retailers across Tamil Nadu can contact Limra Clothing to discuss their requirements and confirm delivery options for their location.",
  },
  {
    question: "How can I check wholesale prices and availability?",
    answer:
      "Send a WhatsApp enquiry with the shirt styles you need and your approximate quantity. Prices, stock availability and order terms can then be confirmed directly.",
  },
  {
    question: "Can I enquire before placing a bulk order?",
    answer:
      "Yes. Contact the team first to discuss product availability, minimum order requirements and delivery arrangements before confirming your order.",
  },
];

export default function MensShirtsWholesalePage() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Hello Limra Clothing, I am interested in men's shirts wholesale. Please share available styles, wholesale prices, order quantities and delivery details."
  )}`;
  const phoneUrl = `tel:+91${siteConfig.contact.phone}`;

  return (
    <main>
      <section className="bg-[#081A4A] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/65">
            <Link href="/" className="hover:text-[#C89B3C]">Home</Link>
            {" / "}
            <Link href="/wholesale" className="hover:text-[#C89B3C]">Wholesale</Link>
            {" / Men's Shirts"}
          </nav>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Wholesale Menswear · Madurai
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Men's Shirts Wholesale Supplier in Madurai
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
            Looking for men's shirts for your clothing shop or resale business?
            Contact Limra Clothing to discuss available shirt styles, bulk
            requirements, pricing and delivery arrangements across Tamil Nadu.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 font-bold text-[#081A4A] transition-transform hover:-translate-y-0.5"
            >
              <MessageCircle className="h-5 w-5" />
              Enquire on WhatsApp
            </a>
            <a
              href={phoneUrl}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-bold text-white hover:border-[#C89B3C] hover:text-[#C89B3C]"
            >
              <Phone className="h-5 w-5" />
              Call Limra Clothing
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
              Wholesale shirt enquiries for retailers and bulk buyers
            </h2>
            <p className="mt-5 leading-8 text-gray-600">
              Limra Clothing is a Madurai-based wholesale and retail garment
              business. We welcome enquiries from clothing retailers, shop
              owners and resellers looking for men's shirts. Contact us to
              discuss your requirements and check current product availability
              before placing an order.
            </p>
            <p className="mt-4 leading-8 text-gray-600">
              If you are sourcing stock for a new shop or replenishing an
              existing collection, share your preferred styles and approximate
              quantities with our team. Buyers outside Madurai can also enquire
              about delivery arrangements to their location.
            </p>
            <Link
              href="/categories/mens-shirts"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-[#081A4A] underline decoration-[#C89B3C] underline-offset-4"
            >
              Explore men's shirt products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
              What to include in your enquiry
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-gray-600">
              <li>• Your shop or resale business location</li>
              <li>• Shirt styles or product types you need</li>
              <li>• Approximate quantity and size requirements</li>
              <li>• Your expected budget, if applicable</li>
              <li>• Your delivery location</li>
            </ul>
            <p className="mt-5 text-sm leading-6 text-gray-500">
              Prices, stock, minimum quantities and delivery terms must be
              confirmed directly with Limra Clothing.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="font-serif text-3xl font-semibold text-[#081A4A]">
            Men's shirts wholesale FAQs
          </h2>
          <div className="mt-7 divide-y divide-gray-200">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-5">
                <h3 className="text-lg font-semibold text-[#081A4A]">
                  {faq.question}
                </h3>
                <p className="mt-2 leading-7 text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 leading-7 text-gray-600">
            Looking for other garment categories? Visit our{" "}
            <Link href="/wholesale" className="font-semibold text-[#081A4A] underline">
              wholesale clothing page
            </Link>{" "}
            or browse our{" "}
            <Link href="/categories" className="font-semibold text-[#081A4A] underline">
              product categories
            </Link>.
          </p>
        </div>
      </section>

      <section className="bg-[#081A4A] px-4 py-14 text-center text-white sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
          Enquire about men's shirts in bulk
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/70">
          Contact Limra Clothing in Madurai to discuss your stock requirements,
          pricing, availability and delivery options.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 font-bold text-[#081A4A]"
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp Limra Clothing
        </a>
      </section>
    </main>
  );
}
