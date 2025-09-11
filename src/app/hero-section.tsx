import { CheckCircle } from "lucide-react";

/**
 * Hero section with main heading and value propositions
 */
export function HeroSection() {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Free Financial Calculators & Loan Payment Tools
      </h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Calculate loan payments, investment returns, and mortgage schedules with
        precision. Professional-grade financial calculators with detailed
        amortization tables, export capabilities, and shareable results. Make
        informed financial decisions today.
      </p>
      <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <CheckCircle className="size-4 text-green-600" />
          100% Free to Use
        </span>
        <span className="flex items-center gap-2">
          <CheckCircle className="size-4 text-green-600" />
          No Registration Required
        </span>
        <span className="flex items-center gap-2">
          <CheckCircle className="size-4 text-green-600" />
          Export & Share Results
        </span>
      </div>
    </div>
  );
}
