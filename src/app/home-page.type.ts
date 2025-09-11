interface CalculatorCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

interface FAQItem {
  question: string;
  answer: string;
}

export type { CalculatorCard, FAQItem };
