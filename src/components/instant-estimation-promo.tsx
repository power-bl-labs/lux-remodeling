"use client";

import Link from "next/link";

export function InstantEstimationPromo() {
  return (
    <section className="mt-8 rounded-[12px] border border-[#dce2ed] bg-[#f4f6fb] px-6 py-7 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:px-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[760px]">
          <h2 className="text-[36px] leading-[0.98] font-bold tracking-[-0.045em] text-[var(--brand-dark)] sm:text-[42px]">
            Get A San Jose Remodel Budget Range Before We Schedule The Visit.
          </h2>
          <p className="mt-4 max-w-[760px] text-[18px] leading-8 text-[#5a6377]">
            Choose the project type, timing, square footage, and ZIP code, then see a live
            starting range for kitchens, bathrooms, additions, ADUs, and whole-home remodels
            before an inspector calls with the next step.
          </p>
        </div>

        <Link
          className="inline-flex min-h-[58px] w-full items-center justify-center rounded-[6px] border border-[var(--brand-dark)] bg-white px-7 py-3 text-center text-[17px] font-semibold tracking-[-0.01em] text-[var(--brand-dark)] transition hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)] lg:w-auto lg:min-w-[300px]"
          href="/instant-estimation"
        >
          Open Instant Calculator
        </Link>
      </div>
    </section>
  );
}
