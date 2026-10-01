"use client";

import { usePeriod } from "../pay-yourself-first.state";
import { PERIOD_DETAILS } from "../pay-yourself-first.type";

/**
 * The chosen period as a unit word such as "month", for use inside server-written copy
 */
export function PeriodUnitWithState() {
  return PERIOD_DETAILS[usePeriod()].unit;
}
