import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { PetData } from "../OnboardingWizard";

const AGE_LABELS: Record<string, { value: string; label: string }[]> = {
  dog: [
    { value: "puppy", label: "Puppy" },
    { value: "young", label: "Young" },
    { value: "adult", label: "Adult" },
    { value: "senior", label: "Senior" },
  ],
  cat: [
    { value: "puppy", label: "Kitten" },
    { value: "young", label: "Young" },
    { value: "adult", label: "Adult" },
    { value: "senior", label: "Senior" },
  ],
};

interface Props {
  petData: PetData;
  update: (patch: Partial<PetData>) => void;
  next: () => void;
}

const StepAgeWeight = ({ petData, update, next }: Props) => {
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");
  const options = AGE_LABELS[petData.species] || AGE_LABELS.dog;
  const kg = petData.weightValue || 15;
  const display = unit === "kg" ? kg : Math.round(kg * 2.20462);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
        Age & weight
      </h1>
      <p className="text-muted-foreground font-medium mb-6 text-sm">
        Helps Petia personalize care for {petData.name || "your pet"}
      </p>

      {/* Age pills */}
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 text-left">
        Age range
      </p>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {options.map((a, i) => (
          <motion.button
            key={a.value}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => update({ ageRange: a.value })}
            className={`py-3 rounded-2xl text-sm font-bold transition-all ${
              petData.ageRange === a.value
                ? "gradient-cta text-primary-foreground shadow-glow"
                : "glass text-foreground shadow-soft"
            }`}
          >
            {a.label}
          </motion.button>
        ))}
      </div>

      {/* Weight */}
      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 text-left">
        Weight
      </p>
      <div className="glass rounded-3xl p-5 shadow-soft mb-8">
        <div className="flex items-baseline justify-center gap-2 mb-3">
          <span className="text-5xl font-black text-foreground tabular-nums">
            {unit === "kg" ? kg.toFixed(1) : display}
          </span>
          <span className="text-lg font-bold text-muted-foreground">{unit}</span>
        </div>
        <input
          type="range"
          min={1}
          max={70}
          step={0.5}
          value={kg}
          onChange={(e) =>
            update({ weightValue: parseFloat(e.target.value) })
          }
          className="w-full accent-primary"
        />
        <div className="flex gap-1 p-1 rounded-2xl bg-muted/50 mt-4 w-fit mx-auto">
          {(["kg", "lbs"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                unit === u
                  ? "gradient-cta text-primary-foreground shadow-glow"
                  : "text-muted-foreground"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={next}
        className="w-full py-4 rounded-3xl gradient-cta text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow"
      >
        Continue <ArrowRight size={18} />
      </motion.button>
    </div>
  );
};

export default StepAgeWeight;
