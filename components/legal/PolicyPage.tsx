type PolicySection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type PolicyPageProps = {
  title: string;
  updated?: string;
  intro: string;
  sections: PolicySection[];
};

export default function PolicyPage({
  title,
  updated = "15 October 2026",
  intro,
  sections,
}: PolicyPageProps) {
  return (
    <main className="min-h-screen bg-[#FAF8F4] px-4 py-14 text-[#1A1A1A] sm:px-6 lg:py-20">
      <article className="mx-auto max-w-4xl rounded-2xl bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9A7427]">
          Limra Clothing
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#081A4A] sm:text-4xl">
          {title}
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          Last updated: {updated}
        </p>

        <p className="mt-8 text-base leading-8 text-gray-700">{intro}</p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold text-[#081A4A]">
                {section.heading}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 leading-7 text-gray-700"
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-gray-700">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
