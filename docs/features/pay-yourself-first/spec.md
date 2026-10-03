# Pay Yourself First Calculator

Living spec for `/calculators/pay-yourself-first`. It describes what a saver can do, the rules behind each answer, and why those rules were chosen.

## Purpose

A saver invests a fixed amount every period while working. In retirement they withdraw spending that rises with prices, until the money runs out at their chosen life expectancy. The calculator answers questions like "if I spend $4,000 a month in today's money, prices rise 4% a year and I plan to live to 90, how much must I invest now, and when can I stop working?"

Worked examples further down use the test suite's reference plan (50,000,000 a month, age 30, 7% return, retire at 50, live to 90), so their figures match the tests.

## The form

- **Eight fields.** Current age, current savings, investment per period, expected annual return (%), retirement age, life expectancy, spending per period in retirement (in today's money), and inflation (%).
- **Fill all but one.** Current age and inflation are always required. Of the other six, leave exactly one empty: that is the value the calculator finds. This mirrors the Investment Calculator.
- **Button names the answer.** With exactly one of the six empty, the button reads "Calculate <field>" (e.g. "Calculate Monthly Investment"). Otherwise it reads "Calculate Plan".
- **Period selector.** Weekly, Monthly (default), Quarterly, Semi-Annually or Annually.
  - It sets how often the saver invests and spends, and how often returns compound (annual rate ÷ periods per year).
  - The schedule has one row per period.
  - Field labels follow it ("Annual Investment", "Semi-Annual Spending").
- **Amounts are per period.** A line under the selector always reads "Amounts are per <month/year/…>". Switching period keeps the typed digits (it does not convert them) and clears any result.
- **Dollar-sized examples.** Empty money fields suggest 1000 to invest and 4000 to spend per period; ages suggest 30, 50 and 90, return 7 and inflation 4.
- **Money view switch.** "Show amounts in today's money" sits under the fields, with the help text "Off: what your account will hold. On: what that money buys at today's prices." It starts off (future money).

## How the money works

- **Two phases, one return rate.** From current age to retirement age, the pot grows with the investments. From retirement age to life expectancy, spending comes out. The same annual return applies to both phases.
- **Spending is in today's money and rises once a year.** On each anniversary from today, prices step up by the full yearly inflation, and spending steps up with them. It stays flat within a year.
  - Example: 50,000,000 a month at 4% inflation is 50,000,000 × 1.04^20 ≈ 109,556,157.15 a month in the year the saver turns 50 (20 years from 30), and × 1.04^21 ≈ 113,938,403.44 the year after.
  - Ages are whole years, so retirement always starts on a price step.
- **The investment stays one fixed amount** every period (it does not rise with inflation; user choice).
- **Spending is taken at the start of each period**, before that period's interest.
- **The plan ends at zero.** A solved money value (investment, savings, spending, return) makes the balance land exactly on $0.00 at life expectancy.
- **Pot needed stays a closed formula:** spending × (1+inflation)^saving years × one year of draws × the retired years discounted by growth after inflation, where growth after inflation = (1+period rate)^periods per year ÷ (1+inflation) − 1. It is checked against the period-by-period schedule for every period setting, with returns above, equal to, below and at zero against inflation.
- **At 0% inflation every answer is the same as before inflation existed.** Existing plans keep their numbers.
- **Money is shown in "$"** with the app's shared currency format, consistent with the other calculators.

## Answers and outcomes

- **Investment, savings, spending.** Exact formula answers. A solved spending is in today's money.
- **Annual return.** Found by search between 0% and 50%, landing on the side where the plan is fully funded. Shown with two decimals (e.g. "8.90%"). It can be below the inflation rate.
- **Retirement age.** The earliest whole age that fully funds the plan, rounded up to be safe. The plan then usually ends with money left over, shown as "Money left at <life expectancy>". Retiring at the current age is allowed.
- **Life expectancy.** The last whole age the money lasts, rounded down to be safe, with the money left at that age shown.
- **Never runs out.** When solving life expectancy, if the pot's growth after inflation covers the rising spending, the answer is "Never runs out". The schedule stops at age 100 (or retirement + 1 if retiring at 100 or later) and shows the balance there.
  - If prices rise as fast as or faster than the pot grows, the money always runs out eventually, however big the pot.
  - Example: 1,000,000,000,000 saved at 7% with 10% inflation lasts until 180.
- **Lasts beyond 100.** When the money would run out only after age 100, the answer is "Lasts beyond 100", with the same capped schedule and balance.
- **Already enough.** When the saver needs nothing extra, the answer is 0 (or the current age) with a note:
  - investment: "You already have enough — no extra investing is needed"
  - savings: "Your <monthly/annual/…> investing alone is enough — you need no savings today"
  - return: "Your plan works even at a 0% return" (shown as 0.00%)
  - retirement age: "You can already stop working"
  - A plan that is funded exactly (only rounding dust left) shows 0 with no note.
- **Goals that cannot be reached** show a plain-words message instead of a number:
  - "This plan would need a return above 50% a year, which is not realistic. Try investing more, retiring later, or spending less."
  - "Your savings would run out within the first year of retirement. Try investing more, retiring later, or spending less."
  - "You would have to keep working until your life expectancy. Try investing more or spending less."
  - Already retired and solving investment: "You've already stopped working, so there's nothing to invest. Leave a different field empty instead."
- **Unexpected errors** (e.g. a computation that overflows) show "Something went wrong. Please check your inputs." The page never shows a raw number like "$∞" or "NaN".

## Results

- **The page scrolls to the result.** After a successful Calculate, the page smoothly scrolls so the results card (answer tiles first) is at the top of the screen. A failed Calculate does not scroll.
- **Summary tiles, above the schedule** so the answer shows without scrolling past the rows (the shared results table's `summaryFirst` option; the Investment page keeps its tiles below). In order:
  - the solved value ("<Field> (Calculated)")
  - the Note, when there is one
  - Pot at retirement
  - Total invested (includes current savings)
  - Total spent in retirement
  - Money left at <final age>
- **Schedule table.**
  - Columns: Period, Age, Phase (Saving / Retired), Money In/Out (negative while retired), Interest, Balance.
  - Age is the saver's age during that row, so the last row of a plan to 90 reads 89.
  - The table shows 12 rows until "Show All (N rows)" is clicked.
  - Its description ends "…, in future money" or "…, in today's money".
- **Future money (switch off).** The amounts the account will actually hold. Spending rows grow once a year.
- **Today's money (switch on).** The same solve, with each row divided by its year's price level ((1+inflation)^years from today).
  - Retired spending reads as the typed amount every row. For example, the 4% reference plan spends $24,000,000,000.00 in total (480 × 50,000,000), against $124,927,563,975.29 in future money.
  - Tiles and table both switch. The solved value stays as typed (it is the field's value).
  - "Pot at retirement" in today's money matches the table's last saving row, so it is in the prices of the last working year.
  - The Interest column becomes **"Interest after inflation"**: the row's interest at today's prices, less what that year's price step took from the balance (user choice). Every row adds up: last balance + money in/out + interest after inflation = balance.
  - Because prices step once a year, the first row of each year shows a large negative (the 4% reference plan shows -$465,652,630.82 at row 241, age 50), while the other rows of the year show normal growth.
  - At 0% inflation, today's money equals future money exactly.
  - Flipping the switch only redraws: the result stays on screen.
- **Never a stray "-$0.00" or negative leftover.** On a solved answer, a leftover that is only rounding noise (within max($1, 0.00001 × the money moved)) shows as exactly $0.00, and the last table row matches, in both views. Real leftovers (whole-year rounding, already-enough, never-runs-out) are always shown as they are.
- **Export, copy, bookmark.**
  - The shared results table provides CSV download and copy (all rows plus the summary) of the view on screen.
  - A money tile or cell can be saved as a saved value.
  - The calculated return and age tiles are text and have no bookmark button (user choice).

## Input rules

- **Numbers.** Plain digits, comma thousands separators ("50,000,000"), and a "." decimal point (".5" and "7." accepted).
  - Rejected with "Must be a number, like 50,000": "50.000.000", "50M", "1e5", "50,00", and a leading zero before a comma group ("0,500", "01,000").
  - A typed amount is never silently read as a smaller one.
- **Ranges.**
  - Amounts: "Must be 0 or more".
  - Spending: "Must be more than 0".
  - Return and inflation: at most 50% ("Must be 50% or less").
  - Money amounts: at most 1,000,000,000,000,000.
  - Ages: whole years ("Must be a whole number of years"), at most 120.
- **Age order.** Current age ≤ retirement age < life expectancy.
  - Messages: "Must be at least your current age" (retirement), and "Must be after your retirement age" / "Must be after your current age" (life expectancy).
  - If both pairs are broken (e.g. 60 / 50 / 40), both messages show, one per broken pair.
- **Required fields.**
  - An empty current age shows "Current age is required" under it, and an empty inflation shows "Inflation is required". Neither is ever the value to find.
  - Any other wrong number of empty fields shows the toast "Fill in your current age and leave exactly one other field empty — that is the value the calculator will find."
- **Order of checks.** Field rules first, then the empty-field count, then the calculation.
- **Fixing a field** clears that field's message. A message about another field stays until the next Calculate.

## Stale results

- **The page never shows an answer that doesn't match the form.** Any edit, any period change, and any failed Calculate clears the previous result (and its Share button). The money view switch is the exception: it changes how the result reads, not the plan.

## Sharing

- **Share** copies a link with the typed inputs (inflation included), the period and the money view (`moneyView=future|today`). The solved field stays empty, and nothing is calculated on open.
- **Opening a link:**
  - It pre-fills every readable number, even one the form would reject (the usual message appears on Calculate).
  - It drops unreadable text, takes the first value of a repeated key, and ignores unknown keys.
  - It falls back to Monthly for an unknown period and to future money for an unknown money view.
  - Links shared before inflation existed open with inflation empty and ask for it on Calculate.

## Where to find it

- **Sidebar** under "Investment Tools", and a **home page card** ("Open Calculator"). Listed in `CLAUDE.md` under Available Calculators.

## Known limitations (accepted)

- **Whole-year ages leave a surplus.** For example, investing 20,000,000/month from 30 (no inflation) retires at 48 and still has about $8.49B at 90, because rounding up adds working years that keep compounding.
- **Return and inflation use different conventions.**
  - The return compounds per period (7% a year is 7%/12 a month, about 7.23% over a year).
  - Inflation steps once a year by exactly the typed rate.
  - So a 7% return with 7% inflation still leaves a little growth after inflation (none on annual periods).
- **Extreme inflation gives extreme answers.** At 50% inflation, a solved investment can exceed the 1,000,000,000,000,000 typed-amount cap (e.g. about 6.3 × 10^15). The values stay finite and correct.
- **Extreme float precision.**
  - At returns above ~30% held for decades (pots around 10^27), a solved money value can still show a non-zero leftover. Float noise at that scale can't be removed without hiding real errors.
  - Life expectancy can come out one year short (the safe side) at very high returns over very long retirements.
- **Rare "Lasts beyond 100" label.** In about 1% of plans that sit exactly on the never-runs-out point (not reachable by typing), the label reads "Lasts beyond 100" instead of "Never runs out". The schedule is identical.
- **Retiring at 100** shows "Lasts beyond 101" (cap is retirement + 1).
- **No "Calculating…" state.** The calculation is synchronous.
- **`?constructor=` in the URL** crashes every calculator page in Next.js 15.5.9 dev mode (pre-existing framework quirk).

## Tests

- **Unit (Vitest, `npm test`).**
  - Pure solvers, schedule, plan, today's-money conversion, validation and the URL parser, in `src/lib/pay-yourself-first/` and the page's `pay-yourself-first.url.test.ts`.
  - Includes seeded round trips at every period, with inflation from 0% to 10–15%.
  - Inflation answers are checked against brute-force month-by-month simulations (e.g. 30,000,000/month at 4% lasts until 65).
- **End-to-end (Playwright, `npm run test:e2e`).**
  - Specs live in `e2e/pay-yourself-first/` (`inflation.spec.ts` and `money-view.spec.ts` cover this change).
  - Runs its own `next dev` on port 3123 with `NEXT_DIST_DIR=.next-e2e`, so it never collides with a dev server already open.
- **E2E locator rule.** After a full page load, use role/label locators rather than strict `#id`.
  - Next 15.5's React briefly keeps a hidden streamed copy of the page (`div#S:0`) next to the live one for ~50–150 ms.
  - It is not a UI defect (the Investment page does the same).
- **Lint.** `npm run lint` fails on errors in the older calculators that predate this feature. Check this feature with `npx biome check src/lib/pay-yourself-first src/app/calculators/pay-yourself-first e2e`.

## Code map

- **Math (no React):** `src/lib/pay-yourself-first/`
  - `solvers.ts`: investment, savings and spending, pot helpers, `priceLevel` and `growthAfterInflation`.
  - `solve-return.ts`
  - `solve-ages.ts`: the life expectancy solve counts whole years.
  - `schedule.ts`: spending steps once a year.
  - `todays-money.ts`: the today's-money view.
  - `plan.ts`: dispatch, outcomes and snap. It returns future figures plus `todaysMoney`.
  - `validation.ts`, `errors.ts`
- **Page:** `src/app/calculators/pay-yourself-first/`
  - Server `page.tsx` parses the URL via `pay-yourself-first.url.ts`.
  - Reducer state and domain hooks live in `pay-yourself-first.state.tsx`. The money view is a form value, and its action keeps the result.
  - One generic `FieldBlock` renders all eight fields.
  - `MoneyViewSwitchWithState` (shadcn `Switch` on `@radix-ui/react-switch`) is composed with its label in `form-section.tsx`.
- **Shared change:** `src/lib/url-state.ts` `CalculatorState.values` loosened to `object` (type-only; the Investment and loan pages are unchanged).
