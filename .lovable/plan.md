
# Petia — UX Reorganization (visuals untouched)

Brand, colors, typography, glassmorphism, FloatingBubble, gradients, motion language all stay exactly as they are. This plan only moves things around so users reach what they need in fewer taps and never see the same feature in two places.

---

## Problems in the current flow

1. **Home and Pet Hub overlap.** Both show the active pet, pet switcher, reminders, and an insights entry. Two tabs, same job.
2. **Bottom nav has 5 tabs, two of which are single-feature** (Scanner, Diary). Scanner and Diary are *capture actions*, not destinations.
3. **Active pet vs. profile sheet is ambiguous.** Tap a FloatingBubble on Home → opens profile sheet. Tap the same bubble on Pet Hub → switches active pet. Same gesture, different result.
4. **Account is only reachable from Home avatar.** Settings, subscription, legal — all hidden behind one tab.
5. **Care tools are buried 2 levels deep** (Pet Hub → grid tile → screen), even the ones used most (Reminders, Weight).
6. **Onboarding is 11 steps** with permissions and AI consent asked before the user has seen value. Import Vet Records also blocks first-run.
7. **No global "log/add" affordance.** Logging mood, a scan, a diary photo, weight, or a reminder all live in different places.

---

## Target information architecture

### Bottom nav: 5 → **4 tabs**

```
[ Home ]   [ Care ]   [ + ]   [ Chat ]   [ Account ]
```

- **Home** — daily snapshot for active pet (mood today, due reminders, latest insight, last scan, quick switcher).
- **Care** — *replaces Pet Hub*. The pet's full record + all tools in one organised screen.
- **+ (center FAB)** — opens a capture sheet: **Scan food · Log mood · Add diary photo · Log weight · Add reminder · Log vet visit**. This kills the need for Scanner and Diary tabs.
- **Chat** — AI care assistant (unchanged).
- **Account** — was buried in the Home avatar; promoted to a tab so settings, subscription, referral, legal, sign-out are always one tap away.

The avatar in the Home header becomes a passive identity chip (no longer the only entry to Account).

### One pet-bubble gesture, one meaning

- **Tap a FloatingBubble anywhere → switches active pet** (toast: "Luna is now active").
- **Long-press a FloatingBubble → opens that pet's profile sheet** (edit fields, allergies, vet, photo).
- Removes the current Home-vs-Hub inconsistency.

---

## Screen-by-screen changes

### Home (simplified)
Keep the visual shell. Sections, in order:
1. Header: greeting + small pet switcher row (FloatingBubbles). Avatar chip on the right (no longer a button — Account is in the nav).
2. **Daily Mood Check** card (unchanged).
3. **Today** card: due reminders count + first 2 titles → tap goes to Reminders.
4. **Latest** card: last food scan result *or* last diary entry, whichever is newer (one card, not two tiles).
5. **Weekly Insight teaser** (unchanged).

Removes: the "Food Scanner" and "Weekly Insight" 2-up tile grid (Scanner moves to FAB, Insight teaser stays as a single card).

### Care (was Pet Hub)
Same layout language, reorganised content:
1. Big active pet bubble + name/breed/age/weight/allergy chips (unchanged).
2. **Quick stats strip** (new, from existing data): Weight delta · Mood 7-day · Reminders due · Last vet visit. Each chip taps to its detail screen.
3. **Tools grid** in priority order: Reminders, Weight, Vet Visits, Photo Journal *(Diary moved here from its own tab)*, Weekly Insights, Health PDF, Import Vet Records.
4. **Emergency Vet** button (unchanged).
5. Pencil icon in header → Edit pet (unchanged).

Removes the duplicate pet switcher row — switching now happens via header bubbles on Home or via long-press anywhere.

### Capture sheet (new, opened by center "+")
Bottom sheet, glass card style matching AccountSheet:
- Scan food → FoodScannerScreen
- Log mood → opens mood picker inline (same component as Home)
- Add photo journal entry → HealthDiaryScreen capture
- Log weight → opens existing weight add sheet
- Add reminder → opens existing reminder add sheet
- Log vet visit → opens existing vet add sheet

