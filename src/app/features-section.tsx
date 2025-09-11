import { Calculator, DollarSign, TrendingUp } from "lucide-react";

/**
 * Features section highlighting the main benefits and capabilities
 */
export function FeaturesSection() {
  return (
    <div className="border-t pt-12">
      <div className="text-center space-y-8">
        <div>
          <h2 className="text-3xl font-semibold mb-4">
            Why Choose Our Financial Calculators?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Professional-grade financial tools used by thousands of individuals,
            financial advisors, and businesses for accurate loan and investment
            calculations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto">
              <Calculator className="size-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold">Precise Calculations</h3>
            <p className="text-muted-foreground">
              Industry-standard financial formulas ensure accurate results for
              loan payments, interest calculations, and investment returns.
              Trusted by financial professionals.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20 w-fit mx-auto">
              <TrendingUp className="size-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Detailed Amortization</h3>
            <p className="text-muted-foreground">
              Complete month-by-month breakdowns show exactly how your payments
              are split between principal and interest, helping you understand
              your financial commitment.
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 w-fit mx-auto">
              <DollarSign className="size-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold">Export & Share</h3>
            <p className="text-muted-foreground">
              Export calculation results to CSV, copy to clipboard, or generate
              shareable links. Perfect for financial planning meetings and
              personal record-keeping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
