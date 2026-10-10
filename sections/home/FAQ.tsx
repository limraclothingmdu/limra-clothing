import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const faqs = [
  {
    question: "Where is Limra Clothing located?",
    answer:
      "Limra Clothing is a wholesale and retail clothing business located on Solaiyalagupuram Main Road, Madurai, Tamil Nadu 625011. Contact us for directions and product enquiries.",
  },
  {
    question: "Does Limra Clothing offer wholesale clothing in Madurai?",
    answer:
      "Yes. Limra Clothing serves wholesale and retail customers in Madurai, offering ready-made garments for retailers, clothing businesses and individual buyers. Contact us to discuss bulk requirements and current product availability.",
  },
  {
    question: "What types of clothing does Limra Clothing sell?",
    answer:
      "Limra Clothing offers ready-made garments, including shirts, T-shirts, trousers, ladies wear and other clothing categories. Product availability may vary, so contact us or browse our current product collection.",
  },
  {
    question: "Does Limra Clothing supply garments across Tamil Nadu?",
    answer:
      "Limra Clothing is based in Madurai and serves customers and businesses across Tamil Nadu. Contact us to confirm distribution arrangements for your location and order requirements.",
  },
  {
    question: "How can retailers enquire about wholesale garment prices?",
    answer:
      "Retailers and business buyers can contact Limra Clothing by phone or WhatsApp to enquire about current products, bulk quantities, wholesale pricing and order arrangements.",
  },
  {
    question: "Can I purchase clothing online from Limra Clothing?",
    answer:
      "Yes. Selected products are available through the Limra Clothing online retail collection. Browse product details and prices, add available items to your cart, and follow the checkout process to place an order.",
  },
  {
    question: "Does Limra Clothing sell ladies wear and kurtis?",
    answer:
      "Limra Clothing offers ladies wear and related ready-made garment collections when available. Browse the current product listings or contact us to check specific styles, sizes and availability.",
  },
  {
    question: "How do I contact Limra Clothing for a clothing order?",
    answer:
      "You can contact Limra Clothing through the website's contact page or available phone and WhatsApp options. Share the products you need, your quantity and your location so we can discuss availability and order arrangements.",
  },
];

export default function FAQ() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-[#081A4A]/10 bg-[#F8F7F4] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Frequently Asked Questions
          </p>

          <h2
            id="faq-heading"
            className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#081A4A] sm:text-5xl"
          >
            Limra Clothing FAQs
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#222]/60 sm:text-base">
            Learn about wholesale garments in Madurai, our ready-made clothing
            collections, online retail shopping and distribution enquiries
            across Tamil Nadu.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-[#081A4A]/10 bg-white p-6"
            >
              <summary className="cursor-pointer list-none pr-8 font-serif text-lg font-semibold text-[#081A4A] marker:hidden">
                {faq.question}
              </summary>

              <p className="mt-4 text-sm leading-7 text-[#222]/60">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#081A4A]"
          >
            Have another question? Contact us
            <ArrowUpRight className="h-4 w-4 text-[#C89B3C]" />
          </Link>
        </div>
      </div>
    </section>
  );
}