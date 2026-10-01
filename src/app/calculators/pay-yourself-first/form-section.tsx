import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { CalculateButtonWithText } from "./components/calculate-button-with-text";
import { FieldBlock } from "./components/field-block";
import { PAY_FIELDS } from "./pay-yourself-first.type";
import { FormElement, FormGrid } from "./pay-yourself-first.ui";

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
          <CalculateButtonWithText />
        </FormElement>
      </CardContent>
    </Card>
  );
}
