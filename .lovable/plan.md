## Recolor: "Trusted Blue" minimal palette

Swap current Sage & Forest tokens for a clean two-color foundation: Soft White background + Royal Blue primary. Layout, copy, IA, components — unchanged.

### Light mode tokens
| Token | HSL | Hex | Role |
|---|---|---|---|
| `--background` | `225 100% 98%` | `#F8FAFF` Soft White |
| `--foreground` | `225 35% 15%` | `#1A2238` Deep Navy ink (derived for contrast) |
| `--card` | `0 0% 100%` | `#FFFFFF` |
| `--popover` | `0 0% 100%` | — |
| `--primary` | `225 76% 55%` | `#3663E5` Royal Blue |
| `--primary-foreground` | `0 0% 100%` | — |
| `--secondary` | `225 100% 95%` | derived soft sky tint |
| `--secondary-foreground` | `225 35% 15%` | — |
| `--muted` | `225 100% 96%` | — |
| `--muted-foreground` | `225 12% 45%` | calm slate |
| `--accent` | `225 76% 55%` | Royal Blue (accent = primary) |
| `--accent-foreground` | `0 0% 100%` | — |
| `--destructive` | `0 72% 55%` | safe red |
| `--warning` | `45 100% 90%` | soft warm |
| `--border` / `--input` | `225 40% 90%` | — |
| `--ring` | `225 76% 55%` | — |

### Dark mode — "Midnight Blue"
Derived from same hue family, kept calm.
| Token | HSL | Hex |
|---|---|---|
| `--background` | `225 35% 9%` | `#0F1424` |
| `--foreground` | `225 30% 95%` | cool cream |
| `--card` | `225 30% 13%` | `#161E33` |
| `--popover` | `225 30% 13%` | — |
| `--primary` | `225 90% 68%` | `#5C82F0` brightened royal |
| `--primary-foreground` | `225 35% 9%` | — |
| `--secondary` | `225 25% 18%` | — |
| `--muted` | `225 20% 22%` | — |
| `--muted-foreground` | `225 18% 72%` | — |
| `--accent` | `225 90% 68%` | — |
| `--destructive` | `0 72% 60%` | — |
| `--border` / `--input` | `225 20% 24%` | — |
| `--ring` | `225 90% 68%` | — |

### Gradients & shadows
- `.gradient-accent`: `#F8FAFF → #DCE7FF` (calm headers, mood ring)
- `.gradient-cta`: `#3663E5 → #2849B8` (buttons, FAB, premium)
- Light `--shadow-soft`: `0 20px 50px rgba(24, 32, 51, 0.10)`
- Dark `--shadow-soft`: `0 20px 50px rgba(0, 0, 0, 0.55)`
- `--shadow-glow`: `0 20px 40px rgba(54, 99, 229, 0.30)`

### Files to edit

1. **`src/index.css`** — full HSL token rewrite for `:root` and `.dark`. Update `.gradient-accent`, `.gradient-cta`, `.glass` (light: `bg-white/80 border-white/60`; dark: `bg-white/[0.04] border-white/10`).

2. **`tailwind.config.ts`** — replace `petia` brand palette and keep back-compat aliases pointing into the new palette:
   ```
   petia: {
     soft:   "#F8FAFF",
     royal:  "#3663E5",
     navy:   "#1A2238",
     // back-compat aliases (mint, sage, gold, amber, ruddy, teal, lavender, raisin, cream…) repointed
   }
   ```

3. **`src/components/petia/account/AccountSheet.tsx`** — rename Dark label "Forest Night" → "Midnight Blue".

4. **Memory updates**:
   - `mem://style/aesthetic` — rewrite to Trusted Blue (Soft White bg, Royal Blue primary, Deep Navy ink, Midnight Blue dark).
   - `mem://index.md` — Core line updated.

### Out of scope

No layout, copy, navigation, IA, AI, mockClassifier, data, onboarding, or backend changes.
