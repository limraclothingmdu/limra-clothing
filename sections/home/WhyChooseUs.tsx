import {
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";

const benefits = [
  {
    number: "01",
    title: "Wholesale & Retail Clothing",
    description:
      "Explore ready-made garments for personal shopping or contact us to discuss wholesale quantities and business requirements.",
    icon: ShoppingBag,
  },
  {
    number: "02",
    title: "Ready-Made Garment Collection",
    description:
      "Browse clothing categories including shirts, T-shirts, trousers, ladies wear and other garments, subject to current availability.",
    icon: Package,
  },
  {
    number: "03",
    title: "Serving Tamil Nadu",
    description:
      "Based in Madurai, Limra Clothing serves customers and business buyers across Tamil Nadu. Contact us to confirm arrangements for your location.",
    icon: Truck,
  },
  {
    number: "04",
    title: "Located in Madurai",
    description:
      "Find Limra Clothing on Solaiyalagupuram Main Road, Madurai, Tamil Nadu 625011, for clothing and wholesale enquiries.",
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
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Why Limra Clothing
          </p>

          <h2
            id="why-choose-heading"
            className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#081A4A] sm:text-5xl"
          >
            Your Clothing Partner in Madurai
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#222]/60 sm:text-base">
            Limra Clothing brings wholesale and retail garment options
            together in Madurai, with ready-made clothing collections and
            distribution enquiries for customers and businesses across
            Tamil Nadu.
          </p>
        </div>

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
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5 text-[#C89B3C]"
                    />
                  </div>

                  <span
                    aria-hidden="true"
                    className="text-xs font-bold tracking-[0.15em] text-[#081A4A]/20"
                  >
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