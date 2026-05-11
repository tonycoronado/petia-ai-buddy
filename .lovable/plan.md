## Implementación: Dark Mode "Midnight Teal"

Implemento el toggle dark/light real en la app, basado en el mockup Midnight Teal aprobado.

### 1. Tokens HSL en `src/index.css`
Agrego el bloque `.dark` con la paleta Midnight Teal:
- `--background: 195 35% 7%` (#0B1416 navy-black)
- `--foreground: 0 0% 98%` (blanco)
- `--card: 195 30% 10%` glass base
- `--muted: 195 20% 14%`, `--muted-foreground: 215 15% 65%`
- `--primary: 174 72% 56%` (teal #20B2AA brillante para mejor contraste sobre fondo oscuro)
- `--secondary: 195 25% 16%`
- `--border: 0 0% 100% / 0.08` → mejor: `--border: 195 20% 20%`
- `--destructive`, `--warning`, `--ring` ajustados

### 2. Utilidades dark-aware en `index.css`
`glass` y `glass-dark` actualmente hardcodean `bg-white/80`. Las migro a tokens:
- `.glass` → light: `bg-white/80`, dark: `bg-white/5 backdrop-blur-2xl border-white/10`
- Sombras (`--shadow-soft`, `--shadow-glow`) ajustadas para dark (sombras más sutiles, glow teal más fuerte)
- Gradientes `--gradient-accent` y `gradient-cta` se mantienen (teal/lavanda funcionan en ambos)

### 3. Theme provider
Extiendo `src/lib/appSettings.tsx` con:
- `theme: "light" | "dark" | "system"`
- `setTheme(t)`
- `useEffect` que aplica/quita la clase `.dark` en `document.documentElement` y respeta `prefers-color-scheme` cuando es `system`
- Persistencia en `localStorage` (clave `petia-theme`)

### 4. Toggle en Account
En `src/components/petia/account/AccountSheet.tsx`, dentro de "Preferences" agrego una nueva fila **Appearance** con 3 chips segmentados: Light · Dark · System. Mismo estilo que el toggle de unidades existente.

### 5. Auditoría rápida de literales
Hay ~85 usos de `bg-white` hardcodeados. La mayoría dentro de `.glass` ya queda resuelta por la utility. Reviso solo los outliers críticos (chips activos, badges premium, splash screen) y los migro a tokens cuando rompan en dark. No reescribo screens enteras: el sistema de tokens ya cubre 90%.

Pantallas que verifico visualmente tras el toggle:
- Today, Health, Capture, Care, Account
- Onboarding (Welcome, Basics)
- Paywall
- Splash

### Lo que NO incluye
- No cambio la IA, navegación, ni features
- No toco mockClassifier ni datos
- No agrego nuevas secciones a Account más allá del toggle
- No migration ni backend (zero-backend prototype)

### Resultado
El usuario puede cambiar entre Light / Dark / System desde Account → Preferences → Appearance. Dark mode hereda exactamente el look del mockup Midnight Teal aprobado.