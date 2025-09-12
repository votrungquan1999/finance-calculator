/**
 * Hero section for the investment calculator page with SEO-optimized content
 * Includes primary keywords and educational content for better search visibility
 */
export function HeroSection() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Investment Calculator with Compound Interest
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Calculate your investment growth with our professional compound
          interest calculator. Whether you're planning for retirement, saving
          for college, or building long-term wealth, our calculator provides
          accurate projections with detailed month-by-month breakdowns.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">
            Retirement Planning
          </h3>
          <p className="text-sm text-muted-foreground">
            Plan your 401(k), IRA, and other retirement accounts with accurate
            compound interest calculations.
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">College Savings</h3>
          <p className="text-sm text-muted-foreground">
            Calculate 529 plan growth and other education savings strategies
            with monthly contributions.
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <h3 className="font-semibold text-primary mb-2">Wealth Building</h3>
          <p className="text-sm text-muted-foreground">
            Project long-term investment growth and compare different
            contribution strategies.
          </p>
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <h2 className="font-semibold mb-2">How It Works</h2>
        <p className="text-sm text-muted-foreground">
          Fill in exactly 4 of the 5 investment variables (initial amount,
          contribution amount, time period, interest rate, or final value) and
          leave 1 empty. Our calculator will solve for the missing value and
          show detailed period-by-period results with CSV export capability.
        </p>
      </div>
    </div>
  );
}
