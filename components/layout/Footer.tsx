import Link from "next/link";
import {
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { siteConfig } from "@/lib/site";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "Wholesale", href: "/wholesale" },
  { name: "Retail", href: "/retail" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}`;

  return (
    <footer className="bg-[#081A4A] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <div className="font-serif text-3xl font-bold">
                LIMRA
              </div>

              <div className="-mt-1 text-[10px] font-bold uppercase tracking-[0.35em] text-[#C89B3C]">
                Clothing
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/55">
              Wholesale and retail textile and clothing business in
              Madurai, offering shirts, pants and other ready-made
              garments.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-5 py-3 text-sm font-bold text-[#081A4A]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>

          {/* Links */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
              Quick Links
            </h2>

            <nav className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/60 transition-colors hover:text-[#C89B3C]"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#C89B3C]">
              Contact
            </h2>

            <div className="mt-5 space-y-5">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex gap-3 text-sm text-white/60 hover:text-white"
              >
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#C89B3C]" />

                <span>{siteConfig.contact.phone}</span>
              </a>

              <div className="flex gap-3 text-sm leading-6 text-white/60">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C89B3C]" />

                <address className="not-italic">
                  No. 25/3, 1st Floor,
                  <br />
                  Solaiyalagupuram Main Road,
                  <br />
                  Madurai - 11
                </address>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="text-xs uppercase tracking-[0.15em] text-white/35">
                  GSTIN
                </p>

                <p className="mt-1 text-sm font-semibold text-white/70">
                  {siteConfig.gstin}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-7">
          <div className="flex flex-col gap-3 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All
              rights reserved.
            </p>

            <p>
              Wholesale & Retail Clothing · Madurai, Tamil Nadu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}