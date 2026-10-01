import { FormSection } from "./form-section";
import { HeroSection } from "./hero-section";
import { PayYourselfFirstProvider } from "./pay-yourself-first.state";
import { ResultsSection } from "./results-section";

/**
 * Pay Yourself First calculator: composes the sections inside one state provider
 */
export function PayYourselfFirst() {
  return (
    <PayYourselfFirstProvider>
      <HeroSection />
      <FormSection />
      <ResultsSection />
    </PayYourselfFirstProvider>
  );
}
