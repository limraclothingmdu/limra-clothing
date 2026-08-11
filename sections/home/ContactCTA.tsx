import Link from "next/link";
import {
  ArrowRight,
  MessageCircle,
  Phone,
} from "lucide-react";

import { siteConfig } from "@/lib/site";

export default function ContactCTA() {
  const whatsappUrl = `https://wa.me/${
    siteConfig.contact.whatsapp
  }?text=${encodeURIComponent(
    "Hello, I would like to enquire about Limra Clothing products."
  )}`;

  return (
    <section
      aria-labelledby="contact-cta-heading"
      className="bg-[#F8F8F8] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#081A4A] px-6 py-14 sm:px-10 sm:py-16 lg:px-16">
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#C89B3C]/20" />

          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full border border-white/5" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                Get In Touch
              </p>

              <h2
                id="contact-cta-heading"
                className="mt-4 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl"
              >
                Looking for clothing for
                <span className="block text-[#C89B3C]">
                  retail or wholesale?
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                Contact Limra Clothing in Madurai for product enquiries,
                retail requirements and wholesale clothing needs. We
                distribute clothing products across Tamil Nadu.
              </p>

              <div className="mt-7 flex flex-wrap gap-5 text-sm text-white/50">
                <span>
                  <strong className="text-white">Madurai</strong>{" "}
                  based
                </span>

                <span>
                  <strong className="text-white">Wholesale</strong>{" "}
                  & Retail
                </span>

                <span>
                  <strong className="text-white">Tamil Nadu</strong>{" "}
                  distribution
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:max-w-xs lg:justify-end">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A] transition-transform hover:-translate-y-0.5"
              >
                Explore Products
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:border-[#C89B3C] hover:text-[#C89B3C]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>

              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-sm font-bold text-white/70 transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4" />
                Call Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}