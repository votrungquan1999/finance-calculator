"use client";

import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { useInputHandlers } from "../hooks/pay-yourself-first.input";
import { usePeriod } from "../pay-yourself-first.state";

/**
 * Period choice that sets how often the saver invests and spends
 * @param props.children - The period options, composed by the server
 */
export function PeriodSelectorWithState({ children }: { children: ReactNode }) {
  const period = usePeriod();
  const { handlePeriodChange } = useInputHandlers();

  return (
    <Select value={period} onValueChange={handlePeriodChange}>
      <SelectTrigger aria-label="Period" className="w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
