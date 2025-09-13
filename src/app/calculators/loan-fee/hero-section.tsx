/**
 * Hero section component (Server Component)
 * Displays the main title and description for the loan fee calculator
 */
export function HeroSection() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Loan with Initial Fee Calculator</h1>
      <p className="text-muted-foreground mt-2">
        Calculate loan payments that include an upfront fee and see the
        equivalent interest rate for comparison with no-fee loans.
      </p>
    </div>
  );
}
