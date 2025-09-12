import { EducationalContentSection } from "./educational-content-section";
import { FAQSection } from "./faq-section";
import { FormSection } from "./form-section";
import { HeroSection } from "./hero-section";
import {
  InvestmentCalculatorFAQSchema,
  InvestmentCalculatorSchema,
} from "./investment-calculator-schema";
import { InvestmentCalculatorProvider } from "./investment-calculator.state";
import type { FormState } from "./investment-calculator.type";
import { RelatedCalculatorsSection } from "./related-calculators-section";
import { ResultsSection } from "./results-section";

interface InvestmentCalculatorProps {
  initialFormState?: FormState;
}

/**
 * Main investment calculator component that composes all sections with proper server/client separation
 * Accepts initial form state for URL state initialization
 */
export function InvestmentCalculator({
  initialFormState,
}: InvestmentCalculatorProps) {
  return (
    <>
      <InvestmentCalculatorSchema />
      <InvestmentCalculatorFAQSchema />
      <InvestmentCalculatorProvider initialFormState={initialFormState}>
        <HeroSection />
        <FormSection />
        <ResultsSection />
        <EducationalContentSection />
        <FAQSection />
        <RelatedCalculatorsSection />
      </InvestmentCalculatorProvider>
    </>
  );
}
