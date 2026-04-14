import { InstantEstimationForm } from "@/components/instant-estimation/instant-estimation-form";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Instant Estimation | Lux Remodeling",
};

export default function InstantEstimationPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-soft)]">
      <SiteHeader />

      <section className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-6 md:px-6 lg:px-8">
        <div className="mb-6 w-full rounded-[10px] bg-[var(--brand-blue)] px-5 py-4 text-white shadow-[0_18px_48px_rgba(51,72,255,0.18)] sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">
            San Jose Instant Estimation
          </p>
          <h1 className="mt-2 max-w-[980px] text-[22px] leading-[1.02] font-semibold tracking-[-0.04em] text-white sm:text-[28px]">
            Get A San Jose Remodel Price Range, Then A Real Inspector Follow-Up.
          </h1>
          <p className="mt-2 max-w-[1120px] text-[14px] leading-6 text-white/82">
            Homeowners can review a live starting range for kitchens, bathrooms, additions, ADUs,
            and larger remodels, then leave their name and phone number so the team can follow up
            with a site visit and a more exact quote.
          </p>
        </div>

        <InstantEstimationForm />
      </section>
    </main>
  );
}
