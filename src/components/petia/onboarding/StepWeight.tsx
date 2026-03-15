import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PetData } from "../OnboardingWizard";

const KG_TO_LBS = 2.20462;

const WEIGHT_THRESHOLDS_KG: Record<string, { medium: number; large: number }> = {
  dog: { medium: 10, large: 25 },
  cat: { medium: 4, large: 7 },
  small_pet: { medium: 1.5, large: 4 },
  bird: { medium: 0.5, large: 1.5 },
};

const MAX_WEIGHT_KG: Record<string, number> = {
  dog: 55,
  cat: 14,
  small_pet: 7,
  bird: 4,
};

function classifyWeight(species: string, kg: number): string {
  const t = WEIGHT_THRESHOLDS_KG[species] || WEIGHT_THRESHOLDS_KG.dog;
  if (kg < t.medium) return "small";
  if (kg < t.large) return "medium";
  return "large";
}

const BADGE_COLORS: Record<string, string> = {
  small: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  large: "bg-rose-100 text-rose-700",
};

interface Props {
  petData: PetData;
  update: (patch: Partial<PetData>) => void;
  next: () => void;
}

const TICK_SPACING = 12; // px per tick

const StepWeight = ({ petData, update, next }: Props) => {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const maxKg = MAX_WEIGHT_KG[petData.species] || 55;
  const maxDisplay = unit === "kg" ? maxKg : Math.round(maxKg * KG_TO_LBS);

  // Store weight internally in kg
  const [kg, setKg] = useState(petData.weightValue || Math.round(maxKg / 3));
  const displayValue = unit === "kg" ? kg : Math.round(kg * KG_TO_LBS);
  const classification = classifyWeight(petData.species, kg);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);

  // Total ticks: one per unit step
  const totalTicks = maxDisplay;
  const totalHeight = totalTicks * TICK_SPACING;

  // Scroll to correct position on mount / unit change
  useEffect(() => {
    if (!scrollRef.current) return;
    const containerH = scrollRef.current.clientHeight;
    const tickIndex = unit === "kg" ? kg : Math.round(kg * KG_TO_LBS);
    const scrollPos = tickIndex * TICK_SPACING - containerH / 2;
    scrollRef.current.scrollTop = Math.max(0, scrollPos);
  }, [unit]);

  // Initial mount scroll
  useEffect(() => {
    if (!scrollRef.current) return;
    const containerH = scrollRef.current.clientHeight;
    const tickIndex = unit === "kg" ? kg : Math.round(kg * KG_TO_LBS);
    const scrollPos = tickIndex * TICK_SPACING - containerH / 2;
    scrollRef.current.scrollTop = Math.max(0, scrollPos);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const containerH = scrollRef.current.clientHeight;
    const scrollTop = scrollRef.current.scrollTop;
    const centerTick = Math.round((scrollTop + containerH / 2) / TICK_SPACING);
    const clamped = Math.max(1, Math.min(centerTick, totalTicks));

    const newKg = unit === "kg" ? clamped : Math.round(clamped / KG_TO_LBS);
    const clampedKg = Math.max(1, Math.min(newKg, maxKg));
    if (clampedKg !== kg) {
      setKg(clampedKg);
      update({ weightValue: clampedKg, weightRange: classifyWeight(petData.species, clampedKg) });
    }
  }, [unit, totalTicks, maxKg, kg, petData.species, update]);

  // Sync on species change
  useEffect(() => {
    const clamped = Math.min(kg, maxKg);
    setKg(clamped);
    update({ weightValue: clamped, weightRange: classifyWeight(petData.species, clamped) });
  }, [petData.species]);

  return (
    <div className="text-center flex flex-col items-center">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
        How much does {petData.name} weigh?
      </h1>
      <p className="text-muted-foreground font-medium mb-4">Scroll the ruler to set weight</p>

      {/* Unit toggle */}
      <div className="flex gap-1 p-1 rounded-2xl glass shadow-soft mb-6">
        {(["kg", "lbs"] as const).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
              unit === u
                ? "gradient-cta text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {u}
          </button>
        ))}
      </div>

      {/* Large number display */}
      <motion.div key={`${displayValue}-${unit}`} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="mb-1">
        <span className="text-6xl font-black text-foreground">{displayValue}</span>
        <span className="text-2xl font-bold text-muted-foreground ml-2">{unit}</span>
      </motion.div>

      {/* Classification badge */}
      <motion.span
        key={classification}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-5 ${BADGE_COLORS[classification]}`}
      >
        {classification}
      </motion.span>

      {/* Vertical ruler */}
      <div className="relative w-full flex justify-center mb-6" style={{ height: 220 }}>
        {/* Center selection line */}
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-28 h-0.5 bg-primary z-10 rounded-full" />
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-32 h-8 rounded-xl border-2 border-primary/30 z-[5] pointer-events-none" />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto no-scrollbar"
          style={{ width: 120 }}
        >
          {/* Top/bottom padding so first/last tick can reach center */}
          <div style={{ height: 110 }} />
          <div className="flex flex-col items-center" style={{ height: totalHeight }}>
            {Array.from({ length: totalTicks + 1 }, (_, i) => {
              const tickVal = i;
              const isMajor = tickVal % 5 === 0;
              const isHalf = tickVal % 5 === 0 || tickVal % 10 === 0;
              return (
                <div
                  key={i}
                  className="flex items-center"
                  style={{ height: TICK_SPACING, minHeight: TICK_SPACING }}
                >
                  {isMajor && (
                    <span className="text-[10px] text-muted-foreground font-semibold w-8 text-right mr-2">
                      {tickVal}
                    </span>
                  )}
                  {!isMajor && <span className="w-8 mr-2" />}
                  <div
                    className={`transition-colors rounded-full ${
                      isMajor
                        ? "w-8 h-[2px] bg-foreground/40"
                        : "w-4 h-px bg-foreground/15"
                    }`}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ height: 110 }} />
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={next}
        className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow"
      >
        Next <ArrowRight size={18} />
      </motion.button>
    </div>
  );
};

export default StepWeight;
