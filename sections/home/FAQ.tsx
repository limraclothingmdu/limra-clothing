import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const faqs = [
  {
    question: "Does Limra Clothing provide wholesale clothing in Madurai?",
    answer:
      "Yes. Limra Clothing is a Madurai-based wholesale and retail clothing business supplying ready-made garments for retailers, businesses and individual customers.",
  },
  {
    question: "What clothing products does Limra Clothing offer?",
    answer:
      "Our collection includes shirts, T-shirts, trousers, ladies wear and other ready-made clothing products. New categories and products are added as they become available.",
  },
  {
    question: "Can I buy clothing from Limra Clothing online?",
    answer:
      "Yes. Selected retail products are available through our online retail collection, where customers can view product prices, add items to their cart and place orders through secure checkout.",
  },
  {
    question: "Does Limra Clothing supply retailers and businesses?",
    answer:
      "Yes. We serve retailers and clothing businesses looking for ready-made garments and wholesale clothing supply from Madurai.",
  },
  {
    question: "Does Limra Clothing distribute clothing across Tamil Nadu?",
    answer:
      "Yes. Limra Clothing is based in Madurai and serves customers and businesses across Tamil Nadu.",
  },
  {
    question: "How can I enquire about wholesale pricing?",
    answer:
      "You can contact Limra Clothing through WhatsApp or phone to enquire about product availability, wholesale requirements and pricing.",
  },
  {
    question: "Where is Limra Clothing located?",
    answer:
      "Limra Clothing is located on Solaiyalagupuram Main Road, Madurai, Tamil Nadu.",
  },
  {
    question: "Does Limra Clothing offer ladies wear?",
    answer:
      "Yes. Ladies wear and other ready-made clothing collections can be available through the Limra Clothing retail and product collections.",
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
            Questions About Limra Clothing
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#222]/60 sm:text-base">
            Find answers about our ready-made clothing products, retail
            shopping, wholesale garment supply and distribution across Tamil
            Nadu.
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