import type { PlanInputs } from "./solvers";

/** Periods per year for a monthly plan */
export const MONTHLY = 12;

/** Periods per year for a weekly plan */
export const WEEKLY = 52;

/** Periods per year for a yearly plan */
export const YEARLY = 1;

/** Age 30, no savings, 7% return, retire at 50, live to 90, spend 50,000,000 a month, no inflation */
export const STEP_1_INPUTS: PlanInputs = {
  currentAge: 30,
  currentSavings: 0,
  contributionAmount: 0,
  annualReturn: 7,
  retirementAge: 50,
  lifeExpectancy: 90,
  spendingAmount: 50_000_000,
  inflation: 0,
};

/**
 * Small seeded random generator so the round-trip cases are the same on every run.
 * @param seed - Starting state
 * @returns Function giving a number in [0, 1) on each call
 */
export function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Draws a realistic whole-age plan (return 1-12%, ages in order, no savings) for round-trip tests.
 * @param random - Seeded generator
 * @returns Plan values whose contribution is still 0 (to be solved)
 */
export function randomPlan(random: () => number): PlanInputs {
  const currentAge = 20 + Math.floor(random() * 30);
  const retirementAge = currentAge + 1 + Math.floor(random() * 30);
  return {
    ...STEP_1_INPUTS,
    currentAge,
    retirementAge,
    lifeExpectancy: retirementAge + 1 + Math.floor(random() * 40),
    annualReturn: 1 + random() * 11,
    spendingAmount: 1_000_000 + Math.floor(random() * 100_000_000),
  };
}
