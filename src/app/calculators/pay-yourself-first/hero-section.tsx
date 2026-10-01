/**
 * Page heading and a one-paragraph explanation of how the calculator works
 */
export function HeroSection() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold tracking-tight">Pay Yourself First</h1>
      <p className="text-xl text-muted-foreground max-w-3xl">
        Invest a fixed amount every period while you work, then take out a fixed
        amount every period from retirement until your life expectancy. Fill in
        every field but one and the calculator finds the empty one.
      </p>
    </div>
  );
}
