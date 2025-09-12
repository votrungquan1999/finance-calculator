/**
 * Educational content section for the investment calculator page
 * Provides detailed explanations about compound interest and calculator usage
 * Optimized for SEO with targeted keywords and educational content
 */
export function EducationalContentSection() {
  return (
    <div className="space-y-8">
      {/* How Compound Interest Works Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">How Compound Interest Works</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            Compound interest is the interest calculated on the initial
            principal and the accumulated interest from previous periods. Unlike
            simple interest, which only calculates interest on the original
            amount, compound interest allows your money to grow exponentially
            over time.
          </p>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                The Power of Compounding
              </h3>
              <p className="text-sm text-muted-foreground">
                When you invest money, you earn returns not just on your initial
                investment, but also on the returns you've already earned. This
                creates a snowball effect where your wealth grows at an
                accelerating rate over time.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">
                Monthly vs Annual Compounding
              </h3>
              <p className="text-sm text-muted-foreground">
                Our calculator uses monthly compounding, which means interest is
                calculated and added to your investment every month. This
                provides more frequent compounding compared to annual
                calculations, resulting in higher returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Use This Calculator Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          When to Use This Investment Calculator
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-primary mb-2">
              Retirement Planning
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 401(k) contribution planning</li>
              <li>• IRA growth projections</li>
              <li>• Roth vs Traditional IRA comparison</li>
              <li>• Required minimum distribution planning</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-primary mb-2">
              Education Savings
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• 529 plan growth calculations</li>
              <li>• College fund projections</li>
              <li>• Monthly contribution planning</li>
              <li>• Education cost inflation adjustments</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Wealth Building</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Long-term investment strategies</li>
              <li>• Portfolio growth projections</li>
              <li>• Goal-based savings planning</li>
              <li>• Investment timeline optimization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Example Calculations Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Example Investment Scenarios</h2>
        <div className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">
              Scenario 1: Retirement Planning
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              A 30-year-old wants to retire at 65 with $1 million. They can
              invest $500 monthly at 7% annual return. How much will they have?
            </p>
            <div className="text-sm font-mono bg-background p-2 rounded border">
              <div>Initial Investment: $0</div>
              <div>Monthly Contribution: $500</div>
              <div>Investment Period: 35 years (420 months)</div>
              <div>Annual Interest Rate: 7%</div>
              <div className="text-primary font-semibold">
                Result: $1,147,000+
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-2">Scenario 2: College Savings</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Parents want to save $100,000 for their child's college in 18
              years. They expect a 6.5% annual return. How much should they
              invest monthly?
            </p>
            <div className="text-sm font-mono bg-background p-2 rounded border">
              <div>Initial Investment: $0</div>
              <div>Investment Period: 18 years (216 months)</div>
              <div>Annual Interest Rate: 6.5%</div>
              <div>Final Value: $100,000</div>
              <div className="text-primary font-semibold">
                Required Monthly Contribution: ~$200
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips for Accurate Results Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">
          Tips for Getting Accurate Results
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              Interest Rate Considerations
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • Use realistic long-term average returns (6-8% for stocks)
              </li>
              <li>• Consider inflation-adjusted returns</li>
              <li>• Account for different asset allocations</li>
              <li>• Factor in investment fees and expenses</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contribution Planning</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Include employer 401(k) matching</li>
              <li>• Plan for contribution increases over time</li>
              <li>• Consider tax-advantaged accounts</li>
              <li>• Account for life changes and income growth</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
