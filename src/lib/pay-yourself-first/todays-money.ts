import {
  type MoneyFigures,
  Phase,
} from "../../app/calculators/pay-yourself-first/pay-yourself-first.type";
import { clearDust } from "./schedule";
import { priceLevel } from "./solvers";

export interface TodaysMoneyParams {
  currentSavings: number;
  inflation: number;
  periodsPerYear: number;
}

/**
 * Shows a plan in today's prices: each row is divided by its year's price level.
 * Interest becomes growth after inflation (the interest less what each year's price step takes), so every row still adds up.
 * @param future - The plan in future money, with its noise snap already applied
 * @param params - Current savings, inflation and periods per year
 * @returns The same figures in today's money
 */
export function toTodaysMoney(
  future: MoneyFigures,
  params: TodaysMoneyParams,
): MoneyFigures {
  // Savings are counted today, at today's prices
  let carriedIn = params.currentSavings;
  let carriedInPrices = 1;
  let previousBalance = params.currentSavings;
  let totalContributions = params.currentSavings;
  let totalInterest = 0;
  let totalSpent = 0;
  let potAtRetirement = params.currentSavings;

  const schedule = future.schedule.map((row, k) => {
    // Prices step up once a year, so every row in a year shares one price level
    const prices = priceLevel(
      params.inflation,
      Math.floor(k / params.periodsPerYear),
    );
    const money = row.contribution / prices;
    const balance = row.totalValue / prices;
    // What the year's price step took from the balance carried in; 0 within a year
    const priceStep = carriedIn / prices - carriedIn / carriedInPrices;
    const interest = row.interest / prices + priceStep;

    carriedIn = row.totalValue;
    carriedInPrices = prices;
    previousBalance = balance;
    totalInterest += interest;
    if (row.phase === Phase.Saving) {
      totalContributions += money;
      potAtRetirement = balance;
    } else {
      totalSpent -= money;
    }

    return {
      ...row,
      contribution: clearDust(money),
      interest: clearDust(interest),
      totalContributions: clearDust(totalContributions),
      totalInterest: clearDust(totalInterest),
      totalValue: clearDust(balance),
    };
  });

  return {
    schedule,
    potAtRetirement: clearDust(potAtRetirement),
    totalInvested: clearDust(totalContributions),
    totalSpent,
    // The last row already carries the snapped balance
    moneyLeft: clearDust(previousBalance),
  };
}
