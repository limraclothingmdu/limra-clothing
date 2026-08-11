import {
  Boxes,
  MapPin,
  MessageCircle,
  Truck,
} from "lucide-react";

const benefits = [
  {
    icon: Boxes,
    title: "Multiple Clothing Categories",
    description:
      "Source shirts, T-shirts, trousers and other ready-made clothing categories for your retail or wholesale business.",
  },
  {
    icon: Truck,
    title: "Tamil Nadu Distribution",
    description:
      "Based in Madurai and serving wholesale clothing customers and businesses across Tamil Nadu.",
  },
  {
    icon: MessageCircle,
    title: "Direct Wholesale Enquiries",
    description:
      "Discuss product availability, clothing requirements and wholesale enquiries directly through phone or WhatsApp.",
  },
  {
    icon: MapPin,
    title: "Madurai Based",
    description:
      "Limra Clothing is based on Solaiyalagupuram Main Road in Madurai, Tamil Nadu.",
  },
];

export default function WholesaleBenefits() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Wholesale Supply
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#081A4A] sm:text-5xl">
            Built for Wholesale Clothing Requirements
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#222]/60 sm:text-base">
            Whether you are a retailer, clothing business or other wholesale
            buyer, contact Limra Clothing to discuss your clothing
            requirements and product availability.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-[#081A4A]/10 bg-white p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#081A4A]">
                  <Icon className="h-5 w-5 text-[#C89B3C]" />
                </div>

                <h3 className="mt-6 font-serif text-xl font-semibold text-[#081A4A]">
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