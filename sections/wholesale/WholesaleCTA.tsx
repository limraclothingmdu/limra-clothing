import { MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/lib/site";

export default function WholesaleCTA() {
  const whatsappUrl = `https://wa.me/${
    siteConfig.contact.whatsapp
  }?text=${encodeURIComponent(
    "Hello, I would like to make a wholesale clothing enquiry."
  )}`;

  const phoneUrl = `tel:+91${siteConfig.contact.phone}`;

  return (
    <section className="bg-[#081A4A]">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
          Start a Wholesale Enquiry
        </p>

        <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl font-semibold text-white sm:text-4xl">
          Looking for Wholesale Clothing in Madurai?
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60">
          Contact Limra Clothing to discuss ready-made clothing requirements,
          product availability and wholesale distribution across Tamil Nadu.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A] transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Enquiry
          </a>

          <a
            href={phoneUrl}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:border-[#C89B3C] hover:text-[#C89B3C]"
          >
            <Phone className="h-4 w-4" />
            Call Limra Clothing
          </a>
        </div>
      </div>
    </section>
  );
}