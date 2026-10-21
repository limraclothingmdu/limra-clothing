import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, PackageSearch, MapPin, ArrowRight } from "lucide-react";

import { siteConfig } from "@/lib/site";

const pageUrl = `${siteConfig.url}/tamil-nadu-wholesale-clothing`;

export const metadata: Metadata = {
  title: "Wholesale Clothing Supplier Across Tamil Nadu | Limra Clothing",
  description:
    "Explore wholesale clothing options from Limra Clothing, a Madurai-based garment business serving wholesale and retail customers. Ask about products, bulk requirements, current stock and distribution across Tamil Nadu.",
  keywords: [
    "wholesale clothing Tamil Nadu",
    "wholesale garments supplier Tamil Nadu",
    "clothing wholesaler Tamil Nadu",
    "ready made garments wholesale Tamil Nadu",
    "wholesale shirts Tamil Nadu",
    "wholesale pants Tamil Nadu",
    "ladies wear wholesale Tamil Nadu",
    "garment supplier for retailers Tamil Nadu",
  ],
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Wholesale Clothing Across Tamil Nadu | Limra Clothing",
    description:
      "Contact Limra Clothing in Madurai about garment categories, bulk requirements, product availability and distribution across Tamil Nadu.",
    url: pageUrl,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};


const buyerQuestions = [
  {
    question: "What clothing products can I enquire about?",
    answer:
      "You can enquire about available men's shirts and ladies' wear, including two-piece sets, three-piece sets, nightwear and Bombay nighties. Contact Limra Clothing to confirm current stock, designs and sizes.",
  },
  {
    question: "Can retailers enquire about wholesale orders?",
    answer:
      "Yes. Retailers and bulk buyers can contact Limra Clothing to discuss garment requirements, applicable order quantities, wholesale pricing and product availability.",
  },
  {
    question: "Does Limra Clothing serve buyers across Tamil Nadu?",
    answer:
      "Limra Clothing is based in Madurai, Tamil Nadu, and serves buyers across the state. Contact the business to confirm delivery or distribution arrangements for your location.",
  },
  {
    question: "How can I check wholesale prices and stock?",
    answer:
      "Wholesale prices and availability may vary by product and order. Share the garments you need and your approximate quantity through WhatsApp or the contact page to request current details.",
  },
];


export default function TamilNaduWholesaleClothingPage() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Hello Limra Clothing, I would like to enquire about wholesale clothing. Please share current product availability, pricing and order requirements."
  )}`;

  return (
    <main className="bg-white text-[#1A1A1A]">
      <section className="bg-[#081A4A] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-white/60">
            <Link href="/" className="hover:text-[#C89B3C]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/wholesale" className="hover:text-[#C89B3C]">
              Wholesale
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Tamil Nadu</span>
          </nav>

          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Wholesale Garments · Tamil Nadu
            </p>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Wholesale Clothing Supplier Across Tamil Nadu
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/75 sm:text-lg">
              Limra Clothing is a Madurai-based wholesale and retail garment
              business. Retailers and buyers can enquire about ready-made
              clothing, product availability, bulk requirements and distribution
              arrangements across Tamil Nadu.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A] transition-colors hover:bg-white"
              >
                <MessageCircle className="h-4 w-4" />
                Enquire on WhatsApp
              </a>

              <Link
                href="/products/wholesale"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:border-[#C89B3C] hover:text-[#C89B3C]"
              >
                Browse Wholesale Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9A7122]">
              For Retailers and Bulk Buyers
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
              Find the Right Garments for Your Business
            </h2>

            <p className="mt-5 leading-8 text-[#444]">
              When choosing a wholesale clothing supplier, buyers need clear
              information about garment types, designs, available sizes,
              pricing and order quantities. Limra Clothing welcomes enquiries
              from buyers who want to discuss their clothing requirements
              directly with the business.
            </p>

            <p className="mt-4 leading-8 text-[#444]">
              Start by reviewing the available products. You can then contact
              the team with the garment types you need, your approximate
              quantity and your location. This helps you confirm current stock,
              pricing and whether suitable distribution arrangements are
              available for your order.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 font-semibold text-[#081A4A] underline decoration-[#C89B3C] underline-offset-4"
              >
                Explore clothing categories
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 font-semibold text-[#081A4A] underline decoration-[#C89B3C] underline-offset-4"
              >
                Contact Limra Clothing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-[#081A4A]/10 bg-[#F8F8F8] p-7 sm:p-9">
            <PackageSearch className="h-8 w-8 text-[#9A7122]" />

            <h2 className="mt-5 font-serif text-2xl font-semibold text-[#081A4A]">
              What to Confirm Before Ordering
            </h2>

            <ul className="mt-5 space-y-4 text-sm leading-7 text-[#444]">
              <li>Garment category, design and available sizes</li>
              <li>Current stock and product-specific pricing</li>
              <li>Minimum or applicable order quantity, if any</li>
              <li>Payment, dispatch and delivery arrangements</li>
              <li>Availability of the selected products for your location</li>
            </ul>

            <div className="mt-7 flex items-start gap-3 border-t border-[#081A4A]/10 pt-5">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#9A7122]" />
              <div>
                <p className="font-semibold text-[#081A4A]">
                  Based in Madurai, Tamil Nadu
                </p>
                <p className="mt-1 text-sm leading-6 text-[#555]">
                  Contact the business to confirm distribution arrangements
                  for your location.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#F8F8F8] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9A7122]">
            Wholesale Buyer Guide
          </p>

          <h2 className="mt-3 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <div className="mt-8 divide-y divide-[#081A4A]/10">
            {buyerQuestions.map((item) => (
              <article key={item.question} className="py-6">
                <h3 className="text-lg font-semibold text-[#081A4A]">
                  {item.question}
                </h3>
                <p className="mt-3 leading-7 text-[#444]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#081A4A] px-4 py-14 text-center text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
            Discuss Your Wholesale Requirements
          </h2>

          <p className="mt-4 leading-7 text-white/70">
            Tell Limra Clothing which garments you are looking for and where
            your business is located. Contact the team to confirm products,
            pricing and order arrangements.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Limra Clothing
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white hover:border-[#C89B3C] hover:text-[#C89B3C]"
            >
              Contact Details
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
