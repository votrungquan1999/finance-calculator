import { CalculatorGridSection } from "./calculator-grid-section";
import { CtaSection } from "./cta-section";
import { FaqSection } from "./faq-section";
import { FeaturesSection } from "./features-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { StructuredData } from "./structured-data.component";
import { TrustSection } from "./trust-section";

/**
 * Landing page with overview of available financial calculators
 */
export default function Home() {
  return (
    <>
      <StructuredData />
      <div className="space-y-12">
        <HeroSection />
        <CalculatorGridSection />
        <FeaturesSection />
        <TrustSection />
        <HowItWorksSection />
        <FaqSection />
        <CtaSection />
      </div>
    </>
  );
}
