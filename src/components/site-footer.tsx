"use client";

import Link from "next/link";

const footerColumns = [
  {
    title: "Services",
    links: [
      "Kitchen Remodeling",
      "Bathroom Renovation",
      "Whole Home Remodeling",
      "Home Additions",
      "ADUs & Garage Conversions",
      "Design + Permit Planning",
    ],
  },
  {
    title: "Resources",
    links: [
      "Instant Estimation",
      "Permit Planning",
      "Project Timeline Guide",
      "Remodel Cost Factors",
      "Material Selections",
      "Planning Your ADU",
    ],
  },
  {
    title: "San Jose",
    links: [
      "Willow Glen",
      "Almaden Valley",
      "Cambrian",
      "Rose Garden",
      "Evergreen",
      "Berryessa",
    ],
  },
  {
    title: "Company",
    links: [
      "About Lux Construct",
      "Reviews",
      "Portfolio",
      "Contact Us",
      "Lead Management Demo",
      "Instant Calculator",
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 overflow-hidden rounded-[12px] border border-[#d8deea] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
      <div className="grid gap-10 px-6 py-10 sm:px-8 lg:grid-cols-[1.15fr_2fr] lg:px-10 lg:py-12">
        <div className="max-w-[420px]">
          <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-[#6d7890]">
            Lux Construct
          </p>
          <h2 className="mt-3 text-[38px] leading-[0.96] font-bold tracking-[-0.045em] text-[var(--brand-dark)] sm:text-[46px]">
            San Jose Remodeling,
            <br />
            Planned And Built
            <br />
            With More Clarity.
          </h2>
          <p className="mt-4 text-[18px] leading-8 text-[#5a6377]">
            Kitchen, bath, addition, ADU, and whole-home remodeling for homeowners who want a
            cleaner process, stronger design direction, and a polished final result.
          </p>

          <div className="mt-6 grid gap-3 sm:max-w-[320px]">
            <a
              className="inline-flex min-h-[56px] items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-6 py-3 text-[16px] font-semibold tracking-[-0.01em] text-white transition hover:brightness-110"
              href="tel:+14085551234"
              style={{ color: "#ffffff" }}
            >
              Call (408) 555-1234
            </a>
            <Link
              className="inline-flex min-h-[56px] items-center justify-center rounded-[6px] border border-[var(--brand-dark)] bg-white px-6 py-3 text-[16px] font-semibold tracking-[-0.01em] text-[var(--brand-dark)] transition hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
              href="/instant-estimation"
            >
              Open Instant Calculator
            </Link>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[28px] leading-[1] font-bold tracking-[-0.035em] text-[var(--brand-dark)]">
                {column.title}
              </h3>
              <ul className="mt-5 grid gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      className="text-[17px] leading-7 text-[#5a6377] transition hover:text-[var(--brand-blue)]"
                      href="#"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#e3e8f1] bg-[#f7f9fc] px-6 py-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] font-medium text-[#5a6377]">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Licensing</a>
            <a href="#">San Jose, California</a>
          </div>

          <p className="max-w-[760px] text-[14px] leading-6 text-[#6d7890]">
            Lux Construct is presented as a San Jose remodeling brand demo. Final pricing depends
            on scope, site conditions, selections, permit requirements, and in-person review.
          </p>
        </div>
      </div>
    </footer>
  );
}
