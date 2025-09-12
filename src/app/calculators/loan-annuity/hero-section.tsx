import { LoanAnnuityHero } from "./loan-annuity.ui";

/**
 * Hero section for the loan annuity calculator
 * Displays the main title and description
 */
export function HeroSection() {
  return (
    <LoanAnnuityHero>
      <h1 className="text-3xl font-bold">Equal Payment Loan Calculator</h1>
      <p className="text-muted-foreground mt-2">
        Calculate traditional annuity-style loans with fixed monthly payments.
        Early payments have more interest, later payments have more principal.
        Perfect for mortgages, personal loans, and auto loans.
      </p>
    </LoanAnnuityHero>
  );
}
