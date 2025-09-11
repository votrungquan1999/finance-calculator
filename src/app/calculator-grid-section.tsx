import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { calculatorCards } from "./home-page.data";

/**
 * Calculator cards grid section displaying available financial calculators
 */
export function CalculatorGridSection() {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold mb-4">
          Choose Your Financial Calculator
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select the calculator that matches your needs. Each tool provides
          detailed calculations, amortization schedules, and professional-grade
          results you can trust.
        </p>
      </div>
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
    </div>
  );
}
