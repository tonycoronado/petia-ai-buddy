
# Petia Mobile IA Refresh — Smart Capture + 5-Tab Structure

Keep all existing branding (off-white bg, lavender→teal gradients, glassmorphism, FloatingBubble, super-rounded shapes, soft shadows, current typography). Only IA, flow, and feature placement change. No backend, no new features outside the project memory.

## 1. New bottom navigation

Replace the current `[Home][Care][+][Chat][Account]` bar with:

```
[ Today ] [ Health ] [ ◉ Capture ] [ Care ] [ Account ]
```

- Capture is the primary center action (raised pill with `gradient-cta`, `shadow-glow`, ScanLine/Camera icon).
- Tapping Capture opens the unified Smart Capture flow (full-screen, not a sheet).
- Active-pet header (avatar + name + chevron) lives at the top of every tab; tap = pet switcher sheet, long-press = pet profile sheet. The current bubble row stays only on Today.
- The standalone `+` Quick-Log sheet (`CaptureSheet.tsx`) is removed — its non-photo actions (mood, weight, reminder, vet visit) are surfaced inside the relevant tab as inline "Add" CTAs, which removes a duplicate entry point.

## 2. Smart Capture flow (the key UX change)

One screen, one decision: take/upload a photo. Petia classifies it and routes.

States:
1. **Camera / library / sample** entry (reuse current scanner camera shell).
2. **"Understanding photo…"** — full-screen analyzing state with shimmer + rotating hints ("Checking if this is food, a symptom, or a document…"). Mocked 1.2s delay.
3. **Auto-route** to one of:
   - Food Scan result (existing `ResultScreen` content)
   - Health Triage result (existing `HealthDiaryScreen` result content)
   - Vet Document import review (existing `ImportVetRecordsScreen` review phase with `MOCK_OCR_RESULT`)
4. **Uncertain** → simple 3-tile chooser: Food / Health concern / Vet document. Each tile has a one-line example.
5. Every result screen shows a small "Not this? Change type ▾" chip in the header that re-routes to the other two result types with the same photo. Save / Discard / Correct type are always visible.

Mock classifier: deterministic mapping from a `mockSource` prop ("food" | "health" | "doc" | "uncertain") plus a "Try a sample" menu so the prototype can demo all branches without a real model.

## 3. Tab content

### Today (default)
Answers "what does my pet need today?" Keep cards minimal and ordered by urgency.
- Active pet header (avatar, name, quick switcher chevron, small mood emoji of last log).
- Today status line ("All good" / "1 thing needs attention").
- Quick mood log — 5 states only (Energetic, Happy, Normal, Quiet, Lethargic). Collapses to a logged confirmation after tap.
- Next reminder card (one item, with Snooze / Done).
- Health follow-up card (only if a diary entry has status `Monitoring`).
- Weekly insight preview (premium teaser if locked).
- Emergency Vet button (deep-link to maps).
- One "Suggested next action" chip (e.g. "Log weight — 18 days since last").
Removed from Today: latest scan card (now lives in Capture history), generic insight teaser duplication.

### Health
Answers "how has my pet been?" Serious history, timeline-first.
- Segmented control at top: `Diary · Weight · Vet visits · Records`.
- Default = Diary timeline (existing diary entries with status pills, follow-up grouping, side-by-side compare entry point).
- Weight tab = current `WeightTrackerScreen` content embedded.
- Vet visits = `VetVisitsScreen` embedded.
- Records = imported vet documents list (from OCR imports), opens detail.
- Persistent footer action: "Export health PDF" (premium gate).

### Capture
Tapping the center nav item opens the Smart Capture flow described in §2. The Capture tab itself, when revisited via swipe-back, shows a lightweight history grid (thumbnails of all captures with type badge: Food / Health / Doc) so users can find a previous scan without hunting through Health.

### Care
Answers "what do I need to organize?" Routine + planning + AI helpers.
- Reminders list (Upcoming / Overdue / Completed filter, inline add).
- Smart AI reminder suggestions card (premium): 3–5 draftable reminders, accept/reject.
- Expenses (premium): monthly total, category breakdown, recent list, add expense.
- Weekly insights archive (premium).
- AI Care Chat entry (premium) — opens existing `ChatScreen`.

