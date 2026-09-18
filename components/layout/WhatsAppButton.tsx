"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

const messages = [
  "Need help choosing a product? 👕",
  "Looking for wholesale garments?",
  "Need bulk order assistance?",
  "Want to know our latest collections?",
  "Talk to Limra Clothing 👋",
];

export default function WhatsAppButton() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [typedText, setTypedText] = useState("");

  const message = encodeURIComponent(
    "Hello Limra Clothing, I would like to know more about your products."
  );

  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${message}`;

  // Typing animation
  useEffect(() => {
    const text = messages[messageIndex];
    let index = 0;

    setTypedText("");

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, [messageIndex]);

  // Change message
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setMessageIndex((current) => (current + 1) % messages.length);
        setVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(messageTimer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Dynamic WhatsApp Message */}
      <div
        className={`relative max-w-[260px] rounded-2xl bg-white px-4 py-3 shadow-xl ring-1 ring-black/10 transition-all duration-500 ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-3 scale-95 opacity-0"
        }`}
      >
        <p className="text-sm font-medium leading-5 text-[#081A4A]">
          {typedText}
          <span className="ml-0.5 inline-block animate-pulse font-bold">
            |
          </span>
        </p>

        {/* Bubble Arrow */}
        <div className="absolute -bottom-2 right-5 h-4 w-4 rotate-45 bg-white" />
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Limra Clothing on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110"
      >
        {/* Animated pulse */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-[whatsappPulse_2.2s_ease-out_infinite]" />

        {/* WhatsApp icon */}
        <MessageCircle
          className="relative z-10 h-7 w-7 animate-[whatsappFloat_2.8s_ease-in-out_infinite] group-hover:animate-none"
          strokeWidth={2.2}
        />
      </a>

      <style jsx>{`
        @keyframes whatsappPulse {
          0% {
            transform: scale(1);
            opacity: 0.45;
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

        @keyframes whatsappFloat {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          20% {
            transform: translateY(-3px) rotate(-4deg);
          }

          40% {
            transform: translateY(0) rotate(0deg);
          }

          60% {
            transform: translateY(-3px) rotate(4deg);
          }

          80% {
            transform: translateY(0) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}