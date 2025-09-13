import { FormSection } from "./form-section";
import { HeroSection } from "./hero-section";
import { LoanFeeProvider } from "./loan-fee.state";
import type { CalculationMode, FormState } from "./loan-fee.type";
import { LoanFeeContainer } from "./loan-fee.ui";
import { ResultsSection } from "./results-section";

interface LoanFeeCalculatorProps {
  initialFormState?: FormState;
  initialCalculationMode?: CalculationMode;
}

/**
 * Main loan fee calculator component that composes all sections with proper server/client separation
 * Accepts initial form state and calculation mode for URL state initialization
 */
export function LoanFeeCalculator({
  initialFormState,
  initialCalculationMode,
}: LoanFeeCalculatorProps) {
  return (
    <LoanFeeProvider
      initialFormState={initialFormState}
      initialCalculationMode={initialCalculationMode}
    >
      <LoanFeeContainer>
        <HeroSection />
        <FormSection />
        <ResultsSection />
      </LoanFeeContainer>
    </LoanFeeProvider>
  );
}