### Account
Owner/admin only — no pet health.
- Profile row (name, email, avatar initials, member since).
- Subscription block (plan, trial status, manage, restore).
- Pets management (list of pets, add/edit/delete, set active) — advanced pet admin lives here; the active pet header on other tabs handles quick switching + quick edit.
- Settings: language (EN/ES), units (kg/lbs), notifications + quiet hours, AI consent toggle + disclosure.
- Referral program.
- Legal: Terms, Privacy, Support, App version.
- Sign out, Delete account (destructive).

## 4. Naming & ambiguity fixes

- Drop the word "Profile" from navigation entirely.
- Active-pet header = the pet profile entry point everywhere.
- "Account" = owner/admin.
- Pet Hub → split: routine tools moved into Care, history into Health, switcher into the header. The old Pet Hub screen is retired.

## 5. States, polish, accessibility

Each new/changed screen ships with: skeleton loading, empty state with friendly copy + primary CTA, error state with retry, success toasts, haptics on key actions, 44pt targets, semantic tokens only, EN copy, AI disclaimers preserved on all AI outputs.

## 6. Premium gates (contextual, not blocking)

- Capture → Health Triage: free has limited triage/month, gate at limit.
- Capture → Food Scan: free has limited scans/month, gate at limit.
- Care → Smart reminders, Expenses, Weekly insights, AI Chat: locked card with inline "Unlock" → paywall.
- Health → Export PDF: locked button → paywall.
- Account → Add 2nd pet: paywall.

---

## Technical section (for the implementer)

Files to add:
- `src/components/petia/capture/SmartCaptureScreen.tsx` — entry + analyzing + uncertain chooser + result wrapper with "Change type" chip.
- `src/components/petia/capture/CaptureHistoryScreen.tsx` — grid of past captures with type badges.
- `src/components/petia/today/TodayScreen.tsx` — replaces `HomeScreen.tsx`.
- `src/components/petia/health/HealthScreen.tsx` — segmented container that renders Diary / Weight / Vet / Records.
- `src/components/petia/care/CareScreen.tsx` — replaces the routine half of `PetHubScreen.tsx`.
- `src/components/petia/PetHeader.tsx` — shared active-pet header used by every tab.
- `src/lib/mockClassifier.ts` — deterministic mock that returns `"food" | "health" | "doc" | "uncertain"`.
- Extend `mockData.ts` with a unified `MOCK_CAPTURES` list (type + thumb + date + summary) feeding capture history.

Files to update:
- `src/components/petia/BottomNav.tsx` — 5 tabs with Capture as raised center item; remove `onCapture` sheet wiring.
- `src/pages/Index.tsx` — switch tabs to `today | health | capture | care | account`; remove `CaptureSheet`; route Capture tab to `SmartCaptureScreen`; keep `useScreenStack` for sub-screens (`mood`, `pdf`, `referral`, `terms`, `privacy`, `chat`, plus capture result detail).
- `src/components/petia/FoodScannerScreen.tsx`, `HealthDiaryScreen.tsx`, `ImportVetRecordsScreen.tsx` — refactor to export their **result body** as a sub-component so `SmartCaptureScreen` can render them after classification (current camera/upload pickers move into Smart Capture).
- `src/components/petia/account/AccountSheet.tsx` → promote to full `AccountScreen.tsx` (already half-done by previous tab promotion); add Pets management list.
- Retire `src/components/petia/pet/PetHubScreen.tsx` and `src/components/petia/CaptureSheet.tsx` after migration.

Navigation contract:
- 3-level back must keep working via `useScreenStack` (already verified). Smart Capture is a sub-screen pushed by the Capture nav item; result screens are pushed on top of it; "Change type" replaces the top of the stack rather than pushing.

No changes to: design tokens, `index.css`, `tailwind.config.ts`, Supabase, edge functions, mock auth, onboarding (already trimmed to 8 steps).

QA path before done:
1. Today → tap pet header → switcher works; long-press → profile sheet.
2. Capture → sample "food" → Food result → Change type → Health result (no extra back step).
3. Capture → sample "uncertain" → chooser → Vet doc → review → Save → returns to Capture history.
4. Health → segmented Diary/Weight/Vet/Records all render with mock data and back navigates to Health, then to Today.
5. Care → Reminders add inline; locked cards open paywall; AI Chat opens.
6. Account → Pets list add/edit; sign out confirms.
