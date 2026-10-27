import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";

const canonicalUrl = `${siteConfig.url}/wholesale/ladies-wear`;

const title = "Ladies Wear Wholesale Supplier in Madurai";
const description =
  "Looking for ladies wear wholesale in Madurai? Contact Limra Clothing about available ladies' 2-piece sets, 3-piece sets, nightwear and Bombay nighties for retailers and bulk buyers.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "ladies wear wholesale Madurai",
    "ladies garments wholesale Tamil Nadu",
    "ladies clothing wholesale supplier",
    "ladies wear wholesaler Madurai",
    "ladies 2 piece sets wholesale",
    "ladies 3 piece sets wholesale",
    "ladies nightwear wholesale",
    "Bombay nighties wholesale",
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
    question: "Where can retailers enquire about ladies wear wholesale in Madurai?",
    answer:
      "Retailers and bulk buyers can contact Limra Clothing in Madurai to ask about available ladies' garments, pricing, order quantities and delivery arrangements.",
  },
  {
    question: "What types of ladies wear can I enquire about?",
    answer:
      "You can enquire about ladies' 2-piece sets, 3-piece sets, nightwear and Bombay nighties. Confirm current styles and stock availability directly with our team.",
  },
  {
    question: "Can buyers from other parts of Tamil Nadu contact Limra Clothing?",
    answer:
      "Yes. Buyers across Tamil Nadu can contact us to discuss their requirements and confirm whether delivery arrangements are available for their location.",
  },
  {
    question: "How do I get wholesale prices?",
    answer:
      "Send us a WhatsApp message with the product types and approximate quantities you need. Our team can discuss current prices, availability and applicable order terms.",
  },
];

export default function LadiesWearWholesalePage() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Hello Limra Clothing, I am interested in ladies wear wholesale. Please share available 2-piece sets, 3-piece sets, nightwear and Bombay nighties, along with prices and order details."
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
            {" / Ladies Wear"}
          </nav>

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Wholesale Ladies Wear · Madurai
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            Ladies Wear Wholesale Supplier in Madurai
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
            Sourcing ladies' garments for your clothing shop or resale business?
            Contact Limra Clothing to enquire about 2-piece sets, 3-piece sets,
            nightwear and Bombay nighties, including current availability,
            wholesale pricing and delivery arrangements.
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
              Ladies' garments for retailers and bulk buyers
            </h2>
            <p className="mt-5 leading-8 text-gray-600">
              Limra Clothing is a Madurai-based wholesale and retail garment
              business. We welcome enquiries from clothing shops, retailers
              and resellers looking for ladies' wear. Tell us which products
              you are sourcing and the approximate quantities you require so
              we can discuss availability and order terms.
            </p>
            <p className="mt-4 leading-8 text-gray-600">
              Buyers can enquire about ladies' 2-piece sets, 3-piece sets,
              nightwear and Bombay nighties. Product designs, sizes, prices
              and stock can vary, so please confirm the current selection
              directly before placing an order.
            </p>
            <Link
              href="/categories/ladies-wear"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-[#081A4A] underline decoration-[#C89B3C] underline-offset-4"
            >
              Explore ladies' wear products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <aside className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-semibold text-[#081A4A]">
              Product categories to enquire about
            </h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-gray-600">
              <li>• Ladies' 2-piece sets</li>
              <li>• Ladies' 3-piece sets</li>
              <li>• Ladies' nightwear</li>
              <li>• Bombay nighties</li>
            </ul>
            <p className="mt-5 text-sm leading-6 text-gray-500">
              Contact us to confirm current designs, sizes, pricing, minimum
              order requirements and delivery options.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="font-serif text-3xl font-semibold text-[#081A4A]">
            Ladies wear wholesale FAQs
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
            Need other garment categories? Visit our{" "}
            <Link href="/wholesale" className="font-semibold text-[#081A4A] underline">
              wholesale clothing page
            </Link>{" "}
            or browse all{" "}
            <Link href="/categories" className="font-semibold text-[#081A4A] underline">
              product categories
            </Link>.
          </p>
        </div>
      </section>

      <section className="bg-[#081A4A] px-4 py-14 text-center text-white sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-semibold sm:text-4xl">
          Enquire about ladies wear in bulk
        </h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/70">
          Contact Limra Clothing in Madurai to discuss ladies' garment
          requirements, current availability, wholesale prices and delivery.
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
