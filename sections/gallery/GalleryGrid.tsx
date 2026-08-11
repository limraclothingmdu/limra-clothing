export default function GalleryGrid() {
  return (
    <section
      aria-labelledby="gallery-heading"
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
            Limra Clothing
          </p>

          <h2
            id="gallery-heading"
            className="mt-3 font-serif text-3xl font-semibold text-[#081A4A] sm:text-4xl"
          >
            Our Store & Clothing Collections
          </h2>

          <p className="mt-4 text-sm leading-7 text-[#222]/60 sm:text-base">
            We are preparing our gallery with photographs of our store,
            clothing collections and ready-made garments.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-dashed border-[#081A4A]/15 bg-[#F8F8F8] px-6 py-16 text-center">
          <div className="mx-auto max-w-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#081A4A]">
              <span className="font-serif text-2xl text-[#C89B3C]">
                L
              </span>
            </div>

            <h3 className="mt-6 font-serif text-2xl font-semibold text-[#081A4A]">
              Gallery Coming Soon
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#222]/55">
              Photos of Limra Clothing, our store in Madurai and our
              clothing collections will be added here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}