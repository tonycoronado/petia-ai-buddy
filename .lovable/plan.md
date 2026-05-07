## Petia Pivot — Soften triage, remove expenses + AI weight projection, add Vet Records OCR Import

Visual language untouched (colors, gradients, typography, glass, FloatingBubble, floating tab bar, copy tone). Only feature-set changes.

### 1. Severity rename + photo-journal reframe

**`src/components/petia/HealthDiaryScreen.tsx`**
- Replace `STATUS_STYLES` keys + entry `status` enum values:
  - `Monitoring` → `Observe` (success/green: `bg-emerald-100 text-emerald-700`)
  - `Improving` → `Minor Change` (amber: `bg-warning text-warning-foreground`)
  - new `Consider Vet` (orange: `bg-orange-100 text-orange-700`, hex #C05621)
  - `Resolved` removed; `Needs Attention` (red: `bg-destructive/15 text-destructive`)
- Update mock entries: replace clinical descriptions ("possible allergic reaction", "minor strain", "food sensitivity") with observational language ("redness behind left ear", "favoring right front leg", "soft stool after new treats — appearance changed").
- Header subtitle: "Photo journal of {petName}'s observations — share with your vet."
- Camera button label/aria: "Add observation".
- Replace existing disclaimer with: *"This is observational only — it is not medical advice. A licensed veterinarian is the only source of diagnosis or treatment."*
- Detail sheet primary CTA: "Add follow-up photo".
- Strip words: diagnose/treat/emergency/urgent/infection/disease throughout file.

**`src/components/petia/ResultScreen.tsx`** (food scanner result)
- Append the strengthened disclaimer line at the bottom of the card body in a small muted style.
- Rename `STATUS_CONFIG` labels: `Safe Analysis` stays, `Cautionary Analysis` → `Worth a Look`, `Urgent Analysis` → `Needs Attention`.

### 2. Removals

**Expense Tracker (gone)**
- Delete `src/components/petia/ExpenseTrackerScreen.tsx`.
- `src/pages/Index.tsx`: drop `ExpenseTrackerScreen` import, `"expenses"` from `SubScreenId`, the route case, and the `onOpenExpenses` prop on `PetHubScreen`.
- `src/components/petia/pet/PetHubScreen.tsx`: remove the Expenses tile + `onOpenExpenses` prop + `DollarSign` import; replace with the new "Import Vet Records" tile (FileText icon).
- `src/lib/mockData.ts`: drop `MOCK_YEARLY_EXPENSES`, `MOCK_YEARLY_TOP_CATEGORIES`, `MOCK_AI_EXPENSE_ESTIMATE`, the `spending` field on `WeeklyInsight`, and the `spending` strings on each insight.
- `src/components/petia/WeeklyInsightsScreen.tsx`: remove the Spending row + `DollarSign` import.
- `src/components/petia/PaywallScreen.tsx`: drop "Expense Tracker" bullet from `FEATURES`.

**AI Weight Projection (gone)**
- `src/components/petia/WeightTrackerScreen.tsx`: remove the entire AI projection block (both premium card + `PremiumGate` fallback), unused imports (`PremiumGate`, `useAppSettings.isPremium`, `onUpgrade`), and the `onUpgrade` prop. Keep current weight card, chart, history list, add sheet.
- `src/pages/Index.tsx`: drop `onUpgrade` from `<WeightTrackerScreen />`.

### 3. New feature — Import Vet Records (OCR)

**Mock data — add to `src/lib/mockData.ts`**
```ts
export interface OcrVetVisit { date; reason; clinic; vet }
export interface OcrVaccination { name; given; nextDue? }
export interface OcrMedication { name; dose; unit; frequency; start; end }
export interface OcrResult { visits; vaccinations; medications; warnings: string[] }
export const MOCK_OCR_RESULT: OcrResult = { /* 3 visits, 4 vaccs, 2 meds, 1 warning */ }
```

**New component `src/components/petia/ImportVetRecordsScreen.tsx`**
- Props: `{ petName: string; mode: "onboarding" | "profile"; onBack?: () => void; onSkip: () => void; onComplete: (counts: { visits: number; reminders: number }) => void }`.
- Local state machine: `"pick" | "analyzing" | "review" | "empty"`; `photos: { id, url }[]` (≤10); `result: OcrResult | null`.
- **Phase 1 (pick):** glass hero card, teal-gradient circle with `FileText`, headline "Have past vet records for {petName}?", subtitle as specified, microcopy. `Add photos` button → hidden `<input type="file" multiple accept="image/*">`; uses `URL.createObjectURL` for thumbs. Horizontal scroll thumbnails 80×80 with `Trash2` corner button. CTA `Analyze with AI` (gradient-cta, `Sparkles` icon), disabled state shows "Add photos to continue". `Skip for now` link below (calls `onSkip`).
- **Phase 2 (analyzing):** centered spinner (existing `Loader2` animate-spin), "Reading {N} documents…", "This usually takes 20-40 seconds." Uses `setTimeout(2200ms)` then transitions to review with `MOCK_OCR_RESULT` (or `empty` if user added 0 — guarded earlier).
- **Phase 3 (review):** Top glass card "Found {N} records". Three sections (only if non-empty) using existing `SectionLabel` style (`text-[10px] font-black uppercase tracking-widest`):
  - Vet Visits — `Calendar` icon, lavender circle (`bg-secondary`).
  - Vaccinations — `Syringe` icon.
  - Medications — `Pill` icon.
  - Each item: glass card, `Trash2` right button removes from local state.
  - Warnings card at bottom: amber glass with `AlertTriangle`, label "Notes", bulleted list.
- Primary CTA `Save {N} records` (gradient-cta, `Check` icon) → toast "Imported {visits} visits + {reminders} reminders" → `onComplete(counts)`. Tertiary "Start over" resets to pick.
- **Empty fallback:** glass card with `AlertTriangle`, "No records found", "We couldn't extract any usable records from those photos.", "Try different photos" button → back to pick.
- Top header: when `mode === "onboarding"` show no chevron + right-aligned "Skip for now" link; when `mode === "profile"` show `ChevronLeft` back button.

**Onboarding integration — `src/components/petia/OnboardingWizard.tsx`**
- Bump `TOTAL` from 10 → 11.
- New step `StepImportRecords` inserted between current step 7 (`StepPermissions`) and step 8 (`StepLoading`). Wait — per spec, *after pet creation, before AI consent*. So the new order is: Welcome(0), Name(1), Species(2), Age(3), Weight(4), Photo(5), **ImportRecords(6)**, AIConsent(7), Permissions(8), Loading(9), Auth(10).
- Update `showBack` exclusions accordingly (loading=9, auth=10). The ImportRecords step shows its own internal "Skip" rather than the wizard back chevron — keep wizard chevron showing as well (consistent with other content steps), but its primary path is `onSkip`/`onComplete` which both call `next()`. Render via wrapper passing `mode="onboarding"`, `petName={petData.name}`, `onSkip={next}`, `onComplete={() => next()}`.

**Pet Hub integration — `src/components/petia/pet/PetHubScreen.tsx`**
- Replace the deleted "Expenses" tile in `TOOL_TILES` with `{ id: "import", label: "Import Vet Records", icon: FileText, key: "onOpenImport" }` placed adjacent to "Vet Visits".
- Add `onOpenImport: () => void` prop + handler mapping.

**Index.tsx wiring**
- Add `"import"` to `SubScreenId` union.
- `<PetHubScreen … onOpenImport={() => push("import")} />`.
- Route case: `subScreen === "import" && <ImportVetRecordsScreen petName={activePet.name} mode="profile" onBack={pop} onSkip={pop} onComplete={({visits,reminders}) => { pop(); }} />`.

### 4. Light touches

- Onboarding progress bar already derives from `TOTAL`, so it auto-updates to 11 steps.
- Paywall `FEATURES` (after Expense Tracker removal): no add — the spec says optionally add "Vet Records OCR Import" *as a free feature note* — we'll add a small caption below the features list: *"Vet Records OCR Import is free for everyone."*
- `LegalScreen` body strings (Terms/Privacy in `Index.tsx`): no expense mentions currently — leave untouched.

### 5. Out of scope
No design tokens, no new colors beyond mapped severities, no animations changes, no FloatingBubble changes, no backend, no real OCR (mocked payload).

### Files touched

```text
edited   src/components/petia/HealthDiaryScreen.tsx
edited   src/components/petia/ResultScreen.tsx
edited   src/components/petia/WeightTrackerScreen.tsx
edited   src/components/petia/WeeklyInsightsScreen.tsx
edited   src/components/petia/PaywallScreen.tsx
edited   src/components/petia/pet/PetHubScreen.tsx
edited   src/components/petia/OnboardingWizard.tsx
edited   src/lib/mockData.ts
edited   src/pages/Index.tsx
created  src/components/petia/ImportVetRecordsScreen.tsx
created  src/components/petia/onboarding/StepImportRecords.tsx (thin wrapper)
deleted  src/components/petia/ExpenseTrackerScreen.tsx
```
