## Recolor: "Amber & Gold" palette

Replace current Pearl & Ruddy tokens with the exact Amber & Gold values you provided. Glassmorphism, rounded shapes, layout, copy and IA all unchanged — only color tokens.

### Token mapping

**Light mode**
| Token | HSL | Hex |
|---|---|---|
| `--background` | `40 30% 97%` | `#FBF9F5` warm cream |
| `--foreground` | `30 30% 12%` | espresso ink |
| `--card` | `40 40% 99%` | warm white surface |
| `--popover` | same as card | — |
| `--primary` | `35 85% 52%` | `#E8A33F` golden amber |
| `--primary-foreground` | `40 40% 99%` | — |
| `--secondary` | `40 60% 94%` | `#F9F0DE` soft gold |
| `--muted` | `40 30% 93%` | — |
| `--accent` | `35 85% 52%` | `#E8A33F` |
| `--destructive` | `0 72% 51%` | `#E23636` |
| `--warning` | `30 100% 90%` | `#FFF4D9` |
| `--border` / `--input` | `40 25% 88%` | — |
| `--ring` | `35 85% 52%` | — |

**Dark mode — "Amber Night"**
| Token | HSL | Hex |
|---|---|---|
| `--background` | `220 18% 8%` | `#10131A` deep charcoal |
| `--foreground` | `40 30% 95%` | warm cream ink |
| `--card` | `220 16% 12%` | `#181C26` |
| `--popover` | same as card | — |
| `--primary` | `38 95% 58%` | `#F5B04F` bright gold |
| `--primary-foreground` | `220 18% 8%` | — |
| `--secondary` | `220 14% 18%` | `#212530` |
| `--muted` | `220 12% 22%` | `#2A2E3A` |
| `--accent` | `38 95% 58%` | bright gold |
| `--destructive` | `0 72% 55%` | — |
| `--warning` | `30 60% 22%` | — |
| `--border` / `--input` | `220 12% 24%` | `#2E323D` |
| `--ring` | `38 95% 58%` | — |

**Gradients & shadows**
- `.gradient-accent`: `#FBF9F5 → #F9F0DE` (calm header glows)
- `.gradient-cta`: `#E8A33F → #C97F1E` (buttons, capture FAB, premium)
- Light `--shadow-soft`: `0 20px 50px rgba(42,31,18,0.10)`
- Dark `--shadow-soft`: `0 20px 50px rgba(0,0,0,0.55)`
- `--shadow-glow` (both): `0 20px 40px rgba(232,163,63,0.35)`

### Files to edit

1. **`src/index.css`** — full HSL token rewrite for `:root` and `.dark` per tables above. Update `.gradient-accent`, `.gradient-cta`, and `.glass` (light: `bg-[#FFFDF7]/80 border-white/60`; dark: `bg-white/[0.04] border-white/10`).

2. **`tailwind.config.ts`** — replace `petia` brand palette:
   ```
   petia: {
     cream:    "#FBF9F5",
     gold:     "#F9F0DE",
     amber:    "#E8A33F",
     burnt:    "#C97F1E",
     espresso: "#10131A",
     // back-compat aliases (lavender, teal, navy) repointed to new palette
   }
   ```

3. **`src/components/petia/account/AccountSheet.tsx`** — rename Dark label "Raisin Night" → "Amber Night".

4. **Memory updates**:
   - `mem://style/aesthetic` — rewrite to Amber & Gold (light cream + amber, dark Amber Night charcoal, glass rules).
   - `mem://index.md` — Core line updated to reflect new palette.

### Out of scope

No layout, copy, navigation, IA, AI, mockClassifier, data, onboarding, or backend changes. Light/Dark/System toggle keeps working.
