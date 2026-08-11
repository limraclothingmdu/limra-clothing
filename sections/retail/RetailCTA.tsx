import { MessageCircle, Phone } from "lucide-react";

import { siteConfig } from "@/lib/site";

export default function RetailCTA() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] bg-[#081A4A] px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Visit Limra Clothing
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl font-semibold text-white sm:text-4xl">
            Looking for shirts, pants or ready-made clothing in Madurai?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/60">
            Contact us for product availability and current clothing
            requirements.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>

            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}