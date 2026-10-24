import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { siteConfig } from "@/lib/site";
import RetailProductShowcase from "@/components/products/RetailProductShowcase";

export const metadata: Metadata = {
  title: "Contact Limra Clothing | Madurai Wholesale Garments",
  description:
    "Contact Limra Clothing in Madurai for wholesale garment enquiries, retail product questions, availability and business requirements. We serve clothing buyers and retailers across Tamil Nadu.",
  keywords: [
    "contact Limra Clothing",
    "wholesale clothing Madurai contact",
    "ready made garments Madurai",
    "wholesale garments Madurai",
  ],
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    title: `Contact Limra Clothing | Madurai Wholesale Garments`,
    description:
      "Contact Limra Clothing in Madurai for wholesale garment enquiries, retail product questions and business requirements.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="bg-[#F8F8F8]">
      {/* Hero */}
      <section className="bg-[#081A4A]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-white/50"
          >
            <Link href="/" className="hover:text-[#C89B3C]">
              Home
            </Link>

            <span className="mx-2">/</span>

            <span className="text-white/80">Contact</span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Get In Touch
            </p>

            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s Talk
              <span className="block text-[#C89B3C]">
                Wholesale Clothing
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Contact Limra Clothing for product enquiries, wholesale
              requirements, and business information.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Phone */}
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="group rounded-2xl border border-[#081A4A]/10 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#081A4A]">
                <Phone className="h-5 w-5 text-[#C89B3C]" />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
                Call Us
              </p>

              <h2 className="mt-2 text-lg font-bold text-[#081A4A]">
                {siteConfig.contact.phone}
              </h2>

              <p className="mt-2 text-sm text-[#222]/55">
                Speak with us about your wholesale requirements.
              </p>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-[#081A4A]/10 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#081A4A]">
                <MessageCircle className="h-5 w-5 text-[#C89B3C]" />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
                WhatsApp
              </p>

              <h2 className="mt-2 text-lg font-bold text-[#081A4A]">
                Chat With Us
              </h2>

              <p className="mt-2 text-sm text-[#222]/55">
                Send us your product or wholesale enquiry directly.
              </p>
            </a>

            {/* Address */}
            <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#081A4A]">
                <MapPin className="h-5 w-5 text-[#C89B3C]" />
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
                Visit Us
              </p>

              <h2 className="mt-2 text-lg font-bold text-[#081A4A]">
                Limra Clothing
              </h2>

              <address className="mt-2 not-italic text-sm leading-6 text-[#222]/55">
                {siteConfig.address.street}
                <br />
                {siteConfig.address.city} - 11
              </address>
            </div>
          </div>

          {/* Address + Enquiry */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Business Information */}
            <div className="rounded-2xl bg-[#081A4A] p-8 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                Business Information
              </p>

              <h2 className="mt-4 font-serif text-3xl font-semibold text-white sm:text-4xl">
                Limra Clothing
              </h2>

              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#C89B3C]" />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Address
                    </p>

                    <p className="mt-1 text-sm leading-6 text-white/60">
                      No. 25/3, 1st Floor,
                      <br />
                      Solaiyalagupuram Main Road,
                      <br />
                      Madurai - 11
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-[#C89B3C]" />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Phone
                    </p>

                    <a
                      href={`tel:${siteConfig.contact.phone}`}
                      className="mt-1 block text-sm text-white/60 hover:text-[#C89B3C]"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-[#C89B3C]" />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Business Hours
                    </p>

                    <p className="mt-1 text-sm text-white/60">
                      Contact us for current business hours.
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A]"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Enquiry
              </a>
            </div>

            {/* Enquiry CTA */}
            <div className="flex flex-col justify-center rounded-2xl border border-[#081A4A]/10 bg-white p-8 sm:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                Wholesale Enquiries
              </p>

              <h2 className="mt-4 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl">
                Looking for clothing in wholesale?
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#222]/60">
                Tell us what products you are looking for and contact us
                directly to discuss your requirements.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${
                    siteConfig.contact.whatsapp
                  }?text=${encodeURIComponent(
                    "Hello, I would like to make a wholesale clothing enquiry."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#081A4A] px-6 py-3.5 text-sm font-bold text-white"
                >
                  Start Enquiry
                  <ArrowRight className="h-4 w-4 text-[#C89B3C]" />
                </a>

                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#081A4A]/10 px-6 py-3.5 text-sm font-bold text-[#081A4A]"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              </div>
            </div>

          </div>

          <RetailProductShowcase
            title="Browse Products Before You Enquire"
            description="Explore our available retail products, then contact Limra Clothing for product details or wholesale and bulk clothing requirements."
          />
          {/* Explore More from Limra */}
          <section
            aria-labelledby="contact-next-steps"
            className="mt-16 rounded-3xl border border-[#081A4A]/10 bg-white p-8 shadow-sm sm:p-10"
          >
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
                Explore Limra Clothing
              </p>

              <h2
                id="contact-next-steps"
                className="mt-3 font-serif text-2xl font-semibold text-[#081A4A] sm:text-3xl"
              >
                How Can We Help You Next?
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#222]/65 sm:text-base">
                Browse our retail collection, explore wholesale clothing
                options, or read our guides to clothing and shopping in Madurai.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/retail/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#081A4A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#10285f]"
                >
                  Shop Retail Products
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/wholesale"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#081A4A]/20 px-6 py-3 text-sm font-semibold text-[#081A4A] transition-colors hover:bg-[#081A4A]/5"
                >
                  Explore Wholesale
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C89B3C]/60 px-6 py-3 text-sm font-semibold text-[#081A4A] transition-colors hover:bg-[#C89B3C]/10"
                >
                  Read Our Blog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
