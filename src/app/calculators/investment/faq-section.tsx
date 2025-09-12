/**
 * FAQ section for the investment calculator page
 * Provides answers to common questions about compound interest and calculator usage
 * Optimized for SEO with structured data markup potential
 */
export function FAQSection() {
  const faqs = [
    {
      question: "How accurate are these investment calculations?",
      answer:
        "Our calculator uses industry-standard compound interest formulas with monthly compounding. The calculations are mathematically accurate for the inputs provided. However, actual investment returns will vary based on market conditions, fees, and other factors not accounted for in the calculation.",
    },
    {
      question:
        "What's the difference between compound interest and simple interest?",
      answer:
        "Simple interest only calculates returns on your original investment amount. Compound interest calculates returns on both your original investment and all previously earned interest, creating exponential growth over time. This is why compound interest is so powerful for long-term investing.",
    },
    {
      question:
        "Should I use monthly or annual compounding for my calculations?",
      answer:
        "Our calculator uses monthly compounding, which is more accurate for most investment scenarios. Monthly compounding means interest is calculated and added to your investment every month, providing more frequent compounding compared to annual calculations and resulting in slightly higher returns.",
    },
    {
      question: "How do I account for inflation in my investment planning?",
      answer:
        "You can account for inflation by using real (inflation-adjusted) returns instead of nominal returns. For example, if you expect 8% annual returns and 3% inflation, use 5% as your interest rate. This gives you the purchasing power of your future investment value in today's dollars.",
    },
    {
      question:
        "What's a realistic interest rate to use for long-term investments?",
      answer:
        "Historical stock market returns average around 7-10% annually, but this varies by time period and asset allocation. For conservative planning, use 6-7%. For moderate risk, use 7-8%. Remember to consider your actual investment mix and any fees that will reduce your net returns.",
    },
    {
      question: "Can I use this calculator for different types of investments?",
      answer:
        "Yes! This calculator works for any investment that compounds monthly, including stocks, bonds, mutual funds, ETFs, and savings accounts. Just adjust the interest rate to match your expected returns for each investment type.",
    },
    {
      question: "How do I factor in employer 401(k) matching?",
      answer:
        "Include employer matching in your monthly contribution amount. For example, if you contribute $500 monthly and your employer matches 50% up to 6% of your salary, add the matching amount to your contribution. This gives you the total monthly investment amount.",
    },
    {
      question: "What if I want to increase my contributions over time?",
      answer:
        "For planning purposes, use your current contribution amount and then recalculate periodically as your income grows. You can also use the calculator to see how increasing contributions by a certain amount affects your final investment value.",
    },
    {
      question: "How do I export my calculation results?",
      answer:
        "After running a calculation, you'll see an export button that allows you to download your results as a CSV file. This includes the detailed month-by-month breakdown, which is useful for further analysis or record-keeping.",
    },
    {
      question: "Is this calculator suitable for retirement planning?",
      answer:
        "Absolutely! This calculator is excellent for retirement planning. You can calculate how much you need to save monthly to reach your retirement goal, or see how much your current savings will grow by retirement age. It's particularly useful for 401(k) and IRA planning.",
    },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question} className="border rounded-lg p-4">
            <h3 className="font-semibold text-primary mb-2">{faq.question}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
