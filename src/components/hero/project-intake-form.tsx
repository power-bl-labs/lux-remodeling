"use client";

import { useMemo, useState } from "react";
import { saveDemoLead } from "@/lib/demo-store";
import { notifyLead } from "@/lib/lead-notifications";

export type IntakeMode = "Remodel" | "Design" | "Build";

const serviceOptionsByMode: Record<IntakeMode, string[]> = {
  Remodel: [
    "Kitchen Remodeling",
    "Bathroom Remodeling",
    "Whole Home Remodeling",
    "Home Addition",
    "ADU / Garage Conversion",
  ],
  Design: [
    "Kitchen Design",
    "Bathroom Design",
    "Whole Home Planning",
    "Addition Planning",
    "ADU Planning",
  ],
  Build: [
    "Construction Estimate",
    "Project Management",
    "Remodel Construction",
    "Addition Construction",
    "Finish Selections",
  ],
};

const modes: IntakeMode[] = ["Remodel", "Design", "Build"];

type ProjectIntakeFormProps = {
  mode: IntakeMode;
  onModeChange: (mode: IntakeMode) => void;
};

export function ProjectIntakeForm({
  mode,
  onModeChange,
}: ProjectIntakeFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [service, setService] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const serviceOptions = useMemo(() => serviceOptionsByMode[mode], [mode]);

  function handleNext() {
    if (!service) {
      return;
    }

    setStep(2);
  }

  async function handleSubmit() {
    if (!phone.trim()) {
      return;
    }

    const nextLead = {
      type: "Quick Lead",
      mode,
      service,
      phone: phone.trim(),
    } as const;

    saveDemoLead(nextLead);
    await notifyLead(nextLead);
    setIsSubmitted(true);
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-8 border-b border-white/20 px-1 pb-4">
        {modes.map((item) => {
          const isActive = item === mode;

          return (
            <button
              key={item}
              className={`relative text-[15px] font-bold tracking-[-0.02em] transition ${
                isActive ? "text-white" : "text-white/70 hover:text-white"
              } ${isActive ? "after:absolute after:-bottom-[17px] after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-white" : ""}`}
              onClick={() => onModeChange(item)}
              type="button"
            >
              {item}
            </button>
          );
        })}
      </div>

      <p className="mt-5 text-sm font-medium text-white/86">
        Tell Us About Your San Jose Project And We&apos;ll Guide The Next Step
      </p>

      {isSubmitted ? (
        <div className="mt-4 animate-hero-copy">
          <div className="rounded-[10px] bg-[var(--brand-blue)] px-5 py-4 text-center text-[16px] font-semibold text-white">
            Thanks. We&apos;ll Reach Out About {service}.
          </div>
          <div className="mt-3 h-6" />
        </div>
      ) : (
        <div className="mt-4 min-h-[104px]">
          <div className="animate-hero-copy">
            {step === 1 ? (
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <select
                    aria-label="Select Service"
                    className="h-14 w-full appearance-none rounded-[10px] border-0 bg-white px-5 pr-12 text-[17px] font-semibold text-[#101114] outline-none"
                    onChange={(event) => setService(event.target.value)}
                    value={service}
                  >
                    <option value="">Choose What You Need</option>
                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-base font-black text-[var(--brand-blue)]">
                    ▾
                  </span>
                </div>
                <button
                  className="inline-flex h-14 w-full items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-8 text-[17px] font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 md:min-w-[170px] md:w-auto"
                  disabled={!service}
                  onClick={handleNext}
                  type="button"
                >
                  Next
                </button>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px] md:items-stretch">
                <input
                  aria-label="Phone Number"
                  className="block h-[56px] w-full min-w-0 rounded-[10px] border-0 bg-white px-5 text-[16px] leading-none font-semibold text-[#101114] outline-none placeholder:text-[16px] placeholder:leading-none placeholder:font-medium placeholder:text-[#8b93a1] md:text-[17px] md:placeholder:text-[17px]"
                  inputMode="tel"
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter Your Phone Number"
                  type="tel"
                  value={phone}
                />
                <button
                  className="inline-flex h-[56px] w-full items-center justify-center rounded-[6px] bg-[var(--brand-blue)] px-8 text-[17px] font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={!phone.trim()}
                  onClick={handleSubmit}
                  type="button"
                >
                  Submit
                </button>
              </div>
            )}
          </div>

          <div className="mt-3 h-6">
            {step === 2 ? (
              <button
                className="text-sm font-semibold text-[var(--brand-blue)] transition hover:text-white"
                onClick={() => setStep(1)}
                type="button"
              >
                Back
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
