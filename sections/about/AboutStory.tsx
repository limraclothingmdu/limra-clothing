export default function AboutStory() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C89B3C]">
              Our Business
            </p>

            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[#081A4A] sm:text-5xl">
              Wholesale Clothing,
              <span className="block">Made Simpler.</span>
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-[#222]/65">
            <p>
              Limra Clothing is a ready-made clothing business serving the
              requirements of wholesale buyers, retailers, and other clothing
              businesses.
            </p>

            <p>
              Our website is designed to make it easier for customers to
              discover our clothing categories, explore available products,
              and contact us for wholesale enquiries.
            </p>

            <p>
              From product discovery to enquiry, our focus is on creating a
              straightforward experience for businesses looking for clothing
              supply solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}