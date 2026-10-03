import { describe, expect, it } from "vitest";
import { convertSearchParamsToFormValues } from "./pay-yourself-first.url";

describe("opening a shared Pay Yourself First link", () => {
  it("fills known fields with the typed text, commas included", () => {
    // Given a link with a plain age and a comma-formatted amount
    const query = { currentAge: "30", spendingAmount: "50,000,000" };

    // When the link is read
    const values = convertSearchParamsToFormValues(query);

    // Then both fields are filled exactly as typed
    expect(values.currentAge).toBe("30");
    expect(values.spendingAmount).toBe("50,000,000");
  });

  it("ignores keys that are not calculator fields", () => {
    // Given a link carrying a stray key next to a real field
    const query = { foo: "1", currentAge: "30" };

    // When the link is read
    const values = convertSearchParamsToFormValues(query);

    // Then only the form's own fields are kept
    expect(values).toEqual({
      currentAge: "30",
      period: "monthly",
      moneyView: "future",
    });
  });

  it("leaves a field empty when its text is not a number", () => {
    // Given a link where one field is unreadable
    const query = { currentAge: "abc", retirementAge: "50" };

    // When the link is read
    const values = convertSearchParamsToFormValues(query);

    // Then the unreadable field is empty and the readable one stays
    expect(values.currentAge).toBeUndefined();
    expect(values.retirementAge).toBe("50");
  });

  it("keeps a number that breaks a field rule, so the saver sees the message on Calculate", () => {
    // Given a negative amount and a fractional age
    const query = { contributionAmount: "-5", lifeExpectancy: "47.5" };

    // When the link is read
    const values = convertSearchParamsToFormValues(query);

    // Then both stay in the form instead of emptying a different field
    expect(values.contributionAmount).toBe("-5");
    expect(values.lifeExpectancy).toBe("47.5");
  });

  it("uses the first value when a key is repeated", () => {
    // Given a link that repeats a key
    const query = { retirementAge: ["50", "60"] };

    // When the link is read
    const values = convertSearchParamsToFormValues(query);

    // Then the first one wins
    expect(values.retirementAge).toBe("50");
  });

  it("selects the period named in the link", () => {
    // Given a link for a yearly plan
    const query = { period: "annually" };

    // When the link is read
    const values = convertSearchParamsToFormValues(query);

    // Then the form plans by year
    expect(values.period).toBe("annually");
  });

  it("falls back to Monthly when the period is not one of ours", () => {
    // Given a link with a made-up period
    const query = { period: "bogus" };

    // When the link is read
    const values = convertSearchParamsToFormValues(query);

    // Then the form plans by month
    expect(values.period).toBe("monthly");
  });

  it("opens in today's money when the link says so", () => {
    // Given a link shared while viewing today's money
    const query = { moneyView: "today" };

    // When the link is read
    const values = convertSearchParamsToFormValues(query);

    // Then the results will show today's money
    expect(values.moneyView).toBe("today");
  });

  it("falls back to future money when the money view is not one of ours", () => {
    // Given a link with a made-up money view
    const query = { moneyView: "bogus" };

    // When the link is read
    const values = convertSearchParamsToFormValues(query);

    // Then the results will show future money
    expect(values.moneyView).toBe("future");
  });
});
