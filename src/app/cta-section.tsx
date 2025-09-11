import { Calculator, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "src/components/ui/button";

/**
 * Call-to-action section encouraging users to start using the calculators
 */
export function CtaSection() {
  return (
    <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-2xl p-8 md:p-12">
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Start Your Financial Calculations Today
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join thousands of users who trust our professional financial
          calculators for accurate loan payments, investment planning, and
          financial decision-making.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/calculators/loan-declining">
              Calculate Loan Payments
              <Calculator className="size-5 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/calculators/investment">
              Plan Your Investment
              <TrendingUp className="size-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
