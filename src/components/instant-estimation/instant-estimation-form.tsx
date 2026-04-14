"use client";

import { useMemo, useState } from "react";
import { submitLead } from "@/lib/lead-notifications";
import { formatUsPhoneInput, isValidUsPhone } from "@/lib/us-phone";

const serviceOptions = [
  { value: "Kitchen Remodeling", base: 18000 },
  { value: "Bathroom Remodeling", base: 12000 },
  { value: "Whole Home Remodeling", base: 42000 },
  { value: "Home Addition", base: 55000 },
  { value: "ADU / Garage Conversion", base: 78000 },
  { value: "Design + Permit Planning", base: 9500 },
];

const timelineOptions = [
  { value: "As Soon As Possible", multiplier: 1.16 },
  { value: "Within 1-3 Months", multiplier: 1.08 },
  { value: "Within 3-6 Months", multiplier: 1 },
  { value: "Just Planning", multiplier: 0.94 },
];

const propertyTypeOptions = [
  { value: "Single Family Home", multiplier: 1 },
  { value: "Townhome", multiplier: 1.04 },
  { value: "Condo", multiplier: 1.12 },
  { value: "ADU / Backyard Unit", multiplier: 1.18 },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function InstantEstimationForm() {
  const [service, setService] = useState(serviceOptions[0].value);
  const [timeline, setTimeline] = useState(timelineOptions[1].value);
  const [propertyType, setPropertyType] = useState(propertyTypeOptions[0].value);
  const [squareFootage, setSquareFootage] = useState("750");
  const [zipCode, setZipCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const estimate = useMemo(() => {
    const serviceData =
      serviceOptions.find((option) => option.value === service) ?? serviceOptions[0];
    const timelineData =
      timelineOptions.find((option) => option.value === timeline) ?? timelineOptions[0];
    const propertyData =
      propertyTypeOptions.find((option) => option.value === propertyType) ??
      propertyTypeOptions[0];
    const footage = Number(squareFootage) || 0;
    const sizeFactor = footage > 0 ? Math.max(0.78, Math.min(1.85, footage / 700)) : 1;
    const zipFactor = zipCode.trim().length >= 5 ? 1.03 : 1;

    return Math.round(
      serviceData.base * timelineData.multiplier * propertyData.multiplier * sizeFactor * zipFactor,
    );
  }, [propertyType, service, squareFootage, timeline, zipCode]);

  async function handleSubmit() {
    if (!name.trim() || !zipCode.trim()) {
      return;
    }

    if (!isValidUsPhone(phone)) {
      setPhoneError("Enter a valid U.S. phone number.");
      return;
    }

    setPhoneError(null);

    const nextLead = {
      type: "Instant Estimation",
      mode: "Estimation",
      service,
      phone: phone.trim(),
      name: name.trim(),
      zipCode: zipCode.trim(),
      timeline,
      squareFootage: Number(squareFootage) || 0,
      propertyType,
      estimate,
    } as const;

    await submitLead(nextLead);

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-[12px] border border-[#dfe3ea] bg-white p-8 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent)]">
          Request Received
        </p>
        <h2 className="mt-4 text-[38px] leading-[0.96] font-semibold tracking-[-0.05em] text-[var(--brand-dark)]">
          Your Estimate Request Is In.
        </h2>
        <p className="mt-4 max-w-[720px] text-[17px] leading-8 text-[#5c6478]">
          We saved your San Jose estimate details and your inspector callback request. The team can
          now review the project scope, your ZIP code, your phone number, and the live starting
          range that was shown on this page.
        </p>
        <div className="mt-6 inline-flex rounded-[6px] bg-[var(--brand-blue)] px-5 py-3 text-[15px] font-semibold text-white">
          Starting From {formatCurrency(estimate)}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[12px] border border-[#dfe3ea] bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent)]">
          San Jose Instant Estimation
        </p>
        <h1 className="mt-4 max-w-[760px] text-[42px] leading-[0.95] font-semibold tracking-[-0.055em] text-[var(--brand-dark)] sm:text-[56px]">
          Get A Live Starting Range Before We Call.
        </h1>
        <p className="mt-4 max-w-[760px] text-[17px] leading-8 text-[#5c6478]">
          Tell us what you want to build in San Jose, your timing, your square footage, and your
          ZIP code. We will show an approximate starting range live on the page, then collect your
          details so an inspector can call with a refined estimate.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-[14px] font-semibold text-[#344054]">Project Type</span>
            <select
              className="h-13 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium text-[#14162b] outline-none"
              onChange={(event) => setService(event.target.value)}
              value={service}
            >
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-[14px] font-semibold text-[#344054]">Timeline</span>
            <select
              className="h-13 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium text-[#14162b] outline-none"
              onChange={(event) => setTimeline(event.target.value)}
              value={timeline}
            >
              {timelineOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-[14px] font-semibold text-[#344054]">Square Footage</span>
            <input
              className="h-13 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium text-[#14162b] outline-none"
              inputMode="numeric"
              onChange={(event) => setSquareFootage(event.target.value)}
              placeholder="750"
              type="text"
              value={squareFootage}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[14px] font-semibold text-[#344054]">Property Type</span>
            <select
              className="h-13 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium text-[#14162b] outline-none"
              onChange={(event) => setPropertyType(event.target.value)}
              value={propertyType}
            >
              {propertyTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 md:col-span-2">
            <span className="text-[14px] font-semibold text-[#344054]">ZIP Code</span>
            <input
              className="h-13 rounded-[10px] border border-[#d0d5dd] bg-[#f8fafc] px-4 text-[15px] font-medium text-[#14162b] outline-none"
              onChange={(event) => setZipCode(event.target.value)}
              placeholder="Enter Your ZIP Code"
              type="text"
              value={zipCode}
            />
          </label>
        </div>
      </section>

      <section className="rounded-[12px] bg-[var(--brand-dark)] p-6 text-white shadow-[0_22px_60px_rgba(15,23,42,0.18)] sm:p-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent)]">
            Live Price
          </p>
        <div className="mt-5 rounded-[10px] bg-white/7 p-6 backdrop-blur">
          <p className="text-[14px] font-medium text-white/70">Starting From</p>
          <div className="mt-3 text-[48px] leading-none font-semibold tracking-[-0.05em] text-white sm:text-[58px]">
            {formatCurrency(estimate)}
          </div>
          <p className="mt-4 text-[15px] leading-7 text-white/76">
            This is an approximate starting range based on the project type, timing, square
            footage, and property profile you selected.
          </p>
        </div>

        <div className="mt-6 rounded-[10px] border border-white/10 bg-white/6 p-5">
          <p className="text-[14px] leading-7 text-white/80">
            Final pricing is only confirmed after an inspector visits the property, reviews access,
            verifies measurements, and checks the finish scope in person. Local permit and code
            conditions can affect the final proposal.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-[14px] font-semibold text-white">Your Name</span>
            <input
              className="h-13 rounded-[10px] border border-white/12 bg-white px-4 text-[15px] font-medium text-[#14162b] outline-none"
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter Your Name"
              type="text"
              value={name}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[14px] font-semibold text-white">Phone Number</span>
            <input
              className="h-13 rounded-[10px] border border-white/12 bg-white px-4 text-[15px] font-medium text-[#14162b] outline-none"
              inputMode="tel"
              onChange={(event) => {
                const nextValue = formatUsPhoneInput(event.target.value);
                setPhone(nextValue);
                if (phoneError) {
                  setPhoneError(null);
                }
              }}
              placeholder="(408) 555-0123"
              type="tel"
              value={phone}
            />
            {phoneError ? (
              <span className="text-[13px] font-medium text-[#ffb4b4]">{phoneError}</span>
            ) : null}
          </label>
        </div>

        <button
          className="mt-6 inline-flex h-13 w-full items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-5 text-[15px] font-semibold text-white shadow-[0_10px_24px_rgba(51,72,255,0.28)] transition hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-55"
          disabled={!name.trim() || !phone.trim() || !zipCode.trim()}
          onClick={handleSubmit}
          type="button"
        >
          Request Inspector Callback
        </button>
      </section>
    </div>
  );
}
