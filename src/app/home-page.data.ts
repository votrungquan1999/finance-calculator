import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import type { CalculatorCard, FAQItem } from "./home-page.type";

export const faqItems: FAQItem[] = [
  {
    question: "How accurate are these financial calculators?",
    answer:
      "Our calculators use industry-standard financial formulas and are regularly audited for accuracy. They provide precise calculations for loan payments, interest rates, and investment returns, helping you make informed financial decisions.",
  },
  {
    question: "Can I save and share my calculation results?",
    answer:
      "Yes! Every calculation can be exported to CSV format, copied to your clipboard, or shared via a unique URL link. You can also save specific values for future reference using our built-in save feature.",
  },
  {
    question: "What types of loans can I calculate?",
    answer:
      "Our platform supports declining balance loans (reducing balance), equal payment loans (annuity method), and loans with initial fees. Each calculator provides detailed amortization schedules and payment breakdowns.",
  },
  {
    question: "Are these calculators free to use?",
    answer:
      "Yes, all our financial calculators are completely free to use. There are no hidden fees, registration requirements, or usage limits. Access professional-grade financial calculation tools anytime.",
  },
  {
    question: "Can I calculate investment returns with monthly contributions?",
    answer:
      "Absolutely! Our investment calculator supports both lump-sum investments and regular monthly contributions. You can model complex investment scenarios with compound interest calculations over any time period.",
  },
];

export const calculatorCards: CalculatorCard[] = [
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
