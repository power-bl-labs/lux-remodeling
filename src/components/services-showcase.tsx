"use client";

const serviceCards = [
  {
    title: "Kitchen Remodeling",
    description: "Rework dated layouts, improve storage, and create a kitchen that fits modern San Jose family flow and entertaining.",
    cta: "Explore Kitchen Remodels",
    image: "/service-kitchen-bright.jpg",
    premiumTag: "Signature",
    featureTag: "Most Requested",
    objectPosition: "center 58%",
  },
  {
    title: "Bathroom Renovation",
    description: "Upgrade everyday comfort with better lighting, cleaner storage, and finish selections that feel calm, durable, and elevated.",
    cta: "See Bathroom Upgrades",
    image: "/service-bathroom-marble.jpg",
    premiumTag: "Elevated",
    featureTag: "Primary Suite Reset",
    objectPosition: "center 54%",
  },
  {
    title: "Whole Home Remodeling",
    description: "Refresh older San Jose homes with one design language, one coordinated scope, and one experienced remodel team.",
    cta: "View Whole-Home Projects",
    image: "/service-kitchen-dark-wood.jpg",
    premiumTag: "Premier",
    featureTag: "Older Home Refresh",
    objectPosition: "center 52%",
  },
  {
    title: "Home Additions",
    description: "Expand the footprint for growing families with bedrooms, offices, family rooms, and better-connected living space.",
    cta: "Plan Your Addition",
    image: "/service-addition-frame.jpg",
    premiumTag: "Tailored",
    featureTag: "Family Expansion",
    objectPosition: "center center",
  },
  {
    title: "ADUs & Garage Conversions",
    description: "Add rental potential, guest space, or multigenerational living with a backyard ADU or garage conversion planned for San Jose approval paths.",
    cta: "Plan An ADU",
    image: "/service-garage-exterior.jpg",
    premiumTag: "Smart Value",
    featureTag: "Income Potential",
    objectPosition: "center center",
  },
  {
    title: "Design + Permit Planning",
    description: "Clarify layout, materials, and permit direction early so pricing, selections, and construction decisions start from a stronger plan.",
    cta: "Start Planning",
    image: "/service-design-plans.jpg",
    premiumTag: "Curated",
    featureTag: "Permit Ready",
    objectPosition: "center center",
  },
];

export function ServicesShowcase() {
  return (
    <section className="mt-16 rounded-[12px] bg-[var(--brand-soft)] px-5 py-10 sm:px-6 md:px-8 md:py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[740px]">
          <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-[#6d7890]">
            Core Services For San Jose Homes
          </p>
          <h2 className="mt-3 text-[38px] leading-[0.96] font-bold tracking-[-0.045em] text-[var(--brand-dark)] sm:text-[46px]">
            Kitchen, Bath, ADU, Addition,
            <br className="hidden md:block" /> And Whole-Home Remodeling In One Clear System.
          </h2>
          <p className="mt-4 max-w-[720px] text-[18px] leading-8 text-[#586177]">
            The strongest demand in San Jose usually clusters around kitchens, bathrooms, additions,
            ADUs, and older-home refreshes, so the service mix here is written to match the real
            local remodeling conversation.
          </p>
        </div>

        <button
          className="inline-flex w-fit items-center justify-center rounded-[6px] border border-[var(--brand-dark)] px-6 py-3.5 text-[16px] font-semibold tracking-[-0.01em] text-[var(--brand-dark)] transition hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
          type="button"
        >
          View Service Categories
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {serviceCards.map((service) => (
          <article
            key={service.title}
            className="group overflow-hidden rounded-[12px] border border-[#dde3ee] bg-white shadow-[0_14px_36px_rgba(16,17,20,0.06)]"
          >
            <div className="relative h-[260px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={service.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                src={service.image}
                style={{ objectPosition: service.objectPosition }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,17,28,0.58)] via-[rgba(15,17,28,0.12)] to-transparent" />
              <div className="absolute left-5 top-5 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-[6px] bg-[rgba(17,22,34,0.9)] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                  <span aria-hidden="true" className="text-[13px] leading-none">
                    ♛
                  </span>
                  {service.premiumTag}
                </div>

                <div className="inline-flex items-center rounded-[6px] bg-[var(--brand-accent)] px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#161b2b]">
                  {service.featureTag}
                </div>
              </div>
            </div>

            <div className="px-6 py-7">
              <h3 className="text-[31px] leading-[1] font-bold tracking-[-0.04em] text-[var(--brand-dark)]">
                {service.title}
              </h3>
              <p className="mt-4 text-[18px] leading-8 text-[#5a6377]">{service.description}</p>
              <button
                className="mt-6 inline-flex items-center gap-2 text-[16px] font-semibold tracking-[-0.01em] text-[var(--brand-blue)] transition group-hover:gap-3"
                type="button"
              >
                {service.cta}
                <span aria-hidden="true" className="text-[18px] leading-none">
                  →
                </span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
