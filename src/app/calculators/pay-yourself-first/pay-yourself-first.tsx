import { FormSection } from "./form-section";
import { HeroSection } from "./hero-section";
import { PayYourselfFirstProvider } from "./pay-yourself-first.state";
import type { FormValues } from "./pay-yourself-first.type";
import { ResultsSection } from "./results-section";

interface PayYourselfFirstProps {
  initialFormValues: FormValues;
}

/**
 * Pay Yourself First calculator: composes the sections inside one state provider
 * @param props - Component props
 * @param props.initialFormValues - Form content to start from (from a shared link)
 */
export function PayYourselfFirst({ initialFormValues }: PayYourselfFirstProps) {
  return (
    <PayYourselfFirstProvider formValues={initialFormValues}>
      <HeroSection />
      <FormSection />
      <ResultsSection />
    </PayYourselfFirstProvider>
  );
}
