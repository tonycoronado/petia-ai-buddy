# Petia Onboarding v2 — Fast, Premium, Mobile

Scope: Wire onboarding into the app, refactor existing steps into the approved flow, and add three new screens (Health context, Permissions primer, Ready) + a soft trial offer reusing the existing Paywall. No brand, color, type, spacing, or IA changes.

## Flow (9 steps + soft paywall)

1. **Welcome** — keep `StepWelcome`, tighten copy: "Daily care, Smart Capture, reminders, and health history." CTA: Get started.
2. **Pet basics** — merge `StepName` + `StepSpecies` into one screen `StepBasics`. Name input on top, Dog/Cat tile pair below. Single Continue.
3. **Age & weight** — merge `StepAge` + `StepWeight` into `StepAgeWeight`. Age pills (Puppy/Young/Adult/Senior) + weight slider. Skip link in header.
4. **Photo** — keep `StepPhoto`, copy emphasizes warmth ("Make Petia personal"). Skip link.
5. **Health context** (new) — `StepHealthContext`. Multi-select chips: Allergies, Medical conditions, Medication, Sensitive stomach, Skin issues, None (None deselects others). Optional one-line note. Skip link.
6. **AI consent** — keep `StepAIConsent`, trim copy. Two CTAs: Enable AI features (primary, gradient), Continue without AI (ghost). "View AI disclosure" opens a sonner toast naming Anthropic, Google, OpenAI + no-training note.
7. **Permissions primer** (new) — `StepPermissions`. Two glass rows with icons: Camera & Photos (Smart Capture), Notifications (reminders). Single Continue. No native prompts in prototype.
8. **Ready** (new) — `StepReady`. "Petia is ready for {name}." Pet photo (or initial bubble) + 4 glass rows: Track daily mood, Use Smart Capture, Set reminders, Keep health history. CTA: Open Petia.
9. **Soft trial offer** (new) — `OnboardingTrialOffer` component. Reuses Paywall styling. Three options: 7-day Premium trial (default highlighted), Monthly, Annual (Save 33% pill). Personalized benefit list referencing pet name. Restore purchases link. **Continue free** clearly visible as equal-weight text button (not hidden, not tiny).

After 9: trial → Today (premium flag mock); free → Today (free limits).

## UX rules applied
- Progress bar shows 1/9…9/9 (already in wizard); hidden on Trial Offer.
- Skip link top-right on steps 3, 4, 5.
- Auth removed from onboarding (existing `StepAuth` is mock-only; the prototype is zero-backend per project memory). Account/sign-in stays in Account sheet as today.
- One idea per screen; no forms longer than 2 fields.
- Animations reuse the wizard's slide transition.

## Wiring (Index.tsx)
- Add `useState` `hasOnboarded` (in-memory; defaults false on fresh load — prototype, no persistence required).
- After splash, if `!hasOnboarded`, render `<OnboardingWizard onComplete={(data) => { setOnboardData(data); setShowTrialOffer(true); }} />`.
- After wizard: render `<OnboardingTrialOffer onChoose={(plan) => { setHasOnboarded(true); /* mock premium if trial */ }} />`.
- Then normal Today screen renders. Active pet swaps to onboarded pet name/photo (extend `MOCK_PETS[0]` shallow-merge for prototype).

## Files

**New**
- `src/components/petia/onboarding/StepBasics.tsx`
- `src/components/petia/onboarding/StepAgeWeight.tsx`
- `src/components/petia/onboarding/StepHealthContext.tsx`
- `src/components/petia/onboarding/StepPermissions.tsx`
- `src/components/petia/onboarding/StepReady.tsx`
- `src/components/petia/onboarding/OnboardingTrialOffer.tsx`

**Edited**
- `src/components/petia/OnboardingWizard.tsx` — new step order, TOTAL=9, extend `PetData` with `health: string[]`, `healthNote: string`, drop Auth step from sequence (file kept for now, not imported).
- `src/components/petia/onboarding/StepWelcome.tsx` — tightened copy.
- `src/components/petia/onboarding/StepAIConsent.tsx` — add secondary "Continue without AI" + disclosure toast.
- `src/components/petia/onboarding/StepPhoto.tsx` — Skip link.
- `src/pages/Index.tsx` — mount wizard + trial offer before main app; merge onboarded pet into active pet.

**Untouched**
- All branding, tokens, BottomNav, Today/Health/Capture/Care/Account screens, Paywall (referenced for visual parity only).

## Visual conventions
- Glass cards (`glass rounded-3xl shadow-soft`), gradient CTA (`gradient-cta text-primary-foreground`), `Sparkles`/`Camera`/`Bell`/`Heart` lucide icons. No new colors. No new fonts.

## Out of scope
- Real auth, real permission prompts, persistence, analytics, A/B copy variants, additional pet creation inside trial offer.
