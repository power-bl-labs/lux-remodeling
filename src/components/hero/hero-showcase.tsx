"use client";

import { useMemo, useState } from "react";
import { IntakeMode, ProjectIntakeForm } from "@/components/hero/project-intake-form";

type HeroScene = {
  mode: IntakeMode;
  accent: string;
  accentStrong: string;
  title: string;
  body: string;
  image: string;
  backgroundPosition: string;
};

const scenes: HeroScene[] = [
  {
    mode: "Remodel",
    accent: "San Jose",
    accentStrong: "Kitchen, Bath & Whole-Home Remodels",
    title: "Remodel San Jose Homes With Clear Scope And Premium Execution",
    body: "From kitchen upgrades and bathroom renovations to full-home transformations, we help San Jose homeowners move from first inquiry into selections, permits, and construction with less friction.",
    image: "/hero-remodel-new.jpg",
    backgroundPosition: "center 56%",
  },
  {
    mode: "Design",
    accent: "Plan",
    accentStrong: "Additions, ADUs & Interior Layouts",
    title: "Design The Space Before Permits, Pricing, And Construction Decisions Stack Up",
    body: "For San Jose additions, reconfigurations, and ADUs, early design work creates a cleaner path through layout planning, finish selections, and permit coordination.",
    image: "/hero-design-new.jpg",
    backgroundPosition: "center 50%",
  },
  {
    mode: "Build",
    accent: "Build",
    accentStrong: "Permitted, Managed, Move-In Ready",
    title: "Turn Approved Plans Into A Smooth San Jose Construction Process",
    body: "Once the scope is approved, we keep schedules, trades, site communication, and finish quality moving toward a confident final walkthrough.",
    image: "/hero-build-new.jpg",
    backgroundPosition: "center 48%",
  },
];

const trustSignals = [
  {
    icon: "★",
    title: "San Jose Permit Aware",
    detail: "Minor remodels to full plan review",
  },
  {
    icon: "✓",
    title: "Licensed California Contractor",
    detail: "Insured and code-conscious",
  },
  {
    icon: "◔",
    title: "ADUs, Additions, Remodels",
    detail: "Built for real local scope",
  },
];

export function HeroShowcase() {
  const [mode, setMode] = useState<IntakeMode>("Remodel");

  const activeScene = useMemo(
    () => scenes.find((scene) => scene.mode === mode) ?? scenes[0],
    [mode],
  );

  return (
    <div className="overflow-hidden rounded-[12px] bg-[#151722] shadow-[0_32px_80px_rgba(24,17,44,0.24)]">
      <div className="relative min-h-[438px] overflow-hidden px-6 py-8 md:px-10 lg:px-14">
        {scenes.map((scene) => (
          <div
            key={scene.mode}
            aria-hidden={scene.mode !== mode}
            className={`absolute inset-0 transition-all duration-700 ease-out ${
              scene.mode === mode
                ? "scale-100 opacity-100"
                : "scale-[1.035] opacity-0"
            }`}
            style={{
              backgroundImage: `url('${scene.image}')`,
              backgroundPosition: scene.backgroundPosition,
              backgroundSize: "cover",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.10),transparent_18%),radial-gradient(circle_at_86%_18%,rgba(255,255,255,0.08),transparent_15%),linear-gradient(180deg,rgba(12,13,17,0.03),rgba(12,13,17,0.10))]" />
        <div className="absolute inset-x-0 bottom-0 h-[32%] bg-[linear-gradient(180deg,rgba(12,13,17,0)_0%,rgba(12,13,17,0.04)_36%,rgba(12,13,17,0.18)_100%)]" />

        <div
          key={activeScene.mode}
          className="relative z-10 mx-auto flex max-w-[920px] animate-hero-copy flex-col items-center rounded-[12px] bg-[rgba(18,21,33,0.20)] px-4 py-4 text-center shadow-[0_20px_50px_rgba(15,11,31,0.18)] backdrop-blur-[14px] sm:px-5 md:px-10 md:py-5"
        >
          <p className="text-[14px] font-bold tracking-[-0.03em] text-[var(--brand-accent)] sm:text-[15px] md:text-[19px]">
            {activeScene.accent}
            <span className="ml-2 font-black text-white">
              {activeScene.accentStrong}
            </span>
          </p>
          <h1 className="mt-2 max-w-[1040px] text-balance text-[26px] leading-[0.98] font-bold tracking-[-0.05em] text-white sm:text-[32px] md:mt-3 md:text-[48px] lg:text-[52px]">
            {activeScene.title}
          </h1>
          <p className="mt-3 max-w-[860px] text-[14px] leading-6 text-white/90 sm:text-[15px] sm:leading-7 md:mt-4 md:text-[18px]">
            {activeScene.body}
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-4 grid max-w-[760px] gap-3 md:grid-cols-3">
          {trustSignals.map((signal) => (
            <div
              key={signal.title}
              className="flex items-center gap-3 rounded-[10px] bg-[rgba(18,21,33,0.24)] px-4 py-2 text-white shadow-[0_12px_32px_rgba(15,11,31,0.18)] backdrop-blur-[14px]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 text-[17px] font-black text-[var(--brand-accent)]">
                {signal.icon}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold tracking-[-0.02em] text-white">
                  {signal.title}
                </p>
                <p className="truncate text-[12px] text-white">
                  {signal.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto mt-5 max-w-[760px] rounded-[12px] bg-[rgba(18,21,33,0.82)] p-6 shadow-[0_24px_60px_rgba(15,11,31,0.28)] backdrop-blur">
          <ProjectIntakeForm key={mode} mode={mode} onModeChange={setMode} />
        </div>
      </div>
    </div>
  );
}
