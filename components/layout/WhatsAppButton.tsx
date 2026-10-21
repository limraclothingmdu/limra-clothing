"use client";

import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hello Limra Clothing, I would like to know more about your products."
  );

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Limra Clothing on WhatsApp"
        title="Contact us on WhatsApp"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-110"
      >
        <MessageCircle
          className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
          strokeWidth={2.2}
        />
      </a>
    </div>
  );
}
