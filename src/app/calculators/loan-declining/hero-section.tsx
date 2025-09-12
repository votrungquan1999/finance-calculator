import { LoanDecliningHero } from "./loan-declining.ui";

/**
 * Hero section for the loan declining calculator
 * Displays the main title and description
 */
export function HeroSection() {
  return (
    <LoanDecliningHero>
      <h1 className="text-3xl font-bold">Declining Balance Loan Calculator</h1>
      <p className="text-muted-foreground mt-2">
        Calculate declining balance loans with fixed principal payments and
        varying interest. Each month you pay a fixed amount toward principal
        plus interest on the remaining balance. Total payments decrease over
        time.
      </p>
    </LoanDecliningHero>
  );
}
