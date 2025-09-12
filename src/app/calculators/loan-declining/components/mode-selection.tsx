import { TabsContent, TabsList, TabsTrigger } from "src/components/ui/tabs";
import { CalculationMode } from "../loan-declining.type";
import { TabsWrapper } from "../loan-declining.ui";

/**
 * Mode selection component (server component)
 * Composes static tab content and delegates interactivity to client component
 */
export function ModeSelection() {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Calculation Mode</h3>
      <TabsWrapper>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={CalculationMode.ByTerm}>
            Calculate Payment
          </TabsTrigger>
          <TabsTrigger value={CalculationMode.ByPayment}>
            Calculate Term
          </TabsTrigger>
        </TabsList>
        <TabsContent value={CalculationMode.ByTerm} className="mt-2">
          <p className="text-sm text-muted-foreground">
            Enter loan term to calculate required monthly payment
          </p>
        </TabsContent>
        <TabsContent value={CalculationMode.ByPayment} className="mt-2">
          <p className="text-sm text-muted-foreground">
            Enter monthly payment to calculate loan term
          </p>
        </TabsContent>
      </TabsWrapper>
    </div>
  );
}
