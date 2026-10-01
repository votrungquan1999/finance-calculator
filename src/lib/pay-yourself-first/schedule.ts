import {
  Phase,
  type ScheduleRow,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { periodsBetween, ratePerPeriod } from "./solvers";

export interface ScheduleParams {
  currentAge: number;
  retirementAge: number;
  endAge: number;
  currentSavings: number;
  investment: number;
  spending: number;
  annualReturn: number;
  periodsPerYear: number;
}

export interface Schedule {
  rows: ScheduleRow[];
  potAtRetirement: number;
  totalInvested: number;
  totalSpent: number;
  finalBalance: number;
}

/**
 * Snaps float dust (under half a cent) to a true 0 so no "-$0.00" is ever shown.
 * @param value - Amount to clean
 * @returns 0 for dust (including -0), otherwise the value unchanged
 */
function clearDust(value: number): number {
  return Math.abs(value) < 0.005 ? 0 : value;
}

/**
 * Builds the period-by-period schedule: saving rows up to retirement, then retired rows up to the end age.
 * @param params - Plan values with the investment already solved
 * @returns Rows plus the totals shown in the summary
 */
export function buildSchedule(params: ScheduleParams): Schedule {
  const ppy = params.periodsPerYear;
  const i = ratePerPeriod(params.annualReturn, ppy);
  const savingPeriods = periodsBetween(
    params.currentAge,
    params.retirementAge,
    ppy,
  );
  const totalPeriods = periodsBetween(params.currentAge, params.endAge, ppy);

  const rows: ScheduleRow[] = [];
  let balance = params.currentSavings;
  let totalContributions = params.currentSavings;
  let totalInterest = 0;
  let totalSpent = 0;
  let potAtRetirement = params.currentSavings;

  for (let k = 0; k < totalPeriods; k++) {
    const saving = k < savingPeriods;
    // Money in while saving, money out while retired
    const money = saving ? params.investment : -params.spending;
    // Deposits land at period end (no interest on them yet); withdrawals come out first
    const interest = saving ? balance * i : (balance + money) * i;

    balance += money + interest;
    totalInterest += interest;
    if (saving) {
      totalContributions += money;
      potAtRetirement = balance;
    } else {
      totalSpent -= money;
    }

    rows.push({
      month: k + 1,
      contribution: clearDust(money),
      interest: clearDust(interest),
      totalContributions: clearDust(totalContributions),
      totalInterest: clearDust(totalInterest),
      totalValue: clearDust(balance),
      age: Math.floor(params.currentAge + k / ppy),
      phase: saving ? Phase.Saving : Phase.Retired,
    });
  }

  return {
    rows,
    potAtRetirement: clearDust(potAtRetirement),
    totalInvested: clearDust(totalContributions),
    totalSpent,
    finalBalance: clearDust(balance),
  };
}
