## Mockups dark mode — Petia

Genero **6 mockups PNG** (mobile, 9:16) sin tocar el código de la app. Solo exploración visual.

### Estilo A — Midnight Teal
Fondo `#0B1416` casi negro azulado. Glass oscuro translúcido (`white/5` con blur). Acento teal `#20B2AA` brillante. Lavanda apagada. Tipografía blanca pura para títulos, gris claro para body. Sensación: premium, sobrio, Apple-like.

### Estilo B — Deep Lavender Night
Fondo violeta profundo `#13101F`. Glass con tinte lavanda (`#E6E6FA` al 8%). Gradientes lavanda→teal vibrantes y luminosos. Mantiene el ADN Gen-Z actual pero en modo noche cálido.

### Pantallas (las 3 principales)
Cada estilo cubre:
1. **Today** — header con bubble del pet activo, mood selector (5 estados), hero "Needs attention", For-you rows, Emergency Vet button rojo, bottom nav flotante.
2. **Smart Capture** — viewfinder central con CTA gigante de cámara, chips de "Food / Health / Vet doc", sample thumbnails, AI consent badge.
3. **Care** — AI Smart Suggestions card, Weekly Insights row con badge Premium, AI Care Chat, Expenses (premium gate).

Todos respetan la IA aprobada, glass cards, super-rounded (`rounded-4xl/5xl`), shadows suaves, bottom nav pill flotante con CTA gradient en el centro, y tipografía Inter black.

### Entrega
6 archivos en `/mnt/documents/`:
- `petia-dark-midnight-today.png`
- `petia-dark-midnight-capture.png`
- `petia-dark-midnight-care.png`
- `petia-dark-lavender-today.png`
- `petia-dark-lavender-capture.png`
- `petia-dark-lavender-care.png`

Renderizados como `<lov-artifact>` para que los compares lado a lado y elijas el ganador (o pidas ajustes) antes de cualquier implementación.

### Detalles técnicos
- Generación con `imagegen` (modelo premium para legibilidad de UI text).
- Aspect ratio 9:16, 1024×1820 aprox.
- Sin cambios al codebase. Cero migrations. Cero tokens nuevos en `index.css`.
- Si después apruebas un estilo, en un segundo loop puedo implementar el toggle dark/light real con CSS variables HSL en `.dark`.