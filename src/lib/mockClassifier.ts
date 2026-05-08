// Deterministic mock classifier for the Smart Capture flow.
// Cycles through outcomes so the prototype demos every branch.

export type CaptureKind = "food" | "health" | "doc" | "uncertain";

export const CAPTURE_LABEL: Record<Exclude<CaptureKind, "uncertain">, string> = {
  food: "Food",
  health: "Health concern",
  doc: "Vet document",
};

let cursor = 0;
const SEQUENCE: CaptureKind[] = ["food", "health", "doc", "uncertain"];

export function classifyCapture(forced?: CaptureKind): {
  kind: CaptureKind;
  confidence: number;
} {
  if (forced) return { kind: forced, confidence: forced === "uncertain" ? 0.42 : 0.93 };
  const k = SEQUENCE[cursor % SEQUENCE.length];
  cursor += 1;
  return { kind: k, confidence: k === "uncertain" ? 0.42 : 0.91 };
}

// Teaching-only demo samples. Exactly 3 — Food label, Health concern, Vet document.
export const SAMPLE_CAPTURES: { id: string; label: string; kind: Exclude<CaptureKind, "uncertain">; thumb: string }[] = [
  {
    id: "smp-food",
    label: "Food label",
    kind: "food",
    thumb: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "smp-health",
    label: "Health concern",
    kind: "health",
    thumb: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "smp-doc",
    label: "Vet document",
    kind: "doc",
    thumb: "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=200",
  },
];
