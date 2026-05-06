## Close the two remaining v1 gaps + 3-level back-nav QA

Strict visual preservation: no token, color, font, radius, shadow, or animation changes.

### 1. ExpenseTracker — Monthly/Yearly tabs + AI estimate detail

**File:** `src/components/petia/ExpenseTrackerScreen.tsx`
- Pill segment toggle under header: **Monthly** | **Yearly** (reuse the segment pill style already used in RemindersScreen).
- **Monthly view** = current screen unchanged.
- **Yearly view** (new):
  - Yearly total card (same glass card pattern).
  - 12-bar Jan–Dec bar list using Tailwind heights + existing `gradient-cta` fill (no new lib).
  - Top categories of the year (reuse existing breakdown row).
- Make the existing "AI estimate next month" line tappable → opens a bottom sheet (same sheet pattern in this file) titled **"AI Estimate Detail"** with predicted total, confidence label, and bullet breakdown (3-month avg, recurring, seasonal, vet).
- Mock data lives in `src/lib/mockData.ts`: `MOCK_YEARLY_EXPENSES`, `MOCK_YEARLY_TOP_CATEGORIES`, `MOCK_AI_EXPENSE_ESTIMATE`.

### 2. useScreenStack hook + Index.tsx refactor

**New file:** `src/lib/useScreenStack.ts`
- Generic `useScreenStack<T extends string>()` returning `{ current, push, pop, reset, depth }`.
- Internal `T[]` stack; `current = stack.at(-1) ?? null`.

**Refactor:** `src/pages/Index.tsx`
- Replace `subScreen` useState with the hook.
- `setSubScreen("x")` → `push("x")`; `setSubScreen(null)` → `pop()`.
- Tab change resets stack: `reset()` then `setTab(t)`.
- Zero visual change.

### 3. QA: 3-level back navigation

After implementation, manually verify in the preview:
1. Open **Pet Hub** tab.
2. Tap **Reminders** tile → RemindersScreen pushes onto stack (depth = 1).
3. Tap **+** to open Add Reminder sheet → sheet is local component state inside RemindersScreen, not on the screen stack (depth still 1).
4. Close the sheet (X or backdrop) → still on RemindersScreen.
5. Tap RemindersScreen back chevron → `pop()` → back on Pet Hub (depth = 0).

If any step skips a level or the back chevron jumps two screens, fix the handler wiring before reporting done.

### Out of scope
- No design tokens, no FloatingBubble changes, no backend.
