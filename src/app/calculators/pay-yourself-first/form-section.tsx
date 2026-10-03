import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Label } from "src/components/ui/label";
import { CalculateButtonWithText } from "./components/calculate-button-with-text";
import { FieldBlock } from "./components/field-block";
import { MoneyViewSwitchWithState } from "./components/money-view-switch-with-state";
import { PAY_FIELDS } from "./pay-yourself-first.type";
import {
  FieldDescription,
  FormElement,
  FormGrid,
  OptionBlock,
  SwitchRow,
} from "./pay-yourself-first.ui";

/**
 * Form section with server-composed fields
 */
export function FormSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Plan</CardTitle>
        <CardDescription>
          Fill every field but one. The calculator will solve for the empty one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormElement>
          <FormGrid>
            {PAY_FIELDS.map((field) => (
              <FieldBlock key={field.id} field={field} />
            ))}
          </FormGrid>
          <OptionBlock>
            <SwitchRow>
              <MoneyViewSwitchWithState />
              <Label htmlFor="moneyView">Show amounts in today's money</Label>
            </SwitchRow>
            <FieldDescription>
              Off: what your account will hold. On: what that money buys at
              today's prices.
            </FieldDescription>
          </OptionBlock>
          <CalculateButtonWithText />
        </FormElement>
      </CardContent>
    </Card>
  );
}
