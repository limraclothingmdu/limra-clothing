"use client";

import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { useState } from "react";

import { siteConfig } from "@/lib/site";
import { navigation } from "@/data/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Hello, I would like to enquire about Limra Clothing products."
  )}`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#081A4A]/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center"
          aria-label="Limra Clothing Home"
        >
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-[#081A4A]">
              LIMRA
            </div>

            <div className="-mt-1 text-[9px] font-bold uppercase tracking-[0.32em] text-[#C89B3C]">
              Clothing
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[#081A4A]/70 transition-colors hover:text-[#C89B3C]"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full bg-[#081A4A] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#C89B3C] hover:text-[#081A4A] lg:inline-flex"
        >
          <MessageCircle className="h-4 w-4" />
          Enquire
        </a>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#081A4A]/10 text-[#081A4A] lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-[#081A4A]/10 bg-white lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-[#081A4A]/5 py-3 text-sm font-semibold text-[#081A4A]"
              >
                {item.name}
              </Link>
            ))}

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#C89B3C] px-5 py-3 text-sm font-bold text-[#081A4A]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Enquiry
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}