import { BenefitsCarousel } from "@/components/benefits-carousel";
import { ConstructionVideoShowcase } from "@/components/construction-video-showcase";
import { FaqGuides } from "@/components/faq-guides";
import { HeroShowcase } from "@/components/hero/hero-showcase";
import { InstantEstimationPromo } from "@/components/instant-estimation-promo";
import { ServicesShowcase } from "@/components/services-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <main className="flex-1 bg-[var(--brand-soft)]">
      <SiteHeader />

      <section className="mx-auto w-full max-w-[1560px] px-4 pb-16 pt-4 md:px-6">
        <HeroShowcase />
        <BenefitsCarousel />
        <ServicesShowcase />
        <ConstructionVideoShowcase />
        <InstantEstimationPromo />
        <FaqGuides />
        <SiteFooter />
      </section>
    </main>
  );
}
