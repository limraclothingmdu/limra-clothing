import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, MessageCircle, Phone, Shirt } from "lucide-react";
import { siteConfig } from "@/lib/site";

const pageTitle = "Wholesale Clothing in Madurai | Limra Clothing";
const pageDescription =
  "Contact Limra Clothing in Madurai for wholesale garment enquiries, men's shirts, ladies' wear and current product availability. Ask about bulk quantities, prices and supply arrangements across Tamil Nadu.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "wholesale clothing Madurai",
    "wholesale clothing supplier in Madurai",
    "mens wholesale clothing",
    "wholesale dress shop Madurai",
    "wholesale garments Tamil Nadu",
    "ladies wear wholesale Madurai",
    "Limra Clothing",
  ],
  alternates: {
    canonical: `${siteConfig.url}/wholesale-clothing-madurai`,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: `${siteConfig.url}/wholesale-clothing-madurai`,
    type: "website",
  },
};

export default function WholesaleClothingMaduraiPage() {
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Hello Limra Clothing, I would like to enquire about wholesale garments in Madurai. Please share current product availability and ordering details."
  )}`;

  return (
    <main className="bg-[#F8F8F8] text-[#081A4A]">
      <section className="bg-[#081A4A]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-white/60">
            <Link href="/" className="hover:text-[#C89B3C]">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Wholesale Clothing in Madurai</span>
          </nav>

          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Wholesale & Retail Garments
            </p>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Wholesale Clothing in Madurai
            </h1>
            <p className="mt-6 text-base leading-8 text-white/75 sm:text-lg">
              Limra Clothing is a Madurai-based garment business serving
              wholesale and retail customers. Contact us to enquire about
              available clothing, current prices, quantities and supply
              arrangements.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A]"
              >
                <MessageCircle className="h-4 w-4" />
                Enquire on WhatsApp
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-bold text-white hover:border-[#C89B3C]"
              >
                <Phone className="h-4 w-4 text-[#C89B3C]" />
                Call Limra
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <article className="space-y-10">
            <section>
              <h2 className="font-serif text-3xl font-semibold">
                Garment Enquiries for Retailers and Businesses
              </h2>
              <p className="mt-4 leading-8 text-[#222]/70">
                Choosing a wholesale clothing supplier involves more than
                comparing prices. Buyers should confirm product quality,
                available sizes, quantities, current stock, payment terms and
                delivery arrangements before placing an order.
              </p>
              <p className="mt-4 leading-8 text-[#222]/70">
                Limra Clothing welcomes enquiries about its currently
                available garment collections. Contact the store with your
                product requirements so the team can discuss suitable options
                and current availability.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-semibold">
                Clothing Categories to Enquire About
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-5">
                  <Shirt className="h-6 w-6 text-[#C89B3C]" />
                  <h3 className="mt-3 font-bold">Men&apos;s Shirts</h3>
                  <p className="mt-2 text-sm leading-6 text-[#222]/65">
                    Ask about available shirt styles, sizes, quantities and
                    current wholesale pricing.
                  </p>
                  <Link
                    href="/categories/mens-shirts"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold hover:text-[#9B7425]"
                  >
                    Explore men&apos;s shirts <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="rounded-2xl border border-[#081A4A]/10 bg-white p-5">
                  <Shirt className="h-6 w-6 text-[#C89B3C]" />
                  <h3 className="mt-3 font-bold">Ladies&apos; Wear</h3>
                  <p className="mt-2 text-sm leading-6 text-[#222]/65">
                    Enquire about available ladies&apos; wear collections,
                    designs, sizes and order quantities.
                  </p>
                  <Link
                    href="/categories"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold hover:text-[#9B7425]"
                  >
                    Browse categories <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#222]/60">
                Product availability and category listings may change. Please
                confirm current stock with Limra Clothing before ordering.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-semibold">
                What to Include in a Wholesale Enquiry
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-[#222]/70">
                <li>The garment category and preferred styles.</li>
                <li>Approximate quantity and required sizes.</li>
                <li>Your expected price range, if applicable.</li>
                <li>Your delivery location or collection preference.</li>
                <li>Your required date and any specific product questions.</li>
              </ul>
              <p className="mt-4 leading-8 text-[#222]/70">
                Ask for confirmation of prices, minimum order quantities,
                shipping costs and payment or return terms before confirming
                your purchase. These details depend on the products and order.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-semibold">
                Wholesale Clothing Supply Across Tamil Nadu
              </h2>
              <p className="mt-4 leading-8 text-[#222]/70">
                Buyers outside Madurai can contact Limra Clothing to discuss
                whether supply and delivery arrangements are available for
                their location. Shipping options, costs and delivery times
                should be confirmed for each order before payment.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-semibold">
                Frequently Asked Questions
              </h2>
              <div className="mt-5 space-y-6">
                <div>
                  <h3 className="font-bold">
                    Where can I enquire about wholesale clothing in Madurai?
                  </h3>
                  <p className="mt-2 leading-7 text-[#222]/70">
                    Contact Limra Clothing through the website&apos;s phone or
                    WhatsApp options to ask about current garment availability
                    and wholesale requirements.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">
                    Can I enquire about men&apos;s shirts and ladies&apos; wear?
                  </h3>
                  <p className="mt-2 leading-7 text-[#222]/70">
                    Yes. You can enquire about these categories and confirm
                    which styles, sizes and quantities are currently available.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">
                    Are wholesale prices and minimum quantities fixed?
                  </h3>
                  <p className="mt-2 leading-7 text-[#222]/70">
                    Pricing and order requirements can vary by product and
                    quantity. Contact Limra Clothing for current details
                    before placing an order.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">
                    Can orders be delivered outside Madurai?
                  </h3>
                  <p className="mt-2 leading-7 text-[#222]/70">
                    Contact the business with your destination to confirm
                    available delivery arrangements, courier costs and
                    estimated transit time.
                  </p>
                </div>
              </div>
            </section>
          </article>

          <aside className="h-fit rounded-2xl bg-white p-7 shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#9B7425]">
              Contact Limra Clothing
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold">
              Discuss Your Requirements
            </h2>
            <p className="mt-3 text-sm leading-7 text-[#222]/65">
              Tell us which garments you need, your approximate quantity and
              destination. Contact us to discuss available products and order
              details.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#081A4A] px-5 py-3.5 text-sm font-bold text-white"
            >
              <MessageCircle className="h-4 w-4 text-[#C89B3C]" />
              WhatsApp Enquiry
            </a>

            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="mt-3 flex items-center justify-center gap-2 rounded-full border border-[#081A4A]/15 px-5 py-3.5 text-sm font-bold"
            >
              <Phone className="h-4 w-4 text-[#9B7425]" />
              {siteConfig.contact.phone}
            </a>

            <div className="mt-7 border-t border-[#081A4A]/10 pt-6">
              <div className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#9B7425]" />
                <div>
                  <h3 className="font-bold">Visit our Madurai store</h3>
                  <p className="mt-2 text-sm leading-6 text-[#222]/65">
                    {siteConfig.address.street}, {siteConfig.address.city}
                  </p>
                  <Link
                    href="/contact"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold hover:text-[#9B7425]"
                  >
                    Full contact details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
