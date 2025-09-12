/**
 * Hero section for the investment calculator page
 */
export function HeroSection() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Investment Calculator</h1>
      <p className="text-muted-foreground">
        Calculate any one of the 5 investment variables: initial investment,
        periodic contribution, time period, interest rate, or final value. Fill
        exactly 4 fields and leave 1 empty - the calculator will solve for the
        missing value and show detailed period-by-period results.
      </p>
    </div>
  );
}
