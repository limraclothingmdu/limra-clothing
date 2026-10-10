
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
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:scale-110"
      >
        {/* Subtle pulse animation */}
        <span className="absolute inset-0 animate-[whatsappPulse_2.2s_ease-out_infinite] rounded-full bg-[#25D366] opacity-40" />

        {/* WhatsApp icon */}
        <MessageCircle
          className="relative z-10 h-7 w-7 transition-transform duration-300 group-hover:scale-110"
          strokeWidth={2.2}
        />
      </a>

      <style jsx>{`
        @keyframes whatsappPulse {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }

          70% {
            transform: scale(1.55);
            opacity: 0;
          }

          100% {
            transform: scale(1.55);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
