/**
 * How It Works section explaining the process in three steps
 */
export function HowItWorksSection() {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-4">
          How Our Financial Calculators Work
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get accurate financial calculations in three simple steps. No complex
          setup or registration required.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center space-y-4">
          <div className="size-12 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center mx-auto">
            1
          </div>
          <h3 className="text-xl font-semibold">Enter Your Numbers</h3>
          <p className="text-muted-foreground">
            Input loan amount, interest rate, and term. Our intuitive forms
            guide you through each field with helpful descriptions and examples.
          </p>
        </div>
        <div className="text-center space-y-4">
          <div className="size-12 rounded-full bg-green-600 text-white font-bold text-xl flex items-center justify-center mx-auto">
            2
          </div>
          <h3 className="text-xl font-semibold">Get Instant Results</h3>
          <p className="text-muted-foreground">
            View detailed calculations with complete amortization schedules,
            payment breakdowns, and summary information in easy-to-read tables.
          </p>
        </div>
        <div className="text-center space-y-4">
          <div className="size-12 rounded-full bg-purple-600 text-white font-bold text-xl flex items-center justify-center mx-auto">
            3
          </div>
          <h3 className="text-xl font-semibold">Export & Save</h3>
          <p className="text-muted-foreground">
            Download results as CSV files, copy to clipboard, or share via
            unique URLs. Perfect for financial planning and record-keeping.
          </p>
        </div>
      </div>
    </div>
  );
}
