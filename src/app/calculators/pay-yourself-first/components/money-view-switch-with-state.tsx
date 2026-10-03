"use client";

import { Switch } from "src/components/ui/switch";
import { useInputHandlers } from "../hooks/pay-yourself-first.input";
import { useMoneyView } from "../pay-yourself-first.state";
import { MoneyView } from "../pay-yourself-first.type";

/**
 * Switch between future money (off) and today's money (on); its label is composed by the server
 */
export function MoneyViewSwitchWithState() {
  const moneyView = useMoneyView();
  const { handleMoneyViewChange } = useInputHandlers();

  return (
    <Switch
      id="moneyView"
      checked={moneyView === MoneyView.Today}
      onCheckedChange={(on) =>
        handleMoneyViewChange(on ? MoneyView.Today : MoneyView.Future)
      }
    />
  );
}
