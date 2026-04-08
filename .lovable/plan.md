

# Plan: Adapt App Content to Product Plan Document

**Rule**: Keep ALL existing visual design (colors, fonts, gradients, glassmorphism, bubbles, button styles, backgrounds). Only change **text content, feature labels, pricing, species options, system prompts, and feature descriptions** to align with the product plan.

---

## Changes Summary

### 1. Onboarding: Dogs & Cats Only at Launch
**File**: `src/components/petia/onboarding/StepSpecies.tsx`
- Remove "Exotic / Small" and "Bird" cards
- Keep only Dog and Cat (the document says dogs and cats only at launch, representing ~85% of pet households)

### 2. Paywall: Correct Pricing & Features
**File**: `src/components/petia/PaywallScreen.tsx`
- Change yearly price from **$49.99** to **$47.99**
- Update features list to match document's free/premium table:
  - "Unlimited AI Food Scans"
  - "Unlimited Pet Profiles"
  - "Visual Health Diary + AI Triage"
  - "Smart AI Reminders"
  - "Priority Vet AI Chat"

### 3. Home Screen: Update Scan Button Text
**File**: `src/components/petia/HomeScreen.tsx`
- Change "Scan Pet" label to "AI Scanner"
- Change helper text from "Point camera at symptoms or food items" to "Scan food labels, health concerns, or symptoms"
- Change subtitle from "Your AI pet companion." to "Your Pet's Personal Care Companion"

### 4. Chat: Dynamic Pet Context + Disclaimer
**Files**: `supabase/functions/chat-vet/index.ts`, `src/components/petia/ChatScreen.tsx`
- Update the system prompt to remove hardcoded "Max" references; instead accept pet context from the frontend
- Add the mandatory disclaimer: "This is not a diagnosis. If you are concerned about your pet's health, please consult a veterinarian." appended to every AI response display
- Update the initial greeting message to use the active pet's name dynamically
- Pass pet data (name, species, breed, age, weight) from `Index.tsx` through to `ChatScreen`

### 5. Scan System Prompt: Add Disclaimer Language
**File**: `supabase/functions/analyze-pet/index.ts`
- Update system prompt to instruct the AI to include a brief disclaimer note in the description field
- Align the prompt with document's "orient, document, recommend vet" philosophy

### 6. Result Screen: Dynamic Pet Name
**File**: `src/components/petia/ResultScreen.tsx`
- Change hardcoded "Save to Max's Profile" to accept the active pet's name dynamically
- Pass `petName` prop from `Index.tsx`

### 7. Profile Screen: Subscription Label
**File**: `src/components/petia/ProfileScreen.tsx`
- No visual changes, just update subtitle text to "Free Plan — Upgrade to PRO"

### 8. Splash Screen: Updated Tagline
**File**: `src/components/petia/SplashScreen.tsx`
- Change "AI Pet Care" to "Your Pet's Personal Care Companion" (matches document tagline)

### 9. Pet Profile Sheet: Remove Hardcoded History
**File**: `src/components/petia/PetProfileSheet.tsx`
- Replace the hardcoded `HISTORY` array with a note that this will fetch from `scan_history` (or show empty state)
- Remove the hardcoded "800kcal" Daily stat; replace with a "Species" stat showing the pet's breed

### 10. Index.tsx: Pass Pet Context to Chat & Result
**File**: `src/pages/Index.tsx`
- Pass active pet data to `ChatScreen` and `ResultScreen` components so they can display the correct pet name instead of hardcoded "Max"
- Update `scan_history` insert to use the actual pet name (already partially done, but verify)

### 11. Onboarding Loading Step: Update Messages
**File**: `src/components/petia/onboarding/StepLoading.tsx`
- Keep animation as-is; update status messages to:
  - "Analyzing {petName}'s profile data..."
  - "Checking breed-specific care needs..."
  - "Almost ready! Finalizing personalized profile..."

---

## Technical Notes
- No database migrations needed — content-only changes
- No visual/CSS changes — only text strings, props, and system prompts
- Edge functions get minor prompt wording updates only
- Chat system prompt becomes dynamic: frontend sends pet context, backend constructs the system message

