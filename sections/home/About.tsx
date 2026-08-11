import Link from "next/link";
import { ArrowRight, MapPin, PackageCheck, Store } from "lucide-react";

const highlights = [
  {
    icon: PackageCheck,
    title: "Wholesale Focus",
    description:
      "A clothing supply solution designed around the needs of wholesale buyers and retailers.",
  },
  {
    icon: Store,
    title: "Ready-Made Collection",
    description:
      "Explore ready-made clothing categories suitable for different business requirements.",
  },
  {
    icon: MapPin,
    title: "Madurai Based",
    description:
      "Based in Madurai and serving clothing buyers and businesses across Tamil Nadu.",
  },
];

export default function About() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        {/* Visual */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[#081A4A]">
            <div className="absolute inset-8 rounded-[1.5rem] border border-white/10" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C89B3C]">
                About Us
              </span>

              <h2 className="mt-4 font-serif text-4xl font-semibold text-white sm:text-5xl">
                Built Around
                <span className="block text-[#C89B3C]">
                  Better Business
                </span>
              </h2>

              <div className="mt-7 h-px w-20 bg-[#C89B3C]" />

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/60">
                Quality, value, and dependable service for wholesale clothing
                buyers.
              </p>
            </div>

            {/* Decorative corners */}
            <div className="absolute left-5 top-5 h-16 w-16 border-l border-t border-[#C89B3C]/60" />

            <div className="absolute bottom-5 right-5 h-16 w-16 border-b border-r border-[#C89B3C]/60" />
          </div>

          <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-[#081A4A]/10 bg-white p-5 shadow-xl sm:block lg:-right-8">
            <p className="text-xs uppercase tracking-wider text-[#C89B3C]">
              Location
            </p>

            <p className="mt-1 font-semibold text-[#081A4A]">
              Madurai, Tamil Nadu
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Who We Are
          </span>

          <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-tight text-[#081A4A] sm:text-5xl">
            Your Wholesale Clothing Partner in Madurai
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#222]/65">
            Limra Clothing is a wholesale and retail textile business based in
            Madurai, offering shirts, pants, T-shirts and other ready-made
            garments.
          </p>

          <p className="mt-4 max-w-2xl text-base leading-8 text-[#222]/65">
            We serve individual retail customers and wholesale buyers, with
            clothing distribution across Tamil Nadu.
          </p>

          <p className="mt-4 max-w-2xl text-base leading-8 text-[#222]/65">
            Our approach is simple: make it easier for businesses to discover
            the right clothing collections and build reliable wholesale
            relationships.
          </p>

          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#081A4A]/10 bg-white p-5 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#081A4A]">
                    <Icon className="h-5 w-5 text-[#C89B3C]" />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-[#081A4A]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#222]/60">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <Link
            href="/about"
            className="group mt-9 inline-flex items-center gap-2 text-sm font-bold text-[#081A4A]"
          >
            Learn More About Us

            <ArrowRight className="h-4 w-4 text-[#C89B3C] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}