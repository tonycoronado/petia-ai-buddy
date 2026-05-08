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

export const SAMPLE_CAPTURES: { id: string; label: string; kind: CaptureKind; thumb: string }[] = [
  {
    id: "smp-food",
    label: "Food bag",
    kind: "food",
    thumb: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "smp-health",
    label: "Skin spot",
    kind: "health",
    thumb: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "smp-doc",
    label: "Vet record",
    kind: "doc",
    thumb: "https://images.unsplash.com/photo-1583912267550-d6c2ac3196c0?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "smp-uncertain",
    label: "Unclear",
    kind: "uncertain",
    thumb: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=200",
  },
];
