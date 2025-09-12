import { LoanDecliningProvider } from "./loan-declining.state";
import type { FormState, CalculationMode } from "./loan-declining.type";
import { HeroSection } from "./hero-section";
import { FormSection } from "./form-section";
import { ResultsSection } from "./results-section";
import { LoanDecliningContainer } from "./loan-declining.ui";

interface LoanDecliningCalculatorProps {
  initialFormState?: FormState;
  initialCalculationMode?: CalculationMode;
}

/**
 * Main loan declining calculator component that composes all sections with proper server/client separation
 * Accepts initial form state and calculation mode for URL state initialization
 */
export function LoanDecliningCalculator({
  initialFormState,
  initialCalculationMode,
}: LoanDecliningCalculatorProps) {
  return (
    <LoanDecliningProvider
      initialFormState={initialFormState}
      initialCalculationMode={initialCalculationMode}
    >
      <LoanDecliningContainer>
        <HeroSection />
        <FormSection />
        <ResultsSection />
      </LoanDecliningContainer>
    </LoanDecliningProvider>
  );
}
