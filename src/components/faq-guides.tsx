"use client";

const faqGuides = [
  {
    title: "Do I Need A Permit For My San Jose Remodel?",
    description: "Understand when a kitchen or bathroom update stays minor and when plans, review, and permits become part of the job.",
    icon: (
      <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
        <path
          d="M7 4.5H17L20 7.5V18.5C20 19.05 19.55 19.5 19 19.5H7C6.45 19.5 6 19.05 6 18.5V5.5C6 4.95 6.45 4.5 7 4.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path d="M16.5 4.5V8H20" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        <path d="M9 12H15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <path d="M9 15.5H13.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: "How Do Additions And ADUs Usually Start?",
    description: "See the early path from planning and site fit to layout decisions, pricing ranges, and permit-ready next steps.",
    icon: (
      <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
        <path
          d="M4 18.5H20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M6.5 18.5V10.5L12 6L17.5 10.5V18.5"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M10 18.5V14H14V18.5"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M17.5 8.5H20V11"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
  {
    title: "What Impacts Remodeling Cost The Most?",
    description: "Compare scope, square footage, finish level, access, and timeline so the starting range makes more sense before a visit.",
    icon: (
      <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
        <path
          d="M5 18.5H19"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M7.5 15.5V10.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M12 15.5V7.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <path
          d="M16.5 15.5V12.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <circle cx="7.5" cy="9" fill="currentColor" r="1.2" />
        <circle cx="12" cy="6" fill="currentColor" r="1.2" />
        <circle cx="16.5" cy="11" fill="currentColor" r="1.2" />
      </svg>
    ),
  },
  {
    title: "How Long Does A Whole-Home Remodel Take?",
    description: "Get a clearer sense of sequencing for design, selections, permits, trades, inspections, and final walkthrough.",
    icon: (
      <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
        <circle cx="12" cy="12" r="7.5" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 8V12L14.8 13.8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    ),
  },
];

export function FaqGuides() {
  return (
    <section className="mt-16 rounded-[12px] bg-[var(--brand-soft)] px-5 py-10 sm:px-6 md:px-8 md:py-12">
      <div className="max-w-[760px]">
        <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-[#6d7890]">
          Remodeling FAQ
        </p>
        <h2 className="mt-3 text-[38px] leading-[0.96] font-bold tracking-[-0.045em] text-[var(--brand-dark)] sm:text-[46px]">
          Helpful Guides For San Jose Homeowners
        </h2>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {faqGuides.map((item) => (
          <article
            key={item.title}
            className="rounded-[12px] border border-[#dde3ee] bg-[#f4f6fb] px-6 py-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-[10px] bg-[color-mix(in_srgb,var(--brand-blue)_12%,white)] text-[var(--brand-blue)]">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-[28px] leading-[1.04] font-bold tracking-[-0.035em] text-[var(--brand-dark)] underline decoration-[1.5px] underline-offset-[3px]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[18px] leading-8 text-[#5a6377]">
                  {item.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
