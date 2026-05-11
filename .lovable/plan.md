## Recolor: "Sage & Forest" palette

Swap current Amber & Gold tokens for the exact Sage/Forest values provided. Layout, copy, IA, components — all unchanged. Only color tokens.

### Light mode tokens
| Token | HSL | Hex |
|---|---|---|
| `--background` | `140 20% 97%` | `#F5F9F6` mint white |
| `--foreground` | `160 25% 10%` | deep forest ink |
| `--card` | `140 30% 99%` | warm white surface |
| `--popover` | same as card | — |
| `--primary` | `152 48% 38%` | `#329A6B` sage green |
| `--primary-foreground` | `140 30% 99%` | — |
| `--secondary` | `140 35% 92%` | `#E0F0E6` soft mint |
| `--muted` | `140 20% 93%` | — |
| `--accent` | `152 48% 38%` | `#329A6B` |
| `--destructive` | `0 72% 51%` | `#E23636` |
| `--warning` | `45 100% 90%` | `#FFF2D1` |
| `--border` / `--input` | `140 18% 87%` | — |
| `--ring` | `152 48% 38%` | — |

### Dark mode — "Forest Night"
| Token | HSL | Hex |
|---|---|---|
| `--background` | `160 20% 7%` | `#0E1614` deep forest |
| `--foreground` | `140 20% 95%` | mint cream ink |
| `--card` | `160 18% 11%` | `#131F1C` |
| `--popover` | same as card | — |
| `--primary` | `158 60% 52%` | `#3DD99A` bright mint |
| `--primary-foreground` | `160 20% 7%` | — |
| `--secondary` | `160 16% 16%` | `#1A2A26` |
| `--muted` | `160 14% 20%` | `#22332E` |
| `--accent` | `158 60% 52%` | bright mint |
| `--destructive` | `0 72% 55%` | — |
| `--warning` | `40 60% 22%` | — |
| `--border` / `--input` | `160 14% 22%` | `#263934` |
| `--ring` | `158 60% 52%` | — |

### Gradients & shadows
- `.gradient-accent`: `#F5F9F6 → #E0F0E6`
- `.gradient-cta`: `#329A6B → #1F6B49` (sage → deep forest)
- Light `--shadow-soft`: `0 20px 50px rgba(14, 38, 28, 0.10)`
- Dark `--shadow-soft`: `0 20px 50px rgba(0, 0, 0, 0.55)`
- `--shadow-glow` (both): `0 20px 40px rgba(61, 217, 154, 0.30)`

### Files to edit

1. **`src/index.css`** — full HSL token rewrite for `:root` and `.dark`. Update `.gradient-accent`, `.gradient-cta`, and `.glass` (light: `bg-[#FAFDFB]/80 border-white/60`; dark unchanged).

2. **`tailwind.config.ts`** — replace `petia` brand palette:
   ```
   petia: {
     mint:    "#F5F9F6",
     soft:    "#E0F0E6",
     sage:    "#329A6B",
     forest:  "#1F6B49",
     deep:    "#0E1614",
     // back-compat aliases repointed
   }
   ```

3. **`src/components/petia/account/AccountSheet.tsx`** — rename Dark label "Amber Night" → "Forest Night".

4. **Memory updates**:
   - `mem://style/aesthetic` — rewrite to Sage & Forest palette.
   - `mem://index.md` — Core line updated.

### Out of scope

No layout, copy, navigation, IA, AI, mockClassifier, data, onboarding, or backend changes.
