# Petia UX Polish — 9 Improvement Areas

Apply the senior-designer review across IA, onboarding, capture, pet model, premium, tone, accessibility, hierarchy, and scope. Keep brand, colors, typography, and tone unchanged.

## 1. Information Architecture
- Move **Capture** out of the tab list; render it as a raised circular FAB in the center notch of `BottomNav` (already partially the case — confirm 4 real tabs: Today, Health, Care, Account, with FAB in middle).
- **De-duplicate** Today vs Care: Today shows only time-sensitive items (today's mood, due reminders, follow-ups, emergency, trial banner). Move "Weekly Insights" and "Log Weight" entry points to Care only (keep Today free of library shortcuts).
- **Health → Pet Timeline**: unify Scans, Triage, Vet Docs, Weight, Mood into one chronological feed with type filter chips (All / Scan / Health / Vet / Weight / Mood). Existing detail screens remain reachable from rows.

## 2. Onboarding
- Slim down `StepWelcome`: one-line promise + single CTA (remove the 4 feature cards; surface those as empty-state nudges later).
- Make `StepHealthContext` a single optional textarea ("Anything Petia should know? — optional") with a clear Skip.
- Add a small "Just let me in" link on Welcome to skip wizard with safe defaults.
- **Defer trial offer**: do not show `OnboardingTrialOffer` immediately after wizard. Set a flag and trigger it after the first AI "wow" (first scan or triage result).

## 3. Smart Capture
- Add a **camera guidance overlay** (dashed frame + 1-line hint per mode: "Fit the label inside the frame").
- Show a **confidence indicator** when classifier is unsure ("Looks like food, but blurry — confirm?") instead of a flat 3-choice fallback.
- Add prominent **Retake** affordance after preview.
- Add **"See past scans for {pet}"** shortcut linking to Pet Timeline filtered by Scan.

## 4. Active Pet Header
- Enlarge `PetHeader`: bigger photo (56–64px), pet name as headline, micro line beneath ("Happy today · 2 reminders"). Becomes the emotional anchor on Today, Health, Care.

## 5. Premium / Monetization
- Standardize on a single Premium pattern: small `Premium` pill (no lock icons, no graying). Update all gates (RemindersScreen, WeeklyInsights, PDF export, ChatScreen, Expenses).
- **Contextual paywall copy**: when free user hits 3-reminder cap, paywall opens with "You're adding reminder #4 — unlock unlimited" (pass a `reason` prop into `PaywallScreen`).
- Add a small dismissable **Trial countdown banner** on Today ("4 days of Premium left").

## 6. Emotional Tone (copy pass)
- Rewrite empty states in pet-voice: e.g. "Bella hasn't told us how she's feeling today 🐾", "No scans yet — show Petia Bella's bowl."
- Soften AI disclaimers: "Petia's a helper, not a vet — always check with your clinic for big stuff."
- Add 1-line warm loading copy ("Petia's looking at this for {pet}…").

## 7. Accessibility
- Food-safety scoring: add icon + text label alongside color (Good ✓ / Okay ! / Avoid ✕).
- Audit touch targets to ≥44pt (BottomNav nav buttons, chip rows).
- Ensure dynamic type via `text-*` not fixed px on body copy.

## 8. Visual Hierarchy
- Introduce **two glass weights** in `index.css`: `.glass` (primary, full opacity) and `.glass-ghost` (secondary, lower opacity, no shadow) — apply ghost to non-actionable info rows.
- Apply consistent **4/8/16/24 spacing scale** by removing one-off `gap-3.5` / `p-5` arbitrary values across Today/Health/Care.

## 9. Scope cuts
- Hide **Referral** entry from Account behind a "More" section (defer surface area).
- Reframe **Expenses** as "Vet costs" tied to Vet Visits only (auto-row from each visit + receipt photo via Capture); remove standalone categories UI for v1.

## Technical Details

Files to add/edit:
- `src/components/petia/BottomNav.tsx` — confirm 4 tabs + center FAB; add Account tab.
- `src/components/petia/TodayScreen.tsx` — strip Insights/Weight rows; add trial banner; pet-voice empty states.
- `src/components/petia/CareScreen.tsx` — own Insights/Weight entry points.
- `src/components/petia/HealthScreen.tsx` — replace cards with unified `PetTimeline` component + filter chips.
- New: `src/components/petia/health/PetTimeline.tsx` (merges scans + triage + vet docs + weight + mood entries from mock data).
- `src/components/petia/PetHeader.tsx` — larger photo + status line prop.
- `src/components/petia/onboarding/StepWelcome.tsx` — slim version + skip link.
- `src/components/petia/onboarding/StepHealthContext.tsx` — single optional textarea.
- `src/pages/Index.tsx` — defer `OnboardingTrialOffer` until first AI result; pass trigger via context.
- `src/components/petia/SmartCaptureScreen.tsx` — guidance overlay + confidence prompt + retake + history shortcut.
- `src/components/petia/PaywallScreen.tsx` — accept `reason` prop; show contextual title.
- `src/components/petia/RemindersScreen.tsx`, `WeeklyInsightsScreen.tsx`, `PDFExportScreen.tsx`, `ChatScreen.tsx` — unified Premium pill pattern + reason passthrough.
- `src/index.css` — add `.glass-ghost` utility; (optional) trial-banner accent.
- `src/lib/mockData.ts` — add unified timeline mock if not derivable.
- `src/components/petia/EmptyState.tsx` and various screens — pet-voice copy pass.
- `src/components/petia/account/AccountSheet.tsx` — move Referral under "More".

No brand, color, or font changes. No new dependencies. All work frontend-only against mock data.
