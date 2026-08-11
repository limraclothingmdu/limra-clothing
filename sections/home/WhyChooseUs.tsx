import {
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

const benefits = [
  {
    number: "01",
    title: "Wholesale & Retail",
    description:
      "We serve both individual retail customers and wholesale buyers with clothing requirements.",
    icon: ShoppingBag,
  },
  {
    number: "02",
    title: "Ready-Made Garments",
    description:
      "Explore shirts, pants, T-shirts, boys' wear and other ready-made clothing categories.",
    icon: Package,
  },
  {
    number: "03",
    title: "Tamil Nadu Distribution",
    description:
      "Based in Madurai, we distribute clothing products to customers and businesses across Tamil Nadu.",
    icon: Truck,
  },
  {
    number: "04",
    title: "Madurai Based",
    description:
      "Visit our business in Solaiyalagupuram, Madurai for your clothing and textile requirements.",
    icon: MapPin,
  },
];

export default function WhyChooseUs() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Why Limra Clothing
          </p>

          <h2
            id="why-choose-heading"
            className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#081A4A] sm:text-5xl"
          >
            Clothing for Retail & Wholesale
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#222]/60 sm:text-base">
            From individual clothing needs to wholesale requirements,
            Limra Clothing serves customers from Madurai and distributes
            across Tamil Nadu.
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#081A4A]/10 bg-[#081A4A]/10 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.number}
                className="bg-white p-7 sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081A4A]">
                    <Icon className="h-5 w-5 text-[#C89B3C]" />
                  </div>

                  <span className="text-xs font-bold tracking-[0.15em] text-[#081A4A]/20">
                    {benefit.number}
                  </span>
                </div>

                <h3 className="mt-7 font-serif text-xl font-semibold text-[#081A4A]">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#222]/55">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}