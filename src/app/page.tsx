import {
  Calculator,
  TrendingUp,
  DollarSign,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";

interface CalculatorCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

const calculatorCards: CalculatorCard[] = [
  {
    title: "Declining Balance Loan",
    description:
      "Calculate monthly payments with interest applied to remaining principal balance",
    href: "/calculators/loan-declining",
    icon: Calculator,
    features: [
      "Monthly interest on remaining balance",
      "Flexible payment or term input",
      "Detailed amortization schedule",
      "Export to CSV",
    ],
  },
  {
    title: "Loan with Initial Fee",
    description:
      "Factor in upfront fees and calculate equivalent interest rates",
    href: "/calculators/loan-fee",
    icon: DollarSign,
    features: [
      "Initial fee calculation",
      "Equivalent interest rate",
      "Month-by-month breakdown",
      "Compare with no-fee scenarios",
    ],
  },
  {
    title: "Equal Payment Loan",
    description: "Traditional annuity-style loans with fixed monthly payments",
    href: "/calculators/loan-annuity",
    icon: Calculator,
    features: [
      "Fixed monthly payments",
      "Calculate payment or term",
      "Complete amortization table",
      "Interest vs principal breakdown",
    ],
  },
  {
    title: "Investment Calculator",
    description:
      "Plan investments with initial amount and/or monthly contributions",
    href: "/calculators/investment",
    icon: TrendingUp,
    features: [
      "Optional initial investment amount",
      "Optional monthly contributions (can be $0)",
      "Compound interest calculation",
      "Growth visualization",
    ],
  },
];

/**
 * Landing page with overview of available financial calculators
 */
export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Professional Finance Calculators
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Solve complex loan and investment calculations with precision. Get
          detailed breakdowns, export results, and make informed financial
          decisions.
        </p>
      </div>

      {/* Calculator Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {calculatorCards.map((calculator) => (
          <Card
            key={calculator.href}
            className="group hover:shadow-lg transition-shadow flex flex-col"
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <calculator.icon className="size-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{calculator.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {calculator.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow space-y-4">
              <ul className="space-y-2 flex-grow">
                {calculator.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="size-4 text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all mt-auto"
              >
                <Link href={calculator.href}>
                  Open Calculator
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Section */}
      <div className="border-t pt-8">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">
            Why Choose Our Calculators?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 w-fit mx-auto">
                <Calculator className="size-6 text-blue-600" />
              </div>
              <h3 className="font-medium">Precise Calculations</h3>
              <p className="text-sm text-muted-foreground">
                Industry-standard formulas ensure accurate results for all your
                financial planning needs
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 w-fit mx-auto">
                <TrendingUp className="size-6 text-green-600" />
              </div>
              <h3 className="font-medium">Detailed Insights</h3>
              <p className="text-sm text-muted-foreground">
                Month-by-month breakdowns help you understand exactly how your
                money works
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 w-fit mx-auto">
                <DollarSign className="size-6 text-purple-600" />
              </div>
              <h3 className="font-medium">Export & Share</h3>
              <p className="text-sm text-muted-foreground">
                Export results to CSV or copy to clipboard for easy sharing and
                record keeping
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