All actions are scoped to the **active pet** so context is implicit.

### Account (promoted from sheet to tab)
Same content as today's AccountSheet rendered as a full screen instead of a bottom sheet. Profile card, Subscription card, Notifications, Preferences, Refer/Export/Legal/Support/Version, Sign out, Delete. No content changes — just no longer hidden.

### Chat
Unchanged.

---

## Onboarding: 11 steps → **6 steps + deferred prompts**

Current order: Welcome · Name · Species · Age · Weight · Photo · Import Records · AI Consent · Permissions · Loading · Auth.

Proposed:

1. **Welcome** (brand + 3 value props)
2. **Pet basics** — name + species on one screen (chip + input)
3. **Age + weight** — one screen, two pickers
4. **Photo** (skippable)
5. **AI consent** — required before any AI runs; explicit Anthropic disclosure
6. **Auth** — email/Apple/Google (Loading folds into the auth submit transition)

Deferred (asked **in context** the first time they're needed, not up front):
- **Notification permission** — asked the first time the user creates a reminder or finishes mood log.
- **Camera/photo permission** — asked the first time the user taps Scan or Add diary photo.
- **Import Vet Records** — moved out of onboarding and surfaced as a dismissible banner on Care for the first 7 days, plus its tile in the tools grid. Stops blocking first-run for users who don't have records ready.

Result: time-to-first-value drops from ~11 screens to 6, and permission denials happen with full context.

### Multi-pet add
"Add another pet" lives in the pet switcher row ( "+" bubble at the end). No need for a separate flow — reuses the same condensed wizard (steps 2–4 only, since auth + AI consent already done).

---

## Affordance and consistency cleanups

- **Back behaviour:** keep `useScreenStack` per tab (already working). Switching tabs resets that tab's stack — already correct.
- **Sheets vs screens:** keep AccountSheet's bottom-sheet pattern for the new Capture sheet so users learn one gesture for "quick actions". Full screens stay for destinations (Care subscreens).
- **Toasts:** "X is now active" only fires on actual change, not on re-tap of current pet.
- **Empty states:** unchanged — current copy is on-tone.
- **Disclaimers:** AI/medical disclaimers stay verbatim where they are today.

---

## Files touched (frontend only)

- `src/components/petia/BottomNav.tsx` — 5 tabs → 4 + center FAB slot.
- `src/components/petia/HomeScreen.tsx` — remove Scanner/Insight tile grid, add Latest card, demote avatar to chip.
- `src/components/petia/pet/PetHubScreen.tsx` → rename concept to "Care", add quick-stats strip, add Photo Journal tile, drop duplicate pet switcher.
- `src/components/petia/HealthDiaryScreen.tsx` — no internal change; just no longer a tab.
- `src/components/petia/FoodScannerScreen.tsx` — no internal change; reachable from FAB.
- New: `src/components/petia/CaptureSheet.tsx` — 6-action bottom sheet.
- New: `src/pages/...` integration in `src/pages/Index.tsx` — tab list updated, Account becomes a tab route, FAB wires to CaptureSheet, pet-bubble long-press → profile sheet, tap → set active.
- `src/components/petia/account/AccountSheet.tsx` — split: keep the body, mount it as a full screen when opened from the Account tab, keep sheet variant available for legacy entry points (or remove).
- `src/components/petia/OnboardingWizard.tsx` — collapse to 6 steps (combine Name+Species, Age+Weight; merge Loading into Auth submit; remove StepPermissions and StepImportRecords from the wizard).
- Defer-permission helpers: small wrapper around existing toast paths in `RemindersScreen`, `FoodScannerScreen`, `HealthDiaryScreen` to request permission inline on first use.
- `src/lib/mockData.ts` — no schema change needed.

No backend changes. No design tokens, gradients, fonts, or component primitives modified.

---

## Out of scope for this pass

- New visuals, illustrations, icons beyond Lucide swaps already in use.
- Copy rewrites (only labels for new nav items: "Care", "Account").
- Backend, auth provider, AI provider, or data model changes.
- Localisation work beyond the new English labels.
