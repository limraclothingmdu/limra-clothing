import {
  BadgeCheck,
  Handshake,
  PackageCheck,
} from "lucide-react";

const values = [
  {
    icon: PackageCheck,
    title: "Product Focus",
    description:
      "A clear focus on ready-made clothing and wholesale product requirements.",
  },
  {
    icon: Handshake,
    title: "Business Relationships",
    description:
      "We value clear communication and dependable relationships with our customers.",
  },
  {
    icon: BadgeCheck,
    title: "Service",
    description:
      "We aim to make the wholesale enquiry and product discovery process simple.",
  },
];

export default function AboutValues() {
  return (
    <section className="bg-[#F8F8F8] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            What Matters
          </p>

          <h2 className="mt-3 font-serif text-4xl font-semibold text-[#081A4A]">
            Our Approach
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <article
                key={value.title}
                className="rounded-2xl border border-[#081A4A]/10 bg-white p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#081A4A]">
                  <Icon className="h-5 w-5 text-[#C89B3C]" />
                </div>

                <h3 className="mt-6 text-lg font-bold text-[#081A4A]">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#222]/60">
                  {value.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}