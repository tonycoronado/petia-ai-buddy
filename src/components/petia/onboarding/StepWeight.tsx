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

// Ruler config
const TICK_SPACING = 14; // px between each minor tick
const TICKS_PER_MAJOR = 10; // 10 minor ticks per major (so major = 1 unit)
const MINOR_PER_UNIT = 10; // 0.1 resolution

// Range: 0 to 150 kg (or converted to lbs)
const MIN_KG = 0.1;
const MAX_KG = 150;

const StepWeight = ({ petData, update, next }: Props) => {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const maxVal = unit === "kg" ? MAX_KG : Math.round(MAX_KG * KG_TO_LBS);
  const minVal = unit === "kg" ? MIN_KG : Math.round(MIN_KG * KG_TO_LBS);

  // Internal value in display units (with 0.1 precision for kg)
  const [kg, setKg] = useState(petData.weightValue || 15);
  const displayValue = unit === "kg" ? kg : Math.round(kg * KG_TO_LBS);
  const classification = classifyWeight(petData.species, kg);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(true);

  // Total minor ticks for current unit
  const totalMinorTicks = Math.round(maxVal * MINOR_PER_UNIT);
  const totalWidth = totalMinorTicks * TICK_SPACING;

  const valueToScrollLeft = useCallback(
    (val: number) => {
      const displayVal = unit === "kg" ? val : Math.round(val * KG_TO_LBS);
      const tickIndex = Math.round(displayVal * MINOR_PER_UNIT);
      if (!scrollRef.current) return 0;
      return tickIndex * TICK_SPACING - scrollRef.current.clientWidth / 2;
    },
    [unit]
  );

  // Scroll to correct position on mount
  useEffect(() => {
    if (!scrollRef.current) return;
    isUserScrolling.current = false;
    scrollRef.current.scrollLeft = Math.max(0, valueToScrollLeft(kg));
    requestAnimationFrame(() => {
      isUserScrolling.current = true;
    });
  }, []);

  // Scroll to correct position on unit change
  useEffect(() => {
    if (!scrollRef.current) return;
    isUserScrolling.current = false;
    scrollRef.current.scrollLeft = Math.max(0, valueToScrollLeft(kg));
    requestAnimationFrame(() => {
      isUserScrolling.current = true;
    });
  }, [unit]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !isUserScrolling.current) return;
    const containerW = scrollRef.current.clientWidth;
    const scrollLeft = scrollRef.current.scrollLeft;
    const centerTick = Math.round((scrollLeft + containerW / 2) / TICK_SPACING);
    const clampedTick = Math.max(1, Math.min(centerTick, totalMinorTicks));
    const displayVal = clampedTick / MINOR_PER_UNIT;

    const newKg = unit === "kg" ? displayVal : Math.round(displayVal / KG_TO_LBS * 10) / 10;
    const clampedKg = Math.max(MIN_KG, Math.min(newKg, MAX_KG));

    if (Math.abs(clampedKg - kg) > 0.05) {
      setKg(Math.round(clampedKg * 10) / 10);
      update({
        weightValue: Math.round(clampedKg * 10) / 10,
        weightRange: classifyWeight(petData.species, clampedKg),
      });
    }
  }, [unit, totalMinorTicks, kg, petData.species, update]);

  return (
    <div className="flex flex-col items-center w-full -mx-6" style={{ width: "calc(100% + 3rem)" }}>
      {/* Header */}
      <div className="text-center px-6 mb-2">
        <h1 className="text-2xl font-black tracking-tight text-foreground mb-1">
          How much does {petData.name} weigh?
        </h1>
        <p className="text-muted-foreground font-medium text-sm">
          Slide the ruler to set weight
        </p>
      </div>

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

      {/* Large number */}
      <motion.div
        key={`${displayValue}-${unit}`}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="mb-1"
      >
        <span className="text-7xl font-black text-foreground tabular-nums">
          {unit === "kg" ? kg.toFixed(1) : displayValue}
        </span>
        <span className="text-2xl font-bold text-muted-foreground ml-2">{unit}</span>
      </motion.div>

      {/* Classification badge */}
      <motion.span
        key={classification}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-block px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 ${BADGE_COLORS[classification]}`}
      >
        {classification}
      </motion.span>

      {/* Horizontal ruler area */}
      <div className="relative w-full" style={{ height: 140 }}>
        {/* Center selection line (fixed teal) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] rounded-full bg-primary z-10" style={{ height: 100 }} />
        {/* Triangle pointer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-10"
          style={{ top: -8 }}
        >
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "10px solid hsl(var(--primary))",
            }}
          />
        </div>

        {/* Scrollable ruler */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-x-auto no-scrollbar touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Left padding so first tick can reach center */}
          <div className="inline-flex items-end" style={{ height: 100 }}>
            <div style={{ width: "50vw", flexShrink: 0 }} />
            {Array.from({ length: totalMinorTicks + 1 }, (_, i) => {
              const isMajor = i % TICKS_PER_MAJOR === 0;
              const isMid = i % (TICKS_PER_MAJOR / 2) === 0 && !isMajor;
              const majorVal = i / MINOR_PER_UNIT;

              return (
                <div
                  key={i}
                  className="flex flex-col items-center flex-shrink-0"
                  style={{ width: TICK_SPACING }}
                >
                  {isMajor && (
                    <span className="text-xs font-semibold text-muted-foreground mb-1 tabular-nums">
                      {Math.round(majorVal)}
                    </span>
                  )}
                  <div
                    className={`rounded-full ${
                      isMajor
                        ? "w-[2px] bg-foreground/50"
                        : isMid
                        ? "w-[1.5px] bg-foreground/25"
                        : "w-px bg-foreground/10"
                    }`}
                    style={{
                      height: isMajor ? 48 : isMid ? 32 : 20,
                      marginTop: isMajor ? 0 : isMid ? 16 : 28,
                    }}
                  />
                </div>
              );
            })}
            <div style={{ width: "50vw", flexShrink: 0 }} />
          </div>
        </div>
      </div>

      {/* Next button */}
      <div className="w-full px-6 mt-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={next}
          className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow"
        >
          Next <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
};

export default StepWeight;
