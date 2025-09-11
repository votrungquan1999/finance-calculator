import { HelpCircle } from "lucide-react";
import { Card } from "src/components/ui/card";
import { faqItems } from "./home-page.data";

/**
 * FAQ section displaying frequently asked questions and answers
 */
export function FaqSection() {
  return (
    <div className="border-t pt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Common questions about our financial calculators and how to use them
          effectively.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqItems.map((faq) => (
            <Card key={faq.question} className="p-6">
              <div className="flex gap-4">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20 flex-shrink-0">
                  <HelpCircle className="size-5 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
