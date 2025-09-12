import { FormSection } from "./form-section";
import { HeroSection } from "./hero-section";
import { LoanAnnuityProvider } from "./loan-annuity.state";
import type { CalculationMode, FormState } from "./loan-annuity.type";
import { LoanAnnuityContainer } from "./loan-annuity.ui";
import { ResultsSection } from "./results-section";

interface LoanAnnuityCalculatorProps {
  initialFormState?: FormState;
  initialCalculationMode?: CalculationMode;
}

/**
 * Main loan annuity calculator component that composes all sections with proper server/client separation
 * Accepts initial form state and calculation mode for URL state initialization
 */
export function LoanAnnuityCalculator({
  initialFormState,
  initialCalculationMode,
}: LoanAnnuityCalculatorProps) {
  return (
    <LoanAnnuityProvider
      initialFormState={initialFormState}
      initialCalculationMode={initialCalculationMode}
    >
      <LoanAnnuityContainer>
        <HeroSection />
        <FormSection />
        <ResultsSection />
      </LoanAnnuityContainer>
    </LoanAnnuityProvider>
  );
}
