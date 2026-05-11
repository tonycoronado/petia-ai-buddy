## Recolor: "Pearl & Ruddy" palette

I'll replace the current Teal/Lavender system with the 5-color palette you uploaded, keeping the glassmorphism, rounded shapes and warm tone — only the color tokens change.

### Palette mapping

| Role | Color | Hex |
|---|---|---|
| Light background | Pearl | `#EAE0C7` |
| Light surface / card | Warm white | `#FBF7EE` |
| Light text | Raisin Black | `#2E211C` |
| Primary (CTAs, active) | Ruddy Brown | `#C06226` |
| Primary deep / pressed | Saddle Brown | `#984619` |
| Secondary surface / accent | Cambridge Blue | `#9CB8B7` |
| Dark background | Raisin Black | `#2E211C` |
| Dark surface | Slightly lifted Raisin | `#3A2A23` |
| Dark primary | Ruddy Brown (brightened) | `#D87A3F` |
| Dark accent | Cambridge Blue | `#9CB8B7` |

Gradients:
- `gradient-accent`: Pearl → Cambridge Blue (calm, header glows)
- `gradient-cta`: Ruddy Brown → Saddle Brown (buttons, capture FAB, premium)

### Files I will edit

1. **`src/index.css`** — full token rewrite for `:root` and `.dark`:
   - `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--warning`, `--border`, `--input`, `--ring` (all HSL).
   - `--gradient-accent` → Pearl → Cambridge Blue.
   - `.gradient-cta` utility → Ruddy → Saddle.
   - `--shadow-glow` → warm Ruddy glow `rgba(192,98,38,.25)`.
   - `.glass` light: `bg-[#FBF7EE]/80 border-white/60`. Dark: `bg-white/[0.04] border-white/10` (unchanged structure).

2. **`tailwind.config.ts`** — replace the `petia` brand colors:
   ```
   petia: {
     pearl:     "#EAE0C7",
     cambridge: "#9CB8B7",
     ruddy:     "#C06226",
     saddle:    "#984619",
     raisin:    "#2E211C",
   }
   ```

3. **Hardcoded outliers audit** (only files using literal teal / lavender / `#008080` / `#E6E6FA` / `#20B2AA`):
   - `src/components/petia/SplashScreen.tsx` — uses `gradient-accent` utility, no literals → no change.
   - Any component still referencing `petia-teal*` / `petia-lavender` classes will be migrated to the new tokens (`bg-petia-cambridge`, `text-petia-ruddy`, etc.).
   - Premium badges, paywall accent, active chips, mood ring, capture FAB → verified to use tokens / gradients (already covered).

4. **Update Appearance toggle copy** in `src/components/petia/account/AccountSheet.tsx`:
   - Rename "Dark (Midnight Teal)" → "Dark (Raisin Night)". No logic change.

5. **Memory update** — `mem://style/aesthetic` updated to reflect: "Pearl background, Ruddy Brown CTA, Cambridge Blue accent, Raisin Black ink. Dark mode = Raisin Night." Old "lavender-to-teal" rule removed from Core in `mem://index.md`.

### Out of scope

- No layout, copy, navigation, IA, AI, mockClassifier, data, onboarding flow or feature changes.
- No new screens or components.
- No backend.

### Result

Same app, fully repainted in Pearl + Ruddy + Cambridge + Raisin. Light mode reads warm-editorial; dark mode reads cocoa-night with bright Ruddy accents. The Light/Dark/System toggle in Account → Preferences keeps working.
