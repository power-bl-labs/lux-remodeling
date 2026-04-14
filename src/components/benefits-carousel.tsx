"use client";

import { useEffect, useMemo, useState } from "react";

const benefits = [
  {
    title: "San Jose Instant Estimate",
    body: "Get a fast first-pass budget range for kitchens, baths, additions, and ADU-style projects before the site visit.",
    linkLabel: "Start Estimating",
    icon: (
      <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
        <rect
          height="16"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.7"
          width="12"
          x="4"
          y="4"
        />
        <path
          d="M7 8H13M7 11.5H13M7 15H10.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
        <path
          d="M17 8.5H20M18.5 7L20 8.5L18.5 10"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="M17 15L19 13M19 13L21 15M19 13V20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    title: "ADU & Addition Planning",
    body: "Plan the extra square footage, garage conversion, or backyard unit before pricing and permit coordination get expensive.",
    linkLabel: "Explore Planning",
    icon: (
      <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
        <path
          d="M4 18L12 4L20 18H4Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="M12 8V14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
        <path
          d="M8.5 18L10.4 13.8H13.6L15.5 18"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <circle cx="12" cy="17.8" fill="currentColor" r="1" />
        <path
          d="M16.8 6.2L19.6 3.4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    title: "Permit-Aware Project Guidance",
    body: "Move from concept through plan review, selections, scheduling, and final walkthrough with one coordinated process.",
    linkLabel: "View The Process",
    icon: (
      <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
        <path
          d="M7 6.5H17"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
        <path
          d="M7 12H17"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
        <path
          d="M7 17.5H13"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
        <rect
          height="15"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.7"
          width="16"
          x="4"
          y="4.5"
        />
        <path
          d="M16.5 14.5L18 16L20.5 12.8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    title: "Electrification-Ready Upgrades",
    body: "Build around modern appliance, lighting, and efficiency decisions that fit the way Bay Area homes are moving.",
    linkLabel: "See Upgrade Ideas",
    icon: (
      <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
        <path
          d="M8 17.5H6.8C5.81 17.5 5 16.69 5 15.7V8.3C5 7.31 5.81 6.5 6.8 6.5H17.2C18.19 6.5 19 7.31 19 8.3V15.7C19 16.69 18.19 17.5 17.2 17.5H15.2"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="M12 9L13.2 11.4L15.9 11.8L13.95 13.7L14.4 16.4L12 15.1L9.6 16.4L10.05 13.7L8.1 11.8L10.8 11.4L12 9Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <path
          d="M7.5 19.5H16.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
  {
    title: "Luxury-Level Craftsmanship",
    body: "Premium materials, cleaner detailing, and a calmer homeowner experience from consultation through the final reveal.",
    linkLabel: "Take A Look",
    icon: (
      <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
        <rect
          height="14"
          rx="2.5"
          stroke="currentColor"
          strokeWidth="1.7"
          width="16"
          x="4"
          y="5"
        />
        <path
          d="M8 9.5H16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
        <path
          d="M8 13H12"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
        <path
          d="M14 13L15.5 14.5L18 11.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    ),
  },
];

const duplicatedBenefits = [...benefits, ...benefits];
const reviews = [
  {
    source: "Google",
    name: "Sarah M.",
    quote: "The team made our kitchen feel custom without turning the process into chaos.",
  },
  {
    source: "Houzz",
    name: "Daniel R.",
    quote: "Clear pricing, clean communication, and the final result looked even better in person.",
  },
  {
    source: "Google",
    name: "Nina L.",
    quote: "We felt guided from the first call through design decisions and final walkthrough.",
  },
];

function GoogleLogo() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 74 24" width="56">
      <path
        d="M23.32 12.27C23.32 11.48 23.25 10.72 23.11 10H12v4.21h6.35a5.43 5.43 0 0 1-2.36 3.56v2.96h3.82c2.24-2.06 3.51-5.09 3.51-8.46Z"
        fill="#4285F4"
      />
      <path
        d="M12 23.8c3.18 0 5.85-1.05 7.79-2.84l-3.82-2.96c-1.06.71-2.41 1.14-3.97 1.14-3.05 0-5.64-2.06-6.57-4.83H1.49v3.06A11.79 11.79 0 0 0 12 23.8Z"
        fill="#34A853"
      />
      <path
        d="M5.43 14.31A7.1 7.1 0 0 1 5.07 12c0-.8.13-1.57.36-2.31V6.63H1.49A11.79 11.79 0 0 0 .2 12c0 1.9.46 3.69 1.29 5.37l3.94-3.06Z"
        fill="#FBBC04"
      />
      <path
        d="M12 4.86c1.73 0 3.28.6 4.5 1.77l3.37-3.37C17.84 1.36 15.18.2 12 .2A11.79 11.79 0 0 0 1.49 6.63l3.94 3.06c.93-2.77 3.52-4.83 6.57-4.83Z"
        fill="#EA4335"
      />
      <path
        d="M31.3 8.26c2.33 0 4.05 1.55 4.05 3.67 0 2.1-1.72 3.67-4.05 3.67-2.33 0-4.05-1.57-4.05-3.67 0-2.12 1.72-3.67 4.05-3.67Zm0 5.89c1.27 0 2.16-.93 2.16-2.22 0-1.31-.89-2.22-2.16-2.22-1.27 0-2.16.91-2.16 2.22 0 1.29.89 2.22 2.16 2.22Z"
        fill="#4285F4"
      />
      <path
        d="M43.13 8.49v6.59c0 2.71-1.6 3.82-3.5 3.82-1.79 0-2.86-1.2-3.27-2.18l1.64-.68c.29.7.99 1.52 1.63 1.52 1.07 0 1.73-.66 1.73-1.9v-.53h-.06c-.4.49-1.16.92-2.13.92-2.02 0-3.86-1.76-3.86-3.89 0-2.14 1.84-3.91 3.86-3.91.97 0 1.73.43 2.13.9h.06v-.67h1.77Zm-1.56 3.68c0-1.34-.9-2.31-2.04-2.31-1.16 0-2.13.97-2.13 2.31 0 1.32.97 2.28 2.13 2.28 1.14 0 2.04-.96 2.04-2.28Z"
        fill="#34A853"
      />
      <path d="M45.85 4.62h1.83V15.4h-1.83V4.62Z" fill="#EA4335" />
      <path
        d="M53.81 13.12l1.45.97c-.47.7-1.61 1.51-3.18 1.51-2.17 0-3.78-1.68-3.78-3.67 0-2.12 1.63-3.67 3.59-3.67 1.97 0 2.94 1.58 3.25 2.43l.19.48-4.9 2.03c.37.73.95 1.1 1.76 1.1.82 0 1.38-.4 1.62-1.18Zm-3.67-1.3 3.27-1.35c-.18-.46-.72-.78-1.36-.78-.81 0-1.94.72-1.91 2.13Z"
        fill="#FBBC04"
      />
      <path
        d="M61.22 10.98v-1.67h5.63c.05.29.08.63.08 1.01 0 1.26-.34 2.82-1.46 3.94-1.08 1.13-2.47 1.74-4.3 1.74-3.39 0-6.25-2.77-6.25-6.17 0-3.4 2.86-6.17 6.25-6.17 1.88 0 3.22.73 4.22 1.69l-1.18 1.18c-.72-.67-1.69-1.2-3.04-1.2-2.49 0-4.44 2-4.44 4.5 0 2.49 1.95 4.5 4.44 4.5 1.61 0 2.53-.64 3.11-1.22.48-.48.8-1.17.92-2.13h-4.03Z"
        fill="#4285F4"
      />
      <path
        d="M70.84 15.4c-2.01 0-3.67-1.55-3.67-3.57s1.66-3.57 3.67-3.57 3.67 1.55 3.67 3.57-1.66 3.57-3.67 3.57Zm0-1.45c1.1 0 1.95-.89 1.95-2.12s-.85-2.12-1.95-2.12-1.95.88-1.95 2.12.85 2.12 1.95 2.12Z"
        fill="#4285F4"
      />
    </svg>
  );
}

function HouzzLogo() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 74 24" width="54">
      <path
        d="M4 2h6.55v8.74l7.1-4.1V2H24v20h-6.35v-8.36l-7.1 4.1V22H4V2Z"
        fill="#4D8A0F"
      />
      <path
        d="M29.08 17.98c0-2.82 2.23-4.58 4.69-4.58 2.49 0 4.72 1.76 4.72 4.58 0 2.8-2.23 4.56-4.72 4.56-2.46 0-4.69-1.76-4.69-4.56Zm6.86 0c0-1.35-.94-2.2-2.17-2.2-1.2 0-2.14.85-2.14 2.2 0 1.32.94 2.18 2.14 2.18 1.23 0 2.17-.86 2.17-2.18Z"
        fill="#1F2937"
      />
      <path
        d="M40.12 22.2v-8.54h2.46v1.08c.47-.74 1.34-1.34 2.53-1.34 1.94 0 3.37 1.28 3.37 3.62v5.18h-2.56v-4.74c0-1.03-.55-1.68-1.54-1.68-.94 0-1.7.62-1.7 1.84v4.58h-2.56Z"
        fill="#1F2937"
      />
      <path
        d="M50.64 22.2v-2.02l4.62-4.28h-4.46v-2.24h7.85v2.02l-4.56 4.28h4.72v2.24h-8.17Z"
        fill="#1F2937"
      />
      <path
        d="M60.06 22.2v-2.02l4.62-4.28h-4.46v-2.24h7.85v2.02l-4.56 4.28h4.72v2.24h-8.17Z"
        fill="#1F2937"
      />
    </svg>
  );
}

export function BenefitsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % benefits.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  const translateStyle = useMemo(
    () => ({
      transform: `translateX(calc(-${index} * (min(100%, 360px) + 16px)))`,
    }),
    [index],
  );

  return (
    <section className="mt-14">
      <div className="mb-6 rounded-[10px] border border-[#dfe3ea] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        <div className="scrollbar-hidden flex gap-4 overflow-x-auto">
          {reviews.map((review) => (
            <article
              key={`${review.source}-${review.name}`}
              className="min-w-[320px] flex-1 rounded-[10px] border border-[#e7ebf3] bg-[#fcfdff] px-5 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-[6px] bg-[#f6f8fc] px-2.5 py-1.5">
                  {review.source === "Google" ? <GoogleLogo /> : <HouzzLogo />}
                </div>
                <div className="flex items-center gap-0.5 text-[var(--brand-accent)]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <span key={starIndex} aria-hidden="true" className="text-[13px] leading-none">
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <p className="mt-3 text-[14px] leading-6 text-[#4f586d]">&ldquo;{review.quote}&rdquo;</p>
              <p className="mt-3 text-[13px] font-semibold text-[var(--brand-dark)]">
                {review.name}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between px-1">
        <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[#7a7f8d]">
          Why Homeowners Choose Us
        </p>
        <button
          className="text-[14px] font-bold text-[var(--brand-dark)] underline decoration-[var(--brand-blue)] underline-offset-4"
          onClick={() => setIndex((current) => (current + 1) % benefits.length)}
          type="button"
        >
          Take A Look
        </button>
      </div>

      <div className="overflow-hidden">
        <div className="benefits-track flex gap-4 transition-transform duration-700 ease-out" style={translateStyle}>
          {duplicatedBenefits.map((benefit, benefitIndex) => (
            <article
              key={`${benefit.title}-${benefitIndex}`}
              className="benefit-card flex min-h-[210px] w-[min(100%,360px)] shrink-0 flex-col rounded-[12px] border border-[#dfe3ea] bg-[var(--brand-soft)] px-8 py-8 shadow-[0_10px_28px_rgba(16,17,20,0.04)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-[10px] bg-[#e7ecff] text-[var(--brand-blue)]">
                {benefit.icon}
              </div>
              <h3 className="mt-5 max-w-[260px] text-[21px] leading-[1.12] font-bold tracking-[-0.03em] text-[var(--brand-dark)]">
                {benefit.title}
              </h3>
              <p className="mt-3 max-w-[280px] text-[15px] leading-8 text-[#5e6474]">
                {benefit.body}
              </p>
              <button
                className="mt-auto w-fit pt-5 text-[15px] font-semibold text-[var(--brand-blue)] underline decoration-[var(--brand-blue)] underline-offset-4"
                onClick={() => setIndex((current) => (current + 1) % benefits.length)}
                type="button"
              >
                {benefit.linkLabel}
              </button>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {benefits.map((_, dotIndex) => (
          <button
            key={dotIndex}
            aria-label={`Go To Benefit ${dotIndex + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              dotIndex === index ? "w-8 bg-[var(--brand-blue)]" : "w-2.5 bg-[#d6dbe6]"
            }`}
            onClick={() => setIndex(dotIndex)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
