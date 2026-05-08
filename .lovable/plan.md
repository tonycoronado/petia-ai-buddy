Polish pass on the approved Petia mobile IA. No new features, no brand changes, no removed features.

## 1. Today subline (TodayScreen.tsx)
Replace count-style sublines with hero-priority phrasing:
- overdue → "Start with what's overdue."
- due → "Top priority for {pet} today."
- followup → "One health item to re-check."
- clear → "{pet} is all set." (unchanged)

## 2. Smart Capture — single primary CTA (SmartCaptureScreen.tsx, `pick` phase)
Make the big circle a viewfinder visual anchor, not a button:
- Convert the 40 px Camera circle to a non-interactive `<div>` (no tap handler, no "Take a photo" copy inside it). Keep the gradient ring + glass interior; show only the camera glyph + a faint dashed corner-frame to read as a viewfinder.
- Keep the single primary `Take photo` gradient button below as the only photo CTA.
- Keep the secondary `Upload from library` text link.

## 3. Sample thumbnails (mockClassifier.ts)
Swap the two misleading Unsplash URLs for clearer ones:
- Food label → kibble bag / pet food packaging shot.
- Health concern → close-up that visibly reads as a concern (e.g. paw/skin/ear close-up), not a happy portrait.
- Vet document → keep as-is.
Use stable Unsplash photo IDs only; no new assets.

## 4. Care helpers grouping (CareScreen.tsx)
- Section label becomes `Petia helpers · Premium` (single inline pill on the right of the label is fine).
- Remove the per-row `Lock` icon and the `locked` prop usage in the helper rows.
- Keep the single shared `Unlock Petia helpers` CTA at the bottom.
- Behavior unchanged: tapping a helper while non-premium still routes to `onUpgrade`.

## 5. AI disclosure copy (AccountSheet.tsx)
Replace `Powered by Anthropic — no training on your data` with neutral copy:
- Sub: `AI features enabled · View disclosure` when `aiEnabled`, otherwise `AI features off · View disclosure`.
- Tapping the row label area opens a short toast/info: "Petia uses Anthropic, Google and OpenAI for different AI features. Photos and data are never used to train models."
- Switch behavior unchanged.

## 6. Emergency Vet — calmer safety affordance (TodayScreen.tsx only)
- Keep it only on Today (already removed elsewhere).
- Restyle the footer card so it reads as safety, not alert: neutral glass surface, small `Siren` glyph in a soft `bg-muted` circle (not destructive red fill), label `Emergency vet`, sub `Find the nearest 24/7 clinic`, with a subtle right-aligned `ChevronRight`. Drop the `border-destructive/20` and the destructive icon background.

## 7. Capture nav active state (BottomNav.tsx)
- Remove `ring-4 ring-primary/30` (reads as a harsh outline).
- When `activeTab === "capture"`, indicate active state with the existing teal language only: a slightly stronger `shadow-glow` (already present) plus `scale-105` on the gradient button. No ring, no border.
- Keep focus-visible ring for keyboard a11y via Tailwind defaults (no custom outline).

## 8. Realistic analysis pause (SmartCaptureScreen.tsx)
- Bump `setTimeout` in `startAnalyze` from 1400 ms to 6000 ms.
- Slow the hint rotator: change interval from 500 ms to ~1500 ms so the 3 hints cycle smoothly across ~6 s without flicker.
- Keep the `Understanding photo…` heading, spinner, and thumbnail; no copy redesign.

## Out of scope
No changes to Health, ImportVetRecords, mock data shape, routing, or any business logic. No new screens or features.

## Files touched
- src/components/petia/TodayScreen.tsx
- src/components/petia/SmartCaptureScreen.tsx
- src/components/petia/CareScreen.tsx
- src/components/petia/BottomNav.tsx
- src/components/petia/account/AccountSheet.tsx
- src/lib/mockClassifier.ts
