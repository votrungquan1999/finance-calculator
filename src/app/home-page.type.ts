export interface CalculatorCard {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
