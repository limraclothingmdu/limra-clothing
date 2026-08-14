import Link from "next/link";

import { ArrowRight, MessageCircle, MapPin } from "lucide-react";



import { siteConfig } from "@/lib/site";



export default function Hero() {

  return (

    <section className="relative overflow-hidden bg-[#081A4A]">

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">

        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">

          {/* Content */}

          <div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#C89B3C]/30 bg-[#C89B3C]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#C89B3C]">

              <MapPin className="h-3.5 w-3.5" />

              Madurai · Tamil Nadu

            </div>



            <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-7xl">

              Clothing Wholesale & Retail

              <span className="block text-[#C89B3C]">

                in Madurai

              </span>

            </h1>



            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">

              Limra Clothing offers shirts, pants, T-shirts and other

              ready-made garments for wholesale and retail customers,

              with distribution across Tamil Nadu.

            </p>



            <div className="mt-9 flex flex-wrap gap-3">

              <Link

                href="/products"

                className="inline-flex items-center gap-2 rounded-full bg-[#C89B3C] px-6 py-3.5 text-sm font-bold text-[#081A4A] transition-transform hover:-translate-y-0.5"

              >

                Explore Products

                <ArrowRight className="h-4 w-4" />

              </Link>



              <a

                href={`https://wa.me/${

                  siteConfig.contact.whatsapp

                }?text=${encodeURIComponent(

                  "Hello, I would like to enquire about Limra Clothing products."

                )}`}

                target="_blank"

                rel="noopener noreferrer"

                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-[#C89B3C] hover:text-[#C89B3C]"

              >

                <MessageCircle className="h-4 w-4" />

                WhatsApp Enquiry

              </a>

            </div>



            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-white/45">

              <span>Wholesale & Retail</span>

              <span>Ready-Made Garments</span>

              <span>Distribution Across Tamil Nadu</span>

            </div>

          </div>



          {/* Visual / Brand Panel */}

          <div className="relative hidden lg:block">

            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">

              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(200,155,60,0.18),transparent_45%,rgba(255,255,255,0.03))]" />



              <div className="absolute inset-8 flex flex-col justify-end">

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#C89B3C]">

                  Limra Clothing

                </p>



                <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-white">

                  Clothing for

                  <br />

                  Business & Everyday Wear

                </h2>



                <p className="mt-5 max-w-sm text-sm leading-6 text-white/50">

                  Serving customers from Madurai and distributing

                  clothing products across Tamil Nadu.

                </p>

              </div>



              <div className="absolute right-8 top-8 h-20 w-20 rounded-full border border-[#C89B3C]/30" />



              <div className="absolute right-14 top-14 h-8 w-8 rounded-full bg-[#C89B3C]/80" />

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}