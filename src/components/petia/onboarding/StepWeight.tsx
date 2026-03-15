import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PetData } from "../OnboardingWizard";

const WEIGHT_THRESHOLDS: Record<string, { medium: number; large: number }> = {
  dog: { medium: 20, large: 50 },
  cat: { medium: 8, large: 15 },
  small_pet: { medium: 3, large: 8 },
  bird: { medium: 1, large: 3 },
};

const MAX_WEIGHT: Record<string, number> = {
  dog: 120,
  cat: 30,
  small_pet: 15,
  bird: 8,
};

function classifyWeight(species: string, lbs: number): string {
  const t = WEIGHT_THRESHOLDS[species] || WEIGHT_THRESHOLDS.dog;
  if (lbs < t.medium) return "small";
  if (lbs < t.large) return "medium";
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

const StepWeight = ({ petData, update, next }: Props) => {
  const maxW = MAX_WEIGHT[petData.species] || 120;
  const [value, setValue] = useState(petData.weightValue);
  const classification = classifyWeight(petData.species, value);
  const rulerRef = useRef<HTMLDivElement>(null);
  const tickCount = maxW;

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setValue(v);
    update({ weightValue: v, weightRange: classifyWeight(petData.species, v) });
  }, [petData.species, update]);

  // Sync on mount
  useEffect(() => {
    const clamped = Math.min(value, maxW);
    setValue(clamped);
    update({ weightValue: clamped, weightRange: classifyWeight(petData.species, clamped) });
  }, [petData.species]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
        How much does {petData.name} weigh?
      </h1>
      <p className="text-muted-foreground font-medium mb-6">Slide to set weight</p>

      {/* Large number display */}
      <motion.div
        key={value}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="mb-2"
      >
        <span className="text-6xl font-black text-foreground">{value}</span>
        <span className="text-2xl font-bold text-muted-foreground ml-2">lbs</span>
      </motion.div>

      {/* Classification badge */}
      <motion.span
        key={classification}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 ${BADGE_COLORS[classification]}`}
      >
        {classification}
      </motion.span>

      {/* Ruler / Slider */}
      <div className="relative mb-4">
        {/* Tick marks background */}
        <div ref={rulerRef} className="w-full h-12 relative overflow-hidden rounded-2xl glass shadow-soft">
          <div className="absolute inset-0 flex items-end justify-between px-2">
            {Array.from({ length: 21 }, (_, i) => {
              const tickVal = Math.round((i / 20) * maxW);
              const isMajor = i % 5 === 0;
              return (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className={`transition-colors ${
                      isMajor ? "w-0.5 h-6 bg-foreground/30" : "w-px h-3 bg-foreground/15"
                    }`}
                  />
                  {isMajor && (
                    <span className="text-[8px] text-muted-foreground font-medium mt-0.5">
                      {tickVal}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Native range input overlay */}
        <input
          type="range"
          min={1}
          max={maxW}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {/* Thumb indicator */}
        <div
          className="absolute top-0 h-12 w-1 bg-primary rounded-full pointer-events-none transition-all duration-75"
          style={{ left: `${((value - 1) / (maxW - 1)) * 100}%` }}
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={next}
        className="w-full py-4 rounded-2xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow mt-6"
      >
        Next <ArrowRight size={18} />
      </motion.button>
    </div>
  );
};

export default StepWeight;
