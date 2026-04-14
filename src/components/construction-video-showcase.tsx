"use client";

import Link from "next/link";

export function ConstructionVideoShowcase() {
  return (
    <section className="mt-16 overflow-hidden rounded-[12px] border border-[#d8deea] bg-[#0f1630] shadow-[0_18px_48px_rgba(13,18,38,0.18)]">
      <div className="relative aspect-[16/7] min-h-[420px] w-full overflow-hidden sm:min-h-[360px]">
        <iframe
          allow="autoplay; encrypted-media; picture-in-picture"
          className="absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 scale-[1.08] pointer-events-none"
          loading="lazy"
          src="https://www.youtube-nocookie.com/embed/ftt-JWHI1Js?autoplay=1&mute=1&controls=0&loop=1&playlist=ftt-JWHI1Js&playsinline=1&modestbranding=1&rel=0"
          title="Construction timelapse"
        />

        <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(8,12,28,0.78)_0%,rgba(8,12,28,0.52)_42%,rgba(8,12,28,0.2)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,12,28,0.1)_0%,rgba(8,12,28,0.46)_100%)]" />

        <div className="relative z-10 flex h-full items-end">
          <div className="max-w-[760px] px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 md:px-10 md:pb-10">
            <div className="inline-flex rounded-[6px] border border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.08)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/82 backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-[12px] sm:tracking-[0.24em]">
              San Jose Build Process
            </div>

            <h2 className="mt-3 max-w-[700px] text-[28px] leading-[0.95] font-bold tracking-[-0.045em] text-white sm:mt-4 sm:text-[40px] md:text-[46px]">
              See The Kind Of Coordination It Takes To Move A Complex Remodel Cleanly.
            </h2>

            <p className="mt-3 max-w-[620px] text-[14px] leading-7 text-white/80 sm:mt-4 sm:text-[17px] sm:leading-8">
              For additions, ADUs, and whole-home remodels in San Jose, homeowners want to feel
              that the build is organized, managed, and moving toward a polished final result.
            </p>

            <div className="mt-5 flex flex-col items-start gap-3 sm:mt-6 sm:flex-wrap sm:flex-row sm:items-center">
              <Link
                className="inline-flex min-h-[50px] items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 py-3 text-[15px] font-semibold tracking-[-0.01em] transition hover:brightness-110 sm:min-h-[54px] sm:px-6 sm:py-3.5 sm:text-[16px]"
                href="/instant-estimation"
                style={{ color: "#ffffff" }}
              >
                Start Your Estimate
              </Link>
              <p className="text-[12px] leading-5 text-white/64 sm:text-[14px] sm:leading-6">
                Video source: Perkins Builder Brothers on YouTube
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
