import { FormSection } from "./form-section";
import { HeroSection } from "./hero-section";
import { InvestmentCalculatorProvider } from "./investment-calculator.state";
import type { FormState } from "./investment-calculator.type";
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
    <InvestmentCalculatorProvider initialFormState={initialFormState}>
      <HeroSection />
      <FormSection />
      <ResultsSection />
    </InvestmentCalculatorProvider>
  );
}
