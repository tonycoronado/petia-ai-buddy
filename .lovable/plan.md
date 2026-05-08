## Petia Mobile UX Refinement — v2 (approved)

Branding, colors, typography, spacing, glass cards, gradients, icons, and tone stay untouched. Mobile-only. No new features, no removed major features.

---

### 1. Today — prioritized hierarchy

- **Hero zone** (top, large): active pet header + the single most important item. Priority order: overdue reminder → due-today reminder → open health follow-up → calm "all clear" hero.
- "All clear" hero copy: **"Nothing urgent today"** (no emoji — keeps premium tone).
- **Daily mood** card (medium weight, quick tap, single screen).
- **Needs attention** (compact rows, only renders when more attention items exist beyond the hero).
- **For you** (small low-contrast suggestion chips: weekly insight teaser, "log weight (18 days)", etc.).
- Subline tied to hero state, not a misleading counter.
- **Emergency Vet** pinned at the bottom of Today as a calm safety action. Lives only here.

### 2. Mood labels

Rename `Low` → `Lethargic`. Final 5: Energetic, Happy, Normal, Quiet, Lethargic. Audit other references.

### 3. Smart Capture — staged intelligent flow

States, in order:

```text
[ AI consent gate? ] -> [ Ready ] -> [ Preview ] -> [ Understanding photo... ]
   -> [ Classified: Food / Health / Vet document ] -> result
   (Uncertain -> 3-tile chooser)
```

- **AI consent gate (short, calm)**: if `appSettings.aiConsent` is false or AI disabled, Capture renders one warm card: short line on what Petia analyzes, primary "Enable AI", secondary "Not now", tertiary "View AI disclosure" link to Account → AI consent. No legal wall of text, no camera until enabled.
- Capture stays AI-first in this prototype: consent before camera is acceptable.
- **Ready**: viewfinder card, primary "Take photo" + secondary "Upload from library". Reassurance line: "Show Petia anything — food, a concern, a vet paper."
- **Preview**: photo fills frame, "Retake" / "Use this photo".
- **Analyzing**: shimmer + "Understanding photo..." with rotating hints (~1.4s mock).
- **Classified**: glass card with detected type pill, confidence dot, "Continue" CTA, and "Not this? Change type ▾" chip exposing other kinds.
- **Uncertain**: 3-tile chooser only (Food / Health concern / Vet document).
- **Premium gates after classification**, at the natural locked moment:
  - Food classified → if monthly food-scan limit reached → paywall.
  - Health classified → if diary/triage limit reached → paywall.
  - Vet doc classified → if OCR-import limit reached → paywall.
  - Capture itself is never blocked early.
- Smart Capture is the only primary photo entry point app-wide.

### 4. Health follow-up via Capture (preserved)

- From a diary entry detail and from the Today follow-up card, "Add follow-up" routes into Smart Capture **with context** (`followUpFor: entryId`).
- Capture pre-tags the resulting health entry as a follow-up of the original so side-by-side comparison still works.
- No camera opens directly inside Health.

### 5. Remove duplicate photo CTAs

- `HealthScreen.tsx`: remove the "Add an observation" gradient camera card. Replace with a small inline secondary link: "Add via Smart Capture →" that switches to the Capture tab.
- Audit `FoodScannerScreen`, `HealthDiaryScreen`, `ImportVetRecordsScreen`: no standalone camera entry — they're only reachable as Capture results or as read-only history rows.

### 6. Health — history & context only

- Title sublabel: "{Pet}'s health history".
- Compact "Recent activity" preview (last 2–3 diary/vet entries with thumbnails + status pill: Monitoring / Improving / Resolved).
- Stat strip retained (Weight / Last vet / Records).
- Sections: Photo journal, Weight, Vet visits, **Medical records** (see §7).
- Footer: Export health PDF (premium gate).
- Single secondary "Add via Smart Capture →" link.
- No Emergency Vet here.

### 7. Medical Records — records library

- "Medical records" routes to a records **library** view (built on the existing `ImportVetRecordsScreen` saved-records list): list of saved records (vaccines, prescriptions, labs, invoices, certificates) with thumbnail, type badge, date, search/filter, detail/edit/delete.
- "Import from photo" / OCR is a **secondary action inside the library** (top-right or empty-state CTA) that routes through Smart Capture → Vet document branch.
- Capture's vet-doc result still funnels saved records into this library.

### 8. Care — useful for free, helpers as premium

Two clearly separated groups:

- **Routines (free, top)** — primary visual weight, with a useful free primary action at the very top so the tab never feels passive or premium-only:
  - Hero "Add reminder" / "Review today's care" CTA.
  - Reminders card (overdue/due counts).
  - Routine tasks summary (birthdays, recurring grooming).
- **Petia helpers (premium)** — secondary, smaller cards, soft lock badge (no full blur):
  - AI smart suggestions, AI care chat, Weekly insights, Expenses.
  - One shared "Unlock helpers" CTA at the bottom of the helpers group.
- Emergency Vet removed from Care.

### 9. Smart Capture samples (teaching aid only)

In `mockClassifier.ts` and Capture UI:
- Keep exactly 3 samples: Food label, Health concern, Vet document. Drop "Unclear".
- Render samples as a small, secondary "Try a sample" row at the bottom of the Ready state — never primary.
- Fix vet-doc thumbnail to a reliable source (or local SVG matching brand) so it always renders.
- Tapping a sample seeds the classifier with the matching `kind` and jumps Capture into Analyzing → Classified, bypassing the camera.

### 10. Emergency Vet placement

Only on Today (footer safety action). Confirm absent from Health, Care, Capture, Account.

### 11. Visual hierarchy rules

Three weights used consistently across Today, Health, Care:
- **Hero card**: full-width, gradient/shadow-glow, primary CTA inline.
- **Standard row**: glass card, icon tile, title + hint, chevron.
- **Suggestion chip**: compact, lower contrast, no chevron.

### 12. Mobile-only

No desktop/tablet layout work. Set preview viewport to mobile.

---

### Files touched

- `src/components/petia/TodayScreen.tsx` — hierarchy zones, mood label fix, calm hero copy, Emergency Vet footer.
- `src/components/petia/SmartCaptureScreen.tsx` — staged flow + short calm AI-consent gate + post-classification premium gates + follow-up context handling + secondary samples row.
- `src/lib/mockClassifier.ts` — 3 samples only, fixed vet-doc thumb, sample-seeding helper.
- `src/components/petia/HealthScreen.tsx` — remove camera CTA, add Recent activity, route Medical records to library, "Add via Smart Capture" secondary link, follow-up CTA wired with context.
- `src/components/petia/ImportVetRecordsScreen.tsx` — reframe as Medical records library; OCR/import as a secondary action inside it.
- `src/components/petia/CareScreen.tsx` — Routines group with free primary action on top, Helpers group with single unlock CTA, remove Emergency Vet.
- `src/pages/Index.tsx` — wire follow-up context param into Capture, route Medical records to the library view.
- Light read of `src/lib/appSettings.tsx` to use existing `aiConsent`/premium flags (no schema change).

No brand changes, no business logic changes beyond presentation and gating placement.
